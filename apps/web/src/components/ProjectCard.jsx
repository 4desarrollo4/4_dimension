import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function ProjectCard({ project, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            {/* La tarjeta lleva a su línea de negocio, no al formulario: es
                información sobre lo que hacemos, no un CTA (ADR-001). */}
            <Link to={`/${project.lineId}`} className="group block">
                <div className="overflow-hidden border border-border/70 bg-card">
                    <div className="aspect-[4/3] overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.alt}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                    </div>
                    <div className="flex items-start justify-between gap-4 p-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{project.line}</p>
                            <h3 className="mt-2 text-xl font-bold tracking-tight">{project.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {project.client} · {project.sector}
                            </p>
                            <p className="mt-3 text-sm font-medium text-foreground/90">{project.result}</p>
                        </div>
                        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                </div>
            </Link>
        </Reveal>
    );
}
