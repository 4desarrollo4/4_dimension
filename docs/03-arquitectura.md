# 03 — Arquitectura y entorno

**Última actualización:** 2026-09-02

---

## Origen del proyecto

Generado con **Hostinger Horizons** (constructor con IA), que dejó el sitio a
medias. Desde entonces se edita en el editor de código, y el **2026-09-02 se
retiró todo el andamiaje que quedaba** del constructor: 45 dependencias sin
usar, 61 archivos de código muerto, los 6 plugins de Vite del editor visual y
los 5 scripts que se inyectaban en el HTML de producción. Ver **ADR-011**.

Ya no queda residuo del scaffold: el proyecto declara **6 dependencias de
ejecución** —bajaron a 6 al retirar `pocketbase` del frontend, **ADR-012**— y
`vite.config.js` tiene 40 líneas.

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node **22** (`.nvmrc`) |
| Frontend | React **18.3** + Vite **7.3** (JSX, sin TypeScript) |
| Enrutado | react-router-dom **7** (SPA con prerender) |
| Estilos | Tailwind CSS **3.4** + tokens CSS en `src/index.css` |
| Componentes | Propios. shadcn/ui y Radix se retiraron el 2026-09-02 (ADR-011); `components.json` sigue ahí por si hiciera falta volver |
| Animación | framer-motion **11** |
| Iconos | lucide-react |
| Meta tags | **react-helmet-async** |
| Prerender | `renderToString` + `StaticRouter`, script propio |
| Backend del formulario | **PHP 8 + MySQL** en el hosting *(desde 2026-09-02, ADR-012)*. PocketBase 0.39.8 se conserva en `apps/pocketbase/` sin usar |
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
│   │   ├── vite.config.js    ← incluye el proxy a PocketBase
│   │   ├── public/           ← Vite copia esta carpeta ENTERA al build
│   │   │   ├── api/              ← backend del formulario
│   │   │   │   ├── contacto.php      ← guarda en MySQL + manda los 2 correos
│   │   │   │   ├── smtp.php          ← cliente SMTP sin dependencias
│   │   │   │   ├── config.example.php ← plantilla; el real NO se versiona
│   │   │   │   └── .htaccess         ← solo contacto.php es alcanzable
│   │   │   ├── logo-4d.png       ← el logo real (ya no del CDN)
│   │   │   ├── og-image.jpg      ← 1200×630, lo que se ve al compartir
│   │   │   ├── favicon.ico      ← 16/32/48; sin él /favicon.ico daba 404
│   │   │   ├── favicon-32.png  favicon-192.png  apple-touch-icon.png
│   │   │   ├── googlec3de623c….html ← verificación de Search Console (P1-07)
│   │   │   └── llms.txt          ← generado
│   │   ├── tools/
│   │   │   ├── generate-llms.js
│   │   │   ├── generate-images.js ← iconos + og-image desde el logo
│   │   │   └── prerender.js       ← 6 rutas + sitemap + robots
│   │   └── src/
│   │       ├── App.jsx           ← rutas (SIN Router)
│   │       ├── main.jsx          ← entrada de navegador
│   │       ├── entry-server.jsx  ← entrada de prerender
│   │       ├── index.css         ← tokens de diseño
│   │       ├── components/       ← los 11 propios (JsonLd, Seo, Reveal…)
│   │       ├── data/projects.js  ← datos de proyectos
│   │       ├── lib/site.js       ← dominio, rutas y OG
│   │       └── pages/            ← 6 páginas
├── db/schema.sql             ← tabla contact_requests (FUERA de public/)
│   └── pocketbase/           ← sin usar desde 2026-09-02; camino de vuelta a VPS
│       ├── pocketbase.exe    ← el único binario (sin versionar)
│       ├── pb_data/          ← la real, NO se toca
│       ├── pb_data_local/    ← la de desarrollo (sin versionar)
│       ├── pb_migrations/    ← 10 migraciones
│       └── pb_hooks/
│           ├── contact-notify.pb.js     ← el correo al cliente
│           └── smtp-desde-entorno.pb.js ← SMTP por variables de entorno
```

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev --prefix apps/web -- --port 3100` | Frontend en `:3100` (el puerto que se usa) |
| `.\pocketbase.exe serve --dir=./pb_data_local …` | Backend en `:8090` — ver *Desarrollo del backend* |
| `node tools/generate-images.js` | Regenera iconos y `og-image.jpg` desde el logo |
| `npm run dev` | ⚠️ **No lo uses**: intenta arrancar el binario de Linux |
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

## Backend del formulario — PHP + MySQL

Desde el **2026-09-02** (**ADR-012**). El sitio se publica en alojamiento
compartido, donde PocketBase no puede correr.

- El frontend hace `POST /api/contacto.php`, una ruta relativa que sirve el
  mismo hosting. En local la proxea `vite.config.js` a un PHP en `:8099`.
- La tabla la crea [`db/schema.sql`](../db/schema.sql). Las solicitudes se
  consultan en **phpMyAdmin**.
- Para ponerlo en marcha: [`06-backlog.md`](06-backlog.md) → **P0-08**.

## Backend anterior — PocketBase *(sin usar)*

`apps/pocketbase/` se conserva intacto como camino de vuelta si algún día se
pasa a un VPS, pero **el frontend ya no lo usa**. Servía en `0.0.0.0:8090` y el
frontend lo consumía vía `/hcgi/platform`.

### Colección `contact_requests` *(el esquema que heredó MySQL)*

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | text | requerido, 2–120 |
| `company` | text | opcional, máx 160 |
| `email` | email | requerido |
| `line` | select | `calzado` · `ropa` · `dotaciones` · `otro` |
| `message` | text | requerido, 10–4000 |
| `phone` | text | **requerido**, 7–40 |
| `consent` | bool | **requerido** — en PocketBase un booleano requerido debe ser verdadero, así que la base rechaza registros sin autorización |
| `consent_at` | date | opcional — marca de tiempo del consentimiento |
| `created` / `updated` | autodate | — |

Reglas de acceso: `createRule: ''` (creación pública), todo lo demás `null`
(solo superusuario). Correcto para un formulario público.

📁 [`apps/pocketbase/pb_migrations/1787766900_create_contact_requests.js`](../apps/pocketbase/pb_migrations/1787766900_create_contact_requests.js)

⚠️ **El binario `apps/pocketbase/pocketbase` es un ejecutable ELF de Linux** y no
arranca en Windows. Para desarrollar en local se usa `pocketbase.exe`, el
binario oficial de la misma versión — ver *Desarrollo del backend en local*.

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

**1. ~~El formulario de contacto no funciona en local.~~ ✅ Resuelto el 2026-09-02.**
`vite.config.js` proxea ahora `/hcgi/platform` → `http://127.0.0.1:8090`,
quitando el prefijo. Y el binario de PocketBase para **Windows** está instalado,
así que el backend corre en local. Ver *Desarrollo del backend* abajo.

**2. ⚠️ Los hooks de PocketBase corren en un CONTEXTO AISLADO.**

Una constante o una función declarada en el nivel superior de un archivo de
`pb_hooks/` **no existe dentro del handler**. Da
`ReferenceError: X is not defined` en tiempo de ejecución, no al arrancar.

```js
const LINEAS = { ... };              // ❌ el handler NO lo ve

onRecordAfterCreateSuccess((e) => {
    const LINEAS = { ... };          // ✅ así sí
    e.next();
}, 'contact_requests');
```

**Por qué duele tanto:** el hook se dispara, falla, el error queda en el log
interno de PocketBase que nadie mira, y la operación principal sigue como si
nada. Por fuera todo parece correcto. Nos costó un correo que nunca salía —
ver [`08-bitacora.md`](08-bitacora.md), 2026-09-02.

Si un handler necesita algo, decláralo **dentro**, aunque se repita entre
handlers. No lo "limpies" sacándolo fuera.

**3. ~~`console.warn` silenciado~~ · ~~scripts de Horizons en producción~~ ·
~~código muerto~~ · ~~no tocar `plugins/`~~** — ✅ resueltas el 2026-09-02.

Eran las cuatro trampas del andamiaje de Horizons y desaparecieron juntas al
retirarlo (**ADR-011**, que sustituye al ADR-006). Consecuencia práctica: **el
build ahora sí muestra los avisos**. El de Rollup sobre `import React from
'react'` es benigno — lo emite el runtime JSX automático y siempre estuvo ahí,
oculto tras el `console.warn = () => {}`.

**4. `sharp` ya no está instalada.**
[`tools/generate-images.js`](../apps/web/tools/generate-images.js) la necesita,
pero no forma parte del build y sus resultados están versionados en `public/`.
Ocupaba 28 MB. El propio script explica cómo reinstalarla si cambia el logo.

---

## Desarrollo del backend en local ✅ *(2026-09-02)*

El binario `pocketbase` que traía el repositorio era un **ELF de Linux**: no
arranca en Windows. Se descargó el binario oficial de Windows de la **misma
versión (0.39.8)** y se dejó como `apps/pocketbase/pocketbase.exe`, ignorado por
git. El ELF de Linux **se borró el 2026-09-02** — ocupaba 31 MB sin poder
usarse. Si algún día hiciera falta para desplegar en Linux, se baja de las
publicaciones oficiales de PocketBase.

```bash
# checksum verificado contra el oficial del repositorio de PocketBase
# 430f36b50b6c01849a7960e0b296bf7a5aebd3674a969d0d30ccafea789c5b9f
```

⚠️ **Se usa `pb_data_local/` como base de datos, NO `pb_data/`.** La real la
creó el binario de Linux y puede tener una clave de cifrado que no tenemos.
`pb_data_local/` está en `.gitignore`.

### Levantar el backend

```bash
cd apps/pocketbase
./pocketbase.exe serve --http=127.0.0.1:8090 --dir=./pb_data_local --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false
```

Panel: `http://127.0.0.1:8090/_/`

**Superusuario de la base local.** 🔒 **Sus credenciales no se escriben aquí**:
el repositorio es público y los rastreadores de credenciales indexan cualquier
contraseña que aparezca en un archivo versionado.

La migración `1764579159_create_superuser.js` lo crea leyendo dos variables de
entorno, `PB_SUPERUSER_EMAIL` y `PB_SUPERUSER_PASSWORD`. Defínelas antes de
levantar `pb_data_local` por primera vez:

```bash
$env:PB_SUPERUSER_EMAIL = "tu-correo@ejemplo.com"
$env:PB_SUPERUSER_PASSWORD = "la-que-elijas"
```

Si borras esa carpeta y la vuelves a crear, el superusuario se regenera con
esas mismas variables. Es la base **local de pruebas**: no contiene nada real.

### Correo — el buzón está en Hostinger, NO en Google ✅ *(2026-09-02)*

`info@4dimensionsas.com` se creó en **Hostinger**, y su contraseña de
aplicación se genera desde el panel de correo de Hostinger.

| Ajuste | Valor |
|---|---|
| Host | `smtp.hostinger.com` |
| Puerto | `465` |
| TLS | **activado** (implícito, no STARTTLS) |
| Username | `info@4dimensionsas.com` |
| Remitente | `info@4dimensionsas.com` |

⚠️ **No uses `smtp.gmail.com`.** Se intentó y devuelve
`535 Username and Password not accepted`. El error engaña: parece que la
contraseña está mal, pero lo que pasa es que se autentica contra un servidor
que no conoce esa cuenta. Una clave de Hostinger solo sirve contra el SMTP de
Hostinger.

📌 **Los envíos correctos no dejan rastro en el log.** `logs.minLevel` está en 8,
que guarda solo errores: silencio tras un envío significa que salió bien. Si
buscas confirmación, mírala en la carpeta *Enviados* del buzón.

### Dos correos *(desde el 2026-09-02 por la tarde)*

El formulario envía **dos**, ambos desde `info@4dimensionsas.com`:

1. **Aviso interno** a `info@`, con `Reply-To` del cliente — responder desde el
   buzón le escribe directamente a quien preguntó.
2. **Acuse de recibo** al cliente, con el mismo texto y diseño que enviaba el
   hook de PocketBase.

Por la mañana se había dejado un solo correo, porque el equipo se enteraba por
la colección de PocketBase. Al pasar a alojamiento compartido esa colección
desaparece del servidor, así que el aviso interno vuelve a ser necesario.
Ver **ADR-012** y [`api/contacto.php`](../apps/web/public/api/contacto.php).

**El orden importa:** primero se guarda en MySQL, después el aviso, después el
acuse. Si el correo falla, la solicitud sigue guardada y `mail_status` dice qué
pasó. Si se topa el límite de envíos por hora, se guarda y se omiten los correos
— nunca se pierde una solicitud.

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
`node_modules/`, `dist/`, `apps/pocketbase/pb_data/` y los binarios de
PocketBase. `.gitattributes` normaliza los finales de línea
a LF (el repositorio se trabaja en Windows).

No hay remoto configurado.
