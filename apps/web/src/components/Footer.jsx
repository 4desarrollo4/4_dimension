import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from './Navbar';

const columns = [
    {
        title: 'Empresa',
        items: [
            { label: 'Nosotros', to: '/nosotros' },
            { label: 'Metodología', to: '/#metodologia' },
            { label: 'Proyectos', to: '/#proyectos' },
            { label: 'Contacto', to: '/contacto' },
        ],
    },
    {
        title: 'Líneas de producto',
        items: [
            { label: 'Calzado', to: '/calzado' },
            { label: 'Ropa', to: '/ropa' },
            { label: 'Dotaciones', to: '/dotaciones' },
        ],
    },
    {
        title: 'Proyectos',
        items: [
            { label: 'Runner X-40', to: '/#proyectos' },
            { label: 'Colección Origin', to: '/#proyectos' },
            { label: 'Programa Atlas', to: '/#proyectos' },
            { label: 'Línea Executive', to: '/#proyectos' },
        ],
    },
    {
        title: 'Contacto',
        items: [
            { label: 'comercial@4dimensionsas.com', href: 'mailto:comercial@4dimensionsas.com' },
            { label: '+57 (601) 743 4400', href: 'tel:+576017434400' },
            { label: 'Bogotá D.C., Colombia' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border/70 bg-background">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:gap-12">
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="Logo 4D Cuarta Dimensión" className="h-10 w-10 rounded-full" />
                            <span className="text-sm font-bold uppercase tracking-[0.18em]">4D Cuarta Dimensión</span>
                        </Link>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Comercializadora internacional de diseño y desarrollo de producto: calzado, ropa y dotaciones.
                        </p>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{col.title}</h3>
                            <ul className="mt-4 space-y-1">
                                {col.items.map((item) => (
                                    <li key={item.label}>
                                        {item.to ? (
                                            <Link to={item.to} className="inline-block py-1 text-sm text-foreground/80 transition-colors duration-200 hover:text-primary">
                                                {item.label}
                                            </Link>
                                        ) : item.href ? (
                                            <a href={item.href} className="inline-block break-words py-1 text-sm text-foreground/80 transition-colors duration-200 hover:text-primary">
                                                {item.label}
                                            </a>
                                        ) : (
                                            <span className="inline-block py-1 text-sm text-foreground/80">{item.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-14 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 4D Cuarta Dimensión ES S.A.S. Todos los derechos reservados.</p>
                    <p>Latinoamérica · Norteamérica · Europa</p>
                </div>
            </div>
        </footer>
    );
}
