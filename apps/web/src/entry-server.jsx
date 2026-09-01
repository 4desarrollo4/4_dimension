import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Punto de entrada del prerender. `tools/prerender.js` importa este `render`
// una vez por ruta y mete el resultado en el index.html del build.
export function render(url) {
	const helmetContext = {};

	const html = renderToString(
		<HelmetProvider context={helmetContext}>
			<StaticRouter location={url}>
				<App />
			</StaticRouter>
		</HelmetProvider>,
	);

	return { html, helmet: helmetContext.helmet };
}
