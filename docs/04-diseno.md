# 04 — Sistema de diseño

**Última actualización:** 2026-09-02

> **Qué está cerrado y qué no.**
>
> - **Cerrado:** paleta, tipografía, tokens y voz visual. No los cambies sin un
>   ADR nuevo.
> - **Rehecho el 2026-09-01:** la **composición** — ritmo de secciones, jerarquía
>   y tratamiento de imagen. Lo pidió el propietario porque el sitio, aun siendo
>   correcto, se sentía plano y repetitivo. Ver [ADR-010](07-decisiones.md).
>
> Este documento existe para que cualquier cosa nueva se vea como el resto.

---

## Carácter

Editorial, oscuro y técnico. Aire generoso, tipografía grande, numeración
visible (`01` / `02` / `03`), bordes finos en vez de sombras, esquinas casi
rectas. Debe leerse como marca internacional de producto — no como plantilla.

---

## Color

Tokens HSL en [`apps/web/src/index.css`](../apps/web/src/index.css).
**Nunca escribas colores literales en los componentes.**

| Token | HSL | Uso |
|---|---|---|
| `--background` | `223 30% 4.5%` | Fondo base (casi negro azulado) |
| `--foreground` | `220 16% 96%` | Texto principal |
| `--primary` | `224 100% 62%` | **Azul de marca.** Acentos, links, CTA |
| `--muted-foreground` | `220 10% 62%` | Texto secundario y párrafos |
| `--card` | `222 18% 11%` | Superficies elevadas |
| `--border` | `222 14% 15%` | Bordes (casi siempre a `/60` o `/70`) |
| `--destructive` | `0 72% 51%` | Errores de formulario |
| `--radius` | `0.25rem` | Radio base — deliberadamente pequeño |

**El sitio es solo modo oscuro.** `:root` y `.dark` tienen los mismos valores.
No hay conmutador de tema y no hace falta.

### Uso del azul
Es un acento, no un fondo. Aparece en: media frase del H1, los eyebrows en
versalitas, los números de las cifras, los iconos y el botón principal.
Si el azul empieza a dominar una sección, está mal usado.

---

## Tipografía

**Manrope** (Google Fonts), pesos 200–800.

| Elemento | Clases |
|---|---|
| H1 | `text-5xl sm:text-7xl font-extrabold leading-[1.02] tracking-tight` |
| H2 | `text-4xl sm:text-5xl font-extrabold tracking-tight` |
| H3 | `text-3xl font-extrabold tracking-tight` |
| Eyebrow | `text-xs font-semibold uppercase tracking-[0.3em] text-primary` |
| Párrafo | `leading-relaxed text-muted-foreground` |
| Números decorativos | `.text-outline` (contorno de 1px, relleno transparente) |

El **eyebrow en versalitas con `tracking-[0.3em]`** encima de cada H2 es la
firma del sitio. Toda sección nueva lo lleva.

✅ *(2026-09-01)* La fuente entra por `<link rel="preconnect">` + `<link>` en
[`index.html`](../apps/web/index.html), con la **variable** de Manrope: un solo
archivo cubre los pesos 400–800. Antes se cargaba con `@import` dentro del CSS,
que bloquea el render y encadena dos peticiones.

---

## Composición ✅ *(rehecha el 2026-09-01)*

El problema anterior: las 9 secciones de la home eran idénticas — `border-t` +
`py-28` + eyebrow + H2 —, todo en el mismo plano y sin ninguna jerarquía. Nada
rompía el patrón en 7.600 px de scroll.

### Reglas de ritmo

1. **Alterna el fondo.** `bg-background` → `bg-card/30` → `bg-background`. Dos
   secciones seguidas nunca comparten fondo.
2. **No todas las secciones son iguales de altas.** La banda de cifras es corta
   y contundente; las líneas de negocio son largas; la de diferenciación es casi
   solo un titular.
3. **Un resplandor por cada dos o tres secciones**, nunca seguidos.
4. **Cada sección tiene un protagonista**: un número enorme, una marca de agua,
   una imagen o un titular. Si no lo tiene, es relleno.

### Piezas reutilizables

Todas viven en [`index.css`](../apps/web/src/index.css).

| Clase | Qué hace |
|---|---|
| `.media` | Envuelve una imagen: degradado hacia el fondo para que se apoye en la página, tinte azul al pasar el cursor y zoom suave. Necesita `.group` en un ancestro para el hover |
| `.glow` + `.glow-tr` / `.glow-bl` / `.glow-c` | Resplandor radial de marca anclado a una esquina o al centro. Da profundidad sin usar sombras |
| `.watermark` | Numeral o palabra gigante en contorno al 9 % — el "01", "02", "03" y el "4D" |
| `.stat-number` | Interlineado y tracking de las cifras grandes, con `tabular-nums` |
| `.sweep` | Botón secundario: la superficie se barre de lado a lado en vez de cambiar de color |
| `.read-progress` | Barra de progreso de lectura, fija arriba |
| `.text-outline` | Contorno de 1px, ya existía. Para numeración decorativa |

### Jerarquía de las cifras

`+120K`, `12.000` y `98%` son el dato más creíble del sitio. Antes vivían en tres
cajitas a `text-4xl` dentro de otra sección. Ahora **abren la página** en su
propia banda, a `text-6xl / 7xl / 8xl`, justo después del hero.

⚠️ Sobre los fondos alternos, medido el 2026-09-01: texto principal **17.4:1**,
secundario **6.8:1**, azul primario **4.53:1**. El azul pasa AA, pero **con poco
margen**: si aclaras un fondo, vuelve a medirlo.

---

## Layout

- Contenedor: `mx-auto max-w-6xl px-6`
- Sección: `py-24 md:py-32`, alternando fondo y separada con `border-t border-border/60`
- Rejillas de tarjetas: `grid gap-px border border-border/60 bg-border/60` con
  hijos `bg-background` — así el borde interno lo dibuja el gap. Reutiliza este
  patrón en vez de inventar otro.
- Alternancia imagen/texto en las líneas de negocio con `lg:order-1` / `lg:order-2`.

---

## Componentes propios

📁 `apps/web/src/components/`

| Componente | Función |
|---|---|
| `Reveal.jsx` | Entrada al hacer scroll (`whileInView`). Acepta `delay` en s o ms |
| `CountUp.jsx` | Contador animado con `IntersectionObserver` |
| `Tesseract.jsx` | Cubo 4D animado en CSS del hero |
| `Navbar.jsx` | Cabecera que se oculta al bajar; menú móvil a pantalla completa |
| `Footer.jsx` | Pie en 4 columnas |
| `ProjectCard.jsx` · `ProductLine.jsx` | Tarjetas de proyecto y de línea |
| `PageTransition.jsx` | Fundido entre rutas |
| `ScrollToTop.jsx` | Scroll al tope al navegar; respeta el hash para las anclas |
| `Seo.jsx` | OG/Twitter/canonical. Se usa en las 6 páginas; toma el dominio de `lib/site.js` |

Estos 11 son **todos** los componentes del sitio. La carpeta `components/ui/`
de shadcn se borró el 2026-09-02: eran 55 componentes que nadie importaba
(**ADR-011**). Si algún día hiciera falta uno, el CLI de shadcn lo regenera —
`components.json` sigue en su sitio.

---

## Movimiento

Reglas:

1. **Todo lo que anime debe respetar `prefers-reduced-motion`.** Ya lo hacen
   `Reveal` y `PageTransition` (vía `useReducedMotion`), `CountUp` (vía
   `matchMedia`) e `index.css` (marquee, cubo, entradas del hero y subrayado del
   navbar). Mantén esa disciplina.
2. Curva estándar: `ease: [0.22, 1, 0.36, 1]`, duración `0.6s`.
3. Desplazamiento de entrada: `y: 24`.
4. Escalonado entre hermanos: `delay: i * 0.05` … `0.06`.
5. Hover: `duration-200`, y `active:scale-[0.98]` en elementos pulsables.

---

## Entradas: cuándo CSS y cuándo framer-motion ✅ *(2026-09-01)*

Es la regla de motion más importante del proyecto, y no es estética: es de
rendimiento.

| Zona | Cómo entra | Por qué |
|---|---|---|
| **Hero** (home y páginas de línea) | **CSS**: `.rise-in` / `.rise-solid` | El CSS bloquea el render, así que se ve en el primer pintado. Con framer-motion la portada quedaba en negro hasta cargar 411 KB de JS |
| **H1 del hero** | `.rise-solid` — **solo desplaza, nunca desvanece** | Es el elemento LCP. Si empieza en `opacity: 0`, el navegador no lo cuenta como pintado |
| **Todo lo demás** | `Reveal` (framer-motion, `whileInView`) | Está bajo el pliegue: nadie lo ve antes de hacer scroll |
| **Cambio de ruta** | `PageTransition` | — |

Clases disponibles en [`index.css`](../apps/web/src/index.css):
`.rise-in` (desvanece y sube), `.rise-solid` (solo sube) y los retardos
`.rise-delay-1` … `.rise-delay-4`.

⚠️ **Nunca pongas un `Reveal` en la primera pantalla.** El sitio se prerenderiza:
un `Reveal` se sirve con `opacity: 0` en el HTML, y ahí es donde mira el
visitante antes de que cargue nada.

### La primera carga no se anima

[`PageTransition`](../apps/web/src/components/PageTransition.jsx) se salta su
animación de entrada la primera vez, con una bandera a nivel de módulo. Si no,
el envoltorio de la página entera se prerenderiza con `opacity: 0` y el sitio
completo queda invisible hasta que arranca el JavaScript.

❌ **No lo "arregles" poniendo `initial={false}` en el `<AnimatePresence>` de
`App.jsx`.** Lo heredan los `Reveal` y se pierden las 25 entradas al hacer
scroll. Ya se probó.

### Sin JavaScript

[`index.html`](../apps/web/index.html) lleva un `<noscript>` que revela todo lo
que tenga `data-reveal` — el atributo que pone `Reveal`. El HTML ya viene
prerenderizado: no tendría sentido servirlo invisible.

---

## Accesibilidad — ya cumplido, no lo rompas

- `lang="es"` en `<html>`
- `alt` descriptivo en español en las 9 imágenes
- `aria-label` en navegaciones y botones de icono
- `<label htmlFor>` correcto en todos los campos del formulario
- `prefers-reduced-motion` respetado
- Objetivos táctiles de 44px (`h-11 w-11`) en los botones del menú móvil
- Sin desbordamiento horizontal a 375px (verificado)

Añadido el **2026-09-01** (**P2-04**, **P2-05**):

- Landmark `<main id="contenido">` en [`App.jsx`](../apps/web/src/App.jsx)
- Enlace **"Saltar al contenido"** (`.skip-link`), primero en el orden de foco
- Anillo de foco global con `:focus-visible`, en el azul de marca — solo con
  teclado, no al hacer clic
- `scroll-margin-top: 6.5rem` en todo `[id]`: sin eso, un ancla deja el título
  debajo del navbar fijo
- Menú móvil: `role="dialog"`, `aria-modal`, `aria-expanded`, cierre con
  `Escape`, foco atrapado dentro, scroll de fondo bloqueado y foco devuelto al
  botón al cerrar

### Pendiente de accesibilidad

- Nada crítico conocido. Al añadir un componente nuevo, comprueba que se puede
  usar con teclado y que el foco se ve.
