import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// La primera pintura del sitio NO se anima. El HTML llega ya renderizado desde
// el prerender, y arrancar en opacity: 0 dejaría la página entera invisible
// hasta que se ejecute el JavaScript. A partir de la primera navegación sí se
// anima. El estado vive en el módulo, no en el componente, porque cada ruta
// monta una instancia nueva de PageTransition.
//
// Ojo: esto NO puede resolverse con `initial={false}` en el <AnimatePresence>
// de App.jsx — lo heredarían los Reveal y se perderían todas las entradas al
// hacer scroll.
let yaNavego = false;

export default function PageTransition({ children }) {
	const reduceMotion = useReducedMotion();
	const esPrimeraCarga = useRef(!yaNavego).current;

	useEffect(() => {
		yaNavego = true;
	}, []);

	if (reduceMotion) {
		return <div>{children}</div>;
	}

	return (
		<motion.div
			// `false` en la primera carga: se renderiza directamente visible, y
			// coincide con lo que produjo el prerender (sin desajuste al hidratar).
			initial={esPrimeraCarga ? false : { opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0 }}
			transition={{
				duration: 0.28,
				ease: [0.22, 1, 0.36, 1],
				exit: { duration: 0.16, ease: 'easeIn' },
			}}
		>
			{children}
		</motion.div>
	);
}
