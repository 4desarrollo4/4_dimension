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

// Aunque el hosting tenga los errores de PHP visibles, aquí no se muestran: un
// aviso con la ruta del servidor o el nombre de la base es información gratis
// para un atacante. Los fallos van al registro, nunca a la respuesta.
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

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

/*
 * Solo se aceptan envíos del propio sitio (2026-10-26).
 *
 * Sin esto, cualquier página de otro dominio podía mandar solicitudes a este
 * endpoint en nombre de sus visitantes (CSRF): se comprobó en local que un
 * envío con `Origin: https://evil.example`, o como `text/plain`, se guardaba.
 *
 * Dos cerrojos:
 *   1. Exigir `application/json`. Un formulario HTML de otra web no puede
 *      mandar ese tipo, y un `fetch` desde otro dominio obliga al navegador a
 *      preguntar antes (CORS), cosa que aquí nunca se autoriza.
 *   2. Si el navegador declara de dónde viene (`Origin`), tiene que ser este
 *      sitio. Se admite localhost para poder probar el formulario en local.
 */
$tipo = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));

if ($tipo !== 'application/json') {
    responder(415, ['ok' => false, 'error' => 'tipo_no_admitido']);
}

$origen = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
$origenValido = $origen === ''
    || in_array($origen, ['https://4dimensionsas.com', 'https://www.4dimensionsas.com'], true)
    || preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origen) === 1;

if (!$origenValido) {
    registrar('Envío rechazado por origen ajeno: ' . substr($origen, 0, 100));
    responder(403, ['ok' => false, 'error' => 'origen_no_permitido']);
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

// ⚠️ Cada clave tiene que existir también en el ENUM `line` de la tabla. Insumos
// se añadió el 2026-10-26: antes de subir este archivo al servidor hay que
// ejecutar db/migraciones/2026-10-26-linea-insumos.sql, o las solicitudes de
// Insumos fallarían al guardarse.
$LINEAS = [
    'calzado'    => 'Calzado',
    'ropa'       => 'Ropa',
    'dotaciones' => 'Dotaciones',
    'insumos'    => 'Insumos',
    'otro'       => 'Otro proyecto',
];

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
 * Huella del cliente, no su IP. Con la sal de la contraseña de base de datos, el
 * hash no se puede revertir ni cruzar con otra tabla. Guardar la IP en claro
 * sería un dato personal más que custodiar sin necesidad.
 *
 * ⚠️ El sitio está detrás de la CDN de Hostinger (cabecera `Server: hcdn`).
 * Detrás de una CDN, REMOTE_ADDR puede ser la IP del NODO de la CDN, compartida
 * por muchos visitantes: el límite por hora dejaría de ser «por persona» y unos
 * pocos envíos de cualquiera cortarían los correos de todos. Por eso la huella
 * combina REMOTE_ADDR con la ÚLTIMA entrada de X-Forwarded-For, que es la que
 * añade el proxy más cercano (la primera la puede inventar el cliente).
 * Si no hay CDN, X-Forwarded-For viene vacía y todo queda como antes.
 */
$reenviada = array_map('trim', explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')));
$cliente   = ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . end($reenviada);
$ipHash    = hash('sha256', $cliente . '|' . $config['db']['clave']);

$enviarCorreos = true;

try {
    $consulta = $pdo->prepare(
        'SELECT COUNT(*) AS total FROM contact_requests
         WHERE ip_hash = ? AND created > (NOW() - INTERVAL 1 HOUR)'
    );
    $consulta->execute([$ipHash]);
    $recientes = (int) $consulta->fetch()['total'];

    /*
     * Tope duro (2026-10-26). Antes no había ninguno: en local, 60 envíos
     * seguidos del mismo cliente se guardaron los 60, y cada uno puede pesar
     * 20 KB. Por encima del tope se rechaza SIN guardar. El valor por defecto
     * está muy lejos de lo que hace una persona; solo frena una inundación.
     */
    if ($recientes >= (int) ($config['tope_por_hora'] ?? 20)) {
        registrar('Tope por hora superado: solicitud rechazada sin guardar');
        responder(429, ['ok' => false, 'error' => 'demasiadas_solicitudes']);
    }

    if ($recientes >= (int) $config['limite_por_hora']) {
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

/*
 * Plantillas de correo con la paleta actual de la marca (2026-10-26): fondo
 * claro, azul PMS 295 (#0F376A). Antes seguían en el tema oscuro del primer
 * sitio. Estilos en línea porque la mayoría de clientes de correo ignoran las
 * hojas de estilo.
 */
$c = [
    'fondo'  => '#ebebeb',
    'tarjeta'=> '#ffffff',
    'texto'  => '#15161a',
    'suave'  => '#5d6165',
    'azul'   => '#0f376a',
    'linea'  => '#d9dcdf',
];

$filas = '';

foreach ([
    ['Nombre', $nombre],
    ['Empresa', $empresa !== '' ? $empresa : '—'],
    ['Correo', $correo],
    ['Teléfono', $telefono],
    ['Línea de interés', $lineaLegible],
] as [$etiqueta, $valor]) {
    $filas .= '<tr>'
        . '<td style="padding:8px 20px 8px 0;color:' . $c['suave'] . ';font-size:12px;white-space:nowrap;vertical-align:top;">' . $escapar($etiqueta) . '</td>'
        . '<td style="padding:8px 0;color:' . $c['texto'] . ';font-size:14px;">' . $escapar($valor) . '</td>'
        . '</tr>';
}

$envoltura = static fn (string $contenido): string => '
    <div style="background:' . $c['fondo'] . ';padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:' . $c['tarjeta'] . ';border-top:4px solid ' . $c['azul'] . ';padding:32px;color:' . $c['texto'] . ';">
            <p style="margin:0 0 6px;color:' . $c['azul'] . ';font-size:11px;font-weight:bold;letter-spacing:.2em;text-transform:uppercase;">
                4D Cuarta Dimensión
            </p>' . $contenido . '
        </div>
        <p style="max-width:560px;margin:16px auto 0;color:' . $c['suave'] . ';font-size:11px;line-height:1.6;text-align:center;">
            4D Cuarta Dimensión ES S.A.S. · Bogotá D.C., Colombia
        </p>
    </div>';

// --- 1 · Aviso interno a info@ ---------------------------------------------
// Sin base de datos consultable a diario, este correo es la vía por la que el
// equipo se entera. Lleva Reply-To del cliente: responder desde el buzón
// escribe directamente a quien preguntó. Solo llega a nuestro propio buzón, así
// que aquí SÍ va todo lo que escribió el visitante (escapado).

$htmlAviso = $envoltura('
            <h1 style="margin:0 0 24px;font-size:22px;color:' . $c['texto'] . ';">Nueva solicitud de contacto</h1>
            <table style="border-collapse:collapse;margin:0 0 20px;">' . $filas . '</table>
            <div style="border-left:3px solid ' . $c['azul'] . ';padding-left:16px;margin:0 0 28px;font-size:15px;line-height:1.7;white-space:pre-wrap;color:' . $c['texto'] . ';">' . $escapar($mensaje) . '</div>
            <p style="margin:0 0 6px;font-size:14px;line-height:1.6;">
                Responde a este correo y le llega directo a
                <a href="mailto:' . $escapar($correo) . '" style="color:' . $c['azul'] . ';">' . $escapar($correo) . '</a>.
            </p>
            <p style="margin:0;padding-top:16px;border-top:1px solid ' . $c['linea'] . ';color:' . $c['suave'] . ';font-size:12px;">
                Solicitud #' . $id . ' · ' . $escapar($ahora->format('d/m/Y H:i')) . ' · autorización de datos registrada
            </p>');

// --- 2 · Acuse de recibo al cliente ----------------------------------------
//
// ⚠️ NO repite nada de lo que escribió el visitante (2026-10-26).
//
// Antes incluía su nombre completo, sus datos y su mensaje. El problema: la
// dirección de destino también la escribe el visitante. Cualquiera podía poner
// el correo de un tercero y un «mensaje» con publicidad o un enlace, y nuestro
// servidor se lo enviaba firmado por 4D. Es el abuso clásico de los formularios
// de contacto, y puede hacer que el buzón acabe en listas de spam.
//
// Ahora el acuse solo lleva texto nuestro. Del visitante, como mucho el primer
// nombre, y solo si son letras: así no puede contener un enlace ni un anuncio.
// La línea de interés sale de una lista cerrada, no de lo que escribió.

$primerNombre = (string) (preg_split('/\s+/u', $nombre)[0] ?? '');
$saludo = preg_match("/^\p{L}[\p{L}'\-]{0,29}$/u", $primerNombre) === 1
    ? 'Hola, ' . $escapar($primerNombre) . '.'
    : 'Hola.';

$htmlAcuse = $envoltura('
            <h1 style="margin:0 0 20px;font-size:22px;color:' . $c['texto'] . ';">Recibimos tu mensaje</h1>

            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">' . $saludo . '</p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                Tu solicitud sobre <strong>' . $escapar($lineaLegible) . '</strong> llegó bien.
                Respondemos en <strong>24 a 48 horas hábiles</strong>.
            </p>

            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;">
                Si necesitas algo antes, puedes escribirnos a
                <a href="mailto:info@4dimensionsas.com" style="color:' . $c['azul'] . ';">info@4dimensionsas.com</a>
                o por WhatsApp al
                <a href="https://wa.me/573165775539" style="color:' . $c['azul'] . ';">+57 316 577 5539</a>.
            </p>

            <p style="margin:0 0 4px;font-size:15px;">Gracias por escribirnos.</p>
            <p style="margin:0;color:' . $c['suave'] . ';font-size:13px;">El equipo de 4D Cuarta Dimensión</p>

            <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid ' . $c['linea'] . ';color:' . $c['suave'] . ';font-size:11px;line-height:1.6;">
                Recibes este correo porque se envió el formulario de contacto de
                4dimensionsas.com con esta dirección y se autorizó el tratamiento de
                los datos con la única finalidad de responder. Si no fuiste tú,
                ignóralo: no volverás a recibir nada.
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
