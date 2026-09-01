import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Entrada al hacer scroll. `data-reveal` es el gancho que usa el <noscript> de
// index.html para revelar el contenido si el JavaScript no llega a ejecutarse:
// el HTML ya viene prerenderizado, no tendría sentido dejarlo en opacity 0.
const Reveal = ({ children, delay = 0, y = 24, className = '', as = 'div', once = true, ...rest }) => {
    const reduceMotion = useReducedMotion();
    const MotionTag = motion[as] || motion.div;
    // `delay` es en segundos (la unidad de framer-motion), pero quien lo llama
    // suele pasar los milisegundos que usaría en una transición CSS. Ninguna
    // entrada espera 10 s, así que un valor tan grande son milisegundos.
    const delaySeconds = delay > 10 ? delay / 1000 : delay;

    return (
        <MotionTag
            data-reveal=""
            className={className}
            initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: '-60px' }}
            transition={{ duration: 0.6, delay: delaySeconds, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}

export default Reveal;

export { Reveal };
