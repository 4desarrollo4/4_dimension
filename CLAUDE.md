# 4D Cuarta Dimensión — Guía del proyecto

> **Lee esto primero.** Este archivo se carga automáticamente en cada sesión.
> El detalle vive en [`docs/`](docs/). No empieces a editar sin leer al menos
> `docs/02-empresa.md` (datos reales) y `docs/05-contenido-y-seo.md` (tono).

---

## Qué es este proyecto

Sitio web **institucional e informativo** de **4D Cuarta Dimensión ES S.A.S.**,
comercializadora internacional colombiana de diseño y desarrollo de producto en
tres líneas: **calzado, ropa y dotaciones**.

Monorepo npm con dos apps: `apps/web` (Vite + React 18 SPA) y
`apps/pocketbase` (PocketBase 0.39.8). Origen: scaffold de **Hostinger Horizons**.

---

## 🎯 Regla número uno: es informativa, NO de ventas

El objetivo del sitio es **que conozcan a la empresa** — quiénes somos, qué
hacemos, cómo trabajamos. **No** es captar leads ni vender.

Esto define cada decisión de redacción y de UI:

| ❌ No hacer | ✅ Hacer |
|---|---|
| Promesas comerciales en titulares | Afirmaciones de identidad |
| CTA al final de cada sección | Máximo 1–2 CTA en toda la página |
| Hablar en 2ª persona vendiendo ("tu mercado", "tu reto") | Hablar en 1ª persona describiendo ("partimos del mercado") |
| "Hablemos", "Cotiza", "Trabajemos juntos" | "Contacto", "Conócenos", "Qué hacemos" |
| Lenguaje de embudo | Lenguaje editorial / corporativo |

La regla completa está en [`docs/05-contenido-y-seo.md`](docs/05-contenido-y-seo.md).

---

## 🔒 Regla número dos: no inventes contenido

Todos los datos de empresa, proyectos, cifras y contacto que aparecen en el
sitio son **reales y fueron validados por el propietario el 2026-09-01**.
Están registrados en [`docs/02-empresa.md`](docs/02-empresa.md), que es la
**única fuente de verdad** para contenido factual.

- **No modifiques cifras, nombres de proyecto ni datos de contacto** sin que el
  propietario lo pida explícitamente.
- **No agregues** clientes, casos, certificaciones ni métricas nuevas por tu
  cuenta. Si falta un dato, pregúntalo — no lo rellenes.
- Si el propietario aporta un dato nuevo, **actualiza `docs/02-empresa.md`
  primero** y después el código.

---

## Comandos

```bash
npm run dev
```
Levanta web (`:3000`) y PocketBase (`:8090`) en paralelo.

```bash
npx vite build --outDir ../../dist/apps/web
```
Compilar producción. Ejecutar **desde `apps/web/`**.

> ⚠️ **`npm run build` está roto en Windows.** El script encadena
> `node tools/generate-llms.js || true && vite build`, y como `true` no existe
> en `cmd.exe`, la cadena muere y **vite nunca corre** — saliendo con código 0.
> Ver `docs/06-backlog.md` → P0-01.

---

## Mapa de la documentación

| Archivo | Contenido |
|---|---|
| [`docs/README.md`](docs/README.md) | **Índice y protocolo**: orden de lectura y cómo mantener los docs |
| [`docs/01-proyecto.md`](docs/01-proyecto.md) | Objetivo, público, alcance y criterios de éxito |
| [`docs/02-empresa.md`](docs/02-empresa.md) | **Fuente de verdad**: datos reales de 4D |
| [`docs/03-arquitectura.md`](docs/03-arquitectura.md) | Stack, estructura, comandos, trampas conocidas |
| [`docs/04-diseno.md`](docs/04-diseno.md) | Sistema de diseño: color, tipografía, componentes, motion |
| [`docs/05-contenido-y-seo.md`](docs/05-contenido-y-seo.md) | Reglas editoriales y estado del SEO |
| [`docs/06-backlog.md`](docs/06-backlog.md) | Pendientes priorizados P0/P1/P2 con estado |
| [`docs/07-decisiones.md`](docs/07-decisiones.md) | Bitácora de decisiones (ADR) |
| [`docs/08-bitacora.md`](docs/08-bitacora.md) | Registro de sesiones de trabajo |

---

## Estado actual (2026-09-01)

El sitio **funciona y se ve bien**, pero todavía **no cumple su objetivo**:
está escrito como una landing de ventas y es prácticamente invisible para
buscadores y para los previsualizadores de WhatsApp y LinkedIn.

| Dimensión | Nota |
|---|---|
| Diseño visual | 8.5/10 — lo más sólido. **No lo rediseñes** |
| Arquitectura de información | 8/10 |
| Accesibilidad | 6/10 — el contraste cumple AA; falta semántica y foco |
| Alineación con "informar, no vender" | **3/10** |
| SEO y compartibilidad | **2/10** |

**Por dónde seguir:** [`docs/06-backlog.md`](docs/06-backlog.md) → **P0-00**
(inicializar Git), y después el bloque de visibilidad P0-01 → P0-03 → P0-02 →
P0-04.

⚠️ **El directorio no es un repositorio Git.** No hay historial ni forma de
revertir. Ten cuidado con lo que sobrescribes hasta que P0-00 esté hecho.

---

## Convenciones de código

- **Indentación:** tabs en config raíz (`vite.config.js`, `package.json`),
  4 espacios en `src/`. Respeta el archivo que estés tocando.
- **Estilos:** solo Tailwind con los tokens de `src/index.css`. Nunca colores
  literales — usa `text-primary`, `bg-card`, `border-border/60`, etc.
- **Alias:** `@/` apunta a `apps/web/src/`.
- **Animación:** todo lo que anime debe respetar `prefers-reduced-motion`
  (ya lo hacen `Reveal`, `CountUp` e `index.css` — mantén esa disciplina).
- **Imágenes:** siempre `alt` descriptivo en español y `loading="lazy"` salvo
  el hero.

---

## Antes de cerrar una sesión

1. Actualiza `docs/06-backlog.md` con lo que cambió de estado.
2. Añade una entrada en `docs/08-bitacora.md`.
3. Si tomaste una decisión estructural, regístrala en `docs/07-decisiones.md`.
4. Actualiza la fecha de *Última actualización* de cada documento que tocaste.

📖 Protocolo completo en [`docs/README.md`](docs/README.md).
