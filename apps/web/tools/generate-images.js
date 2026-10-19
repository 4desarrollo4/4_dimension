#!/usr/bin/env node

/*
  Genera los iconos del sitio y la imagen para compartir, a partir del logo.

  Se corre a mano, no en cada build: los resultados se versionan en public/.
  Vuelve a correrlo solo si cambia el logo.

      npm i -D sharp --prefix apps/web    # solo si hace falta regenerar
      node tools/generate-images.js

  ⚠️ `sharp` YA NO es una dependencia del proyecto. Ocupaba 28 MB y este script
  no forma parte del build: los PNG y el JPG que produce ya están versionados
  en public/. Instálala con la línea de arriba solo si cambia el logo, y
  desinstálala después (`npm un -D sharp --prefix apps/web`).

  ── Qué produce ────────────────────────────────────────────────────────────

  public/favicon-32.png       pestaña del navegador
  public/favicon-192.png      Android / PWA
  public/apple-touch-icon.png iOS al añadir a pantalla de inicio (180×180)
  public/og-image.jpg         WhatsApp, LinkedIn, Facebook, X (1200×630)

  ── Por qué el og-image importa tanto ──────────────────────────────────────

  Sin él, compartir un enlace muestra título y descripción pero NINGUNA imagen.
  Para un sitio cuyo objetivo es que conozcan la empresa, y cuyo canal principal
  es WhatsApp, esa imagen es la primera impresión.

  ⚠️ El texto del og-image se dibuja con las fuentes del sistema. En Windows
  usa Segoe UI. Si algún día se genera en otra máquina y el tipo se ve distinto,
  es por eso — no es un error del script.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const ORIGEN = path.join(publicDir, 'logo-4d-cdn.png');

if (!fs.existsSync(ORIGEN)) {
	console.error(`\n❌ No encuentro el logo en ${ORIGEN}\n`);
	process.exit(1);
}

// Tokens de marca — los mismos de src/index.css
const FONDO = '#0a0c14';
const AZUL = '#3d6bff';
const TEXTO = '#f2f4f8';
const APAGADO = '#8a8f9c';

const salida = (nombre) => path.join(publicDir, nombre);

// --- Iconos ----------------------------------------------------------------
const iconos = [
	{ archivo: 'favicon-32.png', lado: 32 },
	{ archivo: 'favicon-192.png', lado: 192 },
	{ archivo: 'apple-touch-icon.png', lado: 180 },
];

for (const { archivo, lado } of iconos) {
	// El logo ya trae fondo negro circular, así que no hace falta añadirlo.
	// `contain` con fondo del color de marca evita bordes blancos si algún día
	// el logo llega recortado.
	await sharp(ORIGEN)
		.resize(lado, lado, { fit: 'contain', background: FONDO })
		.png({ compressionLevel: 9 })
		.toFile(salida(archivo));

	const { size } = fs.statSync(salida(archivo));
	console.log(`  ✓ ${archivo.padEnd(22)} ${lado}×${lado}  ${(size / 1024).toFixed(1)} KB`);
}

// --- Imagen para compartir --------------------------------------------------
const ANCHO = 1200;
const ALTO = 630;
const LADO_LOGO = 300;

const fondo = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">
	<defs>
		<radialGradient id="brillo" cx="78%" cy="22%" r="62%">
			<stop offset="0%" stop-color="${AZUL}" stop-opacity="0.20"/>
			<stop offset="100%" stop-color="${AZUL}" stop-opacity="0"/>
		</radialGradient>
	</defs>
	<rect width="${ANCHO}" height="${ALTO}" fill="${FONDO}"/>
	<rect width="${ANCHO}" height="${ALTO}" fill="url(#brillo)"/>
	<rect x="0" y="${ALTO - 6}" width="${ANCHO}" height="6" fill="${AZUL}"/>
</svg>`);

const texto = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="620" height="${ALTO}">
	<style>
		.eyebrow { font: 600 19px 'Segoe UI', Arial, sans-serif; fill: ${AZUL}; letter-spacing: 5px; }
		.titulo  { font: 800 54px 'Segoe UI', Arial, sans-serif; fill: ${TEXTO}; }
		.lineas  { font: 600 27px 'Segoe UI', Arial, sans-serif; fill: ${APAGADO}; letter-spacing: 1px; }
	</style>
	<text class="eyebrow" x="0" y="212">4D CUARTA DIMENSIÓN</text>
	<text class="titulo"  x="0" y="286">Diseñamos y</text>
	<text class="titulo"  x="0" y="350">desarrollamos producto</text>
	<text class="lineas"  x="0" y="412">Calzado · Ropa · Dotaciones</text>
</svg>`);

// El logo viene como un cuadrado NEGRO OPACO con el círculo dibujado dentro
// (comprobado: las esquinas son [0,0,0,255], no transparentes). Sin recortar,
// ese cuadrado se recorta contra el degradado del fondo y se ve el borde.
// La máscara circular deja solo el círculo y el resto transparente.
const mascara = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${LADO_LOGO}" height="${LADO_LOGO}">
	<circle cx="${LADO_LOGO / 2}" cy="${LADO_LOGO / 2}" r="${LADO_LOGO / 2}" fill="#fff"/>
</svg>`);

const logo = await sharp(ORIGEN)
	.resize(LADO_LOGO, LADO_LOGO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.composite([{ input: mascara, blend: 'dest-in' }])
	.png()
	.toBuffer();

await sharp(fondo)
	.composite([
		{ input: logo, top: Math.round((ALTO - LADO_LOGO) / 2), left: 92 },
		{ input: texto, top: 0, left: 470 },
	])
	.jpeg({ quality: 88, mozjpeg: true })
	.toFile(salida('og-image.jpg'));

const { size } = fs.statSync(salida('og-image.jpg'));
console.log(`  ✓ ${'og-image.jpg'.padEnd(22)} ${ANCHO}×${ALTO}  ${(size / 1024).toFixed(1)} KB`);
console.log('\n✅ Imágenes generadas en apps/web/public/\n');
