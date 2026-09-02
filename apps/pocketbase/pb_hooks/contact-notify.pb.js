/// <reference path="../pb_data/types.d.ts" />

/*
  Aviso por correo cuando entra una solicitud de contacto.

  Por qué existe: el sitio promete públicamente "Respondemos en 24 a 48 horas
  hábiles", pero hasta ahora nada avisaba a nadie. Los mensajes se quedaban en
  la base de datos esperando a que alguien entrara al panel a mirarlos.

  ⚠️⚠️ LEE ESTO ANTES DE TOCAR NADA ⚠️⚠️

  PocketBase ejecuta cada handler en un **contexto aislado**. Una constante o
  una función declarada en el nivel superior de este archivo NO existe dentro
  del handler: da "ReferenceError: X is not defined" en tiempo de ejecución.

  Por eso todo lo que el handler necesita está declarado DENTRO del handler,
  aunque se repita entre uno y otro. No lo "limpies" sacándolo fuera.

  Se descubrió por las malas: el hook se disparaba, fallaba con
  "LINEAS is not defined", el error quedaba en el log interno que nadie lee y
  el correo no salía nunca. La solicitud sí se guardaba, así que por fuera todo
  parecía correcto.

  Verificado el 2026-09-02 con PocketBase 0.39.8 en Windows y base local.
*/

// --- Trampa antibots -------------------------------------------------------
// El formulario incluye un campo oculto que una persona nunca ve ni rellena.
// Si viene con contenido, es un bot. Se rechaza antes de tocar la base de datos.
// (El navegador ya corta la mayoría; esto cubre el envío directo a la API.)
onRecordCreateRequest((e) => {
	try {
		const trampa = e.requestInfo().body.website;

		if (trampa) {
			$app.logger().warn('Solicitud de contacto descartada por la trampa antibots');
			throw new BadRequestError('Solicitud no válida.');
		}
	} catch (error) {
		// Si el error es el nuestro, propágalo. Si falló la lectura del cuerpo,
		// no bloquees un envío legítimo por eso.
		if (error instanceof BadRequestError) {
			throw error;
		}
		$app.logger().error('No se pudo leer el cuerpo de la solicitud', 'error', String(error));
	}

	e.next();
}, 'contact_requests');

// --- Aviso al equipo comercial ---------------------------------------------
onRecordAfterCreateSuccess((e) => {
	try {
		// ↓↓↓ TODO ESTO VA DENTRO DEL HANDLER A PROPÓSITO. Ver la nota de arriba.

		// A dónde llegan los avisos. Se puede cambiar sin tocar código con la
		// variable de entorno CONTACT_NOTIFY_TO.
		// OJO: no es el correo público del sitio (comercial@cuartadimension.co).
		// Ese sigue siendo el que ven los visitantes y sale de docs/02-empresa.md.
		const destino = $os.getenv('CONTACT_NOTIFY_TO') || 'rodriguezsilvamilton5@gmail.com';

		// Etiquetas legibles: en la base, `line` se guarda como identificador.
		const LINEAS = {
			calzado: 'Calzado',
			ropa: 'Ropa',
			dotaciones: 'Dotaciones',
			otro: 'Otro proyecto',
		};

		// El contenido lo escribe un desconocido: nunca lo metas crudo en el HTML.
		const escapar = (valor) => String(valor === null || valor === undefined ? '' : valor)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

		// wa.me solo acepta dígitos, sin "+" ni espacios.
		const soloDigitos = (valor) => String(valor === null || valor === undefined ? '' : valor).replace(/\D/g, '');

		const r = e.record;

		const nombre = r.getString('name');
		const empresa = r.getString('company');
		const correo = r.getString('email');
		const telefono = r.getString('phone');
		const linea = LINEAS[r.getString('line')] || r.getString('line') || 'sin especificar';
		const mensaje = r.getString('message');

		// El saludo que pidió el propietario, en primera persona, como si lo
		// escribiera quien rellena el formulario. La empresa es opcional: si no
		// la puso, la frase se arma sin ella en lugar de quedar coja.
		const presentacion = empresa
			? `Hola, soy <strong>${escapar(nombre)}</strong> de la empresa <strong>${escapar(empresa)}</strong> y mi línea de interés es <strong>${escapar(linea)}</strong>.`
			: `Hola, soy <strong>${escapar(nombre)}</strong> y mi línea de interés es <strong>${escapar(linea)}</strong>.`;

		const whatsapp = soloDigitos(telefono);

		const html = `
			<div style="background:#0a0c14;color:#f2f4f8;font-family:Helvetica,Arial,sans-serif;padding:32px;">
				<p style="margin:0 0 4px;color:#3d6bff;font-size:11px;letter-spacing:.2em;text-transform:uppercase;">
					4D Cuarta Dimensión
				</p>
				<h1 style="margin:0 0 28px;font-size:20px;">Nueva solicitud de contacto</h1>

				<p style="margin:0 0 20px;font-size:16px;line-height:1.6;">${presentacion}</p>

				<div style="border-left:2px solid #3d6bff;padding-left:16px;margin:0 0 24px;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapar(mensaje)}</div>

				<p style="margin:0 0 32px;font-size:16px;">Muchas gracias.</p>

				<table style="border-collapse:collapse;border-top:1px solid #23262d;padding-top:16px;width:100%;">
					<tr>
						<td style="padding:14px 16px 6px 0;color:#8a8f9c;font-size:12px;white-space:nowrap;">Correo</td>
						<td style="padding:14px 0 6px;font-size:14px;">
							<a href="mailto:${escapar(correo)}" style="color:#3d6bff;text-decoration:none;">${escapar(correo)}</a>
						</td>
					</tr>
					<tr>
						<td style="padding:6px 16px 6px 0;color:#8a8f9c;font-size:12px;white-space:nowrap;">Teléfono</td>
						<td style="padding:6px 0;font-size:14px;">
							<a href="tel:${escapar(telefono)}" style="color:#f2f4f8;text-decoration:none;">${escapar(telefono || '—')}</a>
						</td>
					</tr>
				</table>

				${whatsapp
					? `<p style="margin:24px 0 0;">
							<a href="https://wa.me/${escapar(whatsapp)}"
								style="display:inline-block;background:#25D366;color:#06180d;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;">
								Escribir por WhatsApp
							</a>
						</p>`
					: ''}

				<p style="margin:28px 0 0;color:#8a8f9c;font-size:12px;line-height:1.6;">
					El compromiso publicado en el sitio es de 24 a 48 horas hábiles.<br>
					Si el botón de WhatsApp no abre la conversación, es que el número llegó sin indicativo de país.
				</p>
			</div>
		`;

		const message = new MailerMessage({
			from: {
				address: $app.settings().meta.senderAddress,
				name: $app.settings().meta.senderName,
			},
			to: [{ address: destino }],
			// `mailer.Message` no tiene campo replyTo: se pone por cabecera.
			headers: { 'Reply-To': correo },
			subject: `Nueva solicitud de contacto — ${nombre}`,
			html: html,
		});

		$app.newMailClient().send(message);

		$app.logger().info('Aviso de contacto enviado', 'destino', destino, 'de', correo);
	} catch (error) {
		// Nunca tumbes la petición por un fallo de correo: el mensaje del
		// visitante ya está guardado y perderlo sería mucho peor que no avisar.
		$app.logger().error('No se pudo enviar el aviso de contacto', 'error', String(error));
	}

	e.next();
}, 'contact_requests');
