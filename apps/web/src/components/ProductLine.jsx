import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { LINEAS } from '../data/lineas';
import { LineaDibujada, ImagenEntrada, Cortina, FileteVertical } from './Movimiento';

/*
    `image` y `claim` son opcionales a propósito: si una línea todavía no tiene
    foto propia, el hero se renderiza a una sola columna y SIN hueco de imagen,
    nunca con un genérico de relleno. Es la regla del sprint 3 de
    docs/10-plan-v2.md.
*/
/*
    `imageWidth`/`imageHeight` son opcionales: sin ellos la foto va en 3:2.
    Con ellos el marco toma la proporción real, y si es vertical se ciñe a
    `max-w-md` y se arrima a la derecha: a media columna, un 4:5 medía más que
    la pantalla.
*/
export function LineHero({ index, title, claim, description, image, imageAlt, imageWidth, imageHeight }) {
    const vertical = imageWidth && imageHeight && imageHeight > imageWidth;
    return (
        <section className="glow glow-tr relative overflow-hidden pt-32 md:pt-40">
            {/* Mismo criterio que el hero de la home: entrada por CSS para que se
                vea en el primer pintado, y el H1 solo se desplaza (P2-03). */}
            <div className={`mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 md:pb-24 ${image ? 'lg:grid-cols-2' : ''}`}>
                <div className="relative">
                    <span aria-hidden="true" className="watermark absolute -top-24 -left-2 text-[11rem] font-extrabold sm:text-[14rem]">
                        {index}
                    </span>
                    <p className="rise-in relative text-xs font-semibold uppercase tracking-[0.3em] text-primary">Dimensión {index}</p>
                    <h1 className="rise-solid relative mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
                    {claim && <p className="rise-in rise-delay-2 mt-4 text-xl font-medium text-foreground/90">{claim}</p>}
                    <p className="rise-in rise-delay-3 mt-4 max-w-lg leading-relaxed text-muted-foreground">{description}</p>
                </div>
                {image && (
                    <div className={`rise-in rise-delay-2 ${vertical ? 'w-full max-w-md lg:justify-self-end' : ''}`}>
                        <div className="media border border-border/70">
                            <img
                                src={image}
                                alt={imageAlt}
                                width={imageWidth}
                                height={imageHeight}
                                style={imageWidth && imageHeight ? { aspectRatio: `${imageWidth} / ${imageHeight}` } : undefined}
                                className={`w-full object-cover ${imageWidth && imageHeight ? '' : 'aspect-[3/2]'}`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

/*
    Capacidades, rehecha el 2026-10-27: el propietario la veía «muy básica,
    muy plana, no llama la atención». Era una lista gris sobre gris idéntica a
    las secciones de alrededor. Ahora:

    - Banda azul claro a todo el ancho (`.banda-marca` en index.css): es la
      sección que cambia el ritmo de la página. (Fue marino unas horas; el
      propietario lo veía pesado.)
    - Dos columnas en escritorio: el título y el recuento a la izquierda,
      fijos mientras se recorre la lista (`lg:sticky`); la lista a la derecha.
    - Número grande en azul de marca; al pasar el cursor la fila se pone en blanco,
      el número se desplaza y aparece un filete a la izquierda. Todo con
      `motion-safe:`, quieto con `prefers-reduced-motion`.

    No se añadió texto nuevo: el recuento sale del propio array.
*/
export function CapabilityList({ title = 'Capacidades', capabilities }) {
    const total = String(capabilities.length).padStart(2, '0');
    return (
        <section className="banda-marca">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <Reveal className="lg:sticky lg:top-32 lg:self-start">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Lo que hacemos</p>
                    <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
                    <p aria-hidden="true" className="mt-8 hidden text-[7rem] font-extrabold leading-none tracking-tight text-primary lg:block">
                        {total}
                    </p>
                </Reveal>
                <div>
                    {capabilities.map((c, i) => (
                        <Reveal key={c.title} delay={i * 0.05}>
                            <div className="group relative grid grid-cols-[3.5rem_1fr] gap-x-5 gap-y-2 py-7 transition-colors duration-300 hover:bg-card sm:grid-cols-[4.5rem_1fr]">
                                <LineaDibujada delay={i * 0.05} className="bg-border" />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-500 group-hover:scale-y-100 motion-reduce:transition-none"
                                />
                                <span className="row-span-2 pl-3 text-3xl font-extrabold text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1 sm:text-4xl">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="text-xl font-bold tracking-tight">{c.title}</h3>
                                <p className="leading-relaxed text-muted-foreground">{c.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/*
    Tarjetas de «Tipos de…» / «Sectores…», rehechas el 2026-10-27 por el mismo
    motivo que `CapabilityList`. Cada tarjeta lleva:

    - un icono (`item.icon`, de lucide-react, ya instalado) en un recuadro azul;
    - el número en grande, de fondo, como marca de agua (decorativo);
    - al pasar el cursor, el azul sube desde abajo y la tarjeta se invierte:
      texto en blanco sobre marino. Con `prefers-reduced-motion` el cambio de
      color es instantáneo, sin barrido.

    `icon` es opcional: sin él la tarjeta funciona igual.
*/
export function FeatureGrid({ title, items, columns = 'sm:grid-cols-2 lg:grid-cols-4' }) {
    return (
        <section className="border-t border-foreground/30 bg-card/40">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <Reveal>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                </Reveal>
                {/* Tarjetas separadas en vez de celdas pegadas (2026-10-26): ver `.tarjeta`. */}
                <div className={`mt-10 grid gap-5 ${columns}`}>
                    {items.map((item, i) => {
                        const Icono = item.icon;
                        return (
                            <Reveal key={item.title} delay={i * 0.06} className="h-full">
                                <div className="tarjeta group h-full overflow-hidden p-7">
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -right-2 -top-4 text-8xl font-extrabold leading-none text-primary/10 transition-colors duration-500 group-hover:text-primary-foreground/10"
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div className="relative">
                                        {Icono && (
                                            <span className="flex h-12 w-12 items-center justify-center border border-primary/50 text-primary transition-colors duration-500 group-hover:border-primary-foreground/60 group-hover:text-primary-foreground">
                                                <Icono className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                                            </span>
                                        )}
                                        <h3 className="mt-6 text-xl font-bold tracking-tight transition-colors duration-500 group-hover:text-primary-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-primary-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/*
    Bloque texto + foto («Personalización total», «Materiales…», «EPP…»).
    Animado el 2026-10-27: el propietario lo veía «muy limpio, muy simple».

    - Un filete azul se dibuja de arriba abajo junto al texto.
    - `puntos` (opcional): etiquetas que entran una a una. Salen LITERALES del
      propio párrafo —no se inventa nada—; al pasar el cursor se rellenan.
    - La foto se destapa de lado (`Cortina`) con el zoom de `ImagenEntrada`,
      y detrás lleva un marco azul desplazado que se acerca al pasar el cursor.
    - `imageWidth`/`imageHeight` (opcionales) dan la proporción real; sin ellos,
      3:2. `tinte={false}` quita el velo azul de `.media`, que ensucia las
      imágenes con fondo blanco (el collage de /ropa).
    Todo respeta `prefers-reduced-motion`.
*/
export function DetailSplit({ title, text, image, imageAlt, imageWidth, imageHeight, puntos = [], tinte = true, reverse = false }) {
    const proporcion = imageWidth && imageHeight;
    return (
        <section className="border-t border-foreground/30">
            <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
                <div className={`relative pl-6 sm:pl-8 ${reverse ? 'lg:order-2' : ''}`}>
                    <FileteVertical />
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                        <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{text}</p>
                    </Reveal>
                    {puntos.length > 0 && (
                        <ul className="mt-8 flex max-w-lg flex-wrap gap-2.5">
                            {puntos.map((p, i) => (
                                <Reveal as="li" key={p} delay={0.2 + i * 0.07} y={12}>
                                    <span className="inline-block border border-primary/40 bg-card px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                                        {p}
                                    </span>
                                </Reveal>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={`group relative mr-4 mb-4 ${reverse ? 'lg:order-1' : ''}`}>
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-4 translate-y-4 border border-primary/60 transition-transform duration-500 ease-out motion-safe:group-hover:translate-x-2 motion-safe:group-hover:translate-y-2"
                    />
                    <Cortina
                        desde={reverse ? 'izquierda' : 'derecha'}
                        className={`relative overflow-hidden border border-border/70 bg-card ${tinte ? 'media' : ''}`}
                    >
                        <ImagenEntrada>
                            <img
                                src={image}
                                alt={imageAlt}
                                width={imageWidth}
                                height={imageHeight}
                                loading="lazy"
                                style={proporcion ? { aspectRatio: `${imageWidth} / ${imageHeight}` } : undefined}
                                className={`w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03] ${proporcion ? '' : 'aspect-[3/2]'}`}
                            />
                        </ImagenEntrada>
                    </Cortina>
                </div>
            </div>
        </section>
    );
}

/*
    Galería de diseños propios. Sustituye a `CasesSection` en /calzado desde el
    2026-10-26: el propietario prefiere enseñar zapatos reales que casos.

    Una fila por diseño: foto ambientada y foto de producto lado a lado, y el
    lado se alterna fila a fila (mismo recurso que las líneas de la home). En
    móvil se apilan: primero la ambientada, que es la que cuenta la historia.

    También la usa /dotaciones desde el 2026-10-27 («Nuestros productos»): ahí
    `etiqueta` y `rotulo` cambian «Nuestros diseños» y «Diseño 0N». Y /ropa,
    el mismo día: con eso `CasesSection` se quedó sin uso y se borró.

    La proporción del marco sale del `width`/`height` de cada foto: calzado y
    dotaciones son 3:2, ropa es 3:4 (personas de cuerpo entero que en 3:2
    perdían cabeza o pies).

    Si no hay diseños, no se renderiza NADA — ni el título. Una galería vacía, o
    rellena con imágenes genéricas, es justo lo que la dirección rechazó.

    El zoom al pasar el cursor va con `motion-safe:`, así que con
    `prefers-reduced-motion` no se mueve. No se usa `.media`: su tinte azul
    sobre una foto de producto con fondo blanco quedaba sucio.
*/
function GalleryPhoto({ foto }) {
    return (
        <figure className="group overflow-hidden border border-border/70 bg-card">
            <ImagenEntrada>
                <img
                    src={foto.src}
                    alt={foto.alt}
                    width={foto.width}
                    height={foto.height}
                    loading="lazy"
                    style={{ aspectRatio: `${foto.width} / ${foto.height}` }}
                    className="w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                />
            </ImagenEntrada>
        </figure>
    );
}

// Dos fotos 3:4 a todo el ancho medían 720 px de alto: una fila no cabía en la
// pantalla de un portátil. Las verticales se ciñen a `max-w-4xl` y se arriman
// a un lado u otro según la fila, siguiendo la misma alternancia.
function anchoVertical(d, i) {
    if (d.producto.height <= d.producto.width) return '';
    return `sm:max-w-4xl lg:shrink-0 ${i % 2 === 1 ? 'sm:ml-auto lg:order-2' : ''}`;
}

// El hueco que dejan las filas verticales en escritorio lo ocupa el rótulo,
// en grande y en vertical (se lee de abajo arriba), con un filete azul del
// lado de las fotos. Lo pidió el propietario el 2026-10-27 con un boceto. En
// móvil y tableta no hay hueco: allí se queda la cabecera horizontal.
function RotuloVertical({ rotulo, numero, nombre, izquierda }) {
    return (
        <div
            className={`hidden flex-1 items-center justify-center lg:flex ${
                izquierda ? 'border-r border-primary/60' : 'border-l border-primary/60'
            }`}
        >
            <h3 className="rotate-180 whitespace-nowrap text-6xl font-extrabold xl:text-7xl uppercase tracking-[0.2em] text-primary [writing-mode:vertical-rl]">
                {rotulo} {numero}
                {nombre && <span className="sr-only"> · {nombre}</span>}
            </h3>
        </div>
    );
}

export function DesignGallery({ title, designs = [], etiqueta = 'Nuestros diseños', rotulo = 'Diseño' }) {
    if (designs.length === 0) return null;
    return (
        <section className="border-t border-foreground/30" aria-labelledby="galeria-titulo">
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{etiqueta}</p>
                    <h2 id="galeria-titulo" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                </Reveal>
                <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
                    {designs.map((d, i) => {
                        const numero = String(i + 1).padStart(2, '0');
                        const vertical = d.producto.height > d.producto.width;
                        return (
                            <Reveal key={d.producto.src} delay={0.05}>
                                <article className={vertical ? 'lg:flex lg:items-stretch lg:gap-8' : ''}>
                                    <div
                                        className={`mb-5 flex items-baseline gap-4 border-b border-primary/60 pb-3 ${vertical ? 'lg:hidden' : ''}`}
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                            {rotulo} {numero}
                                        </span>
                                        {d.nombre && <h3 className="text-lg font-bold tracking-tight">{d.nombre}</h3>}
                                    </div>
                                    <div className={`grid gap-4 sm:grid-cols-2 sm:gap-5 ${anchoVertical(d, i)}`}>
                                        <div className={i % 2 === 1 ? 'sm:order-2' : ''}>
                                            <GalleryPhoto foto={d.ambiente} />
                                        </div>
                                        <GalleryPhoto foto={d.producto} />
                                    </div>
                                    {vertical && <RotuloVertical rotulo={rotulo} numero={numero} nombre={d.nombre} izquierda={i % 2 === 1} />}
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/*
    Cierre de página de línea. Informa y navega — no vende. Sustituyó al antiguo
    LineCTA, que cerraba cada línea con un "Iniciar conversación" (ADR-001).

    Rehecho el 2026-10-26: el propietario lo veía «muy cuadrado, muy genérico».
    Tenía además un fallo de fondo: tres líneas en una rejilla de dos columnas
    dejaban SIEMPRE una celda vacía. Ahora:

    - Las otras líneas salen de `data/lineas.js` (todas menos `actual`). Ya no
      hay listas escritas a mano en cada página que se puedan desincronizar.
    - Tres tarjetas con la foto de cada línea, sin huecos. En móvil, filas
      compactas con miniatura para no apilar tres fotos grandes.
    - La flecha va en un botón azul que se rellena al pasar el cursor: es la
      señal de «esto se pulsa» de la regla de enlaces en azul.
    - Zoom de la foto con `motion-safe:`: quieto con `prefers-reduced-motion`.
*/
export function LineClosing({ actual, title, text }) {
    const otras = LINEAS.filter((l) => l.index !== actual);
    return (
        <section className="glow glow-c border-t border-foreground/30">
            <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                <Reveal>
                    <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{text}</p>
                </Reveal>
                {otras.length > 0 && (
                    <Reveal delay={0.1}>
                        <p className="mt-14 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            Las otras líneas de 4D
                        </p>
                        <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:gap-8">
                            {otras.map((l) => (
                                <Link key={l.to} to={l.to} className="group flex items-center gap-5 sm:block">
                                    <div className="w-28 shrink-0 overflow-hidden border border-border/70 bg-card sm:w-auto">
                                        <ImagenEntrada>
                                            <img
                                                src={l.image}
                                                alt={l.alt}
                                                loading="lazy"
                                                style={l.posicion ? { objectPosition: l.posicion } : undefined}
                                                className="aspect-[4/3] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.05]"
                                            />
                                        </ImagenEntrada>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between gap-4 sm:mt-5">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                                Dimensión {l.index}
                                            </span>
                                            <span className="mt-1.5 block text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary">
                                                {l.title}
                                            </span>
                                        </div>
                                        <span
                                            aria-hidden="true"
                                            className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                                        >
                                            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
