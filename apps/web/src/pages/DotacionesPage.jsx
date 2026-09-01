import React from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '../components/PageTransition';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, CasesSection, LineCTA } from '../components/ProductLine';
import { IMAGES, projects } from '../data/projects';

const capabilities = [
    { title: 'Diagnóstico por cargo', description: 'Levantamiento de necesidades por área y cargo: exposición, movimiento, clima e imagen requerida.' },
    { title: 'Diseño y personalización', description: 'Uniformes con la identidad de tu empresa: color, bordado, estampado y tallaje por colaborador.' },
    { title: 'EPP y cumplimiento', description: 'Elementos de protección personal y prendas alineadas con la normativa de seguridad aplicable a cada sector.' },
    { title: 'Producción por volumen', description: 'Programas de dotación de cientos a decenas de miles de unidades con consistencia por lote.' },
    { title: 'Logística internacional', description: 'Entregas multi-país, consolidación de envíos y reposición programada para operaciones en crecimiento.' },
    { title: 'Gestión de reposición', description: 'Calendarios de reposición y control de tallas para que tu operación nunca se detenga.' },
];

const sectors = [
    { title: 'Industrial y manufactura', description: 'Overoles, pantalones cargo y prendas de alta resistencia con elementos reflectivos.' },
    { title: 'Logística y transporte', description: 'Dotaciones duraderas para operación intensiva, con visibilidad y confort térmico.' },
    { title: 'Salud', description: 'Uniformes clínicos y de apoyo con textiles de fácil mantenimiento y alta rotación.' },
    { title: 'Hotelería y gastronomía', description: 'Vestuario de servicio que cuida la imagen de marca en cada punto de contacto.' },
    { title: 'Corporativo', description: 'Vestuario de oficina y fuerza comercial con imagen unificada.' },
    { title: 'Seguridad', description: 'Uniformes tácticos y de vigilancia con especificaciones técnicas exigentes.' },
];

export default function DotacionesPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Dotaciones — Uniformes corporativos e industriales | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Uniformes corporativos e industriales y EPP con personalización por cliente, producción por volumen y logística internacional multi-país."
                />
            </Helmet>
            <LineHero
                index="03"
                title="Dotaciones"
                claim="Uniformes que trabajan tan duro como tu equipo."
                description="Diseñamos y suministramos uniformes corporativos e industriales y elementos de protección personal, con personalización total, producción por volumen y logística internacional."
                image={IMAGES.dotacionesHero}
                imageAlt="Uniforme industrial azul con detalles reflectivos y casco blanco sobre fondo oscuro"
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Sectores que atendemos" items={sectors} columns="sm:grid-cols-2 lg:grid-cols-3" />
            <DetailSplit
                title="EPP y normativa, sin improvisación"
                text="Cascos, guantes, protección visual, calzado de seguridad y prendas de alta visibilidad seleccionados según la normativa aplicable a tu sector y país. Documentamos especificaciones y certificados de cada elemento para tus auditorías."
                image={IMAGES.dotacionesDetail}
                imageAlt="Elementos de protección personal: casco, guantes, gafas y chaleco reflectivo sobre fondo oscuro"
                reverse
            />
            <CasesSection cases={projects.filter((p) => p.lineId === 'dotaciones')} />
            <LineCTA
                title="¿Dotamos a tu equipo en serio?"
                text="Cuéntanos el tamaño de tu operación y los países donde trabajas. Te devolvemos un programa de dotación con tiempos y costos claros."
            />
        </PageTransition>
    );
}
