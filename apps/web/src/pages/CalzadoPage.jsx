import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import { absoluteUrl } from '@/lib/site';
import JsonLd from '../components/JsonLd';
import PageTransition from '../components/PageTransition';
import { Footprints, Activity, HardHat, Briefcase } from 'lucide-react';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, DesignGallery, LineClosing } from '../components/ProductLine';
import { IMAGES } from '../data/projects';
import { FOTOS, GALERIA_CALZADO } from '../data/media';

const capabilities = [
    { title: 'Investigación y tendencias', description: 'Análisis de mercado, comportamiento del consumidor y dirección de producto por categoría y región.' },
    { title: 'Diseño conceptual y renders', description: 'Conceptos, bocetos y renders fotorrealistas para validar la idea antes de invertir en desarrollo.' },
    { title: 'Desarrollo de hormas y suelas', description: 'Ingeniería de horma, suelas en EVA, caucho y PU, y ajuste anatómico según el uso final.' },
    { title: 'Ingeniería de materiales', description: 'Cueros, textiles técnicos y sintéticos de alto rendimiento seleccionados por desempeño y costo objetivo.' },
    { title: 'Prototipado y muestras', description: 'Prototipos funcionales y muestras de venta con iteraciones controladas hasta la aprobación final.' },
    { title: 'Producción y control de calidad', description: 'Manufactura con aliados certificados, inspección en línea y verificación pre-embarque.' },
];

const types = [
    { icon: Footprints, title: 'Casual', description: 'Siluetas urbanas y lifestyle con identidad de marca propia.' },
    { icon: Activity, title: 'Deportivo', description: 'Performance real: amortiguación, soporte y materiales técnicos.' },
    { icon: HardHat, title: 'Industrial', description: 'Calzado de seguridad con puntera, antideslizante y dieléctrico según norma.' },
    { icon: Briefcase, title: 'Corporativo', description: 'Calzado formal y de servicio para equipos que representan una marca.' },
];

export default function CalzadoPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Diseño y desarrollo de calzado en Colombia | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Diseño y desarrollo integral de calzado casual, deportivo, industrial y corporativo. Del concepto a la producción y comercialización internacional."
                />
            </Helmet>
            <Seo
                title="Diseño y desarrollo de calzado en Colombia | 4D Cuarta Dimensión"
                description="Diseño y desarrollo integral de calzado casual, deportivo, industrial y corporativo. Del concepto a la producción y comercialización internacional."
                image={absoluteUrl('/og/calzado.jpg')}
            />
            <JsonLd migas={[{ nombre: 'Calzado', ruta: '/calzado' }]} />
            <LineHero
                index="01"
                title="Calzado"
                claim="Del concepto a la horma, y de la horma al mercado."
                description="Diseñamos y desarrollamos calzado que combina identidad, confort y desempeño. Acompañamos todo el ciclo: investigación, diseño, ingeniería de materiales, prototipado, producción y comercialización internacional."
                image={FOTOS.calzadoHero.src}
                imageAlt={FOTOS.calzadoHero.alt}
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Tipos de calzado" items={types} />
            <DetailSplit
                title="Materiales que hacen la diferencia"
                text="Trabajamos cueros de curtidurías certificadas, textiles técnicos, mallas de alto rendimiento y suelas desarrolladas a medida. Cada material se elige por tres criterios: desempeño en uso real, consistencia en producción y costo objetivo del proyecto."
                puntos={['Cueros', 'Textiles técnicos', 'Mallas', 'Suelas a medida']}
                image={IMAGES.calzadoDetail}
                imageAlt="Manos de un artesano cosiendo la suela de un calzado de cuero en un taller"
                reverse
            />
            {/* Antes: casos de éxito (Greenloop, Línea Executive). Desde el
                2026-10-26, galería de diseños propios. Mientras GALERIA_CALZADO
                esté vacía no se pinta nada: ver data/media.js. */}
            <DesignGallery title="Algunos de nuestros diseños." designs={GALERIA_CALZADO} />
            <LineClosing
                actual="01"
                title="Calzado es la línea 01 de 4D."
                text="Comparte con las otras tres líneas la misma metodología —descubrimiento, diseño, desarrollo y evolución— y la misma red de aliados de manufactura en Colombia, Guatemala, Ecuador y Bolivia."
            />
        </PageTransition>
    );
}
