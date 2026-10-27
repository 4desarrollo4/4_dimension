import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import { absoluteUrl } from '@/lib/site';
import JsonLd from '../components/JsonLd';
import PageTransition from '../components/PageTransition';
import { Factory, Truck, Stethoscope, UtensilsCrossed, Building2, ShieldCheck } from 'lucide-react';
import { LineHero, CapabilityList, FeatureGrid, DetailSplit, DesignGallery, LineClosing } from '../components/ProductLine';
import { IMAGES } from '../data/projects';
import { GALERIA_DOTACIONES } from '../data/media';

const capabilities = [
    { title: 'Diagnóstico por cargo', description: 'Levantamiento de necesidades por área y cargo: exposición, movimiento, clima e imagen requerida.' },
    { title: 'Diseño y personalización', description: 'Uniformes con la identidad de cada empresa: color, bordado, estampado y tallaje por colaborador.' },
    { title: 'EPP y cumplimiento', description: 'Elementos de protección personal y prendas alineadas con la normativa de seguridad aplicable a cada sector.' },
    { title: 'Producción por volumen', description: 'Programas de dotación de cientos a decenas de miles de unidades con consistencia por lote.' },
    { title: 'Logística internacional', description: 'Entregas multi-país, consolidación de envíos y reposición programada para operaciones en crecimiento.' },
    { title: 'Gestión de reposición', description: 'Calendarios de reposición y control de tallas para que la operación del cliente no se detenga.' },
];

const sectors = [
    { icon: Factory, title: 'Industrial y manufactura', description: 'Overoles, pantalones cargo y prendas de alta resistencia con elementos reflectivos.' },
    { icon: Truck, title: 'Logística y transporte', description: 'Dotaciones duraderas para operación intensiva, con visibilidad y confort térmico.' },
    { icon: Stethoscope, title: 'Salud', description: 'Uniformes clínicos y de apoyo con textiles de fácil mantenimiento y alta rotación.' },
    { icon: UtensilsCrossed, title: 'Hotelería y gastronomía', description: 'Vestuario de servicio que cuida la imagen de marca en cada punto de contacto.' },
    { icon: Building2, title: 'Corporativo', description: 'Vestuario de oficina y fuerza comercial con imagen unificada.' },
    { icon: ShieldCheck, title: 'Seguridad', description: 'Uniformes tácticos y de vigilancia con especificaciones técnicas exigentes.' },
];

export default function DotacionesPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Dotaciones y uniformes empresariales en Colombia | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Uniformes corporativos e industriales y EPP con personalización por cliente, producción por volumen y logística internacional multi-país."
                />
            </Helmet>
            <Seo
                title="Dotaciones y uniformes empresariales en Colombia | 4D Cuarta Dimensión"
                description="Uniformes corporativos e industriales y EPP con personalización por cliente, producción por volumen y logística internacional multi-país."
                image={absoluteUrl('/og/dotaciones.jpg')}
            />
            <JsonLd migas={[{ nombre: 'Dotaciones', ruta: '/dotaciones' }]} />
            <LineHero
                index="03"
                title="Dotaciones"
                claim="Uniformes que trabajan tan duro como quien los usa."
                description="Diseñamos y suministramos uniformes corporativos e industriales y elementos de protección personal, con personalización total, producción por volumen y logística internacional."
                image={IMAGES.dotacionesHero}
                imageAlt="Uniforme industrial azul con detalles reflectivos y casco blanco sobre fondo oscuro"
            />
            <CapabilityList capabilities={capabilities} />
            <FeatureGrid title="Sectores que atendemos" items={sectors} columns="sm:grid-cols-2 lg:grid-cols-3" />
            <DetailSplit
                title="EPP y normativa, sin improvisación"
                text="Cascos, guantes, protección visual, calzado de seguridad y prendas de alta visibilidad seleccionados según la normativa aplicable a cada sector y país. Documentamos especificaciones y certificados de cada elemento para las auditorías del cliente."
                puntos={['Cascos', 'Guantes', 'Protección visual', 'Calzado de seguridad', 'Alta visibilidad']}
                image={IMAGES.dotacionesDetail}
                imageAlt="Elementos de protección personal: casco, guantes, gafas y chaleco reflectivo sobre fondo oscuro"
                reverse
            />
            {/* 2026-10-27: sustituye a los casos de éxito. El propietario prefiere
                enseñar sus productos, como en /calzado. */}
            <DesignGallery
                title="Nuestros productos."
                etiqueta="Calzado de dotación"
                rotulo="Referencia"
                designs={GALERIA_DOTACIONES}
            />
            <LineClosing
                actual="03"
                title="Dotaciones es la línea 03 de 4D."
                text="Comparte con las otras tres líneas la misma metodología —descubrimiento, diseño, desarrollo y evolución— y la misma red de aliados de manufactura en Colombia, Guatemala, Ecuador y Bolivia."
            />
        </PageTransition>
    );
}
