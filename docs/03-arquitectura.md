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
| Enrutado | react-router-dom **7** (SPA con prerender) |
| Estilos | Tailwind CSS **3.4** + tokens CSS en `src/index.css` |
| Componentes | shadcn/ui sobre Radix UI (~55 componentes en `src/components/ui/`, **todos sin usar**) |
| Animación | framer-motion **11** |
| Iconos | lucide-react |
| Meta tags | **react-helmet-async** |
| Prerender | `renderToString` + `StaticRouter`, script propio |
| Backend | PocketBase **0.39.8** |
| Monorepo | npm workspaces (`apps/*`) |
| Control de versiones | Git *(inicializado el 2026-09-01)* |

---

## Estructura

```
C:\4 dimension\
├── CLAUDE.md                 ← guía de entrada (se carga en cada sesión)
├── docs/                     ← esta documentación
├── .gitignore  .gitattributes
├── package.json              ← raíz del monorepo
├── apps/
│   ├── web/                  ← frontend
│   │   ├── index.html        ← plantilla + meta de fallback
│   │   ├── vite.config.js
│   │   ├── public/           ← favicon.svg, llms.txt
│   │   ├── plugins/          ← plugins de Horizons (NO tocar)
│   │   ├── tools/
│   │   │   ├── generate-llms.js
│   │   │   └── prerender.js  ← genera las 6 rutas + sitemap + robots
│   │   └── src/
│   │       ├── App.jsx           ← rutas (SIN Router)
│   │       ├── main.jsx          ← entrada de navegador
│   │       ├── entry-server.jsx  ← entrada de prerender
│   │       ├── index.css         ← tokens de diseño
│   │       ├── components/       ← propios
│   │       ├── components/ui/    ← shadcn (generado, sin usar)
│   │       ├── data/projects.js  ← datos de proyectos
│   │       ├── lib/site.js       ← dominio, rutas y OG
│   │       └── pages/            ← 6 páginas
│   └── pocketbase/           ← backend
│       ├── pb_migrations/  pb_hooks/  pb_data/
└── vault/temp/SESSION_JOURNAL.md
```

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Web `:3000` + PocketBase `:8090` en paralelo |
| `npm run dev --prefix apps/web` | Solo el frontend |
| `npm run build --prefix apps/web` | **Build completo con prerender** |
| `npm run start --prefix apps/web` | Sirve el build ⚠️ ver aviso abajo |
| `npm run lint --prefix apps/web` | ESLint |

### La cadena de build

```
generate-llms.js  →  build:client  →  build:ssr  →  prerender.js
```

| Paso | Qué produce |
|---|---|
| `generate-llms.js` | `public/llms.txt` leyendo los `<Helmet>` del código fuente |
| `build:client` | `dist/apps/web` — el bundle del navegador |
| `build:ssr` | `dist/ssr/entry-server.js` — la app renderizable en Node |
| `prerender.js` | Un `index.html` por ruta, más `sitemap.xml` y `robots.txt` |

Salida actual: **411 KB JS (130 KB gzip)** + **80 KB CSS (14 KB gzip)**, en un
solo bundle sin code-splitting (**P2-09**).

> ⚠️ `npm run start` usa `vite preview`, que **reescribe todas las rutas al
> `index.html` raíz**. Por eso `/nosotros` devuelve el home y solo `/nosotros/`
> (con barra final) devuelve la página correcta. Es un artefacto de la
> herramienta, no del build — pero es exactamente lo que pasaría en producción
> con un hosting mal configurado. Ver **P0-06**.

---

## Cómo funciona el prerender

**Por qué existe:** WhatsApp, LinkedIn, Facebook, X y Slack no ejecutan
JavaScript. Sin prerender ven el `index.html` crudo y compartir un enlace no
muestra ni título ni descripción ni imagen — lo que anula el objetivo del
proyecto. Ver [ADR-004](07-decisiones.md).

**El mecanismo:**

1. `App.jsx` **no incluye el Router**. Lo pone cada entrada:
   - `main.jsx` → `BrowserRouter` (navegador)
   - `entry-server.jsx` → `StaticRouter` (Node)
2. `entry-server.jsx` exporta `render(url)`, que devuelve el HTML y el contexto
   de `react-helmet-async`.
3. `tools/prerender.js` importa ese `render`, recorre las rutas de
   `src/lib/site.js`, y por cada una escribe un `index.html` con el HTML dentro
   de `#root` y las etiquetas de Helmet dentro de `<head>`.
4. En el navegador, `main.jsx` **hidrata** si `#root` ya trae contenido y monta
   de cero si está vacío — que es lo que pasa en desarrollo.

### Reglas al tocar esto

- **Una ruta nueva va en dos sitios:** `App.jsx` (el `<Route>`) y
  `src/lib/site.js` (la lista `ROUTES`). Si falta la segunda, la ruta funciona
  en el navegador pero no se prerenderiza ni entra al sitemap.
- **Nada de `window`, `document` o `localStorage` en el cuerpo de un
  componente.** Se ejecuta en Node. Va dentro de `useEffect`, o detrás de
  `typeof window !== 'undefined'`.
- `useLayoutEffect` avisa en el servidor: usa el patrón isomorfo de
  `ScrollToTop.jsx`.
- **El dominio vive solo en `src/lib/site.js`.** No lo escribas en ningún otro
  archivo.
- Si añades un `React.lazy`, necesita un `Suspense` cuyo fallback también
  renderice en servidor.

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

⚠️ **El binario `apps/pocketbase/pocketbase` es un ejecutable ELF de Linux.** En
Windows no arranca: hace falta WSL o el binario de PocketBase para Windows. Por
eso `npm run dev` solo levanta la web en esta máquina.

---

## ⚠️ Trampas conocidas

### ✅ Resueltas el 2026-09-01

| Trampa | Cómo quedó |
|---|---|
| `npm run build` no compilaba en Windows | Arreglado — **P0-01** |
| `generate-llms.js` nunca corría en Windows | Arreglado — **P0-01** |
| No existía `apps/web/public/` | Creado — **P0-02** |
| SPA puro sin prerender | Prerender de 6 rutas — **P0-04** |
| El directorio no era un repositorio Git | Inicializado — **P0-00** |

### Vigentes

**1. El formulario de contacto no funciona en local.**
`/hcgi/platform` proxea la infraestructura de Horizons, no Vite. En local
devuelve el `index.html` del SPA (`text/html`, 200), así que PocketBase nunca
recibe la petición. → **P1-05**

**2. `console.warn` está silenciado globalmente.**
[`vite.config.js`](../apps/web/vite.config.js) hace `console.warn = () => {}`.
Si depuras avisos y no ves nada, es por esto. Ya ocultó un bug real durante
meses (**P2-07**).

**3. `vite.config.js` inyecta scripts de Horizons también en producción.**
El `index.html` del build pesa 8.7 KB en vez de ~1 KB. → **P2-11**

**4. Código muerto del scaffold.**
`AuthContext.jsx`, `ProtectedRoute.jsx`, los ~55 componentes de `ui/` (ninguno
importado) y la dependencia `react-helmet`. `knip.json` está configurado para
detectarlo. → **P2-06**

**5. No tocar `apps/web/plugins/`.**
Son plugins del editor visual de Horizons. Solo cargan en dev. Modificarlos
puede romper la integración con el builder. → [ADR-006](07-decisiones.md)

---

## Despliegue

El build produce un **sitio estático**: `dist/apps/web` se sube tal cual, sin
Node en el servidor.

### Requisito crítico del hosting

El servidor debe resolver `/nosotros` con `nosotros/index.html`. La mayoría de
hostings estáticos lo hacen solos:

```nginx
location / {
	try_files $uri $uri/ $uri/index.html /index.html;
}
```

❌ **Lo que NO debe hacer** es reescribir todo a `/index.html` (la configuración
típica de un SPA). Si lo hace, todas las rutas devuelven el HTML del home:
WhatsApp y LinkedIn muestran el título equivocado, Google indexa 6 URLs
idénticas y el navegador reporta un error de hidratación de React en cada ruta
interna. → **P0-06**

### Antes de publicar

- [ ] Confirmar el dominio en [`src/lib/site.js`](../apps/web/src/lib/site.js)
- [ ] Reemplazar el `favicon.svg` provisional por el logo oficial
- [ ] Añadir `og-image.jpg` (1200×630)
- [ ] Verificar la regla de rutas del hosting (**P0-06**)
- [ ] Publicar el aviso de privacidad antes de dejar el formulario activo (**P0-05**)

---

## Git

Repositorio inicializado el **2026-09-01**. `.gitignore` excluye
`node_modules/`, `dist/`, `apps/pocketbase/pb_data/`, el binario `pocketbase` y
`vault/temp/SESSION_JOURNAL.md`. `.gitattributes` normaliza los finales de línea
a LF (el repositorio se trabaja en Windows).

No hay remoto configurado.
