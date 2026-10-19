# 07 — Bitácora de decisiones (ADR)

**Última actualización:** 2026-09-02

---

> ## Cómo se usa este archivo
>
> Aquí queda **por qué** el proyecto es como es. Si una sesión futura se
> pregunta *"¿por qué no hicieron X?"*, la respuesta debe estar aquí.
>
> - Registra solo decisiones **estructurales**: las que serían caras de
>   revertir, o las que alguien podría deshacer por error si no supiera el
>   motivo. Un cambio de copy o un ajuste de espaciado **no** es un ADR.
> - **Nunca edites un ADR aceptado.** Si cambia la decisión, se añade uno nuevo
>   que lo sustituye y el viejo pasa a estado **Sustituido por ADR-XXX**.
> - Numeración correlativa, sin reutilizar números.

### Estados

| Estado | Significado |
|---|---|
| ✅ **Aceptada** | Vigente. Se respeta. |
| 💡 **Propuesta** | Recomendada, pendiente de que el propietario la apruebe. |
| 🔄 **Sustituida** | Ya no aplica. Apunta al ADR que la reemplaza. |

---

## ADR-001 · El sitio informa, no vende

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El sitio nació de un scaffold de Hostinger Horizons con estructura
y lenguaje de landing comercial: titular de promesa, CTA al cierre de cada
sección, formulario de cotización.

**Decisión.** El objetivo del sitio es **presencia institucional y
reconocimiento de marca**: que el mercado sepa quién es 4D, qué hace y cómo
trabaja. **No** es captar leads, no es un catálogo y no es un e-commerce.

**Consecuencias.**
- Máximo **2 llamados a la acción en toda la home**.
- Voz en **1ª persona describiendo**, nunca en 2ª persona vendiendo.
- La métrica no es la conversión, es la **comprensión**: el visitante debe
  entender qué hace la empresa en menos de 15 segundos.
- Esto obliga a la reescritura editorial de **[P1-01](06-backlog.md)**.

📖 Reglas operativas en [`05-contenido-y-seo.md`](05-contenido-y-seo.md).

---

## ADR-002 · `02-empresa.md` es la única fuente de verdad del contenido factual

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** Las cifras, proyectos y datos de contacto del sitio son reales y
verificables. Un asistente de IA que rellene un hueco con una cifra plausible
crea una afirmación publicitaria insostenible — riesgo bajo la **Ley 1480 de
2011**.

**Decisión.** Todo dato factual del sitio vive en
[`02-empresa.md`](02-empresa.md). El código refleja ese archivo, nunca al revés.

**Consecuencias.**
- Prohibido inventar o estimar clientes, cifras, casos o certificaciones. Si
  falta un dato, **se pregunta al propietario**.
- Cuando llega un dato nuevo: se actualiza `02-empresa.md` **primero**, con
  fecha, y solo después se toca el código.
- La empresa debe conservar el soporte interno de cada cifra publicada.

---

## ADR-003 · Solo modo oscuro, sin conmutador de tema

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada

**Contexto.** El scaffold traía `next-themes` y una estructura `:root` / `.dark`
preparada para dos temas.

**Decisión.** El sitio es **solo oscuro**. `:root` y `.dark` comparten los mismos
valores y no hay conmutador.

**Consecuencias.**
- La identidad visual es oscura, editorial y técnica: es una decisión de marca,
  no una preferencia de usuario.
- Un modo claro exigiría rediseñar contraste, `--border` y `.text-outline`.
- El contraste actual cumple **WCAG AA** con holgura (18:1 / 7.08:1 / 4.72:1,
  medido 2026-09-01). Cualquier cambio de tokens debe volver a medirse.

📖 [`04-diseno.md`](04-diseno.md)

---

## ADR-004 · Prerender en tiempo de build, en vez de migrar de framework

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada e implementada el 2026-09-01

**Contexto.** El sitio es un SPA puro. Los rastreadores de WhatsApp, LinkedIn,
Facebook, X y Slack no ejecutan JavaScript, así que ven el `index.html` crudo con
el `<title>` vacío. Compartir un enlace no muestra ni título ni imagen — lo que
anula el objetivo del **ADR-001**.

La solución evidente sería migrar a Next.js o Astro con SSR.

**Decisión.** **No migrar.** Prerenderizar las 6 rutas en tiempo de build.
(Se evaluaron `vite-react-ssg` y `react-snap`; se acabó usando un script propio
— ver [ADR-008](#adr-008--cómo-se-implementó-el-prerender).)

**Razones.**
- Son 6 rutas estáticas sin contenido dinámico: SSR es desproporcionado.
- Una migración tira a la basura el sistema de diseño, que es lo más sólido que
  tiene el proyecto.
- El prerender resuelve el 100 % del problema de compartibilidad e indexación.

**Consecuencias.**
- Requiere migrar `react-helmet` → `react-helmet-async` (**P1-04**).
- Cada ruta nueva debe añadirse a la lista de prerender **y** al `sitemap.xml`.
- Si algún día el sitio necesita contenido dinámico real (blog, catálogo), este
  ADR se revisa.

📌 Implementada en **[P0-04](06-backlog.md)**. El detalle técnico y las reglas
que impone están en el **[ADR-008](#adr-008--cómo-se-implementó-el-prerender)**.

---

## ADR-005 · Los clientes se nombran por descriptor genérico

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** Los cuatro proyectos del portafolio son reales, con clientes
reales.

**Decisión.** En el sitio, el cliente se identifica por **descriptor genérico**
("Marca deportiva internacional", "Operador logístico regional"), nunca por
marca.

**Consecuencias.**
- Nombrar a un cliente real exige **autorización escrita** de esa empresa.
- Los resultados publicados (+120.000 pares, 12.000 dotaciones, 3.500
  colaboradores) sí son reales y deben poder sustentarse.

📁 [`apps/web/src/data/projects.js`](../apps/web/src/data/projects.js)

---

## ADR-006 · No se toca `apps/web/plugins/`

**Fecha:** 2026-09-01 · **Estado:** 🔄 Sustituida por **ADR-011** el 2026-09-02

**Contexto.** El proyecto viene de Hostinger Horizons y arrastra cuatro plugins
de Vite propios del editor visual: `visual-editor`, `session-journal`,
`site-pages` y `pocketbase-auth`.

**Decisión.** No se modifican. Solo cargan en desarrollo.

**Consecuencias.**
- Modificarlos puede romper la integración con el builder de Horizons.
- Efecto colateral conocido y aceptado: `vite.config.js` silencia
  `console.warn` globalmente. Si depuras avisos y no ves nada, es por esto —
  ver **P2-07**, un bug real que quedó oculto durante meses por esa línea.

---

## ADR-007 · La documentación vive en `docs/` y se actualiza al cerrar sesión

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada

**Contexto.** El proyecto se trabaja en sesiones de chat sin memoria entre una y
otra. Sin un estado escrito, cada sesión nueva vuelve a auditar el sitio desde
cero, repite diagnósticos y arriesga deshacer decisiones tomadas.

**Decisión.** El estado del proyecto vive en `docs/`. `CLAUDE.md` es la puerta de
entrada y se carga automáticamente en cada sesión.

**Consecuencias.**
- Antes de tocar código hay que leer al menos [`02-empresa.md`](02-empresa.md) y
  [`05-contenido-y-seo.md`](05-contenido-y-seo.md).
- Antes de cerrar sesión: actualizar [`06-backlog.md`](06-backlog.md), añadir
  entrada en [`08-bitacora.md`](08-bitacora.md) y, si hubo decisión estructural,
  registrarla aquí.
- La documentación es parte del entregable, no un extra.

📖 Protocolo completo en [`README.md`](README.md).

---

## ADR-008 · Cómo se implementó el prerender

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada

**Contexto.** El ADR-004 decidió *qué* (prerender en build, sin migrar de
framework). Este registra el *cómo*, porque son decisiones que alguien podría
deshacer sin querer y romper el SEO en silencio.

**Decisiones.**

1. **Script propio, no un plugin.** `tools/prerender.js` son ~130 líneas que
   usan `renderToString` y `StaticRouter`. Se prefirió a `vite-react-ssg` o
   `react-snap`: sin dependencia nueva que mantener, sin Puppeteer, y el
   mecanismo queda legible para quien lo herede.
2. **El `<Router>` sale de `App.jsx`.** Lo pone cada entrada: `BrowserRouter` en
   `main.jsx`, `StaticRouter` en `entry-server.jsx`. Sin esto no hay forma de
   renderizar una ruta concreta en Node.
3. **Hidratar si hay HTML, montar si no.** `main.jsx` mira si `#root` tiene
   contenido. En producción hidrata el HTML prerenderizado; en desarrollo, donde
   Vite sirve un `#root` vacío, monta de cero. Un `hydrateRoot` incondicional
   llenaría la consola de desarrollo de errores falsos.
4. **`src/lib/site.js` es la única fuente del dominio y de las rutas.** De ahí
   salen los `canonical`, el `sitemap.xml` y el `robots.txt`. Un dominio escrito
   dos veces se desincroniza; uno solo, no.
5. **Se conserva la duplicación `<Helmet>` + `<Seo>`.** Es fea a propósito:
   `tools/generate-llms.js` extrae `<title>` y `description` leyendo el código
   fuente con expresiones regulares, así que tienen que ser literales. El
   `<Seo>` aporta lo demás.

**Consecuencias.**

- Una ruta nueva se registra en **dos** sitios: `App.jsx` y `src/lib/site.js`.
- Ningún componente puede tocar `window`, `document` o `localStorage` fuera de
  un efecto: ese código ahora también corre en Node.
- El despliegue deja de ser indiferente: el hosting **debe** resolver
  `/nosotros` con `nosotros/index.html`. Ver **P0-06** y la sección de
  despliegue de [`03-arquitectura.md`](03-arquitectura.md).
- `react-helmet` quedó obsoleto en favor de `react-helmet-async` (**P1-04**).

---

## ADR-009 · Dos enlaces de contacto por página, y ninguno más

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada

**Contexto.** El **ADR-001** fijó que el sitio informa y no vende, pero era una
regla de redacción. Al aplicarla (**P1-01**) hizo falta una regla estructural,
porque los llamados a la acción se reproducían solos: había nueve en el cuerpo
del sitio, y cuatro más escondidos en las tarjetas de proyecto, que enlazaban al
formulario de contacto.

**Decisión.** Cada página tiene **exactamente dos enlaces a `/contacto`**: uno en
el navbar y uno en el footer, ambos etiquetados "Contacto". **Ningún otro
elemento del cuerpo enlaza al formulario.**

**Consecuencias.**

- Un bloque de cierre informa o navega hacia otra parte del sitio; no invita a
  contactar. Por eso `LineCTA` se convirtió en `LineClosing` y el cierre de la
  home pasó a ser el bloque "Dónde operamos".
- **Las tarjetas de proyecto enlazan a su línea de negocio**, no al formulario.
  Un caso de éxito es información, no un anzuelo.
- Los datos de contacto pueden aparecer las veces que hagan falta como
  **información** — correo, teléfono y ciudad, enlazados con `mailto:` y `tel:`.
  Eso no es un CTA: es un dato.
- Antes de añadir un enlace nuevo, la pregunta no es qué dice sino **a dónde
  lleva**.

**Cómo comprobarlo.** Sobre el build, cada ruta debe dar exactamente 2:

```bash
grep -o 'href="/contacto"' dist/apps/web/nosotros/index.html | wc -l
```

---

## ADR-010 · Se rehace la composición, no el lenguaje visual

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** [`04-diseno.md`](04-diseno.md) decía *"El diseño visual es lo más
sólido del sitio. No lo rediseñes."* Bajo esa regla, la sesión de pulido tocó
solo rendimiento, accesibilidad y tiempos: mejoras reales, pero **invisibles**.
El propietario lo señaló — *"no cambiaste nada de la parte visual"* — y tenía
razón.

Al revisarlo, el problema no era la paleta ni la tipografía, que están bien. Era
la **composición**: nueve secciones con la misma estructura, todo en el mismo
plano, imágenes sin tratamiento y las cifras más creíbles del sitio escondidas
en tres cajitas pequeñas.

**Decisión.** Se rehace la **composición**; se conserva el **lenguaje visual**.

| Se conserva | Se rehace |
|---|---|
| Paleta y tokens | Ritmo y jerarquía de secciones |
| Manrope y sus pesos | Escala de las cifras y los numerales |
| Solo modo oscuro (ADR-003) | Tratamiento de imagen |
| Bordes de 1px, sin sombras | Profundidad mediante resplandores |
| Radio de 0.25rem | Rejilla de proyectos, ahora asimétrica |

**Consecuencias.**

- La regla de cabecera de `04-diseno.md` cambia: lo cerrado es el lenguaje
  visual, no la composición.
- Aparecen piezas reutilizables — `.media`, `.glow`, `.watermark`,
  `.stat-number`, `.sweep` — que **toda sección nueva debe usar** en vez de
  inventar su propio tratamiento.
- El contraste sobre los fondos alternos queda medido y documentado. El azul
  primario pasa AA con poco margen: cualquier fondo más claro obliga a
  remedirlo.
- **No cambió ni un dato ni una palabra del contenido.** Las reglas del ADR-001,
  ADR-002 y ADR-009 siguen intactas.

**Petición explícita del propietario:** en el navbar, **"Proyectos" va primero**,
antes de Calzado, Ropa y Dotaciones.


---

## ADR-011 · Se retira el andamiaje de Hostinger Horizons

**Fecha:** 2026-09-02 · **Estado:** ✅ Aceptada
**Sustituye a:** ADR-006

**Contexto.** El propietario confirmó el 2026-09-02 que Horizons dejó el sitio a
medias, que lo descargó y que desde entonces lo edita en el editor de código. El
editor visual de Horizons **ya no se usa y no se va a volver a usar**. Eso retira
el único motivo por el que existía el ADR-006.

Lo que arrastraba el scaffold, medido esa fecha:

| Residuo | Tamaño |
|---|---|
| 45 dependencias declaradas y nunca importadas | ~93 MB en `node_modules` |
| 55 componentes de `src/components/ui/` + 6 huérfanos | 61 archivos, 0 importados |
| 6 plugins de Vite del editor visual, en `plugins/` | 570 KB |
| 5 scripts inyectados en el HTML **de producción** | 7,3 KB × 6 páginas |
| `optimizeDeps.include: allDeps` | 21 MB de caché de Vite |
| Entradas fantasma en `knip.json` | 8.792 → 651 bytes |

Los 55 componentes de `ui/` eran una isla: los únicos archivos que importaban
`@/components/ui/*` eran **otros componentes de `ui/`**. Nada de `App.jsx` hacia
abajo los alcanzaba. Y eran ellos los que mantenían "vivas" las 28 dependencias
de Radix ante cualquier herramienta de análisis.

**Decisión.** Se retira todo el andamiaje. El proyecto declara **7 dependencias
de ejecución** — las que de verdad importa: `react`, `react-dom`,
`react-router-dom`, `react-helmet-async`, `framer-motion`, `lucide-react` y
`pocketbase` — y `vite.config.js` pasa de ~400 líneas a 40.

**Consecuencias.**

- **El sitio publicado no cambia.** Verificado el 2026-09-02: el JS quedó
  byte a byte idéntico (hash `e1c1bad…`), el bundle SSR idéntico, y el HTML de
  las 6 páginas idéntico salvo los scripts retirados. Se compararon los estilos
  calculados de 383 elementos en la home y 154 en contacto cargando el CSS
  anterior encima del nuevo: **0 diferencias**.
- El CSS baja de 85 KB a 25 KB (14,8 → 5,8 KB con gzip) porque Tailwind ya no
  escanea los componentes muertos. Ninguna de las 326 clases que el sitio usa
  perdió su regla.
- Cada página pesa 7.465 bytes menos y ningún visitante recibe ya un `fetch` ni
  un `console` parcheados.
- **Deja de silenciarse `console.warn`.** El aviso de Rollup sobre
  `import React from 'react'` que ahora aparece en el build es benigno: siempre
  estuvo ahí. Cierra el efecto colateral que el ADR-006 daba por aceptado.
- **Ya no se puede volver a abrir el proyecto en el editor visual de Horizons.**
  Es el precio consciente de esta decisión. Si algún día hiciera falta, hay que
  recuperar `apps/web/plugins/` y `vite.config.js` del historial de git
  (anteriores al 2026-09-02).
- Volver a añadir un componente de shadcn es posible: `components.json` sigue
  ahí, y el CLI regenera `ui/` y `lib/utils.js` con sus dependencias.
- `sharp` deja de ser dependencia (28 MB). `tools/generate-images.js` documenta
  cómo reinstalarla si hay que regenerar los iconos.


---

## ADR-012 · El formulario pasa de PocketBase a PHP + MySQL

**Fecha:** 2026-09-02 · **Estado:** ✅ Aceptada

**Contexto.** El sitio se va a publicar en el alojamiento web compartido de
Hostinger que el propietario ya tiene. Ahí **PocketBase no puede correr**: es un
binario de Go que necesita un proceso vivo, y el alojamiento compartido no
ejecuta demonios propios.

El formulario llamaba a `/hcgi/platform`, una ruta que solo resuelve la
infraestructura de Horizons. En el hosting nuevo esa ruta no existe: el
formulario habría fallado en el primer envío, sin base de datos y sin correo.

Se consideró quitar el formulario y dejar solo correo y WhatsApp, que encaja con
el **ADR-001** (informar, no vender). Se descartó por dos razones concretas:

1. **La prueba del consentimiento.** El formulario guarda `consent` y
   `consent_at` porque la **Ley 1581 de 2012** los exige, y el **Decreto 1074
   de 2015** obliga al responsable a *conservar* esa prueba. Un correo en el
   buzón es un registro débil comparado con una fila fechada.
2. **La red de seguridad.** El hook de PocketBase guardaba primero y enviaba
   después, a propósito: *«Nunca tumbes la petición por un fallo de correo»*.
   Sin base de datos, un fallo de SMTP borraría la solicitud sin rastro.

Y sí hay base de datos disponible: **el plan incluye MySQL**. Se comprueba en la
propia oferta del plan, que ofrece WordPress — imposible sin MySQL.

**Decisión.** El formulario pasa a `POST /api/contacto.php`, que guarda en MySQL
y envía **dos** correos: aviso interno a `info@` y acuse de recibo al cliente.

| Pieza | Dónde |
|---|---|
| Tabla `contact_requests` | [`db/schema.sql`](../db/schema.sql) — fuera de `public/`, no descargable |
| Endpoint | [`apps/web/public/api/contacto.php`](../apps/web/public/api/contacto.php) |
| Cliente SMTP sin dependencias | [`apps/web/public/api/smtp.php`](../apps/web/public/api/smtp.php) |
| Credenciales | `api/config.php` — **no versionado**, se pone a mano en el servidor |

**Por qué se repone el aviso interno.** El **2026-09-02** por la mañana el
propietario había pedido un solo correo, porque el equipo se enteraba por la
colección de PocketBase. Al desaparecer esa colección del servidor, ese correo
pasa a ser la vía principal de aviso. Decisión suya, tomada esa misma tarde.

**Consecuencias.**

- El visitante **no nota ningún cambio**: mismo formulario, mismo acuse, mismo
  diseño y mismo texto que enviaba el hook.
- Las solicitudes se consultan en **phpMyAdmin**, no en el panel de PocketBase.
- Se pierden las migraciones versionadas de PocketBase; las sustituye
  `db/schema.sql`. Los respaldos los cubre el plan, que incluye copias diarias.
- Aparece `mail_status` en la tabla: se escribe `pendiente` antes de enviar y se
  actualiza después. Un fallo de correo deja de ser invisible.
- Se guarda `ip_hash`, **no la IP**. Sirve para limitar envíos por hora y
  proteger el cupo del buzón, sin custodiar un dato personal de más.
- Al topar el límite la solicitud **se guarda igual**; solo se omiten los
  correos. Nunca se pierde una solicitud por eso.
- `vite.config.js` deja de proxear `/hcgi/platform` y pasa a proxear `/api`.
  Probar el formulario en local ahora exige un PHP escuchando aparte.
- `apps/pocketbase/` **se conserva intacto**: es el camino de vuelta si algún
  día se pasa a un VPS. Lo que se retiró es la dependencia npm `pocketbase` y
  `src/lib/pocketbaseClient.js`, que ya no importaba nadie. Quedan
  **6 dependencias de ejecución** y **23 archivos** en `src/`.
- **El JS que descarga el visitante baja de 418,77 KB a 380,55 KB**
  (132,24 → 121,05 KB con gzip): la librería cliente de PocketBase ya no viaja
  al navegador. Es la única reducción real del bundle de toda la limpieza — la
  del ADR-011 no movió ni un byte, porque el tree-shaking ya la hacía.
- `tools/prerender.js` borra `api/config.php` del build si aparece: Vite copia
  todo `public/`, y un config de desarrollo no puede acabar pisando el del
  servidor.

✅ **Verificado en producción el 2026-09-02.** El formulario guarda en MySQL y
entrega los dos correos desde `4dimensionsas.com`. La regla de «guardar primero»
se puso a prueba sola: en el primer envío real el correo falló por la contraseña
y **la solicitud se guardó igual**, con el fallo anotado en `mail_status`.

Los pasos para ponerlo en marcha están en [`09-despliegue.md`](09-despliegue.md).

**Verificado el 2026-09-02** con PHP 8.3.33 y MySQL 8.4.3 en local:
25 pruebas del endpoint, 18 del diálogo SMTP contra un servidor con TLS real,
envío completo desde el navegador con los dos correos capturados, escapado de
HTML malicioso y límite por hora.
