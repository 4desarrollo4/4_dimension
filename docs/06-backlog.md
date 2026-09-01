# 06 — Backlog priorizado

**Última actualización:** 2026-09-01
**Auditoría base:** 2026-09-01 — revisión técnica, editorial y SEO del sitio completo

---

> ## Cómo se usa este archivo
>
> - Es la **lista viva de pendientes**. Los demás documentos apuntan a estos IDs
>   (`P0-01`, `P2-03`…) — **no renumeres**, aunque una tarea se cierre.
> - Al terminar una tarea: cambia el estado a ✅, pon la fecha y añade la
>   entrada correspondiente en [`08-bitacora.md`](08-bitacora.md).
> - Si una tarea deja de tener sentido, márcala ❌ **descartada** con el motivo.
>   No la borres: los otros documentos la referencian.

### Leyenda

| Símbolo | Estado |
|---|---|
| ⬜ | Pendiente |
| 🟡 | En curso |
| ✅ | Hecho |
| ⛔ | Bloqueado — falta un dato o una decisión del propietario |
| ❌ | Descartada |

**Esfuerzo:** `S` < 1 h · `M` 1–4 h · `L` > 4 h

---

# P0 · Sin esto el sitio no cumple su objetivo

El objetivo declarado es **que conozcan a la empresa**. Todo lo que hay en P0
impide literalmente que la conozcan: el sitio no se puede compartir, no se
puede indexar de forma fiable, o expone legalmente a la empresa.

---

### P0-00 · Inicializar Git — `S` — ⬜

El directorio **no es un repositorio Git**: no hay historial y no hay forma de
revertir nada. Es el mayor riesgo operativo del proyecto ahora mismo.

Antes del primer commit, crear un `.gitignore` que excluya `node_modules/`,
`dist/`, `apps/pocketbase/pb_data/`, `apps/pocketbase/pocketbase` y
`vault/temp/SESSION_JOURNAL.md`.

```bash
git init && git add -A && git commit -m "Estado inicial del sitio 4D"
```

---

### P0-01 · `npm run build` no compila nada en Windows — `S` — ⬜

```
node tools/generate-llms.js || true && vite build --outDir ../../dist/apps/web
```

`cmd.exe` no tiene el comando `true`, así que la cadena se rompe y **`vite build`
nunca se ejecuta** — saliendo con código **0**. Un CI creería que compiló bien y
desplegaría un directorio vacío.

**Solución:** separar los comandos, o envolver el generador en un script Node que
nunca falle. Mientras tanto, compilar desde `apps/web/` con:

```bash
npx vite build --outDir ../../dist/apps/web
```

📁 [`apps/web/package.json`](../apps/web/package.json)

---

### P0-02 · Crear `apps/web/public/` — `M` — ⬜

El directorio **no existe**. Por eso `/vite.svg`, `/robots.txt` y `/sitemap.xml`
caen en el fallback del SPA y devuelven HTML con status 200 en vez de 404
*(verificado 2026-09-01)*.

Debe contener:

- `favicon.svg` + `favicon.ico` + `apple-touch-icon.png`
- `og-image.jpg` (1200×630) de marca, para WhatsApp y LinkedIn
- `robots.txt` con la referencia al sitemap
- `sitemap.xml` con las 6 rutas

⛔ Parcialmente bloqueado: el favicon definitivo necesita el **logo en vectorial**
y el `og:image` necesita el **dominio confirmado**. Ver
[`02-empresa.md`](02-empresa.md).

---

### P0-03 · Completar `index.html` — `S` — ⬜

Estado verificado el 2026-09-01:

| Etiqueta | Hoy |
|---|---|
| `<title>` | **vacío** |
| `<meta name="description">` | ausente |
| `<meta name="generator">` | dice `Hostinger AI Builder` — **quitar** |
| `<link rel="icon">` | apunta a `/vite.svg`, que no existe |
| `<link rel="preconnect">` a Google Fonts | ausente |

El `<title>` y la `description` del HTML son el **fallback** que ven los
rastreadores sin JavaScript. Deben decir quién es la empresa aunque React nunca
llegue a ejecutarse.

📁 [`apps/web/index.html`](../apps/web/index.html)

---

### P0-04 · Prerender de las 6 rutas + usar `<Seo>` — `L` — ⬜

**Es la tarea más importante del backlog.**

WhatsApp, LinkedIn, Facebook, X y Slack **no ejecutan JavaScript**. Como todo el
contenido y los meta tags se inyectan en el cliente, esas plataformas ven el
`index.html` crudo. Hoy, compartir cualquier enlace del sitio muestra **una URL
pelada: sin título, sin descripción y sin imagen**.

Para un sitio de reconocimiento de marca cuyo canal principal será WhatsApp y
LinkedIn, eso anula el objetivo del proyecto.

Estado verificado el 2026-09-01 en el sitio corriendo:

| Etiqueta | Cantidad en la página |
|---|---|
| `og:*` | **0** |
| `twitter:*` | **0** |
| `<link rel="canonical">` | **ausente** |

Dos partes:

1. **Prerenderizar en build.** `vite-plugin-ssg`, `react-snap` o similar.
   No requiere migrar de framework — ver [ADR-004](07-decisiones.md).
2. **Usar el componente [`Seo.jsx`](../apps/web/src/components/Seo.jsx)**, que ya
   está escrito y funcionando pero **no está importado en ninguna página**. Debe
   ir en las 6, con `title`, `description`, `image` y `url`.

⚠️ Cada página debe **conservar** su `<title>` y `<meta name="description">`
literales dentro de su `<Helmet>`: `tools/generate-llms.js` los lee del código
fuente, así que no pueden ser variables.

---

### P0-05 · Aviso de privacidad y consentimiento en el formulario — `M` — ⬜

[`ContactoPage.jsx`](../apps/web/src/pages/ContactoPage.jsx) recoge nombre,
empresa, correo y mensaje, y los guarda en PocketBase **sin aviso de privacidad
ni autorización expresa**. Incumple la **Ley 1581 de 2012** (habeas data) y el
**Decreto 1074 de 2015**.

Mínimo exigible:

- Casilla de autorización **no premarcada**, obligatoria para enviar
- Texto corto de finalidad del tratamiento junto al formulario
- Página `/politica-de-datos` con la política completa, enlazada desde el footer
- Guardar en `contact_requests` la marca de tiempo del consentimiento

⛔ La política necesita datos que aún no tenemos: NIT, dirección física y
responsable del tratamiento.

---

# P1 · Alinean el sitio con su objetivo

---

### P1-01 · Reescritura editorial: informar en vez de vender — `L` — ⬜

El sitio está escrito como una landing de captación. Conteo verificado el
2026-09-01: **9 llamados comerciales en el cuerpo**, más el botón "Hablemos ↗"
del navbar presente en las 6 páginas. La regla del proyecto es **máximo 2 en
toda la home**.

| Dónde | Texto actual | Reemplazo acordado |
|---|---|---|
| [`Navbar.jsx:66`](../apps/web/src/components/Navbar.jsx:66) | "Hablemos ↗" | "Contacto" |
| [`HomePage.jsx:88`](../apps/web/src/pages/HomePage.jsx:88) | H1 "Convertimos ideas en productos ganadores" | Titular de identidad |
| [`HomePage.jsx:109`](../apps/web/src/pages/HomePage.jsx:109) | "Hablemos de un proyecto" | "Qué hacemos" — ancla a las líneas |
| [`HomePage.jsx:308`](../apps/web/src/pages/HomePage.jsx:308) | "¿Cuál será tu próxima dimensión?" → "Iniciar conversación" | Cierre informativo, sin CTA |
| [`HomePage.jsx:198`](../apps/web/src/pages/HomePage.jsx:198) | Eyebrow "PROPUESTA DE VALOR" | "CÓMO TRABAJAMOS" |
| [`ProductLine.jsx:20`](../apps/web/src/components/ProductLine.jsx:20) | **"Solicitar cotización"** (×3 páginas) | Eliminar |
| [`ProductLine.jsx:113`](../apps/web/src/components/ProductLine.jsx:113) | `LineCTA` "Iniciar conversación" (×3) | Eliminar la sección, o dejarla informativa |
| [`NosotrosPage.jsx:107`](../apps/web/src/pages/NosotrosPage.jsx:107) | "Trabajemos juntos" | "Conócenos", o eliminar |
| [`ContactoPage.jsx:50`](../apps/web/src/pages/ContactoPage.jsx:50) | Meta "Hablemos de tu proyecto… Cotiza" | "Datos de contacto de 4D Cuarta Dimensión" |
| [`ContactoPage.jsx:115`](../apps/web/src/pages/ContactoPage.jsx:115) | Campo "Tu proyecto \*" | "Mensaje" |

**El fondo no son los botones, es la persona gramatical.** Hay que pasar de 2ª
persona vendiendo a 1ª persona describiendo:

- ❌ "Entendemos **tu** mercado, **tu** cliente y el reto que **quieres** convertir en oportunidad." — [`HomePage.jsx:51`](../apps/web/src/pages/HomePage.jsx:51)
- ✅ "Partimos del mercado y del usuario final para definir qué producto tiene sentido desarrollar."

Otros focos de 2ª persona: [`HomePage.jsx:297`](../apps/web/src/pages/HomePage.jsx:297),
[`DotacionesPage.jsx:47`](../apps/web/src/pages/DotacionesPage.jsx:47),
[`RopaPage.jsx:8`](../apps/web/src/pages/RopaPage.jsx:8) y `RopaPage.jsx:19`.

📖 Reglas completas en [`05-contenido-y-seo.md`](05-contenido-y-seo.md).

⚠️ **No cambia ni un dato factual.** Cifras, proyectos, nombres y datos de
contacto se quedan exactamente como están.

---

### P1-02 · `ScrollToTop` rompe los enlaces con ancla — `S` — ⬜

El navbar y el footer enlazan a `/#proyectos` y `/#metodologia`, pero
[`ScrollToTop.jsx`](../apps/web/src/components/ScrollToTop.jsx) fuerza el scroll
al tope en cada navegación. Resultado: "Proyectos" y "Metodología" llevan al
inicio de la home, no a la sección.

**Solución:** no hacer scroll si `location.hash` tiene valor; en su lugar,
desplazarse al elemento correspondiente.

---

### P1-03 · Correo y teléfono no son clicables — `S` — ⬜

Para un sitio informativo, contactar es la única acción que importa, y hoy está
rota en móvil:

- [`ContactoPage.jsx`](../apps/web/src/pages/ContactoPage.jsx) muestra correo y
  teléfono como **texto plano**
- [`Footer.jsx:36`](../apps/web/src/components/Footer.jsx:36) es peor: el correo,
  el teléfono y la ciudad son **enlaces internos a `/contacto`**

Deben ser `mailto:comercial@cuartadimension.co` y `tel:+576017434400`.

---

### P1-04 · Migrar `react-helmet` → `react-helmet-async` — `S` — ⬜

`react-helmet@6.1.0` está sin mantenimiento y usa ciclos de vida heredados que
React 18 ya no garantiza con `createRoot`. Funciona hoy, pero es frágil y
**`react-helmet-async` es requisito práctico para el prerender de P0-04**.

📁 [`apps/web/src/main.jsx`](../apps/web/src/main.jsx) — añadir `HelmetProvider`

---

### P1-05 · El formulario de contacto no se puede probar en local — `S` — ⬜

`/hcgi/platform` es una ruta que proxea la infraestructura de Horizons, no Vite.
En local devuelve el `index.html` del SPA (`text/html`, 200), así que PocketBase
nunca recibe la petición y el formulario **siempre falla**.

**Solución:** `server.proxy` en [`vite.config.js`](../apps/web/vite.config.js)
apuntando `/hcgi/platform` → `http://localhost:8090`.

⚠️ En Windows, además, el binario `apps/pocketbase/pocketbase` es un ejecutable
**ELF de Linux** y no arranca. Para probarlo hace falta WSL, o el binario de
PocketBase para Windows.

---

### P1-06 · JSON-LD `Organization` en la home — `M` — ⛔

Es lo que alimenta el panel de conocimiento de Google — literalmente, lo que hace
que "te conozcan" cuando buscan la empresa por su nombre.

Datos a incluir, todos desde [`02-empresa.md`](02-empresa.md): razón social,
logo, dirección, teléfono, correo, área de servicio y `sameAs` con las redes.

⛔ Bloqueado en parte: faltan NIT, dirección exacta, año de fundación y perfiles
de redes sociales.

---

# P2 · Solidez, rendimiento y pulido

---

### P2-01 · Carga de la fuente Manrope — `S` — ⬜

Se carga con `@import` dentro del CSS, lo que **bloquea el render**. Debe ser
`<link rel="preconnect">` + `<link>` en el HTML, y bajar de 7 pesos a 3
(400 / 600 / 800).

📁 [`apps/web/src/index.css`](../apps/web/src/index.css)

---

### P2-02 · Logo e imágenes alojadas en CDN externo — `M` — ⬜

Los 11 assets de [`data/projects.js`](../apps/web/src/data/projects.js) apuntan a
`images.hostinger.com`; el logo del navbar y del footer, a
`horizons-cdn.hostinger.com`. Una imagen viene de Unsplash.

**Riesgo:** si se desactiva el proyecto en Hostinger, el sitio se queda **sin una
sola imagen y sin logo**. Hay que bajarlos al repositorio — o a un CDN propio — y
servirlos desde el dominio de la empresa.

---

### P2-03 · El H1 del hero no debería animar — `S` — ⬜

Es el elemento **LCP** de la home y hoy entra desde `opacity: 0` con `Reveal`.
El HTML existe, pero el visitante no ve nada hasta que carguen y se ejecuten
409 KB de JavaScript. Con conexión lenta, la primera impresión es una pantalla
en negro.

El hero (eyebrow, H1, párrafo y botones) debe renderizarse visible; anima solo lo
que está por debajo del pliegue.

---

### P2-04 · `<main>`, "saltar al contenido" y `:focus-visible` — `S` — ⬜

- [`App.jsx`](../apps/web/src/App.jsx) envuelve las rutas en un `<div>` — **no hay
  landmark `<main>`**
- No hay enlace "saltar al contenido"
- No hay ni un estilo `:focus-visible` en `index.css`

✅ El contraste de color **sí** cumple WCAG AA con holgura (medido 2026-09-01:
texto principal 18:1, secundario 7.08:1, azul primario 4.72:1). No lo rompas.

---

### P2-05 · Menú móvil: foco, Escape y `aria-expanded` — `S` — ⬜

[`Navbar.jsx`](../apps/web/src/components/Navbar.jsx) abre un menú a pantalla
completa que no atrapa el foco, no cierra con `Escape` y cuyo botón no declara
`aria-expanded`.

---

### P2-06 · Eliminar el código muerto del scaffold — `M` — ⬜

Verificado el 2026-09-01: **ningún archivo fuera de `src/components/ui/` importa
un solo componente de shadcn**. Los 55 archivos de `ui/` y ~30 dependencias de
Radix están **100 % sin usar**.

No inflan el JS — el tree-shaking funciona: `recharts`, `embla-carousel`,
`react-day-picker`, `cmdk`, `vaul` e `input-otp` **no** aparecen en el bundle —
pero sí el CSS: Tailwind escanea `src/**` y genera **80 KB** de clases que nadie
usa.

También son residuo [`AuthContext.jsx`](../apps/web/src/contexts/AuthContext.jsx)
y [`ProtectedRoute.jsx`](../apps/web/src/components/ProtectedRoute.jsx): no hay
área privada ni la habrá.

`knip.json` en la raíz ya está configurado para detectarlo.

---

### P2-07 · La barra de progreso de Metodología calcula mal — `S` — ⬜

[`HomePage.jsx:61`](../apps/web/src/pages/HomePage.jsx:61) usa
`useScroll({ target: methodRef })`, pero la sección de destino
([`HomePage.jsx:259`](../apps/web/src/pages/HomePage.jsx:259)) **no tiene
`position: relative`**. framer-motion emite el aviso *"Please ensure that the
container has a non-static position…"* y los offsets salen mal.

⚠️ El aviso no se ve en consola porque
[`vite.config.js`](../apps/web/vite.config.js) hace `console.warn = () => {}`.
Quedó registrado en `vault/temp/SESSION_JOURNAL.md`.

**Solución:** añadir `relative` a la clase de la sección.

---

### P2-08 · Columna "Proyectos" del footer — `S` — ⬜

Los 4 enlaces de esa columna apuntan **todos al mismo ancla** `/#proyectos`. Es
relleno visual: o llevan a algo distinto, o la columna sobra.

📁 [`Footer.jsx:22`](../apps/web/src/components/Footer.jsx:22)

---

### P2-09 · Code-splitting por ruta — `M` — ⬜

El build sale en **un solo bundle de 409 KB JS (130 KB gzip)** + 80 KB CSS.
`React.lazy` por ruta reduce el coste de la primera carga.

---

### P2-10 · Fotos reales de operación y equipo — `L` — ⛔

Las imágenes actuales son renders genéricos. Para un sitio cuyo objetivo es *"que
nos conozcan"*, fotos reales de la operación, la oficina y el equipo valen diez
veces más que un render.

⛔ Bloqueado: depende de material que debe aportar el propietario.

---

# Bloqueados por falta de información

Estas tareas **no se pueden cerrar** hasta que el propietario aporte los datos
listados en [`02-empresa.md`](02-empresa.md):

| Dato que falta | Bloquea |
|---|---|
| Logo en vectorial (SVG) | P0-02 |
| Dominio definitivo confirmado | P0-02, P0-04 |
| NIT, dirección exacta, responsable de datos | P0-05, P1-06 |
| Año de fundación | P1-06 |
| Perfiles de redes sociales | P1-06 |
| Fotos reales y equipo | P2-10 |

---

# Orden recomendado de ejecución

1. **P0-00** — Git primero. Sin historial, cualquier cambio posterior es irreversible.
2. **P0-01** — Sin un build que funcione no se puede desplegar nada.
3. **P0-03 → P0-02 → P0-04** — El bloque de visibilidad. Es el que más mueve la aguja.
4. **P0-05** — El riesgo legal sigue abierto mientras el formulario esté publicado.
5. **P1-01** — La reescritura editorial. No toca ni un dato factual.
6. El resto de P1, y luego P2 según haya tiempo.
