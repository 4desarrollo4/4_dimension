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
| **P0** | 4 | 3 | 1 | 8 |
| **P1** | 4 | 1 | 1 | 6 |
| **P2** | 6 | 0 | 6 | 12 |

**Siguiente tarea recomendada:** **P0-06** — confirmar cómo sirve las rutas el
hosting. Es lo único de P0 que no depende de datos del propietario, y de ello
depende que el prerender sirva de algo.

Casi todo lo demás está ⛔ **esperando material del propietario**: logo en
vectorial y dirección física exacta.

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
| `og-image.jpg` (1200×630) | ⛔ solo falta el **logo oficial**; el dominio ya está confirmado |

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

1. ⛔ **Página `/politica-de-datos`** con la política completa. Al crearla,
   registrarla también en [`src/lib/site.js`](../apps/web/src/lib/site.js) y
   enlazarla desde el footer.

   **Qué exige realmente la ley** *(corregido el 2026-09-02)*. El
   **Decreto 1074 de 2015** pide, del responsable: razón social, domicilio,
   dirección, correo electrónico y teléfono.

   | Dato | ¿Obligatorio? | ¿Lo tenemos? |
   |---|---|---|
   | Razón social | ✅ | ✅ 4D Cuarta Dimensión ES S.A.S. |
   | Correo y teléfono | ✅ | ✅ |
   | Domicilio (ciudad) | ✅ | ✅ Bogotá D.C. |
   | **Dirección exacta** | ✅ | ⛔ **lo único que bloquea** |
   | **NIT** | ❌ no lo exige el decreto | ⬜ conveniente para el JSON-LD |

   **Responsable del Tratamiento = la sociedad**, no una persona natural.
   Aparte hay que designar un *área o persona de atención al titular*: basta
   con "Área Administrativa — info@4dimensionsas.com". No hace falta el nombre
   del propietario.

   ⚠️ Es la lectura de lo que enumera el decreto, no un dictamen legal. El
   texto final debería validarlo un abogado.
2. ⬜ **Guardar la marca de tiempo del consentimiento** en `contact_requests`.
   Requiere una migración de PocketBase que **no se puede probar en Windows**
   (el binario es un ejecutable de Linux), así que no se escribió a ciegas.
3. ⚠️ **Revisión legal.** El texto actual recoge los elementos que exige la ley,
   pero no lo redactó un abogado. Conviene que alguien lo valide antes de
   publicar.
---

### P0-07 · Verificar el backend del formulario — `M` — ✅ *(2026-09-02)*

Verificado de extremo a extremo con el backend corriendo en local.

| Comprobación | Estado |
|---|---|
| Las 10 migraciones aplican | ✅ |
| Esquema con `phone`, `consent`, `consent_at` | ✅ |
| `consent` obligatorio a nivel de base | ✅ |
| Formulario → registro guardado | ✅ |
| Hook se dispara | ✅ |
| **Correo entregado** | ✅ **sin errores por smtp.hostinger.com:465** |

**Tres bugs encontrados y corregidos por el camino:**

1. 🐞 **Contexto aislado de los hooks.** `ReferenceError: LINEAS is not defined`.
   Ver [`03-arquitectura.md`](03-arquitectura.md) → trampa 2.
2. 🐞 **El mailer de Hostinger se tragaba el envío.**
   `unsupported protocol scheme ""`. Se resuelve activando el SMTP propio.
3. 🐞 **Servidor SMTP equivocado.** Estaba apuntando a `smtp.gmail.com` y
   devolvía `535 Username and Password not accepted`. El buzón está en
   **Hostinger**: la contraseña era correcta desde el principio, pero se
   autenticaba contra un servidor que no conoce esa cuenta.

📌 **Se envía un solo correo:** el acuse de recibo al cliente. El aviso interno
al equipo se quitó el 2026-09-02 por decisión del propietario.

**Queda por comprobar:** el límite de 5 envíos por hora y que las copias
automáticas se generen.
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

### P1-05 · El formulario de contacto no se puede probar en local — `S` — ✅ *(2026-09-02)*

Dos piezas:

1. **Proxy en Vite.** `/hcgi/platform` → `http://127.0.0.1:8090`, quitando el
   prefijo. Antes la petición caía en el fallback del SPA y el formulario
   fallaba siempre.
2. **Binario de PocketBase para Windows.** Descargado el oficial de la misma
   versión (0.39.8), checksum verificado contra el del repositorio de
   PocketBase, dejado como `pocketbase.exe` e ignorado por git.

⚠️ Se usa `pb_data_local/` como base, **no** `pb_data/`: la real la creó el
binario de Linux y puede tener una clave de cifrado que no tenemos.

**Verificado el 2026-09-02:** formulario rellenado en el navegador → registro
guardado con teléfono, consentimiento y marca de tiempo → hook de aviso
disparado.
---

### P1-06 · JSON-LD `Organization` en la home — `M` — 🟡 *(parcial, 2026-09-02)*

**Hecho.** Las 6 rutas emiten un grafo JSON-LD válido, verificado sobre el HTML
del build:

| Ruta | Contenido |
|---|---|
| `/` | `Organization` + `WebSite` |
| Las otras 5 | `Organization` + `WebSite` + `BreadcrumbList` |

📁 [`src/components/JsonLd.jsx`](../apps/web/src/components/JsonLd.jsx)

Vive en su propio componente, no dentro del `<Helmet>` de cada página, porque
`tools/generate-llms.js` lee el **primer** `<Helmet>` del archivo con
expresiones regulares y un bloque JSON ahí dentro podría romperlo.

🐞 **Bug encontrado al hacerlo:** `tools/prerender.js` inyectaba `title`, `meta`
y `link` de Helmet, pero **no `script`**. El JSON-LD se generaba y no llegaba
nunca al HTML servido — es decir, Google no lo habría visto jamás. Corregido.

**Falta** (⛔ depende del propietario): `taxID` (NIT), `foundingDate`,
`streetAddress` y `sameAs` con las redes sociales. Los huecos están marcados en
el propio componente.

⚠️ **Regla:** en JSON-LD solo entran datos verificados de
[`02-empresa.md`](02-empresa.md). Un dato inventado aquí no es un adorno: es
una afirmación que Google publica como oficial.
---

# P2 · Solidez, rendimiento y pulido

---

### P2-01 · Carga de la fuente Manrope — `S` — ✅ *(2026-09-01)*

Sale del CSS y entra en el HTML como `<link>`, precedido del `preconnect` que ya
estaba. Además se pasó a la **fuente variable**: un solo archivo cubre los pesos
400–800, en vez de siete peticiones de pesos estáticos.

El `@import` anterior bloqueaba el render y encadenaba dos peticiones: el
navegador tenía que descargar el CSS para descubrir que necesitaba la fuente.
---

### P2-02 · Logo e imágenes alojadas en CDN externo — `M` — ⬜

Los 11 assets de [`data/projects.js`](../apps/web/src/data/projects.js) apuntan a
`images.hostinger.com`; el logo del navbar y del footer, a
`horizons-cdn.hostinger.com`. Una imagen viene de Unsplash.

**Riesgo:** si se desactiva el proyecto en Hostinger, el sitio se queda **sin una
sola imagen y sin logo**. Hay que bajarlos al repositorio — o a un CDN propio — y
servirlos desde el dominio de la empresa.

---

### P2-03 · El H1 del hero no debería animar — `S` — ✅ *(2026-09-01)*

Resultó ser mucho más grave de lo documentado. El problema no era solo el H1:
**`PageTransition` envolvía la página entera y se prerenderizaba con
`opacity: 0`**. El HTML llegaba completo y correcto… e invisible, hasta que el
navegador descargaba y ejecutaba 411 KB de JavaScript.

Medido sobre el HTML del build: **31 elementos con `opacity: 0`**, empezando por
el envoltorio de todo el documento.

**Cómo quedó:**

- `PageTransition` se salta su animación solo en la **primera** carga, con una
  bandera a nivel de módulo. Las transiciones entre rutas siguen intactas.
- El hero de la home y el de las páginas de línea entran con **CSS**
  (`.rise-in`), no con framer-motion: el CSS bloquea el render, así que se ve
  desde el primer pintado.
- El **H1 usa `.rise-solid`**, que solo desplaza y nunca desvanece: es el
  elemento LCP y con `opacity: 0` el navegador no lo cuenta como pintado.
- `index.html` lleva un `<noscript>` que revela todo lo que tenga `data-reveal`.

**Verificado:** de **31 `opacity: 0`** a **0** en el envoltorio y la primera
pantalla. Los 25 que quedan son `Reveal` bajo el pliegue, que es justo su
función.

⚠️ **Trampa:** poner `initial={false}` en el `<AnimatePresence>` de `App.jsx`
parece la solución obvia y **rompe los 25 reveals**, porque los hereda. Probado
y descartado. Ver [`04-diseno.md`](04-diseno.md).
---

### P2-04 · `<main>`, "saltar al contenido" y `:focus-visible` — `S` — ✅ *(2026-09-01)*

- Landmark `<main id="contenido">` en [`App.jsx`](../apps/web/src/App.jsx).
- Enlace **"Saltar al contenido"**, primero en el orden de foco y oculto hasta
  recibirlo.
- Anillo de foco global con `:focus-visible` en el azul de marca. Solo con
  teclado: al hacer clic con el ratón no aparece.
- `scroll-margin-top: 6.5rem` en todo `[id]` — sin eso, cualquier ancla dejaba
  el título tapado por el navbar fijo.

✅ El contraste sigue cumpliendo WCAG AA (18:1 / 7.08:1 / 4.72:1).
---

### P2-05 · Menú móvil: foco, Escape y `aria-expanded` — `S` — ✅ *(2026-09-01)*

[`Navbar.jsx`](../apps/web/src/components/Navbar.jsx) declara ahora
`role="dialog"`, `aria-modal`, `aria-expanded` y `aria-controls`. Al abrirse
bloquea el scroll de fondo, lleva el foco dentro y lo atrapa con Tab y
Shift+Tab; cierra con `Escape` y devuelve el foco al botón que lo abrió.

**Verificado el 2026-09-01:** al pulsar Escape, `aria-expanded` vuelve a
`false` y el scroll del cuerpo se restaura.
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

### P2-07 · La barra de progreso de Metodología calcula mal — `S` — ✅ *(2026-09-01)*

La sección de destino de `useScroll` ya es `position: relative`. framer-motion
deja de emitir el aviso y los offsets se miden contra el contenedor correcto.

Verificado en el navegador: `getComputedStyle(#metodologia).position === 'relative'`.
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

### P2-12 · El build acumulaba archivos viejos en `dist` — `S` — ✅ *(2026-09-01)*

`build:client` no vaciaba su directorio de salida — Vite no lo hace solo cuando
el `outDir` está fuera de la raíz del proyecto. Cada build dejaba el CSS y el JS
anteriores en `dist/apps/web/assets`, con sus hashes viejos.

En local es ruido; al desplegar es peor: se sube basura y, si el hosting sirve
un `index.html` cacheado, puede acabar apuntando a un bundle que ya no existe.

Resuelto con `--emptyOutDir` en `build:client`. Verificado: tras un build
limpio quedan exactamente **dos** archivos en `assets/`.

---

### P2-13 · Desborde horizontal a 768 px — `S` — ✅ *(2026-09-02)*

Auditado el sitio a 360, 768, 1024 y 1440 px en las cuatro páginas. Un solo
fallo real: a **768 px exactos** la página desbordaba (`scrollWidth` 790).

Causa: la rejilla del footer era `md:grid-cols-[1.2fr_repeat(4,1fr)]`, y `md`
en Tailwind empieza justo en 768. Con cinco columnas en 768 px, la columna de
contacto recibía ~120 px y `comercial@cuartadimension.co` no cabe.

Resuelto pasando las cinco columnas a `lg` (1024 px), con dos columnas
intermedias en `sm`, y permitiendo que el correo se parta.

De paso: los enlaces del footer medían **19 px** de alto, por debajo del mínimo
de 24 px que pide la WCAG 2.5.8. Ahora pasan.

**Verificado:** sin desborde en 360/768/1024/1440 en `/`, `/contacto`,
`/calzado` y `/nosotros`.

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
| ~~Dominio definitivo~~ ✅ `4dimensionsas.com`, confirmado el 2026-09-02 | — |
| **Dirección física exacta** — lo único que bloquea la política | P0-05 |
| NIT *(no lo exige el decreto; solo mejora el JSON-LD)* | P1-06 |
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
8. ~~P2: accesibilidad, entradas del hero, fuente, menú móvil y el bug de la
   barra de progreso.~~ ✅
9. P2 que queda: **P2-02** (bajar las imágenes del CDN externo), **P2-06**
   (código muerto), **P2-08** (columna del footer), **P2-09** (code-splitting)
   y **P2-11** (scripts de Horizons en producción).
