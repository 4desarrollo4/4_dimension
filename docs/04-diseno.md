# 04 — Sistema de diseño

**Última actualización:** 2026-10-27

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

Editorial, claro y técnico. Aire generoso, tipografía grande, numeración
visible (`01` / `02` / `03`), bordes finos en vez de sombras, esquinas casi
rectas. Debe leerse como marca internacional de producto — no como plantilla.

> 🔄 **Era «oscuro» hasta el 2026-10-20.** El sitio pasó a tema claro con la
> barra superior en negro — ver [**ADR-013**](07-decisiones.md).

---

## Color

Tokens HSL en [`apps/web/src/index.css`](../apps/web/src/index.css).
**Nunca escribas colores literales en los componentes.**

| Token | HSL | Uso |
|---|---|---|
| `--background` | `0 0% 92%` | Fondo base — **es el gris del vídeo del hero**, ver ADR-016 |
| `--foreground` | `228 11% 9%` | Texto principal (casi negro) |
| `--primary` | `214 75% 24%` | **PMS 295.** Azul marino de marca. Acentos, links, CTA |
| `--muted-foreground` | `210 4% 36%` | Texto secundario y párrafos |
| `--card` | `0 0% 100%` | Superficies elevadas (blanco puro, por encima del fondo) |
| `--border` | `210 8% 78%` | Bordes (casi siempre a `/60` o `/70`) |
| `--destructive` | `0 72% 45%` | Errores de formulario |
| `--radius` | `0.25rem` | Radio base — deliberadamente pequeño |

**El sitio es solo tema claro.** No hay conmutador y no hace falta. El bloque
`.dark` de `index.css` conserva la paleta oscura anterior pero está **inerte**:
ningún elemento lleva esa clase. Es el camino de vuelta del ADR-013.

### La única superficie oscura: la barra superior
La cabecera lleva fondo negro propio mediante la clase `.navbar-dark`, que
**redefine los tokens dentro del `<header>`** en vez de reescribir sus clases.
Por eso `Navbar.jsx` sigue usando `text-muted-foreground` y `border-border/70`
tal cual. Si añades algo a la cabecera, úsalos igual — se resuelven solos.
⚠️ El menú móvil es hermano del `<header>`, no hijo: **no** hereda el negro.

### Uso del azul
Es un acento, no un fondo. Aparece en: media frase del H1, los eyebrows en
versalitas, los números de las cifras, los iconos y el botón principal.
Si el azul empieza a dominar una sección, está mal usado.

⚠️ **PMS 295 es muy oscuro, y la barra superior es negra.** Dentro de
`.navbar-dark` se usa un **tinte** del mismo color, `hsl(214 75% 58%)`: mismo
matiz y misma saturación, solo más claro. Sin él, el subrayado del enlace
activo sería invisible. **Si cambias `--primary`, recalcula ese tinte.**

### Fotografía: sin difuminado
⛔ **No pongas un degradado sobre las fotos.** Hubo uno (`.media::after`) que
las fundía con el fondo; el propietario lo rechazó el 2026-10-20 y se eliminó.
Las imágenes van con su marco de 1 px (`border-border/70`) y nada más.

Como ya no hay degradado, **decae la regla de «30 % inferior libre de caras y
rótulos»** que [`10-plan-v2.md`](10-plan-v2.md) imponía a las fotos nuevas.

### Si falta una foto, no hay hueco
`LineHero` y las tarjetas de línea de la home aceptan `image` nulo: se
renderizan **a una sola columna, sin marco vacío**. Nunca una imagen rota ni un
render genérico de relleno. Al llegar la foto vuelven solos a dos columnas, sin
tocar el componente — es lo que pasó con Insumos el 2026-10-20.

### Las fotos propias van en `data/media.js`
Hay **dos** registros de imagen y no se mezclan:

| Registro | Qué guarda |
|---|---|
| `data/media.js` | Las fotos **propias**, en `public/fotos/` |
| `data/projects.js` → `IMAGES` | Las 11 imágenes de **banco** servidas desde CDN externo, pendientes de sustituir (P1-13 / P2-10) |

Cada entrada de `media.js` lleva `src`, `width`, `height` y `alt`. Las medidas
no son opcionales: sin ellas el navegador no reserva el hueco y la página da un
salto al cargar.

### Todo lo que se pulsa va en azul
Regla desde el 2026-10-26, pedida por el propietario para que el visitante sepa
dónde hacer clic. Dos clases en `index.css`, no colores sueltos:

| Clase | Cuándo | Cómo se ve |
|---|---|---|
| `.enlace` | Enlace suelto: correo, teléfono, dirección, footer | Azul; subrayado al pasar el cursor |
| `.enlace-texto` | Enlace **dentro de un párrafo** | Azul y **siempre** subrayado |

El subrayado permanente en `.enlace-texto` no es decoración: el azul marino y
el gris del cuerpo se parecen en luminosidad, y WCAG 1.4.1 pide algo más que el
color para distinguir un enlace en mitad de un texto.

**Excepciones:** el menú superior, los botones y las tarjetas enteras clicables
(que llevan foto y botón de flecha), porque ya se leen como pulsables.

### Cierre de las páginas de línea
`LineClosing` recibe `actual` (el número de la línea) y enseña **las otras
tres** desde `data/lineas.js`: tres tarjetas con foto, número de dimensión y un
botón de flecha azul que se rellena al pasar el cursor. En móvil, filas
compactas con miniatura. **No escribas listas de «otras líneas» a mano.**

### Contraste
Verificado el 2026-10-20 con una auditoría automática sobre las **7** rutas:
cero elementos por debajo de AA.

| | Ratio |
|---|---|
| PMS 295 sobre la página | **9,92:1** |
| Blanco sobre PMS 295 (botones) | **11,83:1** |
| Enlaces del navbar sobre negro | **10,33:1** |
| Tinte del azul sobre negro | **5,63:1** |

Si cambias un token, vuelve a medirlo.

**Re-medido el 2026-10-26** con una auditoría que, esta vez, **mezcla la
transparencia con el fondo real** (la del 20-oct trataba los colores con alfa
como opacos y por eso no vio dos fallos):

| Lo que fallaba | Antes | Ahora |
|---|---|---|
| Numeración `.text-outline` («01», «02»…) y «de lo mismo» | **1,59:1** | gris sólido, ≥ 3:1 (texto grande) |
| Textos de ayuda y *placeholder* del formulario (`/60`, `/70`) | < 4,5:1 | `text-muted-foreground` sin alfa |

Resultado: **0 fallos en las 7 rutas.** Regla: nada de `text-foreground/60`
para texto que se tiene que leer; para eso está `text-muted-foreground`.

---

## Tipografía

> 🔄 **Reescrita el 2026-10-20 — ver [ADR-015](07-decisiones.md).**
> La tipografía ya **no está «cerrada»**: la dirección se quejó de que el texto
> se veía borroso y pequeño, y se cambió entera.

**Familia: Archivo** (variable, 400–800), no Manrope. Entra por `<link>` en
`index.html`, nunca por `@import` en el CSS.

**Peso del cuerpo: 450.** No 400.

⛔ **Nunca pongas `-webkit-font-smoothing: antialiased`.** Adelgaza los trazos
y era la causa principal del «se ve borroso». Se quitó a propósito.

⛔ **Nunca uses `-webkit-text-stroke` para texto decorativo.** Un trazo de 1 px
se lo come el antialiasing y el número queda a medio dibujar. Los números
gigantes (`.watermark`, `.text-outline`) van con **relleno tenue**, no con
contorno. Ya no queda ni un `text-stroke` en el proyecto.

**La escala NO se toca en los componentes.** Está redefinida en
`tailwind.config.js`, así que `text-sm` ya son 16 px y `text-base` 18 px. Si
necesitas otro tamaño, pregúntate antes por qué: subir la escala fue
precisamente el arreglo.

| Clase | px | Uso |
|---|---|---|
| `text-xs` | 13 | Eyebrows en versalitas |
| `text-sm` | 16 | Tarjetas, listas, pies |
| `text-base` | 18 | Cuerpo |
| `text-lg` | 20 | Entradillas |
| `text-xl` | 22 | Destacados |


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
| `.text-outline` | Numeración decorativa («01», «02»…). **Ya no es contorno:** desde el 2026-10-26 es un gris sólido `hsl(210 4% 50%)`. El contorno al 22 % daba **1,59:1** sobre el fondo y no se leía |
| `.tarjeta` | Tarjeta blanca con borde. Al pasar el cursor: el borde toma el azul, sube 2px y una línea azul de 2px se dibuja arriba de izquierda a derecha. Quieta con `prefers-reduced-motion`. **Sustituye a las rejillas `gap-px bg-border`** (ver abajo) |
| `.enlace` · `.enlace-texto` | Enlace suelto en azul · enlace dentro de un párrafo, siempre subrayado |

### Las líneas: azul agrupa, negro separa *(2026-10-27)*

El propietario pidió meter el azul en las líneas de los cuadros y de
separación, «que unos sean azules y otros negros, sin sobrecargar». Regla:

| Línea | Color | Clase |
|---|---|---|
| Borde de las tarjetas (`.tarjeta`, `ProjectCard`, cajas de /contacto) | Azul al 40 % + acento azul de 2 px arriba a la izquierda | `border-primary/40` |
| Filas de las listas numeradas, filas de líneas de la home, cabecera de cada referencia de la galería, línea bajo las cifras | Azul al 60 % | `bg-primary/60` · `border-primary/60` |
| Separación entre secciones, marquesina, footer | Negro al 30 % | `border-foreground/30` |
| Marcos de fotos, divisiones pequeñas dentro de una caja, campos del formulario | Neutro, sin cambios | `border-border/…` |

Por qué esos porcentajes: una línea de 1 px de azul al 30–40 % sobre el gris
de la página **se lee gris**. Al 60 % ya se ve azul marino. En las tarjetas
basta el 40 % porque el acento sólido de arriba ya dice «azul».

❌ No pongas azul en los marcos de las fotos ni en los campos del formulario:
es lo que convertiría la regla en sobrecarga.

### La banda de marca *(2026-10-27)*

`.banda-marca` (index.css) pinta una sección en **azul claro a todo el ancho**
(`hsl(214 60% 94%)`, el matiz de PMS 295 muy aclarado) con una retícula tenue
de fondo. Redefine los tokens dentro, como `.navbar-dark`. Contraste: texto
15,6:1, texto secundario 7,2:1, azul de marca 10,1:1.

⚠️ Primero fue **azul marino**; el propietario lo vio «muy molesto» el mismo
día y se pasó a claro. No vuelvas al marino sin preguntar.

La usa **«Capacidades»** de las páginas de línea: título y recuento fijos a la
izquierda (`lg:sticky`), lista a la derecha, fila que se aclara al pasar el
cursor (se pone en blanco). Se pidió porque las secciones grises iguales se
veían «muy planas».

- Dentro de la banda las líneas son `bg-border` (un azul medio).
- ❌ **Una banda por página, como mucho.** Es el contraste lo que llama la
  atención; con dos seguidas vuelve a ser monótono.

### Bloque texto + foto animado *(2026-10-27)*

`DetailSplit` («Personalización total», «Materiales…», «EPP…») se veía «muy
limpio, muy simple». Ahora: filete azul que se dibuja junto al texto
(`FileteVertical`), etiquetas que entran una a una (`puntos`, sacadas
**literalmente** del párrafo), foto que se destapa de lado (`Cortina`, con
`clip-path`) más el zoom de `ImagenEntrada`, y un marco azul desplazado detrás
que se acerca al pasar el cursor. El `<noscript>` de `index.html` incluye
`clip-path: none` para que la foto no quede tapada sin JavaScript.

### Tarjetas con icono *(2026-10-27)*

Las tarjetas de `FeatureGrid` («Tipos de…», «Sectores…») llevan un icono de
lucide-react en un recuadro azul (`icon` en cada item), el número en grande de
marca de agua y, al pasar el cursor, un barrido azul de abajo arriba que
invierte la tarjeta a blanco sobre marino. Con `prefers-reduced-motion` el
color cambia sin barrido.

### Tarjetas separadas, no celdas pegadas *(2026-10-26)*

Las rejillas de celdas pegadas (`grid gap-px bg-border`, la línea de 1px que
asoma entre celdas) eran el recurso que el propietario veía «muy cuadrado,
muy genérico», y además dejaban celdas vacías cuando el número de elementos
no casaba con las columnas. Se sustituyeron **todas** por tarjetas `.tarjeta`
separadas con `gap-5`, envueltas en `<Reveal className="h-full">` para que la
fila mantenga la misma altura.

❌ No vuelvas a usar `gap-px bg-border` para maquetar contenido.

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
| `Movimiento.jsx` | `LineaDibujada` (filete que se dibuja al entrar) e `ImagenEntrada` (foto que entra con zoom 1,08 → 1) |
| `ShoeTurntable.jsx` | Vídeo del zapato girando en el hero. Sustituyó al cubo `Tesseract.jsx`, ya borrado |
| `WhatsAppFab.jsx` | Botón flotante de WhatsApp; lee de `lib/contacto.js` |
| `JsonLd.jsx` | Datos estructurados `Organization` |
| `Navbar.jsx` | Cabecera que se oculta al bajar; menú móvil a pantalla completa |
| `Footer.jsx` | Pie en 4 columnas |
| `ProjectCard.jsx` · `ProductLine.jsx` | Tarjetas de proyecto y de línea |
| `PageTransition.jsx` | Fundido entre rutas |
| `ScrollToTop.jsx` | Scroll al tope al navegar; respeta el hash para las anclas |
| `Seo.jsx` | OG/Twitter/canonical. Se usa en las 6 páginas; toma el dominio de `lib/site.js` |

Estos 13 son **todos** los componentes del sitio (2026-10-26). La carpeta `components/ui/`
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
6. **Filetes de las listas numeradas:** `<LineaDibujada />` en vez de
   `border-t`. La fila tiene que ser `relative`.
7. **Fotos bajo el pliegue:** `<ImagenEntrada>` dentro de un padre con
   `overflow-hidden`. Va en un envoltorio propio porque framer escribe
   `transform` en línea y anularía el zoom del hover de la propia `<img>`.
8. Ambas llevan `data-reveal`, como `Reveal`: sin JavaScript quedan en su
   estado final.

⚠️ **Las transiciones no se pueden comprobar en el panel de vista previa de
Claude:** cuando la ventana no está al frente, el navegador congela
`requestAnimationFrame` (0 fps medidos el 2026-10-26). Se verifican en un
navegador normal.

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

Pasó otra vez: hasta el 2026-10-26 los H1 de `/contacto` y `/nosotros` estaban
en un `Reveal` y salían invisibles en el HTML prerenderizado. **Todos** los H1
entran ahora con `.rise-solid`.

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
