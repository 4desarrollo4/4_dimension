import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import { absoluteUrl } from '@/lib/site';
import JsonLd from '../components/JsonLd';
import PageTransition from '../components/PageTransition';
import { LineHero, LineClosing } from '../components/ProductLine';
import { FOTOS } from '../data/media';

/*
    ⚠️ PÁGINA MÍNIMA — PENDIENTE DE CONTENIDO REAL.

    Creada el 2026-10-20 porque el propietario añadió «Insumos» como cuarta
    línea de negocio. Lo único que aportó fue la descripción que aparece abajo.

    NO se inventaron capacidades, tipos de material, cifras ni casos: la regla
    del proyecto (CLAUDE.md) es que el contenido factual sale de
    docs/02-empresa.md y lo valida el propietario. Las otras tres líneas tienen
    `CapabilityList`, `FeatureGrid`, `DetailSplit` y una galería de productos;
    aquí no se ponen hasta que haya material real.

    Desde el 2026-10-20 sí hay foto propia (`FOTOS.insumos`), así que el hero
    vuelve a dos columnas. Es la PRIMERA imagen del sitio que no es de banco.

    Qué falta para equipararla a las otras tres — ver docs/06-backlog.md P1-15.
*/

export default function InsumosPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Insumos para calzado y textil en Colombia | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Materiales e insumos para la industria de calzado y textil, la cuarta línea de 4D Cuarta Dimensión, empresa colombiana de diseño y desarrollo de producto."
                />
            </Helmet>
            <Seo
                title="Insumos para calzado y textil en Colombia | 4D Cuarta Dimensión"
                description="Materiales e insumos para la industria de calzado y textil, la cuarta línea de 4D Cuarta Dimensión, empresa colombiana de diseño y desarrollo de producto."
                image={absoluteUrl('/og/insumos.jpg')}
            />
            <JsonLd migas={[{ nombre: 'Insumos', ruta: '/insumos' }]} />
            <LineHero
                index="04"
                title="Insumos"
                description="Materiales e insumos para la industria de calzado y textil."
                image={FOTOS.insumos.src}
                imageAlt={FOTOS.insumos.alt}
            />
            <LineClosing
                actual="04"
                title="Insumos es la línea 04 de 4D."
                text="Comparte con las otras tres líneas la misma metodología —descubrimiento, diseño, desarrollo y evolución— y la misma red de aliados en Colombia, Guatemala, Ecuador y Bolivia."
            />
        </PageTransition>
    );
}
