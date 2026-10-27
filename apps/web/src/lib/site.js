// Configuración canónica del sitio.
//
// Un solo sitio donde vive el dominio: lo usan el componente <Seo>, el
// prerender (tools/prerender.js), el sitemap.xml y el robots.txt. Si el dominio
// definitivo cambia, se cambia AQUÍ y en ningún otro lado.
//
// ✅ Dominio confirmado por el propietario el 2026-09-02.
// Antes estaba inferido del correo comercial y apuntaba a cuartadimension.co,
// que NO es el dominio del sitio. Ver docs/02-empresa.md.

export const SITE_URL = 'https://4dimensionsas.com';

export const SITE_NAME = '4D Cuarta Dimensión';

// Imagen que ven WhatsApp y LinkedIn al compartir un enlace.
// ⚠️ El archivo todavía no existe: hace falta el logo en vectorial para
// generarlo (1200×630). Ver docs/06-backlog.md → P0-02.
// El dominio ya no bloquea: solo falta el logo.
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Las 7 rutas públicas del sitio. Es la lista que consumen el prerender y el
// sitemap: si añades una ruta en App.jsx, añádela también aquí.
export const ROUTES = [
    { path: '/', priority: '1.0' },
    { path: '/calzado', priority: '0.8' },
    { path: '/ropa', priority: '0.8' },
    { path: '/dotaciones', priority: '0.8' },
    { path: '/insumos', priority: '0.8' },
    { path: '/nosotros', priority: '0.7' },
    { path: '/contacto', priority: '0.6' },
];

// Devuelve la URL absoluta y canónica de una ruta.
export function absoluteUrl(pathname = '/') {
    const clean = pathname === '/' ? '' : pathname.replace(/\/$/, '');
    return `${SITE_URL}${clean}`;
}
