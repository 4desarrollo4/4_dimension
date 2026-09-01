import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import PageTransition from '../components/PageTransition';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, CasesSection, LineCTA } from '../components/ProductLine';
import { IMAGES, projects } from '../data/projects';

const capabilities = [
    { title: 'Diseño de colecciones', description: 'Dirección creativa y desarrollo de colecciones completas alineadas con la identidad de tu marca.' },
    { title: 'Fichas técnicas y patronaje', description: 'Patronaje digital, fichas técnicas detalladas y escalado de tallas listo para producción.' },
    { title: 'Desarrollo de textiles', description: 'Selección y desarrollo de telas: composición, gramaje, acabados y pruebas de laboratorio.' },
    { title: 'Muestras y aprobación', description: 'Muestras físicas con iteraciones controladas hasta lograr el ajuste y acabado exactos.' },
    { title: 'Producción a escala', description: 'Manufactura con plantas aliadas, control de calidad en línea y trazabilidad por lote.' },
    { title: 'Comercialización internacional', description: 'Consolidación, documentación y logística para entregar tu colección en cualquier mercado.' },
];

const types = [
    { title: 'Casual y lifestyle', description: 'Prendas de uso diario con diseño diferenciado y calidad constante.' },
    { title: 'Deportiva', description: 'Textiles técnicos, costuras planas y prendas pensadas para el movimiento.' },
    { title: 'Corporativa', description: 'Vestuario de oficina y servicio que proyecta la imagen de tu empresa.' },
    { title: 'Exterior y técnica', description: 'Prendas de protección y alto desempeño para condiciones exigentes.' },
];

export default function RopaPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Ropa — Diseño y desarrollo de indumentaria | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Diseño y desarrollo de indumentaria: colecciones, patronaje, textiles, personalización y producción a escala con comercialización internacional."
                />
            </Helmet>
            <Seo
                title="Ropa — Diseño y desarrollo de indumentaria | 4D Cuarta Dimensión"
                description="Diseño y desarrollo de indumentaria: colecciones, patronaje, textiles, personalización y producción a escala con comercialización internacional."
            />
            <LineHero
                index="02"
                title="Ropa"
                claim="Indumentaria con identidad, no con etiqueta prestada."
                description="Desarrollamos colecciones y líneas de indumentaria para marcas que quieren diferenciarse: diseño, patronaje, textiles, personalización y producción con estándares internacionales."
                image={IMAGES.ropaHero}
                imageAlt="Chaqueta técnica azul oscuro presentada en forma fantasma sobre fondo oscuro"
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Tipos de prenda" items={types} />
            <DetailSplit
                title="Personalización total"
                text="Bordado, estampado, sublimación, transferencias, etiquetas tejidas y empaques de marca. Cada prenda sale de producción lista para el punto de venta o para tu operación, con tu identidad en cada detalle."
                image={IMAGES.ropaDetail}
                imageAlt="Muestras de tela técnica y cinta métrica sobre una mesa de estudio de diseño"
            />
            <CasesSection cases={projects.filter((p) => p.lineId === 'ropa')} />
            <LineCTA
                title="¿Desarrollamos tu próxima colección?"
                text="Desde una cápsula hasta una línea completa: te proponemos concepto, materiales, tiempos y costos con total transparencia."
            />
        </PageTransition>
    );
}
