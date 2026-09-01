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
| 🟡 | En curso / parcial |
| ✅ | Hecho |
| ⚠️ | Necesita verificación |
| ⛔ | Bloqueado — falta un dato o una decisión del propietario |
| ❌ | Descartada |

**Esfuerzo:** `S` < 1 h · `M` 1–4 h · `L` > 4 h

---

## Resumen

| Prioridad | ✅ | 🟡 ⚠️ | ⬜ ⛔ | Total |
|---|---|---|---|---|
| **P0** | 4 | 2 | 1 | 7 |
| **P1** | 3 | 1 | 2 | 6 |
| **P2** | 0 | 0 | 11 | 11 |

**Siguiente tarea recomendada:** **P0-06** — confirmar cómo sirve las rutas el
hosting. Es lo único de P0 que no depende de datos del propietario, y de ello
depende que el prerender sirva de algo.

Casi todo lo demás está ⛔ **esperando material del propietario**: logo en
vectorial, dominio definitivo, NIT y dirección física.

---

# P0 · Sin esto el sitio no cumple su objetivo

El objetivo declarado es **que conozcan a la empresa**. Todo lo que hay en P0
impide literalmente que la conozcan: el sitio no se puede compartir, no se
puede indexar de forma fiable, o expone legalmente a la empresa.

---

### P0-00 · Inicializar Git — `S` — ✅ *(2026-09-01)*

Repositorio inicializado con un primer commit de 189 archivos. Se creó
[`.gitignore`](../.gitignore) excluyendo `node_modules/`, `dist/`,
`apps/pocketbase/pb_data/`, el binario `pocketbase` y
`vault/temp/SESSION_JOURNAL.md`, más un `.gitattributes` que normaliza los
finales de línea (el repositorio se trabaja en Windows).

---

### P0-01 · `npm run build` no compila nada en Windows — `S` — ✅ *(2026-09-01)*

Eran **dos** bugs de Windows, no uno:

1. El script encadenaba `node tools/generate-llms.js || true && vite build`.
   `cmd.exe` no tiene el comando `true`, así que la cadena se rompía y **vite
   nunca corría**, saliendo con código 0. Se quitó el `|| true`.
2. `tools/generate-llms.js` comparaba la URL del propio módulo contra una ruta
   construida a mano desde `process.argv[1]`. En Windows **nunca coinciden**
   (separador de ruta y espacios sin escapar), así que `main()` no llegaba a
   ejecutarse: **`llms.txt` no se había generado jamás**. Ahora usa
   `pathToFileURL()`.

Además, quedarse sin páginas con `<Helmet>` ya no tumba el build: avisa y sigue.

📁 [`apps/web/package.json`](../apps/web/package.json) ·
[`apps/web/tools/generate-llms.js`](../apps/web/tools/generate-llms.js)

---

### P0-02 · Crear `apps/web/public/` — `M` — 🟡 *(parcial, 2026-09-01)*

| Archivo | Estado |
|---|---|
| `public/favicon.svg` | ✅ **provisional** — marca tipográfica "4D" con los tokens de marca |
| `public/llms.txt` | ✅ lo genera `tools/generate-llms.js` |
| `robots.txt` | ✅ lo genera `tools/prerender.js` en `dist/` |
| `sitemap.xml` | ✅ lo genera `tools/prerender.js` en `dist/` |
| `favicon.ico` + `apple-touch-icon.png` | ⛔ necesitan el logo oficial |
| `og-image.jpg` (1200×630) | ⛔ necesita el logo oficial y el dominio confirmado |

`robots.txt` y `sitemap.xml` **no se escriben a mano**: salen de la lista de
rutas y del dominio de [`src/lib/site.js`](../apps/web/src/lib/site.js), para que
no puedan desincronizarse.

⛔ Lo que falta depende del propietario: **logo en vectorial** y **dominio
definitivo**. El favicon actual es un marcador de posición — hay que
reemplazarlo antes de publicar.

⚠️ **Sin `og-image.jpg`, al compartir un enlace sale el título y la descripción
pero no la imagen.** Es lo que más se nota en WhatsApp y LinkedIn.

---

### P0-03 · Completar `index.html` — `S` — ✅ *(2026-09-01)*

| Etiqueta | Antes | Ahora |
|---|---|---|
| `<title>` | **vacío** | título completo de la empresa |
| `<meta name="description">` | ausente | descripción institucional |
| `<meta name="generator">` | `Hostinger AI Builder` | eliminada |
| `<link rel="icon">` | `/vite.svg` (roto) | `/favicon.svg` |
| `<meta name="theme-color">` | ausente | `#0a0c14` |
| `preconnect` a Google Fonts | ausente | añadido |

⚠️ Estas etiquetas son solo el **fallback**. El prerender las reemplaza por las
de cada ruta. Si alguna vez ves este título en una página interna, significa que
el prerender no corrió — o que el hosting está sirviendo el `index.html` raíz
para todas las rutas (ver **P0-06**).

📁 [`apps/web/index.html`](../apps/web/index.html)

---

### P0-04 · Prerender de las 6 rutas + usar `<Seo>` — `L` — ✅ *(2026-09-01)*

Era la tarea más importante del backlog. **Hecha y verificada.**

**Cómo funciona.** El build encadena cuatro pasos:

```
generate-llms.js  →  build:client  →  build:ssr  →  prerender.js
```

`build:ssr` compila [`src/entry-server.jsx`](../apps/web/src/entry-server.jsx), y
[`tools/prerender.js`](../apps/web/tools/prerender.js) lo importa para renderizar
las 6 rutas en Node, inyectando en cada `index.html` las etiquetas que
`react-helmet-async` recolecta.

**Cambios de arquitectura que trajo:**

- El `<Router>` salió de [`App.jsx`](../apps/web/src/App.jsx): ahora lo pone cada
  entrada — `BrowserRouter` en `main.jsx`, `StaticRouter` en `entry-server.jsx`.
- `main.jsx` **hidrata** si encuentra HTML prerenderizado y monta de cero si no
  (que es el caso en desarrollo).
- [`Seo.jsx`](../apps/web/src/components/Seo.jsx) ya no lee `window.location` —
  no existe en Node — sino `useLocation()` + `SITE_URL`.
- `ScrollToTop` usa un layout effect isomorfo, o React avisaba en cada ruta.
- Nuevo [`src/lib/site.js`](../apps/web/src/lib/site.js): dominio, rutas y OG en
  un solo sitio.

**Verificado el 2026-09-01** sobre el build servido:

| Comprobación | Antes | Ahora |
|---|---|---|
| `og:*` | 0 | **9 por ruta** |
| `twitter:*` | 0 | **4 por ruta** |
| `canonical` | ausente | correcto y único por ruta |
| `<title>` en el HTML servido | vacío | el de cada página |
| `<h1>` en el HTML sin JavaScript | ausente | presente |
| Errores de hidratación en consola | — | **ninguno** |

⚠️ Cada página debe **conservar** su `<title>` y `<meta name="description">`
literales dentro de su `<Helmet>`: `tools/generate-llms.js` los lee del código
fuente, así que no pueden ser variables.

---

### P0-05 · Aviso de privacidad y consentimiento en el formulario — `M` — 🟡 *(parcial, 2026-09-01)*

**Hecho:** el formulario ya no recoge datos sin autorización.

- Casilla de autorización **no premarcada** y **obligatoria**: sin marcarla, el
  envío se bloquea con un mensaje de error. Verificado el 2026-09-01.
- Texto de finalidad junto al formulario, nombrando al responsable
  (4D Cuarta Dimensión ES S.A.S.) y la única finalidad del tratamiento.
- Aviso de los derechos del titular (consultar, actualizar, eliminar) con el
  correo de contacto, y mención expresa de la **Ley 1581 de 2012**.

**Falta:**

1. ⛔ **Página `/politica-de-datos`** con la política completa. Necesita NIT,
   dirección física y responsable del tratamiento — ver
   [`02-empresa.md`](02-empresa.md). Al crearla, registrarla también en
   [`src/lib/site.js`](../apps/web/src/lib/site.js) y enlazarla desde el footer.
2. ⬜ **Guardar la marca de tiempo del consentimiento** en `contact_requests`.
   Requiere una migración de PocketBase que **no se puede probar en Windows**
   (el binario es un ejecutable de Linux), así que no se escribió a ciegas.
3. ⚠️ **Revisión legal.** El texto actual recoge los elementos que exige la ley,
   pero no lo redactó un abogado. Conviene que alguien lo valide antes de
   publicar.
---

### P0-06 · Confirmar cómo sirve las rutas el hosting — `S` — ⬜

**Esta tarea decide si P0-04 sirve de algo o no.**

El prerender genera un archivo por ruta:

```
dist/apps/web/index.html
dist/apps/web/calzado/index.html
dist/apps/web/nosotros/index.html
…
```

Para que funcione, el servidor tiene que responder a `/nosotros` con
`nosotros/index.html`. La mayoría de hostings estáticos lo hacen solos
(nginx `try_files $uri $uri/index.html`, Netlify, Vercel, Cloudflare Pages).

⚠️ **Pero si el hosting tiene una regla de reescritura de SPA** — todo a
`/index.html` — entonces cada ruta devuelve el HTML del **home**, y:

- WhatsApp y LinkedIn muestran el título del home en todos los enlaces;
- Google indexa 6 URLs con el mismo `<title>` y el mismo `canonical`;
- el navegador reporta un error de hidratación de React en cada ruta interna.

Verificado el 2026-09-01: `vite preview` (`npm run start`) **hace exactamente
esa reescritura**, así que `/nosotros` devuelve el home y `/nosotros/` devuelve
la página correcta. Es un artefacto de la herramienta de previsualización, pero
sirve de aviso de lo que pasaría en producción con esa configuración.

**Qué hacer:**

1. Averiguar cómo sirve Hostinger las rutas de este proyecto.
2. Si hace fallback a `/index.html`, cambiar la regla por una que pruebe primero
   el archivo y el directorio.
3. Comprobarlo en producción pegando `https://<dominio>/nosotros` en el
   validador de enlaces de LinkedIn o en un chat de WhatsApp: debe salir
   "Nosotros — 4D Cuarta Dimensión ES S.A.S.", no el título del home.

---

# P1 · Alinean el sitio con su objetivo

---

### P1-01 · Reescritura editorial: informar en vez de vender — `L` — ✅ *(2026-09-01)*

El sitio dejó de estar escrito como una landing de captación.

**Llamados a la acción.** De **9 CTA comerciales** en el cuerpo a **0**. Cada
página conserva exactamente **dos** enlaces a `/contacto`, ambos etiquetados
"Contacto": uno en el navbar y otro en el footer.

| Dónde | Antes | Ahora |
|---|---|---|
| Navbar | "Hablemos ↗" | "Contacto" |
| Home, H1 | "Convertimos ideas en productos ganadores" | "Diseñamos y desarrollamos producto: calzado, ropa y dotaciones" |
| Home, hero | "Hablemos de un proyecto" | "Qué hacemos" → ancla a las líneas |
| Home, eyebrow | "PROPUESTA DE VALOR" | "CÓMO TRABAJAMOS" |
| Home, cierre | "¿Cuál será tu próxima dimensión?" + "Iniciar conversación" | "Dónde operamos" — bloque informativo con correo, teléfono y oficina |
| Líneas, hero | "Solicitar cotización" (×3) | eliminado |
| Líneas, cierre | `LineCTA` "Iniciar conversación" (×3) | `LineClosing` — sitúa la línea y enlaza a las otras dos |
| Nosotros | "Trabajemos juntos" | eliminado |
| Contacto, H1 | "Hablemos sobre el reto que quieres convertir…" | "Dónde y cómo encontrarnos" |
| Contacto, campo | "Tu proyecto \*" | "Mensaje \*" |

**Un embudo escondido que no estaba en la auditoría.** Cada `ProjectCard` del
portafolio enlazaba a `/contacto`: cuatro CTA disfrazados de casos de éxito solo
en la home. Ahora cada tarjeta lleva a **su línea de negocio**, que es
información sobre lo que hace la empresa.

**Voz.** Se pasó de 2ª persona vendiendo a 1ª persona describiendo en la
metodología, la sección de diferenciación, las capacidades de Dotaciones y Ropa,
los compromisos de Nosotros y la capacidad internacional. Ejemplo:

- ❌ "Entendemos **tu** mercado, **tu** cliente y el reto que **quieres** convertir en oportunidad."
- ✅ "Partimos del mercado y del usuario final para definir qué producto tiene sentido desarrollar."

**Verificado sobre el HTML del build:** 0 apariciones de "Hablemos", "Cotiza",
"cotización", "Trabajemos", "Iniciar conversación" y "Solicitar".

⚠️ **No se tocó ni un dato factual.** Cifras, proyectos, clientes y datos de
contacto son exactamente los mismos de [`02-empresa.md`](02-empresa.md).

📌 **Desviación deliberada de lo acordado en `05-contenido-y-seo.md`:** ese
documento pedía dejar el formulario en "nombre, correo, mensaje y ya". Se
conservaron los campos *Empresa* (opcional) y *Línea de interés* porque son
útiles para clasificar la solicitud y no empujan a nada. Lo que se corrigió fue
el tono de las etiquetas. Si el propietario prefiere el formulario mínimo, es un
cambio de cinco minutos.
---

### P1-02 · `ScrollToTop` y los enlaces con ancla — `S` — ⚠️ *(sin confirmar)*

La documentación daba por roto este comportamiento, pero al revisar el código,
[`ScrollToTop.jsx`](../apps/web/src/components/ScrollToTop.jsx) **sí contempla el
hash**: si `location.hash` tiene valor, busca el elemento y hace `scrollIntoView`
en lugar de saltar al tope.

Al probarlo el 2026-09-01 el scroll no ocurrió, pero **la causa no parece ser el
sitio**: en ese navegador `scrollIntoView({ behavior: 'smooth' })` no hace nada,
mientras que `'instant'` sí funciona. Es una limitación del entorno de prueba.

**Pendiente:** abrir el sitio en un navegador real y comprobar que "Proyectos" y
"Metodología", en el navbar y en el footer, llevan a su sección. Si funciona,
cerrar como ❌ descartada; si no, reabrir con el diagnóstico real.

---

### P1-03 · Correo y teléfono no son clicables — `S` — ✅ *(2026-09-01)*

- [`ContactoPage.jsx`](../apps/web/src/pages/ContactoPage.jsx): el correo y el
  teléfono del panel lateral son ahora `mailto:` y `tel:`.
- [`Footer.jsx`](../apps/web/src/components/Footer.jsx): dejaron de ser enlaces
  internos a `/contacto`. El correo y el teléfono son enlaces reales; la ciudad
  es texto, porque no es un enlace a ninguna parte.
- El nuevo cierre de la home repite los tres datos, también enlazados.
---

### P1-04 · Migrar `react-helmet` → `react-helmet-async` — `S` — ✅ *(2026-09-01)*

Hecho como parte de P0-04, del que era requisito: `react-helmet` no recolecta
etiquetas en un render de servidor.

- Las 6 páginas importan ahora `react-helmet-async`.
- `main.jsx` y `entry-server.jsx` envuelven la app en `HelmetProvider`.
- En el servidor, `helmetContext.helmet` es lo que `prerender.js` inyecta.

La dependencia vieja `react-helmet` sigue declarada en `package.json` y ya no se
usa: quitarla junto con el resto del código muerto en **P2-06**.

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

Ahora es fácil: el prerender ya inyecta lo que declare `<Helmet>`, así que basta
con añadir el `<script type="application/ld+json">` en la home.

⛔ Bloqueado en parte: faltan NIT, dirección exacta, año de fundación y perfiles
de redes sociales.

---

# P2 · Solidez, rendimiento y pulido

---

### P2-01 · Carga de la fuente Manrope — `S` — ⬜

Se carga con `@import` dentro del CSS, lo que **bloquea el render**. Debe ser un
`<link>` en el HTML — el `preconnect` ya está puesto desde P0-03 — y bajar de 7
pesos a 3 (400 / 600 / 800).

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

Es el elemento **LCP** de la home y entra desde `opacity: 0` con `Reveal`.

El prerender de P0-04 mejoró esto a medias: el HTML ya llega con el contenido,
así que un rastreador lo ve. Pero para una persona el texto sigue empezando
invisible hasta que framer-motion lo anima.

El hero (eyebrow, H1, párrafo y botones) debería renderizarse visible; anima solo
lo que está por debajo del pliegue.

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
área privada ni la habrá. Y desde P1-04, la dependencia `react-helmet`.

`knip.json` en la raíz ya está configurado para detectarlo.

---

### P2-07 · La barra de progreso de Metodología calcula mal — `S` — ⬜

`HomePage.jsx` usa `useScroll({ target: methodRef })`, pero la sección de destino
**no tiene `position: relative`**. framer-motion emite el aviso *"Please ensure
that the container has a non-static position…"* y los offsets salen mal.

⚠️ El aviso no se ve en consola porque
[`vite.config.js`](../apps/web/vite.config.js) hace `console.warn = () => {}`.
Quedó registrado en `vault/temp/SESSION_JOURNAL.md`.

**Solución:** añadir `relative` a la clase de la sección.

---

### P2-08 · Columna "Proyectos" del footer — `S` — ⬜

Los 4 enlaces de esa columna apuntan **todos al mismo ancla** `/#proyectos`. Es
relleno visual: o llevan a algo distinto, o la columna sobra.

📁 [`Footer.jsx`](../apps/web/src/components/Footer.jsx)

---

### P2-09 · Code-splitting por ruta — `M` — ⬜

El build sale en **un solo bundle de 411 KB JS (130 KB gzip)** + 80 KB CSS.
`React.lazy` por ruta reduce el coste de la primera carga.

⚠️ Cuidado al hacerlo: el prerender renderiza todas las rutas en Node, así que
cualquier `lazy` necesita su `Suspense` con un fallback que también funcione en
servidor.

---

### P2-10 · Fotos reales de operación y equipo — `L` — ⛔

Las imágenes actuales son renders genéricos. Para un sitio cuyo objetivo es *"que
nos conozcan"*, fotos reales de la operación, la oficina y el equipo valen diez
veces más que un render.

⛔ Bloqueado: depende de material que debe aportar el propietario.

---

### P2-11 · Scripts de Horizons inyectados en producción — `S` — ⬜

`vite.config.js` inyecta con `addTransformIndexHtml` varios scripts del editor
visual de Horizons (captura de errores, sobreescritura de `fetch`, silenciado de
`console.warn`) **también en el build de producción**: el `index.html` pesa
8.7 KB en vez de ~1 KB, y todo visitante los descarga.

⚠️ Tocar esto roza el **ADR-006** (no tocar la integración con Horizons).
Investigar primero si se pueden limitar a desarrollo sin romper el builder.

---

# Bloqueados por falta de información

Estas tareas **no se pueden cerrar** hasta que el propietario aporte los datos
listados en [`02-empresa.md`](02-empresa.md):

| Dato que falta | Bloquea |
|---|---|
| Logo en vectorial (SVG) | P0-02 |
| Dominio definitivo confirmado | P0-02, P0-06 |
| NIT, dirección exacta, responsable de datos | P0-05, P1-06 |
| Año de fundación | P1-06 |
| Perfiles de redes sociales | P1-06 |
| Fotos reales y equipo | P2-10 |

---

# Orden recomendado de ejecución

1. ~~**P0-00** — Git primero.~~ ✅
2. ~~**P0-01** — Sin un build que funcione no se puede desplegar nada.~~ ✅
3. ~~**P0-03 → P0-02 → P0-04** — El bloque de visibilidad.~~ ✅ / 🟡
4. ~~**P1-01** — Reescritura editorial.~~ ✅
5. ~~**P0-05** — Consentimiento en el formulario.~~ 🟡 *(falta la página de política)*
6. **P0-06** — Confirmar el hosting. Sin esto, P0-04 puede no servir de nada.
7. Cuando llegue el material del propietario: cerrar **P0-02** (logo y
   `og-image`), **P0-05** (página de política) y **P1-06** (JSON-LD).
8. Luego P2: empezar por **P2-04** (accesibilidad) y **P2-07** (bug de la barra
   de progreso), que son de minutos.
