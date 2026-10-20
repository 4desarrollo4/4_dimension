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
`apps/pocketbase` (PocketBase 0.39.8). Nació de un scaffold de **Hostinger
Horizons**, cuyo andamiaje se retiró por completo el 2026-09-02
([ADR-011](docs/07-decisiones.md)). El formulario dejó PocketBase por PHP +
MySQL el mismo día ([ADR-012](docs/07-decisiones.md)). Quedan **6 dependencias
de ejecución** y **23 archivos** en `src/`.

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

## Cómo levantar el proyecto

Hacen falta **dos procesos**, cada uno en su terminal.

**1 · Backend** (PocketBase, en `:8090`)

```bash
cd "C:\4 dimension\apps\pocketbase"; .\pocketbase.exe serve --http=127.0.0.1:8090 --dir=./pb_data_local --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false
```

**2 · Frontend** (Vite, en `:3100`)

```bash
npm run dev --prefix apps/web -- --port 3100
```

Y ya: `http://localhost:3100`.

> 📌 **Para probar el formulario** hace falta un tercer proceso: PHP sirviendo
> `public/`, porque desde el 2026-09-02 el formulario va contra
> `/api/contacto.php` y no contra PocketBase ([ADR-012](docs/07-decisiones.md)).
>
> ```bash
> php -S 127.0.0.1:8099 -t apps/web/public
> ```
>
> `vite.config.js` proxea `/api` → `:8099`. Sin ese proceso el resto del sitio
> funciona igual; solo el envío del formulario deja de poder probarse. También
> hace falta un MySQL con `db/schema.sql` aplicado y un `api/config.php`.

> ⚠️ El único binario es `pocketbase.exe`, descargado del repositorio oficial de
> PocketBase 0.39.8 y **no versionado**. Si no está, hay que volver a bajarlo.
> (El `pocketbase` sin extensión era un ELF de Linux que no arranca en Windows;
> se borró el 2026-09-02 porque ocupaba 31 MB sin poder usarse.)
>
> ⚠️ Se usa `pb_data_local/`, **no** `pb_data/`. La real la creó el binario de
> Linux y puede tener una clave de cifrado que no tenemos.

> ⚠️ **PocketBase ya no es el backend del formulario.** Desde el 2026-09-02 el
> sitio se publica en alojamiento compartido de Hostinger, donde un binario de
> Go no puede correr. `apps/pocketbase/` se conserva **intacto** como camino de
> vuelta si algún día se pasa a un VPS, pero el frontend no lo usa.

### Panel de PocketBase (histórico)

`http://127.0.0.1:8090/_/`

🔒 **Las credenciales no van aquí.** El repositorio es público: cualquier
usuario y contraseña escritos en un archivo versionado los indexan los
rastreadores de credenciales en minutos.

La migración [`1764579159_create_superuser.js`](apps/pocketbase/pb_migrations/1764579159_create_superuser.js)
las lee de dos variables de entorno, `PB_SUPERUSER_EMAIL` y
`PB_SUPERUSER_PASSWORD`. Defínelas en tu terminal antes de arrancar PocketBase,
o crea el superusuario a mano la primera vez. Es la base **local de pruebas**,
no hay nada real dentro.

Ahí se configura el SMTP (ver [`docs/03-arquitectura.md`](docs/03-arquitectura.md)).

---

## Comandos

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
| [`docs/09-despliegue.md`](docs/09-despliegue.md) | **Paso a paso para publicar en Hostinger**, con el formulario |
| [`docs/10-plan-v2.md`](docs/10-plan-v2.md) | **Plan de la versión 2**: diagnóstico, 6 sprints e historias |
| [`wiki/`](wiki/) | Páginas de la wiki de GitHub: Scrum, historias y material necesario |

---

## Estado actual (2026-10-20)

**El sitio está en línea en `4dimensionsas.com`** y el formulario funciona de
extremo a extremo. Pero **está en marcha una versión 2**, porque la dirección de
la empresa revisó el sitio y lo rechazó.

### 🔴 Lo primero que debe saber una sesión nueva

📖 **El plan completo de la v2 está en [`docs/10-plan-v2.md`](docs/10-plan-v2.md).**
Léelo antes de tocar nada. Lleva el diagnóstico con evidencia, los 6 sprints y
las historias de usuario.

| Pendiente | Estado |
|---|---|
| ⚠️ **Subir `apps/web/public/.htaccess` al servidor** | **Preparado desde el 3-sep y SIN SUBIR.** Hasta que se suba, `/nosotros` devuelve 301 y Google solo indexa 1 de 6 páginas |
| ⚠️ Subir `favicon.ico` y republicar | `/favicon.ico` da 404; es parte de por qué no sale el logo en el buscador |
| 🚧 Las 14 fotos de la empresa | Bloquean los sprints 3 y 4. Lista en [`wiki/Material-necesario.md`](wiki/Material-necesario.md) |
| 🚧 Año de fundación, nombres del equipo, NIT | Bloquean secciones enteras |
| Cambiar la contraseña de la base de datos | Quedó expuesta en una captura de pantalla |

### Las cuatro objeciones de la dirección, auditadas

Las cuatro son ciertas y las cuatro están medidas:

| Objeción | Qué se encontró |
|---|---|
| «Muy básico» | ~34 secciones pero solo **4 plantillas** repetidas 28 veces |
| «Las imágenes no nos representan» | **11 de 11 imágenes son de banco externo. Cero fotos de la empresa** |
| «Muchas secciones repiten lo mismo» | El cierre de las 3 páginas de línea es **la misma cadena literal** |
| «Se ve borroso o muy pequeño» | **75 % del texto a ≤14px**, cuerpo a peso 400, y `font-smoothing: antialiased` adelgaza los trazos |

### Decisiones ya tomadas para la v2

- **Colores:** se mantienen intactos.
- **Tipografía: Archivo** sustituye a Manrope en todo el sitio. Requiere un ADR
  nuevo, porque hoy la tipografía está declarada «cerrada» en `04-diseno.md`.
- **Escala:** cuerpo 16→18px, tarjetas y listas 14→16px, eyebrows 12→13px.
- **Alcance:** se mantiene el lenguaje visual y se enriquece el contenido.
  El ADR-010 sigue vigente — **no es un rediseño visual desde cero**.
- **Método:** Scrum ligero. La dirección es Product Owner y aprueba cada sprint.

### Repositorio y wiki

🔗 **https://github.com/4desarrollo4/4_dimension** — rama `main`, **público**.

⚠️ **Es público: nunca escribas una contraseña en un archivo versionado.** Las
credenciales se leen de variables de entorno o de `api/config.php`, que está
ignorado.

La carpeta [`wiki/`](wiki/) tiene las páginas de la wiki de GitHub en Markdown.
**Todavía no están subidas**: GitHub no crea el repositorio de la wiki hasta que
se guarda la primera página desde la web. Una vez creada, se suben con:

```bash
git clone https://github.com/4desarrollo4/4_dimension.wiki.git
# copiar wiki/*.md dentro, commit y push
```

La wiki **no duplica `docs/`** a propósito: la documentación técnica vive en el
repositorio y la wiki aporta la capa de Scrum e historias de usuario.

### Lo que ya está hecho

**2026-09-01:** Git · build arreglado · prerender de las 6 rutas con OG y
canonical · `sitemap.xml` + `robots.txt` · reescritura editorial (9 CTA → 0) ·
consentimiento en el formulario · accesibilidad.

**2026-09-02:** datos reales · logo e iconos propios · el correo funcionando ·
**retirada completa del andamiaje de Horizons** (288 MB → 177 MB, 52
dependencias → 6, `vite.config.js` de ~400 líneas a 40) · **el formulario pasó a
PHP + MySQL** ([ADR-012](docs/07-decisiones.md)) · publicado e indexado.

**2026-10-19/20:** auditoría de seguridad · auditoría de contenido con evidencia
· plan de la v2 · **todo el trabajo de septiembre commiteado y subido a GitHub**
· credenciales retiradas de los archivos versionados.

### Reglas que impone lo ya construido

- Una ruta nueva se registra en `App.jsx` **y** en `src/lib/site.js`.
- Nada nuevo dentro de `public/` que lleve secretos: Vite copia esa carpeta
  entera al build.
- Ningún componente toca `window`, `document` o `localStorage` fuera de un
  efecto: ese código también corre en Node. Ver [ADR-008](docs/07-decisiones.md).
- **Dos enlaces a `/contacto` por página**, navbar y footer, y ninguno más en el
  cuerpo. Antes de añadir un enlace, pregúntate a dónde lleva, no qué dice.
  Ver [ADR-009](docs/07-decisiones.md).
- Al cambiar un título o una descripción, cámbialo en `<Helmet>` **y** en
  `<Seo>`: están duplicados a propósito.
- **El formulario tiene tres piezas y un orden que no es negociable:** guardar
  en MySQL primero, avisar a `info@` después, acusar recibo al cliente al final.
  Un fallo de correo **nunca** puede costar una solicitud, y la prueba del
  consentimiento (Ley 1581) vive en la fila, no en el correo.
  Ver [ADR-012](docs/07-decisiones.md).
- **`api/config.php` no se versiona ni viaja en el build.** Lleva contraseñas y
  vive solo en el servidor. `tools/prerender.js` lo borra del build si aparece.
- **No añadas dependencias sin necesidad real.** Son 7 y hubo que trabajar para
  llegar ahí. Antes de instalar algo, mira si se resuelve con lo que hay.
  No existe `src/components/ui/` ni `lib/utils.js` (`cn`): si necesitas un
  componente de shadcn, genéralo con su CLI — `components.json` sigue ahí — y
  déjalo anotado. Ver [ADR-011](docs/07-decisiones.md).
- **Nada de `Reveal` en la primera pantalla.** El sitio se prerenderiza y un
  `Reveal` se sirve con `opacity: 0`. El hero entra con CSS (`.rise-in` /
  `.rise-solid`). Ver [`docs/04-diseno.md`](docs/04-diseno.md).

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
