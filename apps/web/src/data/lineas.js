import { IMAGES } from './projects';
import { FOTOS } from './media';

/*
    Las cuatro líneas de negocio: registro ÚNICO desde el 2026-10-26.

    Antes vivían a mano en dos sitios: la home (con foto y descripción) y el
    cierre de cada página de línea (una lista de «otras líneas» copiada en las
    cuatro páginas). Esas copias ya se desincronizaron una vez: tras añadir
    Insumos, los cierres siguieron diciendo «las otras dos líneas».

    Ahora la home pinta esta lista y `LineClosing` muestra todas menos la actual.
    Si se añade, renombra o cambia de foto una línea, se cambia AQUÍ.

    ⚠️ La foto de Dotaciones sigue siendo de banco (CDN externo). Calzado, Ropa
    e Insumos ya usan fotos propias (`data/media.js`).

    `posicion` (opcional) es el `object-position` de la foto donde se recorta:
    hace falta en las verticales, para que el recorte no se coma la cabeza.
*/
export const LINEAS = [
    {
        index: '01',
        title: 'Calzado',
        to: '/calzado',
        image: FOTOS.calzadoHero.src,
        alt: FOTOS.calzadoHero.alt,
        description:
            'Diseño y desarrollo integral de calzado casual, deportivo casual, industrial y corporativo. Del concepto a la horma y de la horma al producto listo para la producción.',
    },
    {
        index: '02',
        title: 'Ropa',
        to: '/ropa',
        image: FOTOS.ropaHero.src,
        alt: FOTOS.ropaHero.alt,
        posicion: FOTOS.ropaHero.posicion,
        description:
            'Indumentaria por desarrollo para marcas y emprendedores que buscan diferenciarse: diseño de colecciones, patronaje, desarrollo de textiles y personalización, con producción a escala.',
    },
    {
        index: '03',
        title: 'Dotaciones',
        to: '/dotaciones',
        image: IMAGES.dotacionesHero,
        alt: 'Uniforme industrial azul con casco de seguridad blanco sobre fondo oscuro',
        description:
            'Uniformes corporativos e industriales y elementos de protección personal, con personalización, volumen y necesidad.',
    },
    {
        index: '04',
        title: 'Insumos',
        to: '/insumos',
        image: FOTOS.insumos.src,
        alt: FOTOS.insumos.alt,
        description: 'Materiales e insumos para la industria de calzado y textil.',
    },
];
