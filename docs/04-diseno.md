# 04 — Sistema de diseño

**Última actualización:** 2026-09-01

> El diseño visual es lo más sólido del sitio. **No lo rediseñes.** Este
> documento existe para que cualquier cambio nuevo se vea como el resto.

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

⚠️ La fuente se carga con `@import` dentro del CSS: bloquea el render.
Debería ser `<link rel="preconnect">` + `<link>` en el HTML, y bajar de 7 pesos
a 3. → Backlog **P2-01**.

---

## Layout

- Contenedor: `mx-auto max-w-6xl px-6`
- Sección: `py-20 md:py-28`, separada con `border-t border-border/60`
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
| `ScrollToTop.jsx` | Scroll al tope al navegar (⚠️ bug con anclas — P1-02) |
| `Seo.jsx` | OG/Twitter/canonical — ⚠️ **existe pero ninguna página lo usa** (P0-04) |

`components/ui/` es shadcn generado — no lo edites a mano.

---

## Movimiento

Reglas:

1. **Todo lo que anime debe respetar `prefers-reduced-motion`.** Ya lo hacen
   `Reveal` (vía `useReducedMotion`), `CountUp` (vía `matchMedia`) e `index.css`
   (marquee y cubo). Mantén esa disciplina.
2. Curva estándar: `ease: [0.22, 1, 0.36, 1]`, duración `0.6s`.
3. Desplazamiento de entrada: `y: 24`.
4. Escalonado entre hermanos: `delay: i * 0.05` … `0.06`.
5. Hover: `duration-200`, y `active:scale-[0.98]` en elementos pulsables.

⚠️ **El H1 del hero no debería animar.** Es el elemento LCP y hoy entra desde
`opacity: 0`, quedando invisible ~0.6–1s. → Backlog **P2-03**.

---

## Accesibilidad — ya cumplido, no lo rompas

- `lang="es"` en `<html>`
- `alt` descriptivo en español en las 9 imágenes
- `aria-label` en navegaciones y botones de icono
- `<label htmlFor>` correcto en todos los campos del formulario
- `prefers-reduced-motion` respetado
- Objetivos táctiles de 44px (`h-11 w-11`) en los botones del menú móvil
- Sin desbordamiento horizontal a 375px (verificado)

### Pendiente de accesibilidad
- El menú móvil no atrapa el foco (`focus trap`) ni cierra con `Escape`
- No hay enlace "saltar al contenido"
- Falta `aria-expanded` en el botón del menú
