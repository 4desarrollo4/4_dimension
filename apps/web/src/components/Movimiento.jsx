import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
    Piezas de movimiento del sprint 5 de docs/10-plan-v2.md, hechas el
    2026-10-26. Usan la misma curva y la misma lógica que `Reveal`:

    - Se disparan al entrar en pantalla, una sola vez.
    - Con `prefers-reduced-motion` aparecen ya en su estado final.
    - Llevan `data-reveal`, así que el <noscript> de index.html las deja en su
      estado final si el JavaScript no llega a ejecutarse (el sitio se
      prerenderiza: sin eso, una línea quedaría a escala 0 para siempre).
    - Ninguna anima la opacidad de algo de la primera pantalla.
*/

const CURVA = [0.22, 1, 0.36, 1];

/**
 * Filete que se dibuja de izquierda a derecha al entrar en pantalla. Sustituye
 * al `border-t` de las filas de las listas numeradas. El contenedor debe ser
 * `relative`.
 */
export function LineaDibujada({ delay = 0, className = 'bg-primary/60' }) {
    const reducir = useReducedMotion();
    return (
        <motion.span
            data-reveal=""
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-px origin-left ${className}`}
            initial={{ scaleX: reducir ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay, ease: CURVA }}
        />
    );
}

/**
 * Foto que entra con un ligero zoom (de 1,08 a 1) al aparecer. Va en un envoltorio
 * propio para no pisar el zoom al pasar el cursor que llevan algunas imágenes
 * (framer escribe `transform` en línea y anularía el de la clase). El padre
 * debe tener `overflow-hidden`.
 */
export function ImagenEntrada({ className = '', children }) {
    const reducir = useReducedMotion();
    return (
        <motion.div
            data-reveal=""
            className={className}
            initial={{ scale: reducir ? 1 : 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: CURVA }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Cortina: la foto se destapa de un lado al otro al entrar en pantalla, con un
 * `clip-path`. Va por fuera de `ImagenEntrada`, así que se suman el destape y
 * el zoom. Con `prefers-reduced-motion` aparece ya destapada; sin JavaScript
 * la destapa el <noscript> de index.html (`clip-path: none`).
 */
export function Cortina({ desde = 'derecha', className = '', children }) {
    const reducir = useReducedMotion();
    const tapada = desde === 'derecha' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    return (
        <motion.div
            data-reveal=""
            className={className}
            initial={{ clipPath: reducir ? 'inset(0 0 0 0%)' : tapada }}
            whileInView={{ clipPath: 'inset(0 0 0 0%)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: CURVA }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Filete vertical que se dibuja de arriba abajo, para el borde izquierdo de un
 * bloque de texto. El contenedor debe ser `relative`.
 */
export function FileteVertical({ delay = 0, className = 'bg-primary' }) {
    const reducir = useReducedMotion();
    return (
        <motion.span
            data-reveal=""
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top ${className}`}
            initial={{ scaleY: reducir ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay, ease: CURVA }}
        />
    );
}
