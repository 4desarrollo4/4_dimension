import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import Tesseract from '../components/Tesseract';
import PageTransition from '../components/PageTransition';
import ProjectCard from '../components/ProjectCard';
import { IMAGES, projects } from '../data/projects';

const lines = [
    {
        index: '01',
        title: 'Calzado',
        to: '/calzado',
        image: IMAGES.calzadoHero,
        alt: 'Calzado premium de cuero blanco flotando sobre fondo oscuro',
        description:
            'Diseño y desarrollo integral de calzado casual, deportivo, industrial y corporativo. Del concepto y la horma al producto listo para producción y comercialización internacional.',
    },
    {
        index: '02',
        title: 'Ropa',
        to: '/ropa',
        image: IMAGES.ropaHero,
        alt: 'Chaqueta técnica azul oscuro en forma fantasma sobre fondo oscuro',
        description:
            'Indumentaria para marcas que buscan diferenciarse: diseño de colecciones, patronaje, desarrollo de textiles y personalización total, con producción a escala.',
    },
    {
        index: '03',
        title: 'Dotaciones',
        to: '/dotaciones',
        image: IMAGES.dotacionesHero,
        alt: 'Uniforme industrial azul con casco de seguridad blanco sobre fondo oscuro',
        description:
            'Uniformes corporativos e industriales y elementos de protección personal, con personalización por cliente, volumen y logística internacional.',
    },
];

const values = [
    { word: 'Visión', text: 'Leemos el mercado antes de dibujar una sola línea. Cada producto nace de una oportunidad real.' },
    { word: 'Precisión', text: 'Fichas técnicas, materiales y procesos definidos al detalle. Nada se deja al azar.' },
    { word: 'Innovación', text: 'Tecnología, materiales y métodos que convierten un buen producto en uno difícil de copiar.' },
    { word: 'Resultados', text: 'Productos que se venden, dotaciones que cumplen y clientes que repiten.' },
];

const steps = [
    { title: 'Descubrimos', text: 'Entendemos tu mercado, tu cliente y el reto que quieres convertir en oportunidad.' },
    { title: 'Diseñamos', text: 'Concepto, renders, materiales y fichas técnicas con dirección de producto clara.' },
    { title: 'Desarrollamos', text: 'Prototipos, muestras, producción y control de calidad con aliados certificados.' },
    { title: 'Evolucionamos', text: 'Medimos resultados y mejoramos cada colección, línea o programa de dotación.' },
];

const marqueeItems = ['Calzado', 'Ropa', 'Dotaciones', 'Diseño de producto', 'Desarrollo', 'Comercialización internacional'];

export default function HomePage() {
    const methodRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: methodRef, offset: ['start 75%', 'end 55%'] });

    return (
        <PageTransition>
            <Helmet>
                <title>4D Cuarta Dimensión — Diseño y desarrollo de producto: calzado, ropa y dotaciones</title>
                <meta
                    name="description"
                    content="Comercializadora internacional de diseño y desarrollo de producto. Convertimos ideas en productos ganadores: calzado, ropa y dotaciones corporativas e industriales."
                />
            </Helmet>
            <Seo
                title="4D Cuarta Dimensión — Diseño y desarrollo de producto: calzado, ropa y dotaciones"
                description="Comercializadora internacional de diseño y desarrollo de producto. Convertimos ideas en productos ganadores: calzado, ropa y dotaciones corporativas e industriales."
            />

            {/* HERO */}
            <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 40%, hsl(224 100% 62% / 0.08), transparent 70%)' }}
                />
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-24 pt-32 lg:grid-cols-[1.15fr_0.85fr]">
                    <div>
                        <Reveal>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                4D — Cuarta Dimensión ES S.A.S.
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                                Convertimos ideas en{' '}
                                <span className="text-primary">productos ganadores</span>.
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                                Comercializadora internacional de diseño y desarrollo de producto. Calzado, ropa y dotaciones con visión estratégica, tecnología y una perspectiva diferente.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-9 flex flex-wrap gap-4">
                                <Link
                                    to="/nosotros"
                                    className="inline-flex items-center gap-2 border border-foreground/25 px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98]"
                                >
                                    Conocer 4D
                                </Link>
                                <Link
                                    to="/contacto"
                                    className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                                >
                                    Hablemos de un proyecto
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                    <Reveal delay={0.25} y={0}>
                        <Tesseract />
                    </Reveal>
                </div>
            </section>

            {/* MARQUEE */}
            <div className="overflow-hidden border-y border-border/60 py-4" aria-hidden="true">
                <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            {item}
                            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary" />
                        </span>
                    ))}
                </div>
            </div>

            {/* QUIÉNES SOMOS */}
            <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Quiénes somos</p>
                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Pensamos más allá de lo evidente.
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:pt-12">
                            <p>
                                4D Cuarta Dimensión ES S.A.S. es una comercializadora internacional que une visión estratégica, tecnología y diseño de producto. No comercializamos catálogos: desarrollamos productos con propósito, pensados para ganar en mercados exigentes.
                            </p>
                            <p>
                                Trabajamos donde la mayoría se detiene: en la cuarta dimensión de cada proyecto, esa perspectiva que convierte una idea en un producto con identidad, calidad verificable y resultados medibles.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* LÍNEAS DE NEGOCIO */}
            <section className="border-t border-border/60">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Nuestras líneas de negocio</p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Tres dimensiones de producto.
                        </h2>
                    </Reveal>
                    <div className="mt-14 space-y-16 md:space-y-24">
                        {lines.map((line, i) => (
                            <Reveal key={line.index} delay={0.05}>
                                <div className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? '' : ''}`}>
                                    <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                                        <Link to={line.to} className="group block overflow-hidden border border-border/70">
                                            <img
                                                src={line.image}
                                                alt={line.alt}
                                                loading="lazy"
                                                className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                            />
                                        </Link>
                                    </div>
                                    <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                                        <span className="text-outline text-7xl font-extrabold leading-none sm:text-8xl">{line.index}</span>
                                        <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{line.title}</h3>
                                        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{line.description}</p>
                                        <Link
                                            to={line.to}
                                            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-primary"
                                        >
                                            Explorar dimensión {line.index}
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROPUESTA DE VALOR */}
            <section className="border-t border-border/60 bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Propuesta de valor</p>
                    </Reveal>
                    <div className="mt-8">
                        {values.map((v, i) => (
                            <Reveal key={v.word} delay={i * 0.06}>
                                <div className="group grid items-baseline gap-2 border-t border-border/60 py-7 transition-colors duration-300 hover:bg-background/60 sm:grid-cols-[6rem_1fr_1.4fr] sm:gap-8 sm:px-4">
                                    <span className="text-outline text-4xl font-extrabold sm:text-5xl">{String(i + 1).padStart(2, '0')}</span>
                                    <h3 className="text-3xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-4xl">
                                        {v.word}
                                    </h3>
                                    <p className="max-w-xl leading-relaxed text-muted-foreground">{v.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                    <div className="mt-14 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-3">
                        {[
                            { value: 120, prefix: '+', suffix: 'K', label: 'Pares desarrollados y comercializados' },
                            { value: 12, suffix: '.000', label: 'Dotaciones entregadas en 4 países' },
                            { value: 98, suffix: '%', label: 'Entregas a tiempo en programas vigentes' },
                        ].map((m) => (
                            <div key={m.label} className="bg-background p-8 text-center">
                                <CountUp
                                    value={m.value}
                                    prefix={m.prefix ?? ''}
                                    suffix={m.suffix ?? ''}
                                    className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl"
                                />
                                <p className="mt-3 text-sm text-muted-foreground">{m.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROYECTOS */}
            <section id="proyectos" className="border-t border-border/60">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <Reveal>
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Portafolio destacado</p>
                                <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Proyectos con resultado.</h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Una muestra de lo que ocurre cuando diseño, desarrollo y comercialización trabajan en la misma dimensión.
                            </p>
                        </div>
                    </Reveal>
                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {projects.map((p, i) => (
                            <ProjectCard key={p.id} project={p} delay={(i % 2) * 0.08} />
                        ))}
                    </div>
                </div>
            </section>

            {/* METODOLOGÍA */}
            <section id="metodologia" ref={methodRef} className="border-t border-border/60 bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Metodología</p>
                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">De la idea al impacto.</h2>
                    </Reveal>
                    <div className="mt-14">
                        <div className="relative mb-10 hidden h-px bg-border md:block">
                            <motion.div
                                className="absolute inset-y-0 left-0 h-px w-full origin-left bg-primary"
                                style={{ scaleX: scrollYProgress }}
                            />
                        </div>
                        <div className="grid gap-10 md:grid-cols-4">
                            {steps.map((s, i) => (
                                <Reveal key={s.title} delay={i * 0.08}>
                                    <div>
                                        <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
                                        <h3 className="mt-2 text-xl font-bold tracking-tight">{s.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DIFERENCIACIÓN */}
            <section className="border-t border-border/60">
                <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
                    <Reveal>
                        <h2 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            No hacemos más <span className="text-outline">de lo mismo</span>.
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Cada proyecto empieza desde cero: tu mercado, tu cliente, tu oportunidad. Diseñamos producto con identidad propia, no variantes de un catálogo. Esa es la diferencia entre vender un producto más y lanzar uno que el mercado recuerda.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="border-t border-border/60 bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
                    <Reveal>
                        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
                            ¿Cuál será tu próxima <span className="text-primary">dimensión</span>?
                        </h2>
                        <Link
                            to="/contacto"
                            className="group mt-10 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                        >
                            Iniciar conversación
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </Reveal>
                </div>
            </section>
        </PageTransition>
    );
}
