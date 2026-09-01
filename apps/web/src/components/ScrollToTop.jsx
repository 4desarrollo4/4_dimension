import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';

// `useLayoutEffect` no existe en el render de servidor y React avisa por cada
// ruta prerenderizada. Como aquí solo tocamos el scroll — algo que no ocurre
// en Node — caemos a `useEffect` fuera del navegador.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useIsomorphicLayoutEffect(() => {
        if (hash) {
            const target = document.getElementById(hash.slice(1));

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;

export { ScrollToTop };
