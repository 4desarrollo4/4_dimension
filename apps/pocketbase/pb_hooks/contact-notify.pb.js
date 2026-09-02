/// <reference path="../pb_data/types.d.ts" />

/*
  Acuse de recibo al cliente cuando envía el formulario de contacto.

  ── Se envía UN SOLO correo ────────────────────────────────────────────────

  De `info@4dimensionsas.com` → a quien llenó el formulario. Nada más.

  Hubo antes un segundo correo de aviso interno a info@; el propietario pidió
  quitarlo el 2026-09-02. No lo vuelvas a añadir sin preguntar.

  📌 Cómo se entera el equipo de que llegó una solicitud, sin aviso interno:
     - El acuse sale DESDE info@4dimensionsas.com, así que queda copia en la
       carpeta "Enviados" de esa cuenta, con todos los datos del cliente.
     - Y la solicitud queda guardada en la colección `contact_requests`.

  ── ⚠️⚠️ LEE ESTO ANTES DE TOCAR NADA ⚠️⚠️ ────────────────────────────────

  PocketBase ejecuta cada handler en un **contexto aislado**. Una constante o
  una función declarada en el nivel superior de este archivo NO existe dentro
  del handler: da "ReferenceError: X is not defined" en tiempo de ejecución.

  Por eso todo lo que el handler necesita está declarado DENTRO del handler.
  No lo "limpies" sacándolo fuera.

  Se descubrió por las malas: el hook se disparaba, fallaba con
  "LINEAS is not defined", el error quedaba en el log interno que nadie lee y
  el correo no salía nunca. La solicitud sí se guardaba, así que por fuera todo
  parecía correcto.

  Verificado el 2026-09-02 con PocketBase 0.39.8 en Windows.
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

// --- Acuse de recibo al cliente --------------------------------------------
onRecordAfterCreateSuccess((e) => {
	try {
		// ↓↓↓ TODO ESTO VA DENTRO DEL HANDLER A PROPÓSITO. Ver la nota de arriba.

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

		const r = e.record;

		const nombre = r.getString('name');
		const empresa = r.getString('company');
		const correo = r.getString('email');
		const telefono = r.getString('phone');
		const linea = LINEAS[r.getString('line')] || r.getString('line') || 'sin especificar';
		const mensaje = r.getString('message');

		const resumen = [
			['Nombre', nombre],
			['Empresa', empresa || '—'],
			['Correo', correo],
			['Teléfono', telefono],
			['Línea de interés', linea],
		].map(function (fila) {
			return '<tr>'
				+ '<td style="padding:7px 18px 7px 0;color:#8a8f9c;font-size:12px;white-space:nowrap;vertical-align:top;">' + escapar(fila[0]) + '</td>'
				+ '<td style="padding:7px 0;color:#f2f4f8;font-size:14px;">' + escapar(fila[1]) + '</td>'
				+ '</tr>';
		}).join('');

		const html = `
			<div style="background:#0a0c14;color:#f2f4f8;font-family:Helvetica,Arial,sans-serif;padding:32px;">
				<p style="margin:0 0 4px;color:#3d6bff;font-size:11px;letter-spacing:.2em;text-transform:uppercase;">
					4D Cuarta Dimensión
				</p>
				<h1 style="margin:0 0 24px;font-size:20px;">Recibimos tu mensaje</h1>

				<p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
					Hola <strong>${escapar(nombre)}</strong>, te escribimos de
					<strong>4D Cuarta Dimensión</strong>. Tu mensaje llegó bien y
					pronto nos pondremos en contacto contigo.
				</p>

				<p style="margin:0 0 10px;color:#8a8f9c;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">
					Esto fue lo que nos enviaste
				</p>
				<table style="border-collapse:collapse;margin:0 0 18px;">${resumen}</table>

				<div style="border-left:2px solid #3d6bff;padding-left:16px;margin:0 0 28px;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapar(mensaje)}</div>

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
				</p>
			</div>
		`;

		$app.newMailClient().send(new MailerMessage({
			from: {
				address: $app.settings().meta.senderAddress,
				name: $app.settings().meta.senderName,
			},
			to: [{ address: correo }],
			subject: 'Recibimos tu mensaje — 4D Cuarta Dimensión',
			html: html,
		}));

		$app.logger().info('Acuse de recibo enviado al cliente', 'destino', correo);
	} catch (error) {
		// Nunca tumbes la petición por un fallo de correo: el mensaje del
		// visitante ya está guardado y perderlo sería mucho peor que no avisar.
		$app.logger().error('No se pudo enviar el acuse al cliente', 'error', String(error));
	}

	e.next();
}, 'contact_requests');
