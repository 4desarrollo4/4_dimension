import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const LOGO_URL = 'https://horizons-cdn.hostinger.com/50b7554a-aba0-4db0-bd2a-1f8c207f1ca5/4d86c6546c2d16b19fbf2212f5a51658.png';

const links = [
    { to: '/calzado', label: 'Calzado' },
    { to: '/ropa', label: 'Ropa' },
    { to: '/dotaciones', label: 'Dotaciones' },
    { to: '/#proyectos', label: 'Proyectos' },
    { to: '/nosotros', label: 'Nosotros' },
];

const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors duration-200 ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (y) => {
        const prev = scrollY.getPrevious() ?? 0;
        setHidden(y > prev && y > 140 && !open);
        setScrolled(y > 24);
    });

    return (
        <>
            <motion.header
                animate={{ y: hidden ? '-100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                    scrolled ? 'border-b border-border/70 bg-background/85 backdrop-blur-md' : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20">
                    <Link to="/" className="flex items-center gap-3" aria-label="4D Cuarta Dimensión — inicio">
                        <img src={LOGO_URL} alt="Logo 4D Cuarta Dimensión" className="h-9 w-9 rounded-full" />
                        <span className="text-sm font-bold tracking-[0.18em] uppercase">
                            4D <span className="hidden font-medium text-muted-foreground sm:inline">Cuarta Dimensión</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
                        {links.map((l) =>
                            l.to.includes('#') ? (
                                <Link key={l.to} to={l.to} className="text-sm tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground">
                                    {l.label}
                                </Link>
                            ) : (
                                <NavLink key={l.to} to={l.to} className={linkClass}>
                                    {l.label}
                                </NavLink>
                            ),
                        )}
                        <Link
                            to="/contacto"
                            className="group inline-flex items-center gap-1.5 border border-foreground/25 px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                        >
                            Hablemos
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </nav>

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="flex h-11 w-11 items-center justify-center text-foreground lg:hidden"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[60] flex flex-col bg-background"
                    >
                        <div className="flex h-16 items-center justify-between px-6">
                            <img src={LOGO_URL} alt="Logo 4D Cuarta Dimensión" className="h-9 w-9 rounded-full" />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-11 w-11 items-center justify-center text-foreground"
                                aria-label="Cerrar menú"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Menú móvil">
                            {[...links, { to: '/contacto', label: 'Contacto' }].map((l, i) => (
                                <motion.div
                                    key={l.to}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.3, ease: 'easeOut' }}
                                >
                                    <Link
                                        to={l.to}
                                        onClick={() => setOpen(false)}
                                        className="block border-b border-border/60 py-4 text-3xl font-extrabold tracking-tight text-foreground"
                                    >
                                        {l.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
