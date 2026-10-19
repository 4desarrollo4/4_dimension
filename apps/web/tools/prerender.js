#!/usr/bin/env node

// Prerender de las 6 rutas del sitio (docs/06-backlog.md → P0-04).
//
// Por qué existe: WhatsApp, LinkedIn, Facebook, X y Slack no ejecutan
// JavaScript. Sin esto ven el index.html crudo y al compartir un enlace del
// sitio no aparece ni título ni descripción ni imagen — lo que anula el
// objetivo del proyecto (ver docs/07-decisiones.md → ADR-001 y ADR-004).
//
// Se ejecuta DESPUÉS de los dos builds de Vite:
//   1. build de cliente → dist/apps/web
//   2. build de SSR     → dist/ssr
//
// Para cada ruta renderiza el HTML en Node, le inyecta las etiquetas que
// react-helmet-async recogió, y escribe un index.html propio. El resultado es
// un sitio estático que cualquier hosting sirve tal cual.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { ROUTES, SITE_URL } from '../src/lib/site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const clientDir = path.resolve(webRoot, '../../dist/apps/web');
const ssrEntry = path.resolve(webRoot, '../../dist/ssr/entry-server.js');

function fail(message) {
	console.error(`\n❌ prerender: ${message}\n`);
	process.exit(1);
}

// --- Comprobaciones previas -------------------------------------------------

const templatePath = path.join(clientDir, 'index.html');

if (!fs.existsSync(templatePath)) {
	fail(`no existe ${templatePath}. Corre antes el build de cliente.`);
}

if (!fs.existsSync(ssrEntry)) {
	fail(`no existe ${ssrEntry}. Corre antes el build de SSR.`);
}

const template = fs.readFileSync(templatePath, 'utf8');

if (!template.includes('<div id="root">')) {
	fail('el index.html del build no tiene <div id="root">.');
}

// El monorepo no declara "type": "module", así que Node avisa al importar el
// bundle de SSR. Un package.json de una línea junto al bundle lo resuelve.
fs.writeFileSync(
	path.join(path.dirname(ssrEntry), 'package.json'),
	'{ "type": "module" }\n',
	'utf8',
);

const { render } = await import(pathToFileURL(ssrEntry).href);

// --- Render de cada ruta ----------------------------------------------------

function buildDocument({ html, helmet }) {
	let out = template;

	// El <title> y la description del template son solo el fallback: cada ruta
	// trae los suyos desde su <Helmet>.
	out = out.replace(/<title>[\s\S]*?<\/title>/i, '');
	out = out.replace(/<meta\s+name="description"[^>]*>/i, '');

	// No olvides ninguna categoría: el JSON-LD viaja en `script`, y sin esa
	// línea los datos estructurados no llegan nunca al HTML servido — que es
	// justo lo único que lee Google cuando no ejecuta JavaScript.
	const head = [
		helmet?.title?.toString(),
		helmet?.meta?.toString(),
		helmet?.link?.toString(),
		helmet?.script?.toString(),
	].filter(Boolean).join('\n\t\t');

	out = out.replace('</head>', `\t${head}\n\t</head>`);
	out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

	return out;
}

let written = 0;

for (const { path: route } of ROUTES) {
	let rendered;

	try {
		rendered = render(route);
	} catch (error) {
		fail(`falló el render de "${route}":\n${error.stack}`);
	}

	const document = buildDocument(rendered);

	// "/" va a la raíz; el resto a <ruta>/index.html, que es lo que esperan
	// tanto los hostings estáticos como el fallback de SPA.
	const outPath = route === '/'
		? path.join(clientDir, 'index.html')
		: path.join(clientDir, route.slice(1), 'index.html');

	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, document, 'utf8');

	const titleMatch = document.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	console.log(`  ✓ ${route.padEnd(12)} → ${titleMatch ? titleMatch[1].slice(0, 60) : '⚠️ SIN TITLE'}`);
	written += 1;
}

// --- robots.txt y sitemap.xml ----------------------------------------------
// Se generan aquí, no a mano, para que salgan siempre de la misma lista de
// rutas y del mismo dominio (src/lib/site.js).

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(({ path: route, priority }) => {
	const loc = route === '/' ? SITE_URL : `${SITE_URL}${route}`;
	return `\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<lastmod>${today}</lastmod>\n\t\t<priority>${priority}</priority>\n\t</url>`;
}).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(clientDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(clientDir, 'robots.txt'), robots, 'utf8');

// --- salvaguarda: las credenciales nunca salen en el build ------------------
// Vite copia TODO lo que hay en public/ a dist/. Si alguien crea un
// `api/config.php` para probar en local, acabaría dentro del build, y al subirlo
// pisaría el config del servidor con credenciales de desarrollo. El config vive
// solo en el servidor, puesto a mano una vez. Ver docs/07-decisiones.md → ADR-012.

const configFiltrado = path.join(clientDir, 'api', 'config.php');
let avisoConfig = '';

if (fs.existsSync(configFiltrado)) {
	fs.unlinkSync(configFiltrado);
	avisoConfig = '\n⚠️  Se eliminó api/config.php del build: ese archivo vive solo en el servidor.';
}

console.log(`\n✅ prerender: ${written} rutas + sitemap.xml + robots.txt en dist/apps/web${avisoConfig}\n`);
