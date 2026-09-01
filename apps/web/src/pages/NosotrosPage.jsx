import React from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';
import { IMAGES } from '../data/projects';

const commitments = [
    { title: 'Calidad verificable', text: 'Procesos alineados con estándares internacionales de calidad, con inspección en línea y verificación pre-embarque en cada proyecto.' },
    { title: 'Cumplimiento', text: 'Especificaciones documentadas y trazabilidad por lote. Lo aprobado en la muestra es lo que sale de producción.' },
    { title: 'Transparencia comercial', text: 'Costos, tiempos y condiciones claros desde la primera conversación. Sin letra pequeña.' },
    { title: 'Relaciones de largo plazo', text: 'Nuestros clientes repiten porque cada entrega abre la puerta a la siguiente dimensión del proyecto.' },
];

export default function NosotrosPage() {
    return (
        <PageTransition>
            <Helmet>
                <title>Nosotros — 4D Cuarta Dimensión ES S.A.S.</title>
                <meta
                    name="description"
                    content="Conoce 4D Cuarta Dimensión ES S.A.S.: comercializadora internacional de diseño y desarrollo de producto en calzado, ropa y dotaciones."
                />
            </Helmet>
            <Seo
                title="Nosotros — 4D Cuarta Dimensión ES S.A.S."
                description="Conoce 4D Cuarta Dimensión ES S.A.S.: comercializadora internacional de diseño y desarrollo de producto en calzado, ropa y dotaciones."
            />

            <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:pt-40">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Nosotros</p>
                    <h1 className="mt-4 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
                        Una empresa, cuatro dimensiones: <span className="text-primary">visión, diseño, desarrollo y resultados</span>.
                    </h1>
                </Reveal>
            </section>

            <section className="border-t border-border/60">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Nuestra historia</h2>
                        <div className="mt-5 space-y-5 leading-relaxed text-muted-foreground">
                            <p>
                                4D Cuarta Dimensión ES S.A.S. nace en Colombia con una convicción: los mejores productos no se compran en un catálogo, se diseñan con propósito. Empezamos desarrollando calzado para marcas que querían dejar de competir por precio y empezar a competir por identidad.
                            </p>
                            <p>
                                Hoy operamos como comercializadora internacional con tres líneas de negocio — calzado, ropa y dotaciones — y una red de aliados de manufactura en Colombia, Asia y Europa que nos permite desarrollar, producir y entregar en múltiples mercados con el mismo estándar.
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <div className="overflow-hidden border border-border/70">
                            <img
                                src={IMAGES.studio}
                                alt="Equipo de diseño de 4D revisando prototipos de calzado y muestras de tela en el estudio"
                                className="aspect-[16/9] w-full object-cover"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="border-t border-border/60 bg-card/40">
                <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Capacidad internacional</h2>
                        <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                            Comercializamos y entregamos en Latinoamérica, Norteamérica y Europa. Consolidamos producción, documentación y logística para que el producto cruce fronteras sin fricción.
                        </p>
                    </Reveal>
                    <div className="mt-10 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-3">
                        {[
                            { region: 'Latinoamérica', detail: 'Desarrollo y producción cercana con manufactura colombiana y regional.' },
                            { region: 'Norteamérica', detail: 'Entregas consolidadas y documentación completa para importación.' },
                            { region: 'Europa', detail: 'Aliados de manufactura y distribución para colecciones premium.' },
                        ].map((r, i) => (
                            <Reveal key={r.region} delay={i * 0.06}>
                                <div className="h-full bg-background p-8">
                                    <h3 className="text-lg font-bold tracking-tight text-primary">{r.region}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-border/60">
                <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Nuestros compromisos</h2>
                    </Reveal>
                    <div className="mt-10">
                        {commitments.map((c, i) => (
                            <Reveal key={c.title} delay={i * 0.05}>
                                <div className="grid gap-2 border-t border-border/60 py-6 sm:grid-cols-[3rem_1fr_2fr] sm:items-baseline sm:gap-6">
                                    <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
                                    <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </PageTransition>
    );
}
