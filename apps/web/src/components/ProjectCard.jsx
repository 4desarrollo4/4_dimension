import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

// `wide` la usa la home para que el primer caso ocupe las dos columnas y rompa
// la rejilla 2×2. En ese modo, imagen y texto van uno al lado del otro.
export default function ProjectCard({ project, delay = 0, wide = false }) {
    return (
        <Reveal delay={delay}>
            {/* La tarjeta lleva a su línea de negocio, no al formulario: es
                información sobre lo que hacemos, no un CTA (ADR-009). */}
            <Link
                to={`/${project.lineId}`}
                className="group block h-full border border-border/70 bg-card transition-colors duration-500 hover:border-primary/50"
            >
                <div className={wide ? 'grid md:grid-cols-2' : ''}>
                    <div className="media">
                        <img
                            src={project.image}
                            alt={project.alt}
                            loading="lazy"
                            className={`w-full object-cover ${wide ? 'aspect-[16/10] h-full' : 'aspect-[4/3]'}`}
                        />
                    </div>
                    <div className={`flex items-start justify-between gap-4 p-6 ${wide ? 'md:flex-col md:justify-center md:p-10' : ''}`}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{project.line}</p>
                            <h3 className={`mt-3 font-bold tracking-tight ${wide ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>
                                {project.name}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {project.client} · {project.sector}
                            </p>
                            <p className={`mt-4 border-t border-border/60 pt-4 font-medium text-foreground/90 ${wide ? 'text-lg' : 'text-sm'}`}>
                                {project.result}
                            </p>
                        </div>
                        <ArrowUpRight
                            className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary ${
                                wide ? 'md:mt-8' : ''
                            }`}
                        />
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}
