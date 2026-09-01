import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App';
import '@/index.css';

const container = document.getElementById('root');

const app = (
	<HelmetProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</HelmetProvider>
);

// En producción el HTML llega ya renderizado por tools/prerender.js, así que
// hidratamos. En desarrollo Vite sirve un #root vacío y no hay nada que
// hidratar: ahí montamos de cero, o React reportaría un desajuste inexistente.
if (container.hasChildNodes()) {
	hydrateRoot(container, app);
} else {
	createRoot(container).render(app);
}
