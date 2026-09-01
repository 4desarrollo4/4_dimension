import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import ProjectCard from './ProjectCard';

export function LineHero({ index, title, claim, description, image, imageAlt }) {
    return (
        <section className="glow glow-tr relative overflow-hidden pt-32 md:pt-40">
            {/* Mismo criterio que el hero de la home: entrada por CSS para que se
                vea en el primer pintado, y el H1 solo se desplaza (P2-03). */}
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 md:pb-24 lg:grid-cols-2">
                <div className="relative">
                    <span aria-hidden="true" className="watermark absolute -top-24 -left-2 text-[11rem] font-extrabold sm:text-[14rem]">
                        {index}
                    </span>
                    <p className="rise-in relative text-xs font-semibold uppercase tracking-[0.3em] text-primary">Dimensión {index}</p>
                    <h1 className="rise-solid relative mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
                    <p className="rise-in rise-delay-2 mt-4 text-xl font-medium text-foreground/90">{claim}</p>
                    <p className="rise-in rise-delay-3 mt-4 max-w-lg leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <div className="rise-in rise-delay-2">
                    <div className="media border border-border/70">
                        <img src={image} alt={imageAlt} className="aspect-[3/2] w-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function CapabilityList({ title = 'Capacidades', capabilities }) {
    return (
        <section className="glow glow-bl border-t border-border/60">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <Reveal>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                </Reveal>
                <div className="mt-10">
                    {capabilities.map((c, i) => (
                        <Reveal key={c.title} delay={i * 0.05}>
                            <div className="grid gap-2 border-t border-border/60 py-6 sm:grid-cols-[3rem_1fr_2fr] sm:items-baseline sm:gap-6">
                                <span className="text-outline text-3xl font-extrabold">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FeatureGrid({ title, items, columns = 'sm:grid-cols-2 lg:grid-cols-4' }) {
    return (
        <section className="border-t border-border/60 bg-card/40">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <Reveal>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                </Reveal>
                <div className={`mt-10 grid gap-px border border-border/60 bg-border/60 ${columns}`}>
                    {items.map((item) => (
                        <div key={item.title} className="bg-background p-6">
                            <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DetailSplit({ title, text, image, imageAlt, reverse = false }) {
    return (
        <section className="border-t border-border/60">
            <div className={`mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2`}>
                <Reveal className={reverse ? 'lg:order-2' : ''}>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{text}</p>
                </Reveal>
                <Reveal delay={0.12} className={reverse ? 'lg:order-1' : ''}>
                    <div className="media border border-border/70">
                        <img src={image} alt={imageAlt} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export function CasesSection({ cases }) {
    return (
        <section className="border-t border-border/60 bg-card/30">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Casos de éxito</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Resultados que hablan por sí solos</h2>
                </Reveal>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {cases.map((p, i) => (
                        <ProjectCard key={p.id} project={p} delay={i * 0.08} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Cierre de página de línea. Informa y navega — no vende. Sustituyó al antiguo
// LineCTA, que cerraba cada línea con un "Iniciar conversación" (ADR-001).
export function LineClosing({ title, text, others = [] }) {
    return (
        <section className="glow glow-c border-t border-border/60">
            <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                <Reveal>
                    <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{text}</p>
                </Reveal>
                {others.length > 0 && (
                    <Reveal delay={0.1}>
                        <div className="mt-12 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-2">
                            {others.map((o) => (
                                <Link
                                    key={o.to}
                                    to={o.to}
                                    className="group bg-background p-8 transition-colors duration-300 hover:bg-card/60"
                                >
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Dimensión {o.index}
                                    </span>
                                    <span className="mt-3 flex items-center gap-2 text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary">
                                        {o.label}
                                        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
