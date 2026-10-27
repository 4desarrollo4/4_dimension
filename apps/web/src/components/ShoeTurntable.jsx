import React, { useEffect, useRef } from 'react';

/*
    Zapato real de 4D girando. Sustituye al cubo del hero el 2026-10-20; el
    vídeo actual (zapato de denim, versión HORIZONTAL) es del 2026-10-26.

    Formato 960×600 (8:5), recortado a resolución nativa y ajustado al zapato:
    ocupa el 93 % del ancho del vídeo, con 35 px de aire en el perfil más ancho.
    El contorno se midió en todo el giro incluyendo flecos, cordones y sombra
    (x 194–1084, y 162–647 del original). Ningún píxel del zapato cae en los
    20 px del borde en ningún fotograma.

    No es cuadrado porque de perfil el zapato mide 886 px y el original 720 de
    alto. El propietario pidió puntera y talón enteros y nítidos en todo el
    giro, y después que el zapato fuera más grande: por eso no hay difuminado
    encima y el margen interior es mínimo.

    El fondo del vídeo está APLANADO al gris exacto de la página (235): solo se
    tocaron los píxeles claros y sin color, así que el zapato no cambia (≈0,75
    niveles de media, imperceptible). Sin eso se veía la peana blanca y un
    recuadro alrededor del vídeo.

    El vídeo lo generó el propietario con Google Flow partiendo de la foto de un
    zapato real de la empresa — ver docs/11-prompt-video-hero.md. Eso es lo que
    responde a la objeción de la dirección: no es un render genérico.

    El bucle NO es el vídeo tal cual. El giro de origen se queda un poco corto
    de 360° y al reiniciar daba un salto. Se fundieron los últimos 0,625 s con
    los primeros (xfade de ffmpeg), de modo que el último fotograma enlaza con
    el primero. El comando exacto está en docs/08-bitacora.md (2026-10-26).

    Tres cosas que no se pueden tocar sin romper algo:

    1. `prefers-reduced-motion`. Si está activo NO se reproduce nada: se muestra
       el póster fijo. Por eso el <video> lleva `poster` y se arranca desde un
       efecto, nunca con el atributo `autoplay` — así el navegador no empieza a
       reproducir antes de que podamos comprobar la preferencia.
       Lo exige docs/04-diseno.md.

    2. `playsInline` es obligatorio. Sin él, Safari en iPhone abre el vídeo a
       pantalla completa al reproducirlo.

    3. Esto es el hero: es el elemento que mide el LCP. El navegador descarga
       UNO de los dos vídeos más el póster: ~490 KB (webm 460 · mp4 584 ·
       póster 28). El original de Flow pesaba 5,79 MB. Si se sustituye el
       vídeo, hay que repetir el proceso entero: recorte, aplanado del fondo,
       bucle y compresión. Receta en docs/08-bitacora.md (2026-10-26).
*/

export default function ShoeTurntable() {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');

        const aplicar = () => {
            if (consulta.matches) {
                video.pause();
                video.currentTime = 0;
            } else {
                // Puede fallar por la política de reproducción del navegador.
                // Si falla, queda el póster, que es una imagen válida del producto.
                video.play().catch(() => {});
            }
        };

        aplicar();
        consulta.addEventListener('change', aplicar);
        return () => consulta.removeEventListener('change', aplicar);
    }, []);

    return (
        // Sin halo detrás: lo heredó del cubo y, con el vídeo de fondo opaco, solo
        // asomaba por arriba y por abajo en móvil (256 px frente a 207 de vídeo).
        <div className="relative flex items-center justify-center" aria-hidden="true">
            <video
                ref={videoRef}
                className="shoe-feather relative w-full"
                poster="/video/zapato-denim-960-poster.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                width="960"
                height="600"
            >
                {/* El nombre del archivo cambia con cada vídeo nuevo, a propósito.
                    Si se sobrescribe con el mismo nombre, un navegador con el
                    vídeo anterior en caché pide trozos con el tamaño viejo y el
                    servidor responde 416. Pasó en pruebas el 2026-10-26. */}
                <source src="/video/zapato-denim-960.webm" type="video/webm" />
                <source src="/video/zapato-denim-960.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
