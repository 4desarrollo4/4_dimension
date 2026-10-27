import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import { absoluteUrl } from '@/lib/site';
import JsonLd from '../components/JsonLd';
import PageTransition from '../components/PageTransition';
import { Shirt, Dumbbell, Briefcase, Mountain } from 'lucide-react';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, DesignGallery, LineClosing } from '../components/ProductLine';
import { FOTOS, GALERIA_ROPA } from '../data/media';

const capabilities = [
    { title: 'Diseño de colecciones', description: 'Dirección creativa y desarrollo de colecciones completas alineadas con la identidad de cada marca.' },
    { title: 'Fichas técnicas y patronaje', description: 'Patronaje digital, fichas técnicas detalladas y escalado de tallas listo para producción.' },
    { title: 'Desarrollo de textiles', description: 'Selección y desarrollo de telas: composición, gramaje, acabados y pruebas de laboratorio.' },
    { title: 'Muestras y aprobación', description: 'Muestras físicas con iteraciones controladas hasta lograr el ajuste y acabado exactos.' },
    { title: 'Producción a escala', description: 'Manufactura con plantas aliadas, control de calidad en línea y trazabilidad por lote.' },
    { title: 'Comercialización internacional', description: 'Consolidación, documentación y logística para entregar tu colección en cualquier mercado.' },
];

const types = [
    { icon: Shirt, title: 'Casual y lifestyle', description: 'Prendas de uso diario con diseño diferenciado y calidad constante.' },
    { icon: Dumbbell, title: 'Deportiva', description: 'Textiles técnicos, costuras planas y prendas pensadas para el movimiento.' },
    { icon: Briefcase, title: 'Corporativa', description: 'Vestuario de oficina y servicio que proyecta la imagen corporativa.' },
    { icon: Mountain, title: 'Exterior y técnica', description: 'Prendas de protección y alto desempeño para condiciones exigentes.' },
];

export default function RopaPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Diseño y desarrollo de ropa en Colombia | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Diseño y desarrollo de indumentaria: colecciones, patronaje, textiles, personalización y producción a escala con comercialización internacional."
                />
            </Helmet>
            <Seo
                title="Diseño y desarrollo de ropa en Colombia | 4D Cuarta Dimensión"
                description="Diseño y desarrollo de indumentaria: colecciones, patronaje, textiles, personalización y producción a escala con comercialización internacional."
                image={absoluteUrl('/og/ropa.jpg')}
            />
            <JsonLd migas={[{ nombre: 'Ropa', ruta: '/ropa' }]} />
            <LineHero
                index="02"
                title="Ropa"
                claim="Indumentaria con identidad, no con etiqueta prestada."
                description="Desarrollamos colecciones y líneas de indumentaria para marcas que quieren diferenciarse: diseño, patronaje, textiles, personalización y producción con estándares internacionales."
                image={FOTOS.ropaHero.src}
                imageAlt={FOTOS.ropaHero.alt}
                imageWidth={FOTOS.ropaHero.width}
                imageHeight={FOTOS.ropaHero.height}
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Tipos de prenda" items={types} />
            <DetailSplit
                title="Personalización total"
                text="Bordado, estampado, sublimación, transferencias, etiquetas tejidas y empaques de marca. Cada prenda sale de producción lista para el punto de venta o para la operación del cliente, con su identidad en cada detalle."
                puntos={['Bordado', 'Estampado', 'Sublimación', 'Transferencias', 'Etiquetas tejidas', 'Empaques de marca']}
                image={FOTOS.ropaPersonalizacion.src}
                imageAlt={FOTOS.ropaPersonalizacion.alt}
                imageWidth={FOTOS.ropaPersonalizacion.width}
                imageHeight={FOTOS.ropaPersonalizacion.height}
                tinte={false}
            />
            <DesignGallery title="Algunos de nuestros productos." etiqueta="Indumentaria" designs={GALERIA_ROPA} />
            <LineClosing
                actual="02"
                title="Ropa es la línea 02 de 4D."
                text="Comparte con las otras tres líneas la misma metodología —descubrimiento, diseño, desarrollo y evolución— y la misma red de aliados de manufactura en Colombia, Guatemala, Ecuador y Bolivia."
            />
        </PageTransition>
    );
}
