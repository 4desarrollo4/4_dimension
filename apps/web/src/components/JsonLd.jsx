import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/site';
import { LOGO_URL } from './Navbar';

/*
  Datos estructurados (schema.org). Es lo que alimenta el panel de conocimiento
  de Google: literalmente, lo que hace que "te conozcan" cuando buscan la
  empresa por su nombre.

  ⚠️ REGLA: aquí solo entran datos verificados de docs/02-empresa.md. Un dato
  inventado en JSON-LD no es un adorno — es una afirmación que Google publica
  como si fuera oficial. Lo que falta se OMITE, no se rellena.

  Pendiente de añadir cuando el propietario los aporte (ver P1-06):
    taxID          → NIT
    foundingDate   → año de fundación
    streetAddress  → dirección exacta
    sameAs         → perfiles de redes sociales

  Va en su propio componente y no en el <Helmet> de cada página a propósito:
  tools/generate-llms.js lee el PRIMER <Helmet> del archivo de la página con
  expresiones regulares, y meterle un bloque JSON aquí podría romperlo.
*/

const organizacion = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organizacion`,
    name: '4D Cuarta Dimensión ES S.A.S.',
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
        'Comercializadora internacional colombiana de diseño y desarrollo de producto: calzado, ropa y dotaciones corporativas e industriales.',
    email: 'info@4dimensionsas.com',
    telephone: '+57-601-743-4400',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bogotá D.C.',
        addressCountry: 'CO',
    },
    areaServed: [
        { '@type': 'Place', name: 'Latinoamérica' },
        { '@type': 'Place', name: 'Norteamérica' },
        { '@type': 'Place', name: 'Europa' },
    ],
    knowsLanguage: ['es'],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'info@4dimensionsas.com',
        telephone: '+57-601-743-4400',
        areaServed: ['CO', 'US', 'EU'],
        availableLanguage: ['Spanish'],
    },
};

const sitioWeb = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#sitio`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'es',
    publisher: { '@id': `${SITE_URL}/#organizacion` },
};

// `migas` es opcional: [{ nombre, ruta }] sin incluir "Inicio", que se añade solo.
export default function JsonLd({ migas }) {
    const grafo = [organizacion, sitioWeb];

    if (migas?.length) {
        grafo.push({
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
                ...migas.map((m, i) => ({
                    '@type': 'ListItem',
                    position: i + 2,
                    name: m.nombre,
                    item: absoluteUrl(m.ruta),
                })),
            ],
        });
    }

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo })}
            </script>
        </Helmet>
    );
}

export { JsonLd };
