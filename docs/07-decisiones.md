# 07 — Bitácora de decisiones (ADR)

**Última actualización:** 2026-09-01

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

**Fecha:** 2026-09-01 · **Estado:** ✅ Aceptada

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
