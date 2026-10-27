/*
    Punto único de los datos de contacto y de los enlaces que se construyen con
    ellos. Antes el teléfono y la dirección estaban escritos a mano en varios
    sitios; ahora el botón flotante de WhatsApp, la sección «Dónde operamos» y
    el footer leen de aquí.

    ⚠️ Los valores son reales y están validados. Si cambia uno, se cambia
    PRIMERO en docs/02-empresa.md y después aquí.
*/

export const EMAIL = 'info@4dimensionsas.com';

// En formato internacional y sin separadores: es lo que necesita wa.me.
export const TELEFONO_E164 = '573165775539';
export const TELEFONO_VISIBLE = '+57 316 577 5539';

export const DIRECCION_CALLE = 'Cra. 34a #27a-22 sur';
export const DIRECCION_CIUDAD = 'Bogotá D.C., Colombia';

// Mensaje con el que se abre WhatsApp, pedido por el propietario el 2026-10-20.
export const WHATSAPP_MENSAJE =
    'Hola 4D Cuarta Dimensión, tengo un proyecto en mente y me gustaría trabajarlo con ustedes.';

export const MAILTO = `mailto:${EMAIL}`;

/*
    `wa.me` es el enlace oficial de WhatsApp y decide solo si abre la app del
    móvil o WhatsApp Web en escritorio. No uses `api.whatsapp.com`: en móvil
    mete una pantalla intermedia.
*/
export const WHATSAPP_URL = `https://wa.me/${TELEFONO_E164}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

/*
    Endpoint universal de Google Maps: funciona en la app de Android, en iOS y
    en el navegador, y deja la dirección ya buscada para pulsar «Cómo llegar».
*/
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${DIRECCION_CALLE}, ${DIRECCION_CIUDAD}`,
)}`;
