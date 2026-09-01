import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import PageTransition from '../components/PageTransition';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, CasesSection, LineCTA } from '../components/ProductLine';
import { IMAGES, projects } from '../data/projects';

const capabilities = [
    { title: 'Investigación y tendencias', description: 'Análisis de mercado, comportamiento del consumidor y dirección de producto por categoría y región.' },
    { title: 'Diseño conceptual y renders', description: 'Conceptos, bocetos y renders fotorrealistas para validar la idea antes de invertir en desarrollo.' },
    { title: 'Desarrollo de hormas y suelas', description: 'Ingeniería de horma, suelas en EVA, caucho y PU, y ajuste anatómico según el uso final.' },
    { title: 'Ingeniería de materiales', description: 'Cueros, textiles técnicos y sintéticos de alto rendimiento seleccionados por desempeño y costo objetivo.' },
    { title: 'Prototipado y muestras', description: 'Prototipos funcionales y muestras de venta con iteraciones controladas hasta la aprobación final.' },
    { title: 'Producción y control de calidad', description: 'Manufactura con aliados certificados, inspección en línea y verificación pre-embarque.' },
];

const types = [
    { title: 'Casual', description: 'Siluetas urbanas y lifestyle con identidad de marca propia.' },
    { title: 'Deportivo', description: 'Performance real: amortiguación, soporte y materiales técnicos.' },
    { title: 'Industrial', description: 'Calzado de seguridad con puntera, antideslizante y dieléctrico según norma.' },
    { title: 'Corporativo', description: 'Calzado formal y de servicio para equipos que representan una marca.' },
];

export default function CalzadoPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Calzado — Diseño y desarrollo de producto | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Diseño y desarrollo integral de calzado casual, deportivo, industrial y corporativo. Del concepto a la producción y comercialización internacional."
                />
            </Helmet>
            <Seo
                title="Calzado — Diseño y desarrollo de producto | 4D Cuarta Dimensión"
                description="Diseño y desarrollo integral de calzado casual, deportivo, industrial y corporativo. Del concepto a la producción y comercialización internacional."
            />
            <LineHero
                index="01"
                title="Calzado"
                claim="Del concepto a la horma, y de la horma al mercado."
                description="Diseñamos y desarrollamos calzado que combina identidad, confort y desempeño. Acompañamos todo el ciclo: investigación, diseño, ingeniería de materiales, prototipado, producción y comercialización internacional."
                image={IMAGES.calzadoHero}
                imageAlt="Calzado premium de cuero blanco flotando sobre fondo oscuro con luz azul"
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Tipos de calzado" items={types} />
            <DetailSplit
                title="Materiales que hacen la diferencia"
                text="Trabajamos cueros de curtidurías certificadas, textiles técnicos, mallas de alto rendimiento y suelas desarrolladas a medida. Cada material se elige por tres criterios: desempeño en uso real, consistencia en producción y costo objetivo del proyecto."
                image={IMAGES.calzadoDetail}
                imageAlt="Manos de un artesano cosiendo la suela de un calzado de cuero en un taller"
                reverse
            />
            <CasesSection cases={projects.filter((p) => p.lineId === 'calzado')} />
            <LineCTA
                title="¿Listo para desarrollar tu próximo calzado?"
                text="Cuéntanos qué quieres lanzar y te devolvemos una ruta clara: concepto, tiempos, costos y plan de producción."
            />
        </PageTransition>
    );
}
