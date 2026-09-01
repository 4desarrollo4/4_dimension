import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { absoluteUrl, OG_IMAGE, SITE_NAME } from '@/lib/site';

// Etiquetas sociales + canonical. La página sigue declarando su propio <title>
// y <meta name="description"> literales dentro de su <Helmet>, porque
// tools/generate-llms.js los lee del código fuente y no admite variables.
//
// La URL sale de `useLocation` + SITE_URL, nunca de `window`: este componente
// también se renderiza en el prerender, donde `window` no existe.
const Seo = ({ title, description, image = OG_IMAGE, path, siteName = SITE_NAME, type = 'website' }) => {
    const location = useLocation();
    const canonical = absoluteUrl(path ?? location.pathname);

    return (
        <Helmet>
            <link rel="canonical" href={canonical} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content={type} />
            <meta property="og:locale" content="es_CO" />
            {siteName && <meta property="og:site_name" content={siteName} />}
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            {image && <meta property="og:image" content={image} />}
            {image && <meta property="og:image:width" content="1200" />}
            {image && <meta property="og:image:height" content="630" />}
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}

export default Seo;

export { Seo };
