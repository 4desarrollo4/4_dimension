# 08 — Bitácora de sesiones

**Última actualización:** 2026-09-01

---

> ## Cómo se usa este archivo
>
> Una entrada por sesión de trabajo, **la más reciente arriba**. Sirve para que
> una sesión nueva sepa en 30 segundos dónde quedó todo.
>
> Plantilla:
>
> ```markdown
> ## AAAA-MM-DD · Título de la sesión
>
> **Qué se hizo**
> - …
>
> **Estado del backlog**
> - P0-XX → ✅ / 🟡 / ⬜
>
> **Decisiones tomadas**
> - ADR-XXX, o "ninguna"
>
> **Dónde quedó / qué sigue**
> - …
> ```
>
> Reglas:
> - **No borres entradas antiguas.** Este archivo es el historial.
> - Si algo se verificó midiéndolo, escribe el dato. Si es una impresión,
>   dilo así. La bitácora solo sirve si es fiable.

---

## 2026-09-02 · Datos reales, logo propio y la imagen para compartir

**Qué aportó el propietario**

| Dato | Valor |
|---|---|
| Dominio | `4dimensionsas.com` |
| Buzón institucional | `info@4dimensionsas.com` — `comercial@` **no existe** |
| Teléfono | `+57 316 577 5539` (el publicado, `+57 (601) 743 4400`, era erróneo) |
| Dirección | `Cra. 34a #27a-22 sur, Bogotá D.C.` |
| Logo | el archivo real |

Todo entró primero en [`02-empresa.md`](02-empresa.md) y después al código,
como manda el [ADR-002](07-decisiones.md).

**El correo, resuelto**

El buzón está en **Hostinger**, no en Google. Ese era el origen del `535`: se
autenticaba contra `smtp.gmail.com`, un servidor que no conoce esa cuenta. La
contraseña siempre estuvo bien.

```
smtp.gmail.com:587  →  smtp.hostinger.com:465 (TLS)
```

Envío real ejecutado, sin errores. Se envía **un solo correo**: el acuse de
recibo al cliente. El aviso interno se quitó por decisión del propietario.

📌 Un envío correcto **no deja rastro en el log**: `logs.minLevel` está en 8 y
solo guarda errores. El silencio es la confirmación.

**Imágenes: P0-02 cerrado**

Se descargó el logo del CDN de Hostinger —con permiso explícito— y se creó
[`tools/generate-images.js`](../apps/web/tools/generate-images.js), que produce
los tres iconos y el `og-image.jpg` de 1200×630 a partir de él. Si el logo
cambia, se vuelve a correr y se regenera todo.

🐞 **El logo es un cuadrado negro opaco, no transparente.** Las esquinas son
`[0,0,0,255]`. Al componer el og-image, ese cuadrado se recortaba contra el
degradado del fondo y se veía el borde. Se resolvió con una máscara circular.

**Y de paso, P2-02 a medias**

El logo dejó de venir del CDN de Hostinger: ahora se sirve desde el propio
dominio. Era un riesgo real — si se desactivaba ese proyecto, el sitio se
quedaba sin logo. Las 11 imágenes de producto siguen en el CDN.

**Verificado sobre el build**

| Comprobación | Resultado |
|---|---|
| `og:image` | `https://4dimensionsas.com/og-image.jpg` ✅ |
| Iconos (32, 192, apple-touch) | ✅ generados y enlazados |
| JSON-LD: logo, teléfono, dirección | ✅ los tres reales |
| Referencias al CDN de Hostinger | **0** ✅ |
| Teléfono viejo en el sitio | **0** ✅ |
| Errores de consola | ninguno |

**Estado del backlog**

P0: 6 ✅, 1 ⬜ (**P0-06**, el hosting). P1: 4 ✅, 1 ⚠️, 1 🟡. P2: 8 ✅, 1 🟡, 4 ⬜.

**Dónde quedó / qué sigue**

El sitio está listo para publicar salvo dos cosas:

1. **P0-06** — confirmar que el hosting resuelve `/nosotros` con
   `nosotros/index.html` y no con el `index.html` de la home.
2. **NIT** — es lo único que falta para la política de tratamiento de datos.

---

## 2026-09-02 · El backend corriendo en local, y dos bugs que habrían llegado a producción

**Por qué esta sesión existe**

El propietario cuestionó mi afirmación de que no se podían enviar correos, y
puso el ejemplo de otro proyecto suyo que envía por Gmail SMTP con contraseña
de aplicación desde desarrollo local, antes de desplegar.

**Tenía razón y yo estaba equivocado.** Mi conclusión ("no hay backend, luego no
hay correo") mezclaba dos cosas distintas: que el binario de Linux no arranca en
Windows —cierto— y que por tanto el correo fuera imposible —falso—. Gmail SMTP
funciona desde cualquier sitio con internet.

**Qué se hizo**

Se comprobó primero el terreno en vez de suponerlo: sin WSL, sin Docker, sin
nodemailer. Pero PocketBase publica binario oficial de Windows.

1. Descargado `pocketbase_0.39.8_windows_amd64`, **checksum verificado** contra
   el oficial (`430f36b5…`). Instalado como `pocketbase.exe`, ignorado por git.
2. Base de datos **aparte** (`pb_data_local/`), para no tocar la real: la creó
   el binario de Linux y puede tener una clave de cifrado que no tenemos.
3. Las 10 migraciones aplican, **incluidas las 4 que se habían escrito a
   ciegas**. El esquema quedó con `phone`, `consent` y `consent_at`, y
   `consent` es obligatorio a nivel de base.
4. **P1-05 cerrado:** proxy `/hcgi/platform` → `:8090` en `vite.config.js`.
5. Nuevo `pb_hooks/smtp-desde-entorno.pb.js`: configura el SMTP desde variables
   de entorno, mismo patrón que el otro proyecto. La contraseña nunca entra al
   repositorio.

**El formulario funcionó de extremo a extremo por primera vez.** Rellenado en el
navegador → "Mensaje recibido." → registro en la base con todos los campos.

**🐞 Bug 1 — Los hooks corren en un contexto aislado**

`ReferenceError: LINEAS is not defined`.

PocketBase ejecuta cada handler en su propio contexto: **las constantes del
nivel superior del archivo no existen dentro de la función**. Todo lo que el
handler necesita tiene que declararse dentro, aunque se repita.

Lo grave es cómo fallaba: el hook se disparaba, reventaba, el error quedaba en
el log interno de PocketBase que nadie mira, y la solicitud se guardaba
igualmente. **Por fuera todo parecía correcto y el correo no salía nunca.**
Documentado en `03-arquitectura.md` como trampa 2.

**🐞 Bug 2 — El mailer de Hostinger se tragaba el envío**

Arreglado el primero, apareció `Post "/api/v2/email": unsupported protocol
scheme ""`. Es `builder-mailer.pb.js` desviando el correo a la API de Hostinger
usando `BUILDER_MAILER_API_URL`, que no está definida.

Ese hook solo interviene **cuando el SMTP propio está desactivado**. Al
activarlo, se aparta.

**La cadena, verificada hasta Gmail**

Con credenciales deliberadamente falsas, para no usar ninguna real:

```
535 5.7.8 Username and Password not accepted ... gsmtp
```

Eso es **el servidor de Gmail respondiendo**: PocketBase conectó a
`smtp.gmail.com:587`, negoció STARTTLS y Gmail rechazó la clave. Todo funciona
salvo la credencial real.

**Estado del backlog**

P0: 4 ✅, 3 🟡, 1 ⬜. P1: 4 ✅, 1 ⚠️, 1 ⛔. P2: 8 ✅, 5 ⬜.

**Decisiones tomadas**

Ninguna nueva.

**Dónde quedó / qué sigue**

Arrancar PocketBase con `SMTP_USERNAME` y `SMTP_PASSWORD` reales y mandar un
mensaje de prueba. Es lo único que separa al formulario de estar terminado.

Falta también comprobar el límite de 5 envíos por hora y las copias automáticas.

**Lección**

Dos veces en esta sesión di por imposible algo que solo era "no está montado".
La diferencia entre las dos afirmaciones es enorme, y la segunda se comprueba
en diez minutos. Comprobar el terreno —¿hay WSL? ¿hay Docker? ¿publica binario
de Windows?— antes de concluir.

---

## 2026-09-02 · Responsive en todas las dimensiones y SEO técnico

**Qué se hizo**

Auditoría de comportamiento responsive en cuatro anchos y cierre del SEO
técnico que quedaba pendiente.

**Responsive: un fallo real, en el punto exacto**

Se auditó `/`, `/contacto`, `/calzado` y `/nosotros` a **360, 768, 1024 y
1440 px**, buscando desborde horizontal, texto por debajo de 12 px y áreas de
toque pequeñas. Un solo fallo, pero real:

A **768 px exactos** la página desbordaba — `scrollWidth` 790 sobre 768. La
rejilla del footer usaba `md:grid-cols-[1.2fr_repeat(4,1fr)]` y `md` en Tailwind
arranca justo en 768: cinco columnas en 768 px dejan ~120 px por columna, y
`comercial@cuartadimension.co` no cabe en 120 px.

Resuelto llevando las cinco columnas a `lg`, con dos columnas intermedias en
`sm`. De paso, los enlaces del footer medían **19 px** de alto, por debajo del
mínimo de 24 px de la WCAG 2.5.8.

**Verificado tras el arreglo:** sin desborde en ninguna combinación de página y
ancho, ningún texto bajo 12 px y ningún enlace del footer bajo 24 px.

*(Nota: el marquee aparece como "desbordado" en cualquier auditoría automática.
Es un ticker dentro de `overflow-hidden`: desborda a propósito. Se excluyó del
análisis para no perseguir un falso positivo.)*

**SEO: cuatro problemas medidos y corregidos**

| Problema | Antes | Ahora |
|---|---|---|
| Títulos demasiado largos | 4 de 6 pasaban de 60 caracteres (el peor, 81) | los 6 entre 40 y 53 |
| Descripción del home | 170 caracteres, Google la cortaba | 133 |
| Datos estructurados | ninguno | `Organization` + `WebSite` en las 6 rutas, más `BreadcrumbList` en las 5 internas |
| `meta robots` | ausente | `index, follow, max-image-preview:large, max-snippet:-1` |

`max-image-preview:large` es lo que permite que Google muestre la imagen grande
en resultados y en Discover; sin esa directiva se queda en miniatura.

**🐞 El bug que casi deja el JSON-LD en nada**

Tras añadir los datos estructurados, el HTML del build seguía sin ellos.
`tools/prerender.js` inyectaba `helmet.title`, `helmet.meta` y `helmet.link`…
pero **no `helmet.script`**. El JSON-LD se generaba correctamente en React y
**nunca llegaba al HTML servido**, que es exactamente lo único que lee Google
cuando no ejecuta JavaScript. Habría pasado por bueno sin comprobarlo sobre el
build.

Corregido, y con un comentario en el sitio para que no vuelva a pasar al añadir
otra categoría de etiqueta.

**Dónde vive el JSON-LD y por qué**

En su propio componente, [`JsonLd.jsx`](../apps/web/src/components/JsonLd.jsx),
no dentro del `<Helmet>` de cada página: `tools/generate-llms.js` lee el primer
`<Helmet>` del archivo con expresiones regulares, y un bloque JSON ahí dentro
podría romper la generación de `llms.txt`.

Solo lleva datos verificados de `02-empresa.md`. Faltan NIT, dirección exacta,
año de fundación y redes: los huecos están marcados en el componente. **Un dato
inventado en JSON-LD no es un adorno: es una afirmación que Google publica como
oficial.**

**Estado del backlog**

P0: 4 ✅, 3 🟡⚠️, 1 ⬜. P1: 3 ✅, 1 🟡, 1 ⚠️, 1 ⬜. P2: 8 ✅, 5 ⬜.

**Decisiones tomadas**

Ninguna nueva.

**Dónde quedó / qué sigue**

Sin cambios de contenido factual. Sigue pendiente **P0-06** (hosting),
**P0-07** (verificar el backend del formulario al desplegar) y el material del
propietario: logo vectorial, dominio, NIT y dirección.

---

## 2026-09-01 · Rediseño de composición

**Por qué**

Tras la sesión de pulido, el propietario dijo: *"no cambiaste nada de la parte
visual, todo sigue igual"*. **Tenía razón.** Lo hecho hasta ahí —render sin
esperar al JavaScript, accesibilidad, tiempos de motion— era ingeniería
invisible. Lo visible se limitaba a textos y a quitar botones.

Me había atenido a la regla de `04-diseno.md`: *"No lo rediseñes."* Esa regla la
escribió una sesión anterior; la decisión del propietario manda sobre ella. Se
preguntó explícitamente el alcance y eligió **rediseño de composición** — más
que pulir, menos que cambiar el lenguaje visual.

**El diagnóstico**

- Las 9 secciones de la home eran idénticas: `border-t` + `py-28` + eyebrow + H2.
  Nada rompía el patrón en 7.600 px de scroll.
- Todo en el mismo plano: sin sombras (decisión de marca) y un solo degradado en
  todo el sitio. Las imágenes eran rectángulos con borde de 1px: parecían
  pegadas.
- **Las cifras estaban desaprovechadas.** `+120K`, `12.000` y `98%` son el dato
  más creíble del sitio y vivían en tres cajitas a `text-4xl`.
- Tarjetas de proyecto planas y rejilla 2×2 previsible.

**Qué se hizo**

| Antes | Ahora |
|---|---|
| Cifras en 3 cajitas a `text-4xl`, dentro de otra sección | **Banda propia justo tras el hero**, a `text-6xl/7xl/8xl` |
| 9 secciones con el mismo fondo y el mismo alto | Fondos alternos, alturas distintas y un protagonista por sección |
| Índice de línea como etiqueta pequeña | **Marca de agua de 192 px** tras el título |
| Imagen con borde de 1px | `.media`: degradado hacia el fondo, tinte azul al pasar el cursor y zoom |
| Rejilla de proyectos 2×2 | **Asimétrica**: el primer caso ocupa el doble y va apaisado |
| Sin profundidad | Resplandores radiales de marca anclados por sección |
| Numeración de metodología a `text-sm` | Numerales en contorno a `text-5xl/6xl` |
| — | Barra de progreso de lectura y botón secundario con barrido |

**Petición explícita del propietario:** en el navbar, **"Proyectos" va primero**.
Hecho.

**Piezas nuevas y reutilizables**

`.media`, `.glow` (+ `-tr` / `-bl` / `-c`), `.watermark`, `.stat-number`,
`.sweep` y `.read-progress`, todas en `index.css` y documentadas en
[`04-diseno.md`](04-diseno.md). Toda sección nueva debe usarlas en vez de
inventar su propio tratamiento.

**Verificado**

| Comprobación | Resultado |
|---|---|
| Contraste texto principal sobre fondos alternos | **17.4:1** ✅ |
| Contraste texto secundario | **6.8:1** ✅ |
| Contraste azul primario | **4.53:1** ✅ AA, con poco margen |
| Desborde horizontal a 375 px | ninguno |
| Errores de consola | ninguno |
| `opacity: 0` fuera de los `data-reveal` | ninguno — el prerender sigue visible |
| Orden del navbar | Proyectos · Calzado · Ropa · Dotaciones · Nosotros · Contacto |

**Estado del backlog**

Sin cambios: esto no era una tarea del backlog, sino una petición directa.

**Decisiones tomadas**

- **ADR-010** — Se rehace la composición, no el lenguaje visual. Incluye la
  tabla de qué se conserva y qué se rehace, y deja constancia de que la regla
  *"no lo rediseñes"* de `04-diseno.md` queda anulada por decisión del
  propietario.

**Dónde quedó / qué sigue**

**No cambió ni un dato ni una palabra de contenido.** Siguen intactas las reglas
del ADR-001 (informar, no vender), ADR-002 (fuente de verdad) y ADR-009 (dos
enlaces de contacto por página).

Sigue pendiente **P0-06** (hosting) y el material del propietario.

⚠️ **Nota de verificación:** el panel de previsualización no consiguió
renderizar capturas de las secciones bajo el pliegue —agotaba el tiempo de
espera—, así que la composición se verificó por DOM: posiciones, tamaños,
clases y contraste medidos en vivo. Conviene que el propietario le eche un ojo
en un navegador real.

---

## 2026-09-01 · Pulido de frontend y motion

**Qué se hizo**

Pasada de calidad sobre el frontend, sin rediseñar nada — `04-diseno.md` dice
que el diseño visual es lo más sólido del proyecto y sigue siéndolo. Lo que se
tocó es cómo **entra**, cómo **responde** y cómo se **navega**.

**El hallazgo: la página entera se servía invisible**

Buscando qué pulir, apareció que el HTML prerenderizado traía **31 elementos con
`opacity: 0`**, y el primero envolvía el documento completo: `PageTransition`
arranca en `opacity: 0`, y ese estado también se renderiza en el servidor.

Es decir: desde P0-04 el HTML llegaba completo y correcto para los rastreadores,
pero **una persona veía una pantalla en negro hasta que se descargaban y
ejecutaban 411 KB de JavaScript**. El prerender servía para el SEO y no para el
visitante.

| Comprobación | Antes | Ahora |
|---|---|---|
| `opacity: 0` en el HTML servido | **31** | **0** en el envoltorio y la primera pantalla |
| Qué se ve sin ejecutar JavaScript | nada | el sitio completo |
| Qué depende de JS en el hero | todo | nada |

**Cómo se resolvió**

- `PageTransition` se salta su animación **solo en la primera carga**, con una
  bandera a nivel de módulo. Las transiciones entre rutas siguen igual.
- El hero de la home y el de las páginas de línea entran con **CSS**
  (`.rise-in`), no con framer-motion.
- El **H1 usa `.rise-solid`**: solo se desplaza, nunca se desvanece. Es el
  elemento LCP y con `opacity: 0` el navegador no lo cuenta como pintado.
- `<noscript>` en `index.html` que revela todo lo que tenga `data-reveal`.

⚠️ **Callejón sin salida documentado.** La solución obvia —`initial={false}` en
el `<AnimatePresence>` de `App.jsx`— se probó y **rompe los 25 reveals de
scroll**, porque los hereda. Se midió: los 25 pasaban a `opacity: 1` de entrada.
Quedó escrito en `04-diseno.md` para que nadie lo repita.

**Accesibilidad (P2-04, P2-05)**

Landmark `<main>`, enlace "Saltar al contenido", anillo de foco global con
`:focus-visible` en el azul de marca, y `scroll-margin-top` en todo `[id]` para
que las anclas no queden tapadas por el navbar fijo.

El menú móvil pasó de ser un div a un diálogo de verdad: `role="dialog"`,
`aria-modal`, `aria-expanded`, `aria-controls`, foco atrapado, scroll de fondo
bloqueado, cierre con `Escape` y foco devuelto al botón. Probado: al pulsar
Escape, `aria-expanded` vuelve a `false` y el scroll se restaura.

**Motion y detalle**

- Transición de ruta más corta: 0.28 s de entrada y 0.16 s de salida. Con
  `mode="wait"` el usuario espera las dos, así que cada 100 ms cuentan doble.
- Subrayado animado en el navbar para el enlace activo y en hover.
- Desvanecido en los bordes del marquee, que antes cortaba en seco.
- `text-wrap: balance` en H1 y H2, `pretty` en párrafos: se acabaron las
  líneas sueltas con una palabra.
- Fuente Manrope **variable** por `<link>` en vez de `@import` (**P2-01**): un
  archivo en lugar de siete, y deja de bloquear el render.
- **P2-07** cerrado: la sección de Metodología ya es `position: relative` y la
  barra de progreso mide bien.

**P2-12 · Un problema de build que apareció de paso**

`build:client` no vaciaba `dist`: Vite no lo hace solo cuando el `outDir` está
fuera de la raíz. Cada build dejaba el CSS y el JS anteriores. Al comprobar las
reglas compiladas aparecieron **tres** hojas de estilo donde debía haber una.
Resuelto con `--emptyOutDir`.

**Nota metodológica**

Tres veces en esta sesión el panel de previsualización dio falsos positivos: no
dispara `IntersectionObserver`, congela las animaciones y no aplica
`scrollIntoView({ behavior: 'smooth' })`. Además, la consola **retiene errores de
cargas anteriores de la misma pestaña**: los errores de hidratación que
aparecieron eran de un bundle viejo, con un hash que ya no existía. Cada
verificación se rehízo en pestaña limpia o se comprobó por diff.

**Estado del backlog**

P0: 4 ✅, 2 🟡, 1 ⬜. P1: 3 ✅, 1 ⚠️, 2 ⬜. P2: 6 ✅, 6 ⬜.

**Decisiones tomadas**

Ninguna nueva. `04-diseno.md` gana una sección — *Entradas: cuándo CSS y cuándo
framer-motion* — que es ahora la regla de motion del proyecto.

**Dónde quedó / qué sigue**

Sin cambios de contenido: ni una palabra ni un dato. Sigue pendiente **P0-06**
(hosting) y el material del propietario.

---

## 2026-09-01 · P1-01: el sitio deja de vender

**Qué se hizo**

La reescritura editorial completa (**P1-01**), el consentimiento del formulario
(**P0-05**, parcial) y los datos de contacto clicables (**P1-03**).

**De 9 llamados comerciales a 0**

| Dónde | Antes | Ahora |
|---|---|---|
| Navbar | "Hablemos ↗" | "Contacto" |
| Home, H1 | "Convertimos ideas en productos ganadores" | "Diseñamos y desarrollamos producto: calzado, ropa y dotaciones" |
| Home, hero | "Hablemos de un proyecto" | "Qué hacemos" → ancla a las líneas |
| Home, cierre | "¿Cuál será tu próxima dimensión?" + botón | "Dónde operamos" — bloque informativo con los datos de contacto |
| Líneas ×3 | "Solicitar cotización" + "Iniciar conversación" | `LineClosing`: sitúa la línea y enlaza a las otras dos |
| Nosotros | "Trabajemos juntos" | eliminado |
| Contacto | "Hablemos sobre el reto que quieres…" | "Dónde y cómo encontrarnos" |

**El hallazgo de la sesión: cuatro CTA escondidos**

Al contar los enlaces sobre el HTML del build apareció que **cada
`ProjectCard` enlazaba a `/contacto`**. Los cuatro proyectos del portafolio no
eran casos de éxito: eran botones de contacto disfrazados, y solo en la home
sumaban cuatro llamados que ninguna auditoría de texto habría detectado, porque
el problema no estaba en lo que decían sino en **a dónde llevaban**.

Ahora cada tarjeta lleva a su línea de negocio. De ahí salió el **ADR-009**, que
fija la regla estructural: dos enlaces a `/contacto` por página, navbar y
footer, y ninguno más en el cuerpo.

**Verificado sobre el HTML del build**

| Comprobación | Antes | Ahora |
|---|---|---|
| Enlaces a `/contacto` en la home | 6 | **2** |
| "Hablemos" / "Cotiza" / "cotización" | presentes | **0** |
| "Trabajemos" / "Iniciar conversación" / "Solicitar" | presentes | **0** |
| Tarjetas de proyecto que apuntan al formulario | 4 | **0** |
| `mailto:` y `tel:` reales | 0 | en home, contacto y footer |

**Voz**

De 2ª persona vendiendo a 1ª persona describiendo, en la metodología, la
sección de diferenciación, las capacidades de Ropa y Dotaciones, los compromisos
de Nosotros y la capacidad internacional.

**P0-05 · Consentimiento (parcial)**

Casilla no premarcada y obligatoria, texto de finalidad nombrando al responsable
y aviso de derechos con mención de la Ley 1581 de 2012. Probado: con todos los
campos válidos pero sin marcar la casilla, el envío se bloquea.

Falta la página `/politica-de-datos` (necesita NIT y dirección) y guardar la
marca de tiempo del consentimiento, que requiere una migración de PocketBase
**que no se puede probar en Windows** — no se escribió a ciegas.

**Desviación deliberada**

`05-contenido-y-seo.md` pedía dejar el formulario en "nombre, correo, mensaje y
ya". Se conservaron *Empresa* (opcional) y *Línea de interés*: son útiles para
clasificar la solicitud y no empujan a nada. Lo que se corrigió fue el tono de
las etiquetas. Queda anotado por si el propietario prefiere el formulario
mínimo.

**Estado del backlog**

P0: 4 ✅, 2 🟡, 1 ⬜. P1: 3 ✅, 1 ⚠️, 2 ⬜. P2: 11 ⬜.

**Decisiones tomadas**

- **ADR-009** — Dos enlaces de contacto por página, y ninguno más. Incluye el
  comando para comprobarlo sobre el build.

**Dónde quedó / qué sigue**

**No se tocó ni un dato factual.** Cifras, proyectos, clientes y datos de
contacto siguen siendo exactamente los de `02-empresa.md`.

Lo único de P0 que no depende del propietario es **P0-06**: confirmar que el
hosting resuelve `/nosotros` con `nosotros/index.html`.

⛔ Todo lo demás espera material: **logo en vectorial** (favicon y
`og-image.jpg`), **dominio definitivo**, **NIT y dirección** (política de datos
y JSON-LD).

---

## 2026-09-01 · Bloque P0: Git, build y visibilidad

**Qué se hizo**

Se ejecutó el bloque P0 del backlog. **Cinco tareas cerradas, una parcial, una
nueva descubierta.**

| Tarea | Resultado |
|---|---|
| **P0-00** Git | ✅ Repositorio inicializado, 189 archivos, `.gitignore` + `.gitattributes` |
| **P0-01** Build roto | ✅ Arreglado — eran **dos** bugs, no uno |
| **P0-02** `public/` | 🟡 favicon provisional, `robots.txt` y `sitemap.xml` generados; falta `og-image.jpg` |
| **P0-03** `index.html` | ✅ title, description, favicon, theme-color, preconnect |
| **P0-04** Prerender | ✅ Las 6 rutas, verificado en el navegador |
| **P1-04** `react-helmet-async` | ✅ Requisito de P0-04 |
| **P0-06** Hosting | 🆕 **Tarea nueva** — ver abajo |

**El segundo bug del build, que nadie había visto**

`npm run build` no compilaba por el `|| true` que `cmd.exe` no entiende. Eso ya
estaba documentado. Al arreglarlo apareció el otro: `tools/generate-llms.js`
comparaba la URL de su propio módulo contra una ruta construida a mano desde
`process.argv[1]`. En Windows **nunca coinciden**, así que `main()` no se
ejecutaba nunca. Consecuencia: **`llms.txt` no se había generado jamás en esta
máquina**. Ahora sí.

**El prerender (P0-04)**

Implementado con un script propio en vez de una dependencia — ver
[ADR-008](07-decisiones.md). Obligó a mover el `<Router>` fuera de `App.jsx`,
separar `main.jsx` de `entry-server.jsx`, hacer `Seo.jsx` compatible con Node y
centralizar dominio y rutas en `src/lib/site.js`.

Medido sobre el build servido, antes y después:

| Comprobación | Antes | Ahora |
|---|---|---|
| `og:*` por ruta | 0 | **9** |
| `twitter:*` por ruta | 0 | **4** |
| `canonical` | ausente | uno por ruta, correcto |
| `<title>` en el HTML servido | vacío | el de cada página |
| `<h1>` visible sin JavaScript | no | **sí** |
| `robots.txt` / `sitemap.xml` | devolvían HTML del SPA | archivos reales |
| Errores de hidratación | — | **ninguno** |

**P0-06: la tarea nueva, y por qué importa**

Al verificar el build apareció que `/nosotros` devolvía el HTML del **home**,
mientras que `/nosotros/` devolvía el correcto. La causa es que `vite preview`
reescribe todas las rutas a `/index.html`, como un SPA.

Es un artefacto de la herramienta de previsualización — los archivos
prerenderizados son correctos —, **pero es exactamente lo que pasaría en
producción si el hosting está configurado igual**: WhatsApp mostraría el título
del home en todos los enlaces y Google indexaría 6 URLs idénticas. Todo el
trabajo de P0-04 se perdería en silencio.

Quedó como **P0-06**, con la regla de nginx correcta y cómo comprobarlo en
producción. También se documentó en la nueva sección *Despliegue* de
[`03-arquitectura.md`](03-arquitectura.md).

**Corrección a la sesión anterior**

**P1-02** (`ScrollToTop` rompe los enlaces con ancla) estaba mal diagnosticado.
El código **sí** contempla el hash. Al probarlo el scroll no ocurrió, pero la
causa es que en ese navegador `scrollIntoView({ behavior: 'smooth' })` no hace
nada, mientras que `'instant'` sí. Es una limitación del entorno de prueba, no
del sitio. La tarea pasó a ⚠️ *sin confirmar*, pendiente de probarla en un
navegador real.

Del mismo modo, los errores de hidratación de React que aparecieron en consola
no eran del sitio: venían de cargar `/nosotros` con el HTML del home servido por
el fallback de `vite preview`. En una carga limpia la hidratación no da un solo
error.

**Estado del backlog**

P0: 4 ✅, 1 🟡, 2 pendientes. P1: 1 ✅, 1 ⚠️, 4 pendientes. P2: 10 pendientes
(uno nuevo, **P2-11**, sobre los scripts de Horizons inyectados en producción).

**Decisiones tomadas**

- **ADR-004** pasa de 💡 *Propuesta* a ✅ *Aceptada e implementada*.
- **ADR-008** nuevo: cómo se implementó el prerender y qué reglas impone al
  código de aquí en adelante.

**Dónde quedó / qué sigue**

El sitio ya es visible y compartible. **No cambió ni una palabra del contenido**:
todo el trabajo fue de infraestructura.

Siguiente: **P0-06** (confirmar el hosting) y **P0-05** (aviso de privacidad).
Después, **P1-01**, la reescritura editorial, que es lo que falta para que el
sitio deje de sonar a landing de ventas.

⛔ Sigue bloqueado por datos del propietario: logo en vectorial, dominio
definitivo, NIT y dirección.

---

## 2026-09-01 · Auditoría completa y cierre del sistema de documentación

**Qué se hizo**

- Se levantó el sitio en local (`npm run dev --prefix apps/web`, puerto 3000) y
  se creó `.claude/launch.json` para relanzarlo.
- **Auditoría del sitio completo** — técnica, editorial, SEO, accesibilidad y
  cumplimiento legal — verificando cada hallazgo contra el código y contra la
  página corriendo, no de memoria.
- Se crearon los tres documentos que `CLAUDE.md` referenciaba pero que no
  existían: [`06-backlog.md`](06-backlog.md), [`07-decisiones.md`](07-decisiones.md)
  y este archivo, más [`README.md`](README.md) como índice y protocolo.

**Hallazgos verificados en vivo**

| Medición | Resultado |
|---|---|
| Etiquetas `og:*` en la página | **0** |
| Etiquetas `twitter:*` | **0** |
| `<link rel="canonical">` | ausente |
| `/robots.txt` y `/sitemap.xml` | devuelven el HTML del SPA (no existen) |
| `<title>` en `index.html` | vacío |
| Archivos fuera de `ui/` que importan shadcn | **0 de 55 componentes en uso** |
| CTA comerciales en el cuerpo del sitio | **9**, más el navbar en las 6 páginas |
| Contraste texto principal / fondo | **18:1** ✅ |
| Contraste texto secundario / fondo | **7.08:1** ✅ |
| Contraste azul primario / fondo | **4.72:1** ✅ (AA) |
| Bundle de producción | 409 KB JS (130 KB gzip) + 80 KB CSS, sin code-splitting |

**Hallazgos nuevos, que no estaban documentados**

- **P1-03** — Correo y teléfono no son clicables. En el footer son enlaces
  internos a `/contacto` en vez de `mailto:` / `tel:`.
- **P2-02** — Las 11 imágenes y el logo viven en CDN externo de Hostinger. Si se
  desactiva ese proyecto, el sitio se queda sin una sola imagen.
- **P2-04** — No hay landmark `<main>`, ni enlace "saltar al contenido", ni
  estilos `:focus-visible`.
- **P2-06** — Los 55 componentes de `ui/` y ~30 dependencias de Radix están
  100 % sin usar. No inflan el JS (el tree-shaking funciona), pero sí los 80 KB
  de CSS.
- **P2-07** — La barra de progreso de Metodología calcula mal los offsets porque
  la sección destino no es `position: relative`. El aviso de framer-motion
  estaba oculto por el `console.warn = () => {}` de `vite.config.js`; apareció
  en `vault/temp/SESSION_JOURNAL.md`.
- **P2-08** — Los 4 enlaces de la columna "Proyectos" del footer apuntan al
  mismo ancla.

**Nota metodológica.** Durante la revisión, el hero se veía en blanco en las
capturas del panel de previsualización. Se investigó antes de reportarlo: el
elemento quedaba congelado a `opacity: 0.287` — un valor intermedio de la
animación — porque el panel oculto limita `requestAnimationFrame`. **Es un
artefacto de la herramienta, no un bug del sitio.** Lo que sí es real y quedó
como **P2-03**: el H1 del hero, que es el elemento LCP, arranca invisible y
depende de que carguen 409 KB de JS para aparecer.

**Estado del backlog**

Backlog creado desde cero con 22 tareas: 6 en P0, 6 en P1, 10 en P2. Todas ⬜
pendientes. Seis están ⛔ bloqueadas esperando datos del propietario.

**Decisiones tomadas**

- **ADR-004** (prerender en vez de migrar de framework) queda registrada como
  💡 *Propuesta* — pendiente de aprobación del propietario.
- **ADR-007** (la documentación vive en `docs/`) queda ✅ *Aceptada*.
- El resto de ADR formaliza decisiones que ya estaban implícitas en `01`–`05`.

**Confirmación del propietario**

El propietario confirmó en esta sesión que **toda la información publicada en el
sitio y recogida en [`02-empresa.md`](02-empresa.md) es correcta y verdadera**.
Sigue vigente la regla del **ADR-002**: ningún dato factual nuevo entra al sitio
sin pasar antes por ese archivo.

**Dónde quedó / qué sigue**

Nada de código cambió en esta sesión: fue diagnóstico y documentación.
El siguiente paso es **P0-00 (inicializar Git)** — sin historial, cualquier
cambio posterior es irreversible. Después, el bloque de visibilidad
**P0-01 → P0-03 → P0-02 → P0-04**.

---

## 2026-09-01 · Documentación inicial del proyecto (sesión previa)

**Qué se hizo**

- Se escribió `CLAUDE.md` y los documentos [`01-proyecto.md`](01-proyecto.md),
  [`02-empresa.md`](02-empresa.md), [`03-arquitectura.md`](03-arquitectura.md),
  [`04-diseno.md`](04-diseno.md) y [`05-contenido-y-seo.md`](05-contenido-y-seo.md).
- Se validaron con el propietario los datos de empresa, proyectos, cifras y
  contacto recogidos en `02-empresa.md`.
- Se compiló una versión de producción en `dist/apps/web`.
- El proyecto se movió de `C:\Users\…\Downloads\horizons-export-…` a
  `C:\4 dimension`.

**Estado del backlog**

Los documentos ya referenciaban IDs (`P0-00`, `P0-01`, `P0-02`, `P0-04`,
`P0-05`, `P1-02`, `P1-05`, `P2-01`, `P2-02`, `P2-03`) pero el archivo
`06-backlog.md` **no llegó a crearse**. Se creó en la sesión siguiente
respetando esa numeración.

**Dónde quedó / qué sigue**

Diagnóstico documentado, sin cambios de código.

---

## 2026-08-26 · Exportación desde Hostinger Horizons

**Qué se hizo**

- El proyecto se exportó del constructor **Hostinger Horizons** con las 6
  páginas ya construidas y el backend PocketBase incluido.
- Se instalaron las dependencias del monorepo.

**Nota.** No hay bitácora de esta sesión — la entrada se reconstruyó a partir de
las fechas de los archivos y del registro automático de navegación en
`vault/temp/SESSION_JOURNAL.md`, que muestra recorridos por las 6 rutas esa
noche.

**Consecuencias que siguen vivas**

Todo lo que en `03-arquitectura.md` aparece como *"trampa conocida"* viene de
aquí: el `build` roto en Windows, la ausencia de `public/`, el `console.warn`
silenciado, el código muerto del scaffold y el hecho de que el directorio
**no sea un repositorio Git**.
