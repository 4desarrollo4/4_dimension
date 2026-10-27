import { FOTOS } from './media';

export const IMAGES = {
    dotacionesHero: 'https://images.hostinger.com/f187d7b4-1893-4b9a-b331-c2b53d8db549.png',
    coleccion: 'https://images.hostinger.com/a9612af2-c6c6-40f8-9931-606f108485fd.png',
    atlas: 'https://images.hostinger.com/06556076-4a19-479d-93ab-2c106a495cee.png',
    executive: 'https://images.hostinger.com/e55b6b4a-7ac8-4b4b-ab40-a325d19b96b5.png',
    calzadoDetail: 'https://images.hostinger.com/591a251b-02ec-4b5c-bd6d-b5ecb9ea5318.png',
    dotacionesDetail: 'https://images.hostinger.com/f8dc83e9-ba5d-4e69-a2f0-50cdeb11234a.png',
    studio: 'https://images.hostinger.com/51a861b5-5e23-41cc-b936-c9b26cf5b0b2.png',
};

/*
    ⚠️ Los textos de estos proyectos los reescribió el propietario el 2026-10-20.
    Los `id` NO se renombraron: los usa el filtro `lineId` de las páginas de
    línea. Ver docs/02-empresa.md, que es la fuente de verdad.

    ⚠️ Los `alt` describen las fotos de banco actuales, no los nombres nuevos.
    Cuando lleguen las fotos reales hay que reescribirlos (P1-13).
*/
export const projects = [
    {
        id: 'runner-x40',
        name: 'Greenloop',
        client: 'Marca de Moda Sostenible',
        sector: 'Sportswear',
        line: 'Calzado',
        lineId: 'calzado',
        result: 'Ingeniería de materiales e insumos.',
        // Foto propia desde el 2026-10-27. `fondoBlanco`: ver ProjectCard.
        image: FOTOS.calzadoGreenloop.src,
        alt: FOTOS.calzadoGreenloop.alt,
        fondoBlanco: true,
    },
    {
        id: 'coleccion-origin',
        name: 'Greenloop',
        client: 'Firma de moda Sostenible',
        sector: 'Retail de moda',
        line: 'Ropa',
        lineId: 'ropa',
        result: 'Colección Sensess.',
        image: IMAGES.coleccion,
        alt: 'Prendas premium dobladas de la Colección Origin',
    },
    {
        id: 'programa-atlas',
        name: 'Diseño Personalizado',
        client: 'Desarrollo enfocado en solucionar tus necesidades',
        sector: 'Logística',
        line: 'Dotaciones',
        lineId: 'dotaciones',
        result: '+20.000 prendas elaboradas.',
        image: IMAGES.atlas,
        alt: 'Dotación industrial del Programa Atlas: pantalón cargo, chaleco y botas de seguridad',
    },
    {
        id: 'linea-executive',
        name: 'Línea Executive',
        client: 'Grupo hotelero por diseño y materiales para cada necesidad',
        sector: 'Hospitalidad',
        line: 'Calzado corporativo',
        lineId: 'calzado',
        result: '+35.000 pares vendidos.',
        image: IMAGES.executive,
        alt: 'Calzado corporativo de cuero negro de la Línea Executive',
    },
];
