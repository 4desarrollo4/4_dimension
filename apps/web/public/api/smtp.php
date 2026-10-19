<?php

/*
 * Cliente SMTP mínimo, sin dependencias.
 *
 * Se escribió a mano en vez de traer PHPMailer porque en alojamiento
 * compartido no hay Composer, y aquí solo hace falta una cosa: mandar un
 * correo HTML a un destinatario por un servidor autenticado.
 *
 * ── Ajustes del buzón (verificados el 2026-09-02) ───────────────────────
 *
 *   Host   smtp.hostinger.com
 *   Puerto 465
 *   TLS    IMPLÍCITO (ssl://), no STARTTLS
 *
 * ⚠️ NO uses smtp.gmail.com. Se intentó y devuelve
 *    «535 Username and Password not accepted». El error engaña: parece la
 *    contraseña, pero lo que pasa es que el buzón está en Hostinger y se
 *    estaba autenticando contra un servidor que no conoce esa cuenta.
 *    Ver docs/03-arquitectura.md → «Correo».
 */

declare(strict_types=1);

class ErrorSmtp extends RuntimeException {}

class Smtp
{
    /** @var resource|null */
    private $conexion = null;

    public function __construct(
        private string $host,
        private int $puerto,
        private string $usuario,
        private string $clave,
        private int $timeout = 20,
    ) {}

    /**
     * Envía un correo HTML. Lanza ErrorSmtp si algo falla; quien llama decide
     * qué hacer con eso — aquí nunca se decide por él.
     */
    public function enviar(
        string $deCorreo,
        string $deNombre,
        string $paraCorreo,
        string $asunto,
        string $html,
        string $responderA = '',
    ): void {
        $this->conectar();

        try {
            $this->orden('EHLO ' . $this->dominioDelRemitente($deCorreo), [250]);

            // AUTH LOGIN: usuario y contraseña van en base64, uno por turno.
            $this->orden('AUTH LOGIN', [334]);
            $this->orden(base64_encode($this->usuario), [334]);
            $this->orden(base64_encode($this->clave), [235]);

            $this->orden('MAIL FROM:<' . $deCorreo . '>', [250]);
            $this->orden('RCPT TO:<' . $paraCorreo . '>', [250, 251]);
            $this->orden('DATA', [354]);

            $this->escribir($this->mensaje($deCorreo, $deNombre, $paraCorreo, $asunto, $html, $responderA));
            $this->orden('.', [250]);

            // Si QUIT falla da igual: el servidor ya aceptó el mensaje.
            try {
                $this->orden('QUIT', [221]);
            } catch (ErrorSmtp) {
            }
        } finally {
            $this->cerrar();
        }
    }

    private function conectar(): void
    {
        $contexto = stream_context_create([
            'ssl' => [
                'verify_peer'       => true,
                'verify_peer_name'  => true,
                'allow_self_signed' => false,
            ],
        ]);

        $conexion = @stream_socket_client(
            'ssl://' . $this->host . ':' . $this->puerto,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $contexto,
        );

        if ($conexion === false) {
            throw new ErrorSmtp(sprintf('No se pudo conectar a %s:%d — %s (%d)', $this->host, $this->puerto, $errstr, $errno));
        }

        $this->conexion = $conexion;
        stream_set_timeout($this->conexion, $this->timeout);

        $this->esperar([220]);   // saludo del servidor
    }

    private function cerrar(): void
    {
        if (is_resource($this->conexion)) {
            @fclose($this->conexion);
        }

        $this->conexion = null;
    }

    private function orden(string $orden, array $esperados): string
    {
        $this->escribir($orden . "\r\n");

        return $this->esperar($esperados);
    }

    private function escribir(string $datos): void
    {
        if (!is_resource($this->conexion) || @fwrite($this->conexion, $datos) === false) {
            throw new ErrorSmtp('Se cortó la conexión al escribir en el servidor.');
        }
    }

    /**
     * Lee una respuesta completa. SMTP parte las respuestas largas en varias
     * líneas: las intermedias llevan guion tras el código (250-...) y solo la
     * última lleva espacio (250 ...). Leer una sola línea desincroniza el
     * diálogo y el fallo aparece mucho después, en una orden que sí era
     * correcta — por eso se leen todas.
     */
    private function esperar(array $esperados): string
    {
        $respuesta = '';

        while (true) {
            $linea = @fgets($this->conexion, 1024);

            if ($linea === false) {
                $info = is_resource($this->conexion) ? stream_get_meta_data($this->conexion) : ['timed_out' => false];

                throw new ErrorSmtp(!empty($info['timed_out'])
                    ? 'El servidor no respondió a tiempo.'
                    : 'Se cortó la conexión al leer la respuesta.');
            }

            $respuesta .= $linea;

            if (strlen($linea) >= 4 && $linea[3] === ' ') {
                break;
            }
        }

        $codigo = (int) substr($respuesta, 0, 3);

        if (!in_array($codigo, $esperados, true)) {
            // El mensaje del servidor puede traer datos del correo: se recorta.
            throw new ErrorSmtp(sprintf('El servidor respondió %d: %s', $codigo, trim(substr($respuesta, 0, 200))));
        }

        return $respuesta;
    }

    private function mensaje(
        string $deCorreo,
        string $deNombre,
        string $paraCorreo,
        string $asunto,
        string $html,
        string $responderA,
    ): string {
        // El cuerpo va en base64: el HTML lleva acentos y líneas largas, y así
        // ninguna línea puede empezar por punto (que SMTP interpretaría como
        // fin del mensaje) ni pasarse del límite de longitud.
        $cuerpo = chunk_split(base64_encode($html), 76, "\r\n");

        $cabeceras = [
            'Date: ' . date('r'),
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $this->dominioDelRemitente($deCorreo) . '>',
            'From: ' . $this->cabeceraConNombre($deNombre, $deCorreo),
            'To: <' . $paraCorreo . '>',
            'Subject: ' . $this->codificar($asunto),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            'Auto-Submitted: auto-replied',
        ];

        if ($responderA !== '') {
            array_splice($cabeceras, 4, 0, ['Reply-To: <' . $responderA . '>']);
        }

        return implode("\r\n", $cabeceras) . "\r\n\r\n" . $cuerpo . "\r\n";
    }

    private function cabeceraConNombre(string $nombre, string $correo): string
    {
        return $nombre === ''
            ? '<' . $correo . '>'
            : $this->codificar($nombre) . ' <' . $correo . '>';
    }

    /** RFC 2047: las cabeceras solo admiten ASCII, y «Dimensión» no lo es. */
    private function codificar(string $texto): string
    {
        if (preg_match('/^[\x20-\x7E]*$/', $texto) === 1) {
            return $texto;
        }

        return '=?UTF-8?B?' . base64_encode($texto) . '?=';
    }

    private function dominioDelRemitente(string $correo): string
    {
        $partes = explode('@', $correo);

        return count($partes) === 2 && $partes[1] !== '' ? $partes[1] : 'localhost';
    }
}
