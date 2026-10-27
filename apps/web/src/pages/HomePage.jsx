import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import Reveal from '../components/Reveal';
import { LineaDibujada, ImagenEntrada } from '../components/Movimiento';
import CountUp from '../components/CountUp';
import ShoeTurntable from '../components/ShoeTurntable';
import PageTransition from '../components/PageTransition';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { LINEAS } from '../data/lineas';
import { EMAIL, MAILTO, WHATSAPP_URL, MAPS_URL, TELEFONO_VISIBLE, DIRECCION_CALLE, DIRECCION_CIUDAD } from '../lib/contacto';

// Las cuatro líneas salen del registro único `data/lineas.js` (2026-10-26).
const lines = LINEAS;

const values = [
    { word: 'Visión', text: 'Leemos el mercado antes de dibujar una sola línea. Cada producto nace de una oportunidad real.' },
    { word: 'Precisión', text: 'Fichas técnicas, materiales y procesos definidos al detalle. Nada se deja al azar.' },
    { word: 'Innovación', text: 'Tecnología, materiales y métodos que convierten un buen producto en uno difícil de copiar.' },
    { word: 'Resultados', text: 'Productos que se venden, dotaciones que cumplen y clientes que repiten.' },
];

const steps = [
    { title: 'Descubrimos', text: 'Partimos del mercado y del usuario final para definir qué producto tiene sentido desarrollar.' },
    { title: 'Diseñamos', text: 'Concepto, renders, materiales y fichas técnicas con dirección de producto clara.' },
    { title: 'Desarrollamos', text: 'Prototipos, muestras, producción y control de calidad con aliados certificados.' },
    { title: 'Evolucionamos', text: 'Medimos resultados y mejoramos cada colección, línea o programa de dotación.' },
];

// Cifras reales validadas por el propietario — ver docs/02-empresa.md.
// No las toques sin actualizar antes ese archivo.
const stats = [
    { value: 120, prefix: '+', suffix: 'K', label: 'Pares desarrollados y comercializados' },
    { value: 130, label: 'Dotaciones entregadas' },
    { value: 98, suffix: '%', label: 'Entregas a tiempo en programas vigentes' },
];

const marqueeItems = ['Calzado', 'Ropa', 'Dotaciones', 'Diseño de producto', 'Desarrollo', 'Comercialización internacional'];

export default function HomePage() {
    const methodRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress: methodProgress } = useScroll({ target: methodRef, offset: ['start 75%', 'end 55%'] });
    const { scrollYProgress: pageProgress } = useScroll();

    return (
        <PageTransition>
            <Helmet>
                <title>4D Cuarta Dimensión | Diseño de calzado, ropa y dotaciones en Colombia</title>
                <meta
                    name="description"
                    content="Comercializadora internacional colombiana de diseño y desarrollo de producto: calzado, ropa y dotaciones corporativas e industriales."
                />
            </Helmet>
            <Seo
                title="4D Cuarta Dimensión | Diseño de calzado, ropa y dotaciones en Colombia"
                description="Comercializadora internacional colombiana de diseño y desarrollo de producto: calzado, ropa y dotaciones corporativas e industriales."
            />
            <JsonLd />

            {!reduceMotion && <motion.div className="read-progress" style={{ scaleX: pageProgress }} aria-hidden="true" />}

            {/* ── HERO ──────────────────────────────────────────────────────
                Sin Reveal: entra con CSS para que se vea en el primer pintado
                (docs/04-diseno.md). El H1 solo se desplaza, nunca se desvanece. */}
            {/* Sin `glow glow-tr` desde el 2026-10-26: ese halo azulado arriba a la
                derecha quedaba detrás del vídeo del zapato y oscurecía 5 niveles la
                página justo en su esquina, dejando ver el recuadro del vídeo. */}
            <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
                {/* A partir de xl el reparto pasa a 50/50 para dar más sitio al zapato
                    (pedido el 2026-10-26). NO lo bajes a lg: a 1024 px «desarrollamos»
                    mide 497 px y en una columna a partes iguales (468) no cabría. */}
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-24 pt-32 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-2">
                    <div>
                        <p className="rise-in text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                            4D — Cuarta Dimensión ES S.A.S.
                        </p>
                        <h1 className="rise-solid mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                            Diseñamos y desarrollamos{' '}
                            <span className="text-primary">calzado, ropa y dotaciones</span>.
                        </h1>
                        <p className="rise-in rise-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Somos una empresa colombiana. Diseñamos soluciones a medida, con dirección de diseño propia y producción verificable.
                        </p>
                        <div className="rise-in rise-delay-3 mt-9 flex flex-wrap gap-4">
                            <Link
                                to="/nosotros"
                                className="sweep inline-flex items-center gap-2 border border-foreground/25 px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-background active:scale-[0.98]"
                            >
                                Conocer 4D
                            </Link>
                            <a
                                href="#lineas"
                                className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                            >
                                Qué hacemos
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                            </a>
                        </div>
                    </div>
                    <div className="rise-in rise-delay-2">
                        <ShoeTurntable />
                    </div>
                </div>
            </section>

            {/* ── MARQUEE ─────────────────────────────────────────────────── */}
            <div className="marquee-mask overflow-hidden border-y border-foreground/30 py-4" aria-hidden="true">
                <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            {item}
                            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary" />
                        </span>
                    ))}
                </div>
            </div>

            {/* ── CIFRAS ────────────────────────────────────────────────────
                Antes vivían en tres cajitas dentro de "Cómo trabajamos". Son el
                dato más creíble del sitio: ahora abren la página a todo el ancho. */}
            <section className="glow glow-c border-b border-foreground/30">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                    <div className="grid gap-12 md:grid-cols-3 md:gap-8">
                        {stats.map((m, i) => (
                            <Reveal key={m.label} delay={i * 0.08}>
                                <div className="md:px-2">
                                    <CountUp
                                        value={m.value}
                                        prefix={m.prefix ?? ''}
                                        suffix={m.suffix ?? ''}
                                        className="stat-number block text-6xl font-extrabold text-primary sm:text-7xl lg:text-8xl"
                                    />
                                    <p className="mt-5 max-w-xs border-t border-primary/60 pt-5 text-sm leading-relaxed text-muted-foreground">
                                        {m.label}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUIÉNES SOMOS ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
                    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <Reveal>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Quiénes somos</p>
                            <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                                Pensamos más allá de lo evidente.
                            </h2>
                            <span aria-hidden="true" className="watermark mt-10 hidden text-[9rem] font-extrabold lg:block">
                                4D
                            </span>
                        </Reveal>
                        <Reveal delay={0.12}>
                            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:pt-6">
                                <p className="border-l border-primary/40 pl-6 text-xl text-foreground/90">
                                    4D Cuarta Dimensión ES S.A.S. es una empresa colombiana que une visión estratégica, tecnología y diseño de producto. No comercializamos catálogos: desarrollamos productos con propósito, pensados para ganar.
                                </p>
                                <p className="pl-6">
                                    Trabajamos donde la mayoría se detiene: en la cuarta dimensión de cada proyecto, esa perspectiva que convierte una idea en un producto con identidad, calidad y resultados medibles.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── LÍNEAS DE NEGOCIO ─────────────────────────────────────────
                A sangre y alternadas. El número de línea es una marca de agua
                gigante, no una etiqueta pequeña. */}
            <section id="lineas" className="border-t border-foreground/30 bg-card/30">
                <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Nuestras líneas de negocio</p>
                        <h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Cuatro dimensiones de producto.
                        </h2>
                    </Reveal>
                </div>

                <div className="mt-16 md:mt-20">
                    {lines.map((line, i) => (
                        <Reveal key={line.index} delay={0.05}>
                            <Link
                                to={line.to}
                                className="group block border-t border-primary/60 transition-colors duration-500 hover:bg-background/60"
                            >
                                <div
                                    className={`mx-auto grid max-w-6xl items-center gap-8 px-6 py-14 md:py-20 lg:gap-16 ${
                                        line.image ? 'lg:grid-cols-2' : ''
                                    } ${i % 2 === 1 && line.image ? 'lg:[&>*:first-child]:order-2' : ''}`}
                                >
                                    {line.image && (
                                        <div className="media border border-border/70">
                                            <ImagenEntrada>
                                                <img
                                                    src={line.image}
                                                    alt={line.alt}
                                                    loading="lazy"
                                                    style={line.posicion ? { objectPosition: line.posicion } : undefined}
                                                    className="aspect-[3/2] w-full object-cover"
                                                />
                                            </ImagenEntrada>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <span
                                            aria-hidden="true"
                                            className="watermark absolute -top-16 left-0 text-[9rem] font-extrabold sm:text-[12rem]"
                                        >
                                            {line.index}
                                        </span>
                                        <div className="relative">
                                            <h3 className="text-4xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-5xl">
                                                {line.title}
                                            </h3>
                                            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{line.description}</p>
                                            <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
                                                Explorar dimensión {line.index}
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── CÓMO TRABAJAMOS ─────────────────────────────────────────── */}
            <section className="glow glow-bl border-t border-foreground/30">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Cómo trabajamos</p>
                    </Reveal>
                    <div className="mt-10">
                        {values.map((v, i) => (
                            <Reveal key={v.word} delay={i * 0.06}>
                                <div className="group relative grid items-baseline gap-2 py-8 transition-colors duration-300 hover:bg-card/40 sm:grid-cols-[7rem_1fr_1.4fr] sm:gap-8 sm:px-4">
                                    <LineaDibujada delay={i * 0.06} />
                                    <span className="text-outline text-4xl font-extrabold transition-colors duration-300 group-hover:text-primary sm:text-5xl">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-3xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-4xl">
                                        {v.word}
                                    </h3>
                                    <p className="max-w-xl leading-relaxed text-muted-foreground">{v.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROYECTOS ─────────────────────────────────────────────────
                Rejilla asimétrica: el primer caso ocupa el doble. Rompe el
                patrón de 2×2 que tenían todas las secciones. */}
            <section id="proyectos" className="border-t border-foreground/30 bg-card/30">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <Reveal>
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Portafolio destacado</p>
                                <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Proyectos con resultado.</h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Una muestra de lo que ocurre cuando la inspiración, diseño, desarrollo y calidad trabajan en la misma dimensión.
                            </p>
                        </div>
                    </Reveal>
                    {/* El primero va destacado a todo el ancho y el resto en fila.
                        Con 4 proyectos y dos columnas quedaba 1 + 2 + 1, con media
                        fila vacía (2026-10-26). Ahora: tres columnas en escritorio
                        y, si en tableta sobra uno, ese ocupa la fila entera. */}
                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((p, i) => {
                            const resto = projects.length - 1;
                            const huerfanoEnTableta = i > 0 && resto % 2 === 1 && i === projects.length - 1;
                            const clase =
                                i === 0 ? 'md:col-span-2 lg:col-span-3' : huerfanoEnTableta ? 'md:col-span-2 lg:col-span-1' : '';
                            return (
                                <div key={p.id} className={clase}>
                                    <ProjectCard project={p} delay={i === 0 ? 0 : ((i - 1) % 3) * 0.08} wide={i === 0} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── METODOLOGÍA ───────────────────────────────────────────────
                `relative` es obligatorio: useScroll mide contra este contenedor
                y con position: static los offsets salen mal (P2-07). */}
            <section id="metodologia" ref={methodRef} className="relative border-t border-foreground/30">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Metodología</p>
                        <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">De la idea al impacto.</h2>
                    </Reveal>
                    <div className="mt-16">
                        <div className="relative mb-12 hidden h-px bg-border md:block">
                            <motion.div
                                className="absolute inset-y-0 left-0 h-px w-full origin-left bg-primary"
                                style={{ scaleX: methodProgress }}
                            />
                        </div>
                        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
                            {steps.map((s, i) => (
                                <Reveal key={s.title} delay={i * 0.08}>
                                    <div className="group">
                                        <span className="text-outline block text-5xl font-extrabold transition-opacity duration-300 group-hover:opacity-70 sm:text-6xl">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold tracking-tight">{s.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DIFERENCIACIÓN ────────────────────────────────────────── */}
            <section className="glow glow-tr border-t border-foreground/30">
                <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
                    <Reveal>
                        <h2 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            No hacemos más <span className="text-outline">de lo mismo</span>.
                        </h2>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p className="mt-10 max-w-2xl border-l border-primary/40 pl-6 text-lg leading-relaxed text-muted-foreground">
                            Cada proyecto empieza desde cero: el mercado, el usuario final y la oportunidad concreta. Diseñamos producto con identidad propia, no variantes de un catálogo.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ── CIERRE INFORMATIVO ──────────────────────────────────────── */}
            <section className="border-t border-foreground/30 bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Dónde operamos</p>
                        <h2 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Colombia, con operación internacional.
                        </h2>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Nuestra oficina principal está en Bogotá D.C. Producimos y comercializamos en Latinoamérica y Centroamérica, con una red de aliados y manufactureros.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        {/* Tarjetas en vez de celdas pegadas (2026-10-26). La tarjeta
                            ENTERA es el enlace: más fácil de acertar en el móvil. Los
                            externos van con `noopener`: sin él la pestaña nueva puede
                            manipular la nuestra con `window.opener`. */}
                        <ul className="mt-14 grid gap-5 sm:grid-cols-3">
                            {[
                                { etiqueta: 'Correo', Icono: Mail, href: MAILTO, externo: false, lineas: [EMAIL], ayuda: 'escribir un correo' },
                                { etiqueta: 'Teléfono', Icono: Phone, href: WHATSAPP_URL, externo: true, lineas: [TELEFONO_VISIBLE], ayuda: 'escribir por WhatsApp' },
                                { etiqueta: 'Oficina', Icono: MapPin, href: MAPS_URL, externo: true, lineas: [DIRECCION_CALLE, DIRECCION_CIUDAD], ayuda: 'ver en Google Maps' },
                            ].map(({ etiqueta, Icono, href, externo, lineas, ayuda }) => (
                                <li key={etiqueta}>
                                    <a
                                        href={href}
                                        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        className="tarjeta group flex h-full flex-col p-7"
                                    >
                                        <span className="flex items-center justify-between">
                                            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                <Icono className="h-4 w-4 text-primary" aria-hidden="true" />
                                                {etiqueta}
                                            </span>
                                            <ArrowUpRight
                                                aria-hidden="true"
                                                className="h-4 w-4 text-primary transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                                            />
                                        </span>
                                        <span className="mt-4 text-base font-medium text-primary underline-offset-4 group-hover:underline">
                                            {lineas.map((l, i) => (
                                                <React.Fragment key={l}>
                                                    {i > 0 && <br />}
                                                    {l}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                        <span className="sr-only"> — {ayuda}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>
        </PageTransition>
    );
}
