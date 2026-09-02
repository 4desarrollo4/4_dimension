/// <reference path="../pb_data/types.d.ts" />

/*
  Configura el SMTP de PocketBase leyéndolo de variables de entorno.

  Mismo patrón que se usa en otros proyectos del propietario: la contraseña de
  aplicación vive en el entorno, nunca en el código ni en el repositorio. Aquí
  solo se lee.

  Si las variables no están definidas, este hook no hace nada y PocketBase se
  queda como estaba. Es decir: es seguro tenerlo siempre puesto.

  ── Cómo usarlo ────────────────────────────────────────────────────────────

  1. Activa la verificación en dos pasos en la cuenta de Gmail.
  2. myaccount.google.com → Seguridad → Contraseñas de aplicación.
     Google genera 16 caracteres.
  3. Arranca PocketBase con estas variables:

       SMTP_USERNAME   la cuenta de Gmail que envía
       SMTP_PASSWORD   la contraseña de aplicación de 16 caracteres
       SMTP_SENDER     (opcional) el remitente; por defecto, SMTP_USERNAME
       SMTP_HOST       (opcional) por defecto smtp.gmail.com
       SMTP_PORT       (opcional) por defecto 587

  ⚠️ Gmail rechaza la contraseña normal de la cuenta. Tiene que ser una
     contraseña de aplicación, y con la verificación en dos pasos activada.

  ── Por qué importa que el SMTP quede activado ─────────────────────────────

  `builder-mailer.pb.js` intercepta el envío y lo desvía a la API de correo de
  Hostinger SOLO cuando el SMTP está desactivado. Al activarlo aquí, ese hook
  se aparta y el correo sale directo por Gmail.
*/

onBootstrap((e) => {
	// Primero deja que PocketBase termine de arrancar; si no, `$app.settings()`
	// todavía no está disponible.
	e.next();

	try {
		const usuario = $os.getenv('SMTP_USERNAME');
		const clave = $os.getenv('SMTP_PASSWORD');

		if (!usuario || !clave) {
			$app.logger().info('SMTP: sin SMTP_USERNAME/SMTP_PASSWORD, se deja la configuración como estaba');
			return;
		}

		const settings = $app.settings();

		settings.smtp.enabled = true;
		settings.smtp.host = $os.getenv('SMTP_HOST') || 'smtp.gmail.com';
		settings.smtp.port = Number($os.getenv('SMTP_PORT') || 587);
		settings.smtp.username = usuario;
		settings.smtp.password = clave;
		settings.smtp.authMethod = 'PLAIN';
		// En el puerto 587 se envía STARTTLS y el servidor decide si eleva la
		// conexión. Poner `tls: true` aquí forzaría TLS directo, que es el 465.
		settings.smtp.tls = Number(settings.smtp.port) === 465;

		settings.meta.senderAddress = $os.getenv('SMTP_SENDER') || usuario;
		settings.meta.senderName = '4D Cuarta Dimensión';

		$app.save(settings);

		$app.logger().info(
			'SMTP configurado desde el entorno',
			'host', settings.smtp.host,
			'puerto', settings.smtp.port,
			'remitente', settings.meta.senderAddress,
		);
	} catch (error) {
		// Que un fallo aquí no impida arrancar: sin correo el sitio sigue
		// funcionando y guardando las solicitudes.
		$app.logger().error('SMTP: no se pudo aplicar la configuración', 'error', String(error));
	}
});
