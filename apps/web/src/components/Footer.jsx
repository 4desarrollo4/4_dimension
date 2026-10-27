import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_URL } from './Navbar';
import { LINEAS } from '../data/lineas';
import {
    EMAIL,
    MAILTO,
    WHATSAPP_URL,
    MAPS_URL,
    TELEFONO_VISIBLE,
    DIRECCION_CALLE,
    DIRECCION_CIUDAD,
} from '../lib/contacto';

/*
    Sin «Proyectos» desde el 2026-10-26: el propietario lo quitó del menú y
    pidió quitarlo también aquí (el enlace de «Empresa» y la columna entera).

    Las líneas salen del registro único `data/lineas.js`, no se copian a mano.
*/
const columns = [
    {
        title: 'Empresa',
        items: [
            { label: 'Nosotros', to: '/nosotros' },
            { label: 'Metodología', to: '/#metodologia' },
            { label: 'Contacto', to: '/contacto' },
        ],
    },
    {
        title: 'Líneas de producto',
        items: LINEAS.map((l) => ({ label: l.title, to: l.to })),
    },
    {
        title: 'Contacto',
        // El teléfono abre WhatsApp con el mensaje ya escrito y la dirección
        // abre Maps con la búsqueda hecha, igual que en «Dónde operamos».
        items: [
            { label: EMAIL, href: MAILTO },
            { label: TELEFONO_VISIBLE, href: WHATSAPP_URL, externo: true, extra: 'escribir por WhatsApp' },
            // Una sola entrada en dos líneas: si fueran dos enlaces al mismo
            // destino, un lector de pantalla anunciaría «ver en Google Maps»
            // dos veces seguidas.
            {
                label: DIRECCION_CALLE,
                label2: DIRECCION_CIUDAD,
                href: MAPS_URL,
                externo: true,
                extra: 'ver en Google Maps',
            },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-foreground/30 bg-background">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="Logo 4D Cuarta Dimensión" className="h-10 w-10 rounded-full" />
                            <span className="text-sm font-bold uppercase tracking-[0.18em]">4D Cuarta Dimensión</span>
                        </Link>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Empresa colombiana de diseño y desarrollo de producto: calzado, ropa, dotaciones e insumos.
                        </p>
                    </div>
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{col.title}</h3>
                            <ul className="mt-4 space-y-1">
                                {col.items.map((item) => (
                                    <li key={item.label}>
                                        {item.to ? (
                                            <Link to={item.to} className="enlace inline-block py-1 text-sm">
                                                {item.label}
                                            </Link>
                                        ) : item.href ? (
                                            <a
                                                href={item.href}
                                                {...(item.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                className="enlace inline-block break-words py-1 text-sm"
                                            >
                                                {item.label}
                                                {item.label2 && (
                                                    <>
                                                        <br />
                                                        {item.label2}
                                                    </>
                                                )}
                                                {item.extra && <span className="sr-only"> — {item.extra}</span>}
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
                    {/* Debe coincidir con «Dónde operamos» de la home. El propietario
                        cambió la cobertura el 2026-10-20 y esta línea se había
                        quedado anunciando Norteamérica y Europa. */}
                    <p>Colombia · Latinoamérica · Centroamérica</p>
                </div>
            </div>
        </footer>
    );
}
