import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Este archivo venía del scaffold de Hostinger Horizons y traía ~400 líneas de
// andamiaje para que el sitio fuera editable dentro del iframe del editor
// visual: cinco scripts inyectados en el HTML que hacían postMessage al padre,
// seis plugins de dev y un pre-bundle forzado de todas las dependencias.
// El proyecto ya no se edita en Horizons, así que todo eso se retiró el
// 2026-09-02. Ver docs/07-decisiones.md.

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		// El formulario llama a /api/contacto.php. En producción lo sirve el
		// mismo hosting; en local hace falta un PHP escuchando aparte, o la
		// petición cae en el fallback del SPA y el formulario siempre falla.
		//
		//   php -S 127.0.0.1:8099 -t apps/web/public
		//
		// Sin ese proceso el resto del sitio funciona igual: solo el envío del
		// formulario deja de poder probarse. Ver docs/06-backlog.md -> P1-05.
		proxy: {
			'/api': {
				target: process.env.PHP_URL || 'http://127.0.0.1:8099',
				changeOrigin: true,
			},
		},
		fs: {
			strict: true,
			// node_modules está izado a la raíz del monorepo, no en apps/web.
			allow: [
				path.resolve(__dirname),
				path.join(path.resolve(__dirname, '../..'), 'node_modules'),
			],
		},
	},
	resolve: {
		extensions: ['.jsx', '.js', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
