# 07 — Bitácora de decisiones (ADR)

**Última actualización:** 2026-10-27

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

---

## ADR-013 · El sitio pasa a tema claro, con la barra superior en negro

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El sitio nació en modo oscuro y así se publicó. El
[`10-plan-v2.md`](10-plan-v2.md) cerró la cuestión en su tabla de decisiones con
un escueto *«Colores: se mantienen intactos»*, y el
[**ADR-010**](#adr-010--se-rehace-la-composición-no-el-lenguaje-visual) había
establecido que la v2 rehace la composición pero **no** el lenguaje visual.

El 2026-10-20 el propietario aportó una referencia visual concreta —una captura
de un sitio de fondo blanco y acento azul petróleo— y pidió explícitamente
adoptar su paleta, aclarando que **solo** quería la parte cromática, no el
contenido ni la estructura de la referencia. En la misma sesión añadió que la
barra de navegación superior debía llevar fondo propio **en negro**.

**Decisión.** Se sustituye la paleta oscura por una clara y se da a la cabecera
una superficie negra propia. Esto **deroga** la línea «los colores se mantienen
intactos» del plan v2. El ADR-010 **sigue vigente en lo demás**: no es un
rediseño de composición ni de tipografía.

Los valores no se estimaron a ojo. Se muestrearon píxel a píxel sobre la
referencia aportada, decodificándola en un lienzo del navegador:

| Token | Valor | Dónde se ve |
|---|---|---|
| `--primary` | `hsl(198 96% 31%)` · `#036D9B` | Acento, botones, cifras |
| `--background` | `hsl(0 0% 100%)` | Fondo de página |
| `--foreground` | `hsl(228 11% 9%)` | Titulares |
| `--muted-foreground` | `hsl(210 4% 38%)` | Cuerpo de texto |
| `--border` | `hsl(210 14% 85%)` | Filetes y separadores |

**Cómo se implementó, y por qué así.**

1. **Un solo punto de cambio.** El color estaba bien centralizado: bastó
   reescribir el bloque `:root` de [`index.css`](../apps/web/src/index.css).
   Navbar y footer no se tocaron — son 100 % tokens y voltearon solos.
2. **Cuatro literales que asumían fondo oscuro** sí hubo que corregirlos a mano:
   el `body`, `::selection`, `.text-outline` y `.watermark` llevaban
   `hsl(220 16% 96%)` escrito a fuego.
3. **La barra negra se hizo redefiniendo tokens, no reescribiendo clases.** La
   clase `.navbar-dark` redeclara `--background`, `--foreground`,
   `--muted-foreground` y `--border` **dentro** de la cabecera. Así
   `text-muted-foreground` y `border-border/70` siguen escritos igual en
   `Navbar.jsx` pero se resuelven en claro sobre el negro. El menú móvil es
   *hermano* del `<header>`, no hijo, así que no hereda el ámbito y se queda en
   blanco — que es lo correcto, porque ocupa la pantalla entera.
4. **La paleta oscura se conserva íntegra** en el bloque `.dark` de `index.css`.
   Hoy está **inerte**: ningún elemento lleva esa clase. Es el camino de vuelta
   si se revierte este ADR.
5. **`theme-color`** pasa de `#0a0c14` a `#ffffff`.

**Consecuencias.**

- ✅ Contraste verificado en las 6 rutas con una auditoría automática que
  recorre todo el texto renderizado: **cero elementos por debajo de AA**. El
  petróleo sobre blanco da 5,74:1 y los enlaces del navbar sobre negro, 10,33:1.
- ⚠️ **`.media::after` hubo que suavizarlo.** Ese degradado existía para fundir
  una foto oscura en una página oscura; sobre blanco hacía lo contrario y
  lavaba el tercio inferior de cada imagen. Al bajarlo, la regla de
  «30 % inferior libre de caras y rótulos» del plan v2 se relaja a ~20 %.
- 🔴 **Las 11 imágenes de banco quedan peor que antes.** Todas tienen fondo
  oscuro y ahora se leen como bloques negros sobre una página blanca. No es un
  fallo nuevo: es el mismo problema del diagnóstico («las imágenes no nos
  representan»), pero **el tema claro lo hace mucho más visible**. Sube la
  urgencia de las fotos propias de los sprints 3 y 4.
- 🔴 **`og-image.jpg` queda desalineado.** Es una imagen de fondo oscuro; al
  compartir un enlace ya no corresponde con el sitio. Hay que rehacerla.
- ✅ El logo (`logo-4d.png`) se lee **mejor** sobre la barra negra que sobre
  blanco: es un círculo oscuro con tipografía metálica clara.

**Lo que NO cambia este ADR:** tipografía (sigue Manrope, pendiente de pasar a
Archivo en el sprint 1), escala tipográfica, composición y contenido.

---

## ADR-014 · Botón flotante de WhatsApp, y lo que rompe

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El [**ADR-009**](#adr-009--dos-enlaces-de-contacto-por-página-y-ninguno-más)
fijó **dos enlaces de contacto por página** —navbar y footer— y ninguno más en
el cuerpo. El motivo no era estético: el
[**ADR-001**](#adr-001) define el sitio como **informativo, no de ventas**, y
nueve CTA repartidos por la página lo hacían parecer un embudo.

El 2026-10-20 el propietario pidió **un botón flotante de WhatsApp fijo en la
esquina inferior derecha, en todas las páginas**.

**Decisión.** Se añade. Manda el propietario.

**Pero queda dicho con todas las letras:** es el **tercer** punto de contacto,
está en **las siete** rutas, y es el elemento más visible de la pantalla
después del hero. En la práctica **deroga el ADR-009**, que queda reducido a
«dos enlaces a `/contacto`» — el de WhatsApp no apunta a `/contacto`, pero
cumple la misma función.

Si en algún momento la dirección vuelve a decir que el sitio «parece que vende»,
este botón es lo primero que hay que mirar.

**Cómo está hecho.**

- `WhatsAppFab.jsx`, montado una sola vez en `App.jsx`, fuera de las rutas.
- Es un `<a>`, no un `<button>`: navega fuera. Con un botón se perdería abrir
  en pestaña nueva y la navegación por teclado sería peor.
- `target="_blank"` **siempre** con `rel="noopener noreferrer"`: sin `noopener`
  la pestaña nueva puede manipular la nuestra a través de `window.opener`.
- Icono SVG **inline**. No se añadió ninguna librería de iconos por una marca,
  ni se carga de una CDN externa (ADR-011).
- 56 × 56 px: por encima del objetivo táctil de 44 px de las WCAG.
- `aria-label="Escribirnos por WhatsApp"`, porque no lleva texto visible.

**El enlace y el mensaje** salen de `src/lib/contacto.js`, que es desde hoy el
punto único de los datos de contacto. Se usa `wa.me` y no `api.whatsapp.com`
porque el segundo mete una pantalla intermedia en móvil.

---

## ADR-015 · Tipografía: Archivo, escala mayor y fin del «borroso»

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** La cuarta objeción de la dirección era que los textos **«se ven
borrosos o muy pequeños»**. La auditoría del 2026-10-19 la midió y le encontró
tres causas, no una:

| Causa | Medida |
|---|---|
| `-webkit-font-smoothing: antialiased` | Desactiva el subpíxel y **adelgaza los trazos**, sobre todo en Mac |
| Texto a ≤14 px | **43 elementos — el 75 %** del texto de la página |
| Peso del cuerpo a 400 | Demasiado ligero para el cuerpo de un sitio |

[`04-diseno.md`](04-diseno.md) declaraba la tipografía «cerrada». Este ADR lo
deroga, como ya preveía el sprint 1 del [plan v2](10-plan-v2.md).

**Decisión y orden de impacto.**

1. **Fuera `-webkit-font-smoothing: antialiased`** y `-moz-osx-font-smoothing`.
   Coste cero y es el mayor salto percibido. **No los vuelvas a poner.**
2. **Archivo sustituye a Manrope.** Variable, 400–800 en un solo archivo, misma
   forma de cargarla (`<link>`, nunca `@import`). Mayor altura de x y trazos
   que aguantan mejor a tamaño pequeño.
3. **Sube la escala.** Y aquí está lo importante: en vez de reescribir las
   **63** clases `text-sm` y `text-xs` repartidas por el código, se **redefine
   la escala de Tailwind** en `tailwind.config.js`. Un solo cambio, los nombres
   de clase intactos:

   | Clase | Antes | Ahora | Dónde se nota |
   |---|---|---|---|
   | `text-xs` | 12 px | **13 px** | Eyebrows en versalitas |
   | `text-sm` | 14 px | **16 px** | Tarjetas, listas, pies |
   | `text-base` | 16 px | **18 px** | Cuerpo |
   | `text-lg` | 18 px | **20 px** | Entradillas |
   | `text-xl` | 20 px | **22 px** | Destacados |

   De `text-2xl` en adelante se deja la escala original: los titulares ya eran
   grandes y nunca fueron el problema.
4. **Peso del cuerpo 400 → 450.** Archivo es variable: no cuesta ni un byte.

**Y una cuarta cosa que no estaba en el plan.** El propietario señaló que
*«algunas cosas medio están delineadas y no se ven, como los números que tienen
relleno blanco»*. Eran `.watermark` y `.text-outline`, que usaban
`-webkit-text-stroke` de 1 px con el relleno transparente. Un trazo de 1 px se
lo come el antialiasing en pantallas de baja densidad y el número queda a medio
dibujar. **Ahora son relleno sólido muy tenue** (7 % y 22 %). Ya no queda ni un
`text-stroke` en el proyecto.

**Resultado medido** sobre las 7 rutas, con el texto renderizado:

| | Antes | Ahora |
|---|---|---|
| Texto a ≤14 px | **75 %** | **12 %** |
| Fallos de contraste AA | 0 | **0** |
| Peso del cuerpo | 400 | 450 |
| `font-smoothing` | `antialiased` | `auto` |

> ⚠️ El 12 % restante **no es texto pequeño por descuido**: son los *eyebrows*
> en versalitas, exactamente a los 13 px que el propio plan v2 fijó, más el
> enlace «Saltar al contenido», que está oculto hasta que se navega con
> teclado. El objetivo del plan era «< 10 %», así que la métrica queda
> técnicamente por encima — pero no hay nada que bajar sin contradecir el plan.

---

## ADR-016 · El hero deja de ser un cubo y pasa a ser un zapato real

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El hero mostraba un **tesseract**: dos cubos de alambre girando
con CSS. Era bonito y no mentía sobre nada, pero tampoco decía nada de lo que
hace la empresa. Y la objeción principal de la dirección seguía siendo que
**«las imágenes no nos representan»**.

Se le propuso al propietario un *turntable* de fotos reales. Prefirió generar
un vídeo con **Google Flow**, y se le advirtió de que un zapato **inventado**
por el modelo reincidiría en la misma objeción. **Partió de la foto de un
zapato real de la empresa** — que era la parte que importaba. El prompt está en
[`11-prompt-video-hero.md`](11-prompt-video-hero.md).

**Decisión.** `Tesseract.jsx` se elimina (recuperable en git) y lo sustituye
`ShoeTurntable.jsx`.

**El vídeo hubo que trabajarlo.** El archivo de Flow venía así:

| | Original de Flow | Publicado |
|---|---|---|
| Tamaño | **8,69 MB** | **171 KB** (mp4) · 210 KB (webm) |
| Dimensiones | 1280×720 (16:9) | 640×640 (1:1) |
| Audio | Pista AAC de 128 kb/s | Ninguna |

8,69 MB en el elemento que mide el LCP era inaceptable. Se recortó a cuadrado
—midiendo antes la envolvente del zapato en todo el giro, x 291–948, para no
cortarlo en ningún fotograma—, se escaló a 640, se quitó el audio y se
reencodeó. **Cincuenta veces menos peso, sin pérdida visible.**

**Reglas que quedan atadas al componente:**

- **Sin atributo `autoplay`.** La reproducción la arranca un efecto, después de
  consultar `prefers-reduced-motion`. Con `autoplay` el navegador empezaría a
  reproducir antes de que pudiéramos comprobar la preferencia. Si el visitante
  tiene el movimiento reducido activado, **ve el póster fijo**.
- **`playsInline` es obligatorio.** Sin él, Safari en iPhone abre el vídeo a
  pantalla completa.
- Si algún día se cambia el vídeo, **hay que volver a comprimirlo**.

### Consecuencia inesperada: la página cambió de color

El fondo del vídeo no es blanco puro, es un gris con degradado. Sobre la página
blanca del [ADR-013](#adr-013--el-sitio-pasa-a-tema-claro-con-la-barra-superior-en-negro)
se veía como **un rectángulo gris pegado encima**, y el propietario lo detectó.

Se muestreó el fondo del propio archivo: **`rgb(234,234,234)` = `hsl(0 0% 92%)`**.
Dos cambios, no uno:

1. **`--background` pasa de blanco puro a `hsl(0 0% 92%)`**, el gris del vídeo.
   `--card` pasa a blanco puro para que las superficies elevadas sigan
   leyéndose *por encima* de la página y no por debajo. `--border` se oscurece
   a 78 % para seguir siendo visible sobre el gris.
2. **Los bordes del vídeo se difuminan** con una máscara radial
   (`.shoe-feather`). Hacía falta igualmente: el fondo del vídeo **no es
   plano**, va del 88 % al 95 %, así que un gris liso nunca habría casado en
   las cuatro esquinas. Es una máscara, no un degradado encima: no tiñe.

⚠️ **Si se cambia el vídeo del hero, hay que volver a muestrear su fondo y
reajustar `--background`.** Están atados.

Contraste reverificado tras el cambio de fondo: **0 fallos AA en las 7 rutas**.

### Actualización 2026-10-26 · segundo vídeo

Se sustituyó por un zapato de denim, también de Flow. Tres cambios respecto a
lo anterior, detallados en la bitácora del 2026-10-26:

- **El bucle se fabrica**, no se confía en el vídeo: se funden los últimos
  0,625 s con los primeros (`xfade`). Costura medida: 2,08 frente a 3,71 de paso
  medio entre fotogramas.
- **La máscara pasa de radial a dos fundidos lineales cruzados** (16 % lateral,
  10 % vertical), porque de perfil el vídeo de origen corta la puntera.
- **Peso servido ~460 KB** (WebM a dos pasadas). El fondo del vídeo nuevo es el
  mismo `rgb(234,234,234)`: `--background` sigue igual.

**Ese mismo día se sustituyó por la versión horizontal del giro**, porque el
vertical cortaba la puntera de perfil y el propietario quiere puntera y talón
nítidos en todo el giro. Lo que cambia de fondo en esta decisión:

- **Se invierte la dependencia.** Antes la página copiaba el gris del vídeo;
  ahora **el vídeo se aplana al gris de la página** (235), solo en los píxeles
  de fondo. Si algún día cambia `--background`, hay que regenerar el vídeo con
  el valor nuevo.
- **Formato 3:2** (960×640), no cuadrado.
- **Ningún difuminado sobre el zapato.** La máscara solo remata el borde.
- **Recorte ajustado al zapato** (960×600, el zapato ocupa el 93 % del ancho) y
  **hero a 50/50 desde 1280 px**, porque el propietario lo veía pequeño.
- **Nada decorativo detrás del vídeo.** Se quitaron el `glow-tr` del hero y el
  halo del componente: cualquier tinte bajo el vídeo hace visible su recuadro.

---

## ADR-017 · El azul de marca pasa a PMS 295

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El [ADR-013](#adr-013--el-sitio-pasa-a-tema-claro-con-la-barra-superior-en-negro)
adoptó un azul petróleo `#036D9B` muestreado de una referencia que aportó el
propietario. El 2026-10-20 aportó el color corporativo real: **PMS 295**.

**Decisión.** `--primary` pasa a **`hsl(214 75% 24%)` = `#0F376A`**.

**De dónde sale ese valor, y qué hay que saber.** El propietario entregó una
**fotografía de un muestrario impreso** con la etiqueta «PMS 295». Se muestreó
el área central de la imagen y la moda de color da `rgb(15,55,106)`.

> ⚠️ **No es necesariamente el Pantone exacto.** Es un escaneo de tinta bajo
> una luz desconocida, así que lleva la desviación del dispositivo. Las
> conversiones publicadas de **Pantone 295 C** quedan algo **más oscuras**
> (en torno a `#002F5F`–`#003057`). Si alguien dispone del valor oficial de la
> guía o del manual de marca, **ese manda** sobre este.

### El problema que destapó: la barra negra

El azul de marca es un **azul marino muy oscuro**. Sobre el negro de la
cabecera (`#09090c`) sería **prácticamente invisible** — y allí se usa en dos
sitios que importan: el subrayado de 1 px del enlace activo (`.nav-link::after`)
y el botón «Contacto» al pasar el cursor.

**Solución:** dentro de `.navbar-dark` se redefine `--primary` a un **tinte del
mismo color**: `hsl(214 75% 58%)`. Mismo matiz (214), misma saturación (75 %),
solo más claro. No es otro color, es el mismo aclarado para fondo oscuro.

⚠️ **Están atados: si cambias `--primary`, recalcula el tinte del navbar.**

### Contraste, medido tras el cambio

| | Ratio | |
|---|---|---|
| PMS 295 sobre la página | **9,92:1** | Antes el petróleo daba 4,77:1 |
| Blanco sobre PMS 295 (botones) | **11,83:1** | |
| Tinte sobre la barra negra | **5,63:1** | |

**El cambio mejora la accesibilidad**, no la empeora: el petróleo anterior
rozaba el mínimo AA de 4,5:1 y este lo dobla con holgura.
0 fallos en las 7 rutas.

---

## ADR-018 · «Inicio» en el menú, y el menú se rompe a 1280 px

**Fecha:** 2026-10-20 · **Estado:** ✅ Aceptada · **Decide:** propietario

**Contexto.** El propietario pidió un enlace **«Inicio»** en la barra. Hasta
entonces solo se volvía a la portada pulsando el logo — que funciona, pero no
todo el mundo lo sabe.

**Decisión.** Se añade como primer enlace. Dos detalles no evidentes:

1. **`end: true` en el `NavLink`.** Sin eso, React Router considera que la ruta
   `/` coincide con **todas** las demás, y «Inicio» aparecería resaltado como
   activo en todo el sitio.
2. **El menú horizontal pasa de `lg` (1024 px) a `xl` (1280 px).**

### Por qué hubo que mover el punto de ruptura

Ya estaba avisado en el **P1-17**: con 6 enlaces más el botón, a 1024 px
quedaban **65 px libres**. Al añadir «Inicio» se midió de nuevo:

| | Antes de «Inicio» | Con «Inicio» (a 1024 px) |
|---|---|---|
| Hueco libre | 65 px | **0 px** |
| Logo | Una línea | **Partido en dos líneas** |

Con el menú a `xl`, entre 1024 y 1279 px se usa la hamburguesa —que ya existía
y funciona— y a partir de 1280 px el menú horizontal entra con **77 px de
holgura**. Se bajó además el espaciado de `gap-8` a `gap-7` y se añadió
`whitespace-nowrap` al nombre del logo para que no se vuelva a partir.

**Medido a 1024, 1280, 1440 y 1680 px.**

> ⚠️ **El margen vuelve a ser estrecho.** Un enlace más y habrá que agrupar las
> cuatro líneas de producto en un desplegable. El P1-17 sigue abierto por eso.

---

## ADR-019 · El formulario se endurece, y el acuse deja de repetir al visitante

**Fecha:** 2026-10-26 · **Estado:** ✅ Aceptada · **Pide:** propietario («mira la parte de seguridad, que todo el backend funcione»)

**Contexto.** El backend de ADR-012 estaba bien planteado: guarda antes de
enviar correo, consultas preparadas, trampa antibots, `config.php` fuera del
repositorio y protegido en el servidor (comprobado en producción: 403). Pero
se probó **de verdad**, en local, con un MySQL 8.4 desechable en modo estricto
y un servidor SMTP falso con TLS que captura los correos, y aparecieron cinco
problemas medidos, no supuestos:

| # | Problema | Cómo se vio |
|---|---|---|
| 1 | **Insumos no existía** ni en el backend ni en el ENUM de la tabla | Una solicitud de Insumos devolvía 422 |
| 2 | **Cualquier web ajena podía enviar solicitudes** (CSRF) | Con `Origin: evil.example` o como `text/plain`, se guardaba |
| 3 | **Detrás de la CDN** (`Server: hcdn`) el límite por IP podía ser por **nodo**, no por persona | Diagnóstico sobre producción: la CDN está delante |
| 4 | **Ningún tope de almacenamiento** | 60 envíos seguidos del mismo cliente: se guardaron los 60 |
| 5 | **El acuse repetía nombre, datos y mensaje** a una dirección que escribe el visitante | Permitía mandar spam firmado por 4D a terceros |

**Decisión.**

1. **Insumos** en el formulario, en `$LINEAS` y en el ENUM, con la migración
   `db/migraciones/2026-10-26-linea-insumos.sql`. ⚠️ **Se ejecuta ANTES de
   subir el PHP** (ver `09-despliegue.md`).
2. **Solo desde el propio sitio:** se exige `application/json` (415 si no) y,
   si el navegador declara `Origin`, tiene que ser 4dimensionsas.com, `www.` o
   localhost para desarrollo (403 si no).
3. **Huella del cliente = `REMOTE_ADDR` + última entrada de `X-Forwarded-For`**
   (la que añade el proxy más cercano; la primera la puede inventar el
   cliente). Sin CDN, la cabecera viene vacía y todo queda como antes.
4. **Tope duro `tope_por_hora` (20 por defecto):** por encima se responde 429
   **sin guardar**. El límite blando de 5 sigue igual: guarda pero no envía
   correos. El formulario muestra un mensaje propio con correo y WhatsApp.
5. **El acuse solo lleva texto nuestro.** Del visitante, como mucho el primer
   nombre y solo si son letras (`/^\p{L}[\p{L}'\-]{0,29}$/u`): no cabe ni un
   enlace ni un anuncio. La línea de interés sale de la lista cerrada. El
   **aviso interno sí lleva todo** (escapado): solo llega a nuestro buzón.
6. `display_errors` forzado a 0 y `Cache-Control: no-store` en la respuesta.
7. Las dos plantillas de correo pasan a la paleta actual (blanco, PMS 295).

**Verificado** con una batería de 18 casos sobre el banco local. Todos pasan.
Los que importan: el correo falla → **la solicitud se guarda igual**
(`aviso:fallo acuse:fallo`); la base falla → error genérico, **sin rutas ni
avisos de PHP** aunque PHP se arrancó con los errores visibles; dos clientes
tras el mismo nodo de CDN → **cuentan por separado**; intento de spam por el
acuse → el enlace **no** llega a la víctima. Asunto y remitente con tildes,
bien codificados (RFC 2047).

**Lo que NO se pudo verificar desde aquí:** si la CDN de Hostinger envía de
verdad `X-Forwarded-For`. Si no la envía, el código se comporta como antes
(ni mejor ni peor). Se puede confirmar mirando `error_log` tras unos envíos.

**Consecuencia para el cliente:** el acuse es más escueto. Antes le devolvía
su propio mensaje; ahora le confirma la línea y el plazo de respuesta. Es el
precio de que el formulario no sirva para mandar spam en nombre de 4D.
