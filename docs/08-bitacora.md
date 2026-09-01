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
