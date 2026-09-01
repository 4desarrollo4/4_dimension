# 03 — Arquitectura y entorno

**Última actualización:** 2026-09-01

---

## Origen del proyecto

Generado con **Hostinger Horizons** (constructor con IA). Eso explica varias
cosas del repositorio que no son decisiones de diseño sino residuo del
scaffold — ver *Trampas conocidas* abajo.

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node **22** (`.nvmrc`) |
| Frontend | React **18.3** + Vite **7.3** (JSX, sin TypeScript) |
| Enrutado | react-router-dom **7** (`BrowserRouter`, SPA) |
| Estilos | Tailwind CSS **3.4** + tokens CSS en `src/index.css` |
| Componentes | shadcn/ui sobre Radix UI (~60 componentes en `src/components/ui/`) |
| Animación | framer-motion **11** |
| Iconos | lucide-react |
| Meta tags | react-helmet ⚠️ *deprecado — migrar a `react-helmet-async`* |
| Backend | PocketBase **0.39.8** |
| Monorepo | npm workspaces (`apps/*`) |

---

## Estructura

```
C:\4 dimension\
├── CLAUDE.md                 ← guía de entrada (se carga en cada sesión)
├── docs/                     ← esta documentación
├── package.json              ← raíz del monorepo
├── apps/
│   ├── web/                  ← frontend
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── plugins/          ← plugins de Horizons (NO tocar)
│   │   ├── tools/generate-llms.js
│   │   └── src/
│   │       ├── App.jsx           ← rutas
│   │       ├── index.css         ← tokens de diseño
│   │       ├── components/       ← propios
│   │       ├── components/ui/    ← shadcn (generado)
│   │       ├── data/projects.js  ← datos de proyectos
│   │       ├── lib/
│   │       └── pages/            ← 6 páginas
│   └── pocketbase/           ← backend
│       ├── pb_migrations/
│       ├── pb_hooks/
│       └── pb_data/
└── vault/temp/SESSION_JOURNAL.md
```

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Web `:3000` + PocketBase `:8090` en paralelo |
| `npm run dev --prefix apps/web` | Solo el frontend |
| `npm run lint --prefix apps/web` | ESLint |
| `npx vite build --outDir ../../dist/apps/web` | Build de producción (**desde `apps/web/`**) |

Salida de build actual: **409 KB JS (130 KB gzip)** + **80 KB CSS (14 KB gzip)**,
en un solo bundle sin code-splitting.

---

## Backend — PocketBase

- Sirve en `0.0.0.0:8090`.
- El frontend lo consume vía `/hcgi/platform` ([`src/lib/pocketbaseClient.js`](../apps/web/src/lib/pocketbaseClient.js)).

### Colección `contact_requests`

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | text | requerido, 2–120 |
| `company` | text | opcional, máx 160 |
| `email` | email | requerido |
| `line` | select | `calzado` · `ropa` · `dotaciones` · `otro` |
| `message` | text | requerido, 10–4000 |
| `created` / `updated` | autodate | — |

Reglas de acceso: `createRule: ''` (creación pública), todo lo demás `null`
(solo superusuario). Correcto para un formulario público.

📁 [`apps/pocketbase/pb_migrations/1787766900_create_contact_requests.js`](../apps/pocketbase/pb_migrations/1787766900_create_contact_requests.js)

---

## ⚠️ Trampas conocidas

### 1. `npm run build` no compila nada en Windows
```
node tools/generate-llms.js || true && vite build --outDir ../../dist/apps/web
```
`cmd.exe` no tiene el comando `true`, así que la cadena se rompe y **vite build
nunca se ejecuta**, saliendo con código 0. Un CI creería que compiló bien y
desplegaría vacío. → Backlog **P0-01**. Mientras tanto usa `npx vite build`.

### 2. El formulario de contacto NO funciona en local
`/hcgi/platform` es una ruta que **proxea la infraestructura de Horizons**, no
Vite. En local devuelve el `index.html` del SPA (`text/html`, 200), así que
PocketBase nunca recibe la petición y el formulario siempre falla.
Para probarlo en local hay que añadir un `server.proxy` en `vite.config.js`
apuntando a `http://localhost:8090`. → Backlog **P1-05**.

### 3. Es un SPA puro, sin SSR ni prerender
Títulos y descripciones se inyectan con `react-helmet` **en el cliente**.
Los rastreadores de WhatsApp, LinkedIn, Facebook, X y Slack **no ejecutan JS**,
así que ven el `index.html` crudo — con `<title>` vacío. → Backlog **P0-04**.

### 4. No existe `apps/web/public/`
Por eso `/vite.svg`, `/robots.txt` y `/sitemap.xml` caen en el fallback del SPA
y devuelven HTML con status 200 en lugar de 404. El favicon está roto.
→ Backlog **P0-02**.

### 5. `console.warn` está silenciado globalmente
[`vite.config.js`](../apps/web/vite.config.js) hace `console.warn = () => {}`.
Si depuras warnings y no ves nada, es por esto.

### 6. Código muerto del scaffold
`AuthContext.jsx`, `ProtectedRoute.jsx`, `pocketbaseClient` en rutas que no lo
usan, y ~60 componentes `ui/` de los que se usan un puñado. `knip.json` en la
raíz está configurado para detectarlo.

### 7. No tocar `apps/web/plugins/`
Son plugins del editor visual de Horizons (`visual-editor`, `session-journal`,
`site-pages`, `pocketbase-auth`). Solo cargan en dev. Modificarlos puede romper
la integración con el builder.

---

## Git

⚠️ **El directorio no es un repositorio Git.** No hay historial ni forma de
revertir. Inicializar es la primera tarea del backlog (**P0-00**):

```bash
git init && git add -A && git commit -m "Estado inicial del sitio 4D"
```

Antes de eso hay que crear un `.gitignore` que excluya `node_modules/`,
`dist/`, `apps/pocketbase/pb_data/` y `apps/pocketbase/pocketbase`.
