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
npm run dev --prefix apps/web
```
Levanta el frontend en `:3000`.
*(`npm run dev` a secas también arranca PocketBase, pero su binario es un
ejecutable de Linux y no corre en Windows.)*

```bash
npm run build --prefix apps/web
```
Build de producción **con prerender**. Encadena cuatro pasos:
`generate-llms.js → build:client → build:ssr → prerender.js`, y deja en
`dist/apps/web` un `index.html` por ruta, más `sitemap.xml` y `robots.txt`.

```bash
npm run start --prefix apps/web
```
Sirve el build en `:3000` (el mismo puerto que `dev`, así que no los levantes a la vez).

> ⚠️ `npm run start` usa `vite preview`, que **reescribe todas las rutas al
> `index.html` raíz**. Por eso `/nosotros` devuelve el home y solo `/nosotros/`
> devuelve la página correcta. Es un artefacto de la herramienta, no del build —
> pero es lo que pasaría en producción con un hosting mal configurado.
> Ver `docs/06-backlog.md` → **P0-06**.

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

El **bloque de visibilidad ya está hecho**: el sitio se puede compartir e
indexar. Lo que falta ahora es sobre todo **contenido**, no infraestructura.

| Dimensión | Nota |
|---|---|
| Diseño visual | 8.5/10 — lo más sólido. **No lo rediseñes** |
| Arquitectura de información | 8/10 |
| SEO y compartibilidad | **8/10** *(era 2/10)* — falta `og-image.jpg` y JSON-LD |
| Accesibilidad | 6/10 — el contraste cumple AA; falta semántica y foco |
| Alineación con "informar, no vender" | **3/10** ← *el pendiente grande* |

**Hecho el 2026-09-01:** Git inicializado · build arreglado (dos bugs de
Windows) · `index.html` completo · prerender de las 6 rutas con OG, Twitter Card
y canonical · `sitemap.xml` + `robots.txt` · migración a `react-helmet-async`.

**Por dónde seguir:** [`docs/06-backlog.md`](docs/06-backlog.md) → **P0-06**
(confirmar cómo sirve las rutas el hosting — si reescribe todo a `/index.html`,
el prerender no sirve de nada), **P0-05** (aviso de privacidad, riesgo legal
abierto) y luego **P1-01**, la reescritura editorial.

⚠️ **El dominio de `apps/web/src/lib/site.js` está sin confirmar.** Está inferido
del correo comercial y alimenta los `canonical`, el `sitemap.xml` y el
`robots.txt`. Confírmalo antes de publicar.

⚠️ **Reglas nuevas desde el prerender:** una ruta nueva se registra en `App.jsx`
**y** en `src/lib/site.js`; y ningún componente puede tocar `window`, `document`
o `localStorage` fuera de un efecto — ese código ahora también corre en Node.
Ver [ADR-008](docs/07-decisiones.md).

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
