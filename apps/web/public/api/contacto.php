<?php

/*
 * Punto de entrada del formulario de contacto.
 *
 * Sustituye a PocketBase, que en alojamiento compartido no puede correr.
 * Ver docs/07-decisiones.md → ADR-012.
 *
 * ── El orden de las cosas NO es casual ──────────────────────────────────
 *
 *   1. Se GUARDA la solicitud en MySQL.
 *   2. Se avisa a info@.
 *   3. Se acusa recibo al cliente.
 *
 * Guardar va primero porque un fallo de correo nunca puede costar una
 * solicitud. Es la misma regla que llevaba el hook de PocketBase:
 * «Nunca tumbes la petición por un fallo de correo».
 *
 * Y el aviso interno va antes que el acuse porque el buzón tiene un límite de
 * envíos por hora: si se topa a mitad, lo que se pierde es la cortesía al
 * cliente, no el aviso de que alguien escribió.
 *
 * ⚠️ Está en api/ y no como /contacto.php suelto a propósito: Apache con
 *    MultiViews podría resolver /contacto como contacto.php en vez de servir
 *    contacto/index.html, y se llevaría por delante la página de contacto.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Responde y termina. El visitante nunca ve el detalle interno de un fallo. */
function responder(int $codigo, array $cuerpo): never
{
    http_response_code($codigo);
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
    exit;
}

function registrar(string $mensaje): void
{
    error_log('[contacto] ' . $mensaje);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'metodo_no_permitido']);
}

$rutaConfig = __DIR__ . '/config.php';

if (!is_file($rutaConfig)) {
    registrar('Falta config.php. Cópialo de config.example.php y rellénalo.');
    responder(500, ['ok' => false, 'error' => 'sin_configuracion']);
}

$config = require $rutaConfig;

// ---------------------------------------------------------------------------
// Entrada
// ---------------------------------------------------------------------------

$crudo = file_get_contents('php://input');

if ($crudo === false || strlen($crudo) > 20000) {
    responder(400, ['ok' => false, 'error' => 'cuerpo_invalido']);
}

$datos = json_decode($crudo, true);

if (!is_array($datos)) {
    responder(400, ['ok' => false, 'error' => 'json_invalido']);
}

$texto = static fn (string $campo): string => trim((string) ($datos[$campo] ?? ''));

/*
 * Trampa antibots. El formulario lleva un campo oculto que una persona nunca
 * ve ni rellena; si viene con algo, es un bot.
 *
 * Se le responde ÉXITO y no se hace nada. Si se le dijera que fue rechazado,
 * aprendería a esquivar la trampa. Misma táctica que en el formulario y en el
 * hook de PocketBase.
 */
if ($texto('website') !== '') {
    registrar('Solicitud descartada por la trampa antibots');
    responder(200, ['ok' => true]);
}

$nombre   = $texto('name');
$empresa  = $texto('company');
$correo   = $texto('email');
$telefono = $texto('phone');
$linea    = $texto('line');
$mensaje  = $texto('message');

$LINEAS = ['calzado' => 'Calzado', 'ropa' => 'Ropa', 'dotaciones' => 'Dotaciones', 'otro' => 'Otro proyecto'];

// Los mismos límites que declaraban las migraciones de PocketBase.
$errores = [];

if (mb_strlen($nombre) < 2 || mb_strlen($nombre) > 120) {
    $errores[] = 'name';
}

if (mb_strlen($empresa) > 160) {
    $errores[] = 'company';
}

// El salto de línea en un correo permitiría inyectar cabeceras SMTP.
if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $correo) === 1) {
    $errores[] = 'email';
}

if (mb_strlen($telefono) < 5 || mb_strlen($telefono) > 40) {
    $errores[] = 'phone';
}

if (!array_key_exists($linea, $LINEAS)) {
    $errores[] = 'line';
}

if (mb_strlen($mensaje) < 10 || mb_strlen($mensaje) > 4000) {
    $errores[] = 'message';
}

// Sin autorización no se guarda nada. La casilla es obligatoria en el
// formulario, pero eso es el navegador: aquí se comprueba de verdad.
if (($datos['consent'] ?? false) !== true) {
    $errores[] = 'consent';
}

if ($errores !== []) {
    responder(422, ['ok' => false, 'error' => 'datos_invalidos', 'campos' => $errores]);
}

// ---------------------------------------------------------------------------
// Base de datos
// ---------------------------------------------------------------------------

try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db']['host'], $config['db']['nombre']),
        $config['db']['user'],
        $config['db']['clave'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ],
    );
} catch (PDOException $e) {
    registrar('No se pudo conectar a MySQL: ' . $e->getMessage());
    responder(500, ['ok' => false, 'error' => 'sin_base_de_datos']);
}

/*
 * Huella de la IP, no la IP. Con la sal de la contraseña de base de datos, el
 * hash no se puede revertir ni cruzar con otra tabla. Guardar la IP en claro
 * sería un dato personal más que custodiar sin necesidad.
 */
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . $config['db']['clave']);

$enviarCorreos = true;

try {
    $consulta = $pdo->prepare(
        'SELECT COUNT(*) AS total FROM contact_requests
         WHERE ip_hash = ? AND created > (NOW() - INTERVAL 1 HOUR)'
    );
    $consulta->execute([$ipHash]);

    if ((int) $consulta->fetch()['total'] >= (int) $config['limite_por_hora']) {
        // La solicitud se guarda igual. Lo único que se omite son los correos,
        // para no agotar el cupo del buzón.
        $enviarCorreos = false;
        registrar('Límite por hora alcanzado: se guarda la solicitud pero no se envían correos');
    }
} catch (PDOException $e) {
    // Que falle el conteo no puede impedir guardar.
    registrar('No se pudo comprobar el límite por hora: ' . $e->getMessage());
}

$ahora = new DateTimeImmutable('now');

try {
    $insercion = $pdo->prepare(
        'INSERT INTO contact_requests
            (name, company, email, phone, line, message, consent, consent_at, created, ip_hash, mail_status)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)'
    );
    $insercion->execute([
        $nombre,
        $empresa !== '' ? $empresa : null,
        $correo,
        $telefono,
        $linea,
        $mensaje,
        $ahora->format('Y-m-d H:i:s'),
        $ahora->format('Y-m-d H:i:s'),
        $ipHash,
        $enviarCorreos ? 'pendiente' : 'omitido_por_limite',
    ]);
    $id = (int) $pdo->lastInsertId();
} catch (PDOException $e) {
    registrar('No se pudo guardar la solicitud: ' . $e->getMessage());
    responder(500, ['ok' => false, 'error' => 'no_guardado']);
}

// A partir de aquí la solicitud YA está a salvo. Pase lo que pase con el
// correo, al visitante se le responde que salió bien.

if (!$enviarCorreos) {
    responder(200, ['ok' => true]);
}

// ---------------------------------------------------------------------------
// Correos
// ---------------------------------------------------------------------------

require_once __DIR__ . '/smtp.php';

/** El contenido lo escribe un desconocido: nunca va crudo dentro del HTML. */
$escapar = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$lineaLegible = $LINEAS[$linea];

$filas = '';

foreach ([
    ['Nombre', $nombre],
    ['Empresa', $empresa !== '' ? $empresa : '—'],
    ['Correo', $correo],
    ['Teléfono', $telefono],
    ['Línea de interés', $lineaLegible],
] as [$etiqueta, $valor]) {
    $filas .= '<tr>'
        . '<td style="padding:7px 18px 7px 0;color:#8a8f9c;font-size:12px;white-space:nowrap;vertical-align:top;">' . $escapar($etiqueta) . '</td>'
        . '<td style="padding:7px 0;color:#f2f4f8;font-size:14px;">' . $escapar($valor) . '</td>'
        . '</tr>';
}

$envoltura = static fn (string $contenido): string => '
    <div style="background:#0a0c14;color:#f2f4f8;font-family:Helvetica,Arial,sans-serif;padding:32px;">
        <p style="margin:0 0 4px;color:#3d6bff;font-size:11px;letter-spacing:.2em;text-transform:uppercase;">
            4D Cuarta Dimensión
        </p>' . $contenido . '
    </div>';

// --- 1 · Aviso interno a info@ ---------------------------------------------
// Sin base de datos consultable a diario, este correo es la vía por la que el
// equipo se entera. Lleva Reply-To del cliente: responder desde el buzón
// escribe directamente a quien preguntó.

$htmlAviso = $envoltura('
        <h1 style="margin:0 0 24px;font-size:20px;">Nueva solicitud de contacto</h1>
        <table style="border-collapse:collapse;margin:0 0 18px;">' . $filas . '</table>
        <div style="border-left:2px solid #3d6bff;padding-left:16px;margin:0 0 28px;font-size:15px;line-height:1.7;white-space:pre-wrap;">' . $escapar($mensaje) . '</div>
        <p style="margin:0 0 4px;font-size:14px;">
            Responde a este correo y le llega directo a
            <a href="mailto:' . $escapar($correo) . '" style="color:#3d6bff;text-decoration:none;">' . $escapar($correo) . '</a>.
        </p>
        <p style="margin:0;color:#8a8f9c;font-size:12px;">
            Solicitud #' . $id . ' · ' . $escapar($ahora->format('d/m/Y H:i')) . ' · autorización de datos registrada
        </p>');

// --- 2 · Acuse de recibo al cliente ----------------------------------------
// Mismo texto y mismo diseño que enviaba el hook de PocketBase.

$htmlAcuse = $envoltura('
        <h1 style="margin:0 0 24px;font-size:20px;">Recibimos tu mensaje</h1>

        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
            Hola <strong>' . $escapar($nombre) . '</strong>, te escribimos de
            <strong>4D Cuarta Dimensión</strong>. Tu mensaje llegó bien y
            pronto nos pondremos en contacto contigo.
        </p>

        <p style="margin:0 0 10px;color:#8a8f9c;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">
            Esto fue lo que nos enviaste
        </p>
        <table style="border-collapse:collapse;margin:0 0 18px;">' . $filas . '</table>

        <div style="border-left:2px solid #3d6bff;padding-left:16px;margin:0 0 28px;font-size:15px;line-height:1.7;white-space:pre-wrap;">' . $escapar($mensaje) . '</div>

        <p style="margin:0 0 28px;font-size:15px;line-height:1.6;">
            Respondemos en <strong>24 a 48 horas hábiles</strong>. Si necesitas
            algo antes, puedes escribirnos a
            <a href="mailto:info@4dimensionsas.com" style="color:#3d6bff;text-decoration:none;">info@4dimensionsas.com</a>
            o llamarnos al
            <a href="tel:+573165775539" style="color:#f2f4f8;text-decoration:none;">+57 316 577 5539</a>.
        </p>

        <p style="margin:0 0 4px;font-size:15px;">Gracias por escribirnos.</p>
        <p style="margin:0;color:#8a8f9c;font-size:13px;">4D Cuarta Dimensión ES S.A.S. · Bogotá D.C., Colombia</p>

        <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #23262d;color:#8a8f9c;font-size:11px;line-height:1.6;">
            Recibes este correo porque enviaste el formulario de contacto de
            4dimensionsas.com y autorizaste el tratamiento de tus datos con la
            única finalidad de responderte. Si no fuiste tú, ignóralo.
        </p>');

$smtp = new Smtp(
    $config['smtp']['host'],
    (int) $config['smtp']['puerto'],
    $config['smtp']['user'],
    $config['smtp']['clave'],
);

$estado = [];

foreach ([
    ['aviso', $config['correo']['aviso_a'], 'Nueva solicitud de contacto — ' . $lineaLegible, $htmlAviso, $correo],
    ['acuse', $correo, 'Recibimos tu mensaje — 4D Cuarta Dimensión', $htmlAcuse, ''],
] as [$etiqueta, $destino, $asunto, $html, $responderA]) {
    try {
        $smtp->enviar(
            $config['correo']['de_correo'],
            $config['correo']['de_nombre'],
            $destino,
            $asunto,
            $html,
            $responderA,
        );
        $estado[] = $etiqueta . ':ok';
    } catch (Throwable $e) {
        $estado[] = $etiqueta . ':fallo';
        registrar('No se pudo enviar el ' . $etiqueta . ' (solicitud #' . $id . '): ' . $e->getMessage());
    }
}

try {
    $pdo->prepare('UPDATE contact_requests SET mail_status = ? WHERE id = ?')
        ->execute([implode(' ', $estado), $id]);
} catch (PDOException $e) {
    registrar('No se pudo anotar el estado del correo: ' . $e->getMessage());
}

responder(200, ['ok' => true]);
