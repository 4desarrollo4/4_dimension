# 08 — Bitácora de sesiones

**Última actualización:** 2026-10-20

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

## 2026-10-19/20 · Auditoría de las objeciones, plan v2 y el proyecto a GitHub

**Origen.** La dirección de la empresa revisó el sitio y lo rechazó: «muy
básico», «las imágenes no nos representan», «muchas secciones repiten lo mismo».
Después añadió una cuarta: los textos «se ven borrosos o muy pequeños».

**Las cuatro son ciertas, y ahora están medidas**

| Objeción | Evidencia |
|---|---|
| Muy básico | ~34 secciones, **4 plantillas** repetidas 28 veces |
| Las imágenes no nos representan | **11 de 11 de banco externo, 0 de la empresa**. Y `NosotrosPage.jsx:57` tenía un `alt` afirmando mostrar al equipo sobre un render genérico |
| Repiten lo mismo | El cierre de las 3 líneas es **la misma cadena literal**; «no comercializamos catálogos» sale **3 veces en la home**; los 4 proyectos se renderizan **8 veces**; `/nosotros` no aporta **ni un hecho** nuevo |
| Borroso o muy pequeño | **75 % del texto a ≤14px**, cuerpo a peso 400 sobre fondo casi negro, y `-webkit-font-smoothing: antialiased` adelgazando los trazos. El contraste (7,08:1) estaba bien — **el problema era el grosor, no el color** |

**Auditoría de seguridad** (hecha el 03-sep, documentada ahora). Sin
vulnerabilidades críticas. Aguantaron en producción: SQL en el campo `line`,
inyección de cabecera SMTP, consentimiento falsificado, cuerpo de 25 KB, y el
acceso directo a `config.php`, `smtp.php` y los listados de directorio (403).
Cinco hallazgos menores, el mayor **DMARC en `p=none`**: SPF y DKIM existen pero
sin política de aplicación, así que hoy se puede suplantar el dominio.

**Error de redirección de Google** (07-sep). El sitemap entrega `/nosotros`, el
servidor redirige a `/nosotros/`, y esa página declara como canónica la versión
que redirige. Google lo reportó y **solo indexó 1 de 6 páginas**. Se preparó un
`.htaccess` que lo elimina y añade las cinco cabeceras de seguridad que faltaban
— pero **seis semanas después seguía sin subirse**, así que el error sigue vivo.

> 📌 **Lección registrada:** algo que funciona en local pero no está publicado no
> está hecho. Por eso la definición de hecho de la v2 exige desplegar y
> verificar en producción.

**El proyecto a GitHub.** Los 154 cambios del árbol de trabajo, que llevaban
desde septiembre sin commitear, se repartieron en **4 commits con historia
legible**: retirada del andamiaje, el formulario a PHP+MySQL, los activos de
despliegue y la documentación. Repositorio **público** en
`4desarrollo4/4_dimension`.

Antes de subir se retiraron las credenciales del superusuario de PocketBase de
`CLAUDE.md` y `03-arquitectura.md` — ahora se leen de variables de entorno.
Verificado que no queda ninguna contraseña real versionada y que el
identificador de hosting no aparece en ningún archivo subido.

También salieron de `public/` dos archivos que se habían colado: un PDF de
8,9 MB y una copia del logo por WhatsApp. `public/` se copia entera al build, así
que habrían acabado publicados.

**Wiki.** GitHub no da wikis en repos privados del plan gratuito; por eso el repo
se hizo público. Se escribieron 5 páginas —portada, historias de usuario,
metodología Scrum, material necesario y barra lateral— que viven en `wiki/` del
repositorio. **Falta crear la primera página desde la web** para que GitHub
inicialice el repositorio de la wiki y se puedan subir.

**Decisiones tomadas**
- Ninguna como ADR todavía. El plan v2 propone dos: **cambiar la tipografía a
  Archivo** (deroga el cierre tipográfico de `04-diseno.md`) y **«una idea, una
  página»** contra la repetición. Se registrarán al ejecutarse.

**Dónde quedó / qué sigue**
- 📖 El plan completo está en **[`10-plan-v2.md`](10-plan-v2.md)**.
- ⚠️ Lo más urgente sigue siendo **subir el `.htaccess`**: es un arreglo ya
  escrito y probado que lleva seis semanas sin aplicarse.
- 🚧 Los sprints 3 y 4 están bloqueados hasta que lleguen **las 14 fotos**.

---

## 2026-09-02 · El formulario deja PocketBase: PHP + MySQL para publicar en Hostinger

**Origen.** Tras la limpieza del andamiaje, el propietario preguntó si podía
publicar en su plan de Hostinger. Sí — pero al revisarlo apareció un problema
que no venía de la limpieza: el formulario llamaba a `/hcgi/platform`, una ruta
que **solo resuelve la infraestructura de Horizons**. En alojamiento compartido
no existe, y el formulario habría fallado en el primer envío.

**Una corrección importante durante la sesión**

Primero se planteó una salida sin base de datos, solo correos. El propietario
preguntó si de verdad no hacía falta base de datos. **Tenía razón, y la
respuesta inicial se quedó corta**: lo que no puede correr en alojamiento
compartido es PocketBase (binario de Go), no una base de datos. **El plan
incluye MySQL** — se comprueba en la propia oferta, que ofrece WordPress, y
WordPress no arranca sin MySQL.

Con MySQL sobre la mesa, la decisión cambió, y por dos razones de peso:

1. La **prueba del consentimiento** (Ley 1581 de 2012 y Decreto 1074 de 2015,
   que obliga a *conservarla*) es mucho más sólida en una fila fechada que en un
   correo suelto.
2. La regla que el propio hook llevaba escrita — *«Nunca tumbes la petición por
   un fallo de correo»* — solo se sostiene si hay dónde guardar.

**Qué se construyó**

| Pieza | Qué hace |
|---|---|
| `db/schema.sql` | Tabla `contact_requests`. **Fuera de `public/`**: ahí sería descargable |
| `api/contacto.php` | Valida → guarda en MySQL → avisa a `info@` → acusa recibo al cliente |
| `api/smtp.php` | Cliente SMTP sin dependencias (no hay Composer en compartido) |
| `api/config.php` | Credenciales. No versionado; se pone a mano en el servidor |
| `api/.htaccess` | Solo `contacto.php` es alcanzable desde el navegador |

Va en `api/` y no como `/contacto.php` **a propósito**: Apache con MultiViews
podría resolver `/contacto` como `contacto.php` en vez de `contacto/index.html`,
llevándose por delante la página de contacto.

**Decisión del propietario:** vuelven los **dos correos**. El aviso interno se
había quitado esa misma mañana porque el equipo se enteraba por la colección de
PocketBase; al desaparecer esa colección del servidor, ese correo pasa a ser la
vía principal de aviso.

**Cómo se verificó**

Se descargó PHP 8.3.33 portable (hash SHA-256 comprobado contra el oficial) a la
carpeta temporal, y se levantó un **MySQL 8.4.3 aislado en el puerto 3399** con
su propio directorio de datos — el MySQL del equipo no se tocó.

| Prueba | Resultado |
|---|---|
| Endpoint: método, formato, validación, trampa antibots | **25 de 25** |
| Diálogo SMTP contra servidor con TLS real y certificado verificado | **18 de 18** |
| Envío completo desde el navegador | fila guardada + **2 correos capturados**, `mail_status = 'aviso:ok acuse:ok'` |
| Escapado de HTML malicioso en los correos | `<script>`, `<img onerror>` y un enlace de phishing salen como texto |
| Límite por hora | las 6 primeras se guardan y envían; de ahí en adelante se guardan y se omite el correo |
| Salvaguarda del build | un `config.php` señuelo **no** sobrevive a `npm run build` |

La prueba más útil fue la del fallo: con el SMTP caído, la solicitud **se guardó
igual**, el error quedó en `mail_status` y el visitante vio «Mensaje recibido».
Es exactamente el comportamiento que se buscaba.

**Estado del backlog**
- P0-08 (poner en marcha el formulario en el hosting) → ⬜ **nuevo, y bloquea el
  formulario en producción**
- P1-05 → anotado: el proxy de Vite ahora apunta a PHP en `:8099`

**Decisiones tomadas**
- **ADR-012** · El formulario pasa de PocketBase a PHP + MySQL.

**Dónde quedó / qué sigue**

📌 **Cierre de sesión: auditoría de coherencia entre código y documentos.**
Se comprobó que cada afirmación de los docs coincide con el disco: archivos que
se citan y existen, los que se dicen borrados y no están, columnas del `INSERT`
contra `schema.sql`, enlaces internos y fechas. Se corrigieron cuatro cifras que
habían quedado atrás — `CLAUDE.md` y `03-arquitectura.md` decían «7 dependencias
y 24 archivos» cuando ya eran **6 y 23** tras retirar `pocketbase`, y
`09-despliegue.md` decía «20 archivos, 909 KB» cuando el build son **22 y
918 KB** al haberse añadido `favicon.ico` y el archivo de verificación de Google.

También se generó **`favicon.ico`** (16/32/48 desde el logo) porque
`/favicon.ico` devolvía 404, y se declaró en `index.html`. No era la causa de que
Google no muestre aún el logo —eso es cuestión de días, el favicon se rastrea
aparte— pero cerraba un 404 innecesario.

**El sitio quedó indexado en Google el mismo día**, con su título y descripción
correctos. Propiedad verificada en Search Console por archivo HTML, que vive en
`apps/web/public/` para que viaje en cada build y no se pierda al republicar.

---

🎉 **DESPLIEGUE COMPLETO el 2026-09-02.** El sitio está en línea en
`4dimensionsas.com` **y el formulario funciona de extremo a extremo**: envío
desde el navegador → «Mensaje recibido» → fila en `contact_requests` con
`mail_status = aviso:ok acuse:ok` → los dos correos entregados. **P0-06 y P0-08
cerrados.**

### Los cuatro tropiezos, y qué los causó de verdad

Ninguno fue del código del proyecto. Los cuatro merecen quedar escritos:

1. **PHP no aparecía en hPanel.** El dominio estaba registrado pero **sin sitio
   de hosting**. En Hostinger, PHP se configura por **sitio**, no por dominio, y
   los sitios del constructor (*Modo agéntico*) ni siquiera tienen Panel. Hubo
   que crear un sitio vacío para el dominio.

2. **`config.php` con error de sintaxis.** **Chrome traducía el código PHP** en
   el editor del administrador de archivos: mostraba y guardaba `declarar` por
   `declare`, `devolver` por `return` y `'usuario'` por `'user'`. También
   traducía los nombres de archivo (`assets`→`activos`, `index.html`→
   `índice.html`), lo que provocó un 404 al buscar un archivo por su nombre real.
   **Desactivar Google Traductor antes de editar código en el navegador.**

3. **SMTP `535 authentication failed`.** Hostinger **sí** ofrece contraseñas de
   aplicación para correo — lo dimos por descartado y era justo lo correcto. La
   que estaba puesta tenía una mayúscula cambiada respecto a la generada
   (`iKyq` en vez de `ikyq`). Generar una nueva y pegarla con el botón *Copiar*.

4. **Un 500 imposible de cazar.** Se estaba probando en **`localhost:3100`**, no
   en el dominio. Sin un PHP local escuchando en `:8099`, el proxy de Vite
   devuelve 500. El endpoint de producción respondía `{"ok":true}` todo ese rato.
   **Mirar siempre la URL de la petición en el panel Network antes de diagnosticar.**

### Cómo se diagnosticó sin registro de errores

hPanel **no expone el registro de errores de PHP** en este plan. Hubo que subir
tres scripts temporales a `public_html`, cada uno cerrando un tramo: el diálogo
SMTP paso a paso, el envío real usando `smtp.php`, y una llamada al propio
endpoint para leer el cuerpo de la respuesta que la consola del navegador oculta.

El diseño de **ADR-012** demostró su valor en producción: en el primer envío el
correo falló por la contraseña y **la solicitud se guardó igual**, con el fallo
anotado en `mail_status`. Nada se perdió.

---

✅ **El sitio está EN LÍNEA en `4dimensionsas.com` desde el 2026-09-02.**
Los 20 archivos subidos, PHP en 8.3, y **P0-06 resuelto**: el alojamiento
compartido de Hostinger resuelve `/nosotros` con `nosotros/index.html` por su
cuenta, sin `.htaccess`. Verificado en WhatsApp — sale el título propio de la
página, su descripción y la og-image. El prerender cumple su objetivo en
producción.

📌 **Trampa que costó un rato:** WhatsApp cachea las vistas previas. La primera
comprobación mostró solo el nombre del dominio, no porque el hosting fallara
sino porque había guardado la tarjeta de cuando el sitio devolvía 403. Con
`?x=1` al final del enlace se fuerza una lectura nueva.

📌 **Otras dos trampas del despliegue, ambas del navegador y no del proyecto:**
el extractor de ZIP de Hostinger crea una carpeta con el nombre del archivo en
vez de volcar el contenido —hubo que mover los 20 archivos un nivel arriba—, y
**Chrome traducía el código PHP al español** dentro del editor del
administrador de archivos: mostraba `declarar`, `devolver` y `'usuario'` en
lugar de `declare`, `return` y `'user'`. Guardar así habría dejado el
`config.php` con un error de sintaxis. Hay que desactivar Google Traductor
antes de editar código en el navegador.

📌 **Avance del despliegue, 2026-09-02 por la tarde.** Al empezar el P0-08
apareció un paso que faltaba en la guía: **`4dimensionsas.com` no tenía sitio de
hosting**. En hPanel existían dos sitios del constructor en *Modo agéntico*
—uno de ellos `fourth-dimension-eso-sas-…hostingersite.com`, el que Horizons
dejó a medias— y esos **no tienen Panel**, así que no admiten subir archivos ni
configurar PHP. El propietario creó un sitio vacío para el dominio; ya aparece
con *Herramientas · Panel*, icono `</>`, SSL activo y copias diarias.

La guía se corrigió: ahora son **siete pasos**, con *Crear el sitio de hosting*
como paso 01. La confusión de origen es que PHP se configura en **Sitios web**,
no en **Dominios**, donde el propietario lo estaba buscando.

⚠️ **El formulario NO funciona en producción hasta hacer los tres pasos de
P0-08**: crear la base de datos e importar el esquema, crear el `config.php` en
el servidor, y probar un envío real.

- `apps/pocketbase/` **se conserva intacto** como camino de vuelta si algún día
  se pasa a un VPS. Solo se retiró la dependencia npm `pocketbase` y
  `src/lib/pocketbaseClient.js`, que ya no importaba nadie. Quedan **6
  dependencias de ejecución**.
- Sigue pendiente **P0-06**: confirmar que el hosting resuelve `/nosotros`.
- Dato a vigilar: el buzón tiene un **límite de envíos por hora** y ahora cada
  solicitud consume **dos**. Está anotado como pendiente de comprobar desde
  P1-05. Si resultara ser 5/hora, son 2 solicitudes por hora antes de topar.

---

## 2026-09-02 · Se retira el andamiaje de Horizons: 288 MB → 178 MB

**Origen.** El propietario preguntó por qué la carpeta pesaba 288 MB con 33.958
archivos si el sitio es sencillo, comparándola con un ecommerce suyo que pesa
menos. Se midió antes de tocar nada.

**El diagnóstico**

El peso no era del sitio, era del taller. Y el hallazgo que lo explicaba todo:
la app importaba **7 paquetes** y el `package.json` declaraba **52**. De los 85
archivos de `src/`, solo **23** estaban conectados a la aplicación.

Los 55 componentes de `src/components/ui/` formaban una isla: los únicos
archivos que importaban `@/components/ui/*` eran **otros componentes de `ui/`**.
Y eran ellos los que mantenían "vivas" las 28 dependencias de Radix. `knip.json`
los declaraba a los 55 como *entry points*, así que la herramienta de limpieza
del proyecto estaba configurada para no ver el problema: reportaba 4
dependencias sobrantes en vez de 45.

**Qué se hizo** — en tres fases, con verificación entre cada una

1. **Basura pura.** El binario `pocketbase` (ELF de Linux, 31 MB, inservible en
   Windows) y la caché de Vite (21 MB). `pb_data/` **no se tocó**.
2. **Código y dependencias.** 61 archivos muertos borrados, 45 dependencias de
   ejecución retiradas (quedan 7), más `sharp` y `terser`. `knip.json` depurado
   de 8.792 a 651 bytes — incluía 26 *entry points* fantasma de un ecommerce con
   Supabase que nunca existió en el disco.
3. **El andamiaje.** Los 6 plugins de Vite del editor visual, `vault/`, el
   `optimizeDeps.include: allDeps` y los 5 scripts que se inyectaban en el HTML
   **de producción**. `vite.config.js`: ~400 líneas → 40.

**Cómo se verificó que el sitio no cambió**

Se compiló antes de empezar y se guardaron los hashes de los 26 archivos del
build. Al terminar:

| Comprobación | Resultado |
|---|---|
| JS del cliente | **hash idéntico** (`e1c1bad…`), 418.766 bytes |
| Bundle SSR | idéntico |
| HTML de las 6 páginas | idéntico salvo los scripts retirados |
| Clases CSS que el sitio usa | 326 de 326 conservan su regla |
| Estilos calculados, home | 383 elementos, **0 diferencias** |
| Estilos calculados, contacto | 154 elementos, **0 diferencias** |

La última prueba fue la decisiva: se cargó el CSS anterior encima del nuevo en
la página ya renderizada y se compararon 23 propiedades calculadas de cada
elemento. Ni una cambió. Además se recorrieron las 6 páginas en el navegador
(sin errores de consola), se probó la navegación SPA y el menú móvil abre y
cierra con sus 6 enlaces.

**Resultado**

| | Antes | Después |
|---|---|---|
| Carpeta | 288 MB | **178 MB** |
| Archivos | 33.958 | **19.637** |
| `node_modules` | 265 MB | 172 MB |
| Dependencias de ejecución | 52 | **7** |
| Archivos en `src/` | 85 | **24** |
| CSS publicado | 84,96 KB (14,77 gzip) | **25,05 KB (5,83 gzip)** |
| HTML por página | −7.465 bytes | |
| JS publicado | 418,77 KB | **sin cambio** |

**Lo que no mejoró, y por qué**

El JS no bajó **ni un byte**: Vite ya hacía tree-shaking de las 45 dependencias
muertas, que nunca llegaban al build. Los 418 KB son React, el router,
framer-motion y helmet — todo en uso. Reducirlos exige **P2-09**
(code-splitting), no limpieza.

También quedó corta una estimación previa: se anunció que quitar `@babel` y
`esbuild` ahorraría ~11 MB. No ahorran nada — los arrastran
`@vitejs/plugin-react` y `vite`, y son obligatorios. La fase 3 no bajó el disco;
su valor está en el HTML publicado y en el config.

**Estado del backlog**
- P2-06 (código muerto del scaffold) → ✅
- P2-11 (scripts de Horizons en producción) → ✅
- P2-09 (code-splitting) → ⬜, ahora es el único camino para bajar el JS

**Decisiones tomadas**
- **ADR-011** · Se retira el andamiaje de Hostinger Horizons. **Sustituye al
  ADR-006** ("no se toca `apps/web/plugins/`"), que existía solo para no romper
  el editor visual. El propietario confirmó que Horizons dejó el sitio a medias,
  que lo descargó y que ya no usa ese editor.

**Dónde quedó / qué sigue**
- El sitio publicado es equivalente al de antes, con menos peso. **Nada que
  reverificar en producción** más allá de lo habitual.
- Sigue pendiente **P0-06**: confirmar que el hosting resuelve `/nosotros` con
  `nosotros/index.html`.
- ⚠️ Ya **no** se puede reabrir el proyecto en el editor visual de Horizons. Si
  hiciera falta, `apps/web/plugins/` y el `vite.config.js` viejo están en el
  historial de git, anteriores a esta fecha.
- Quedan dos herramientas de desarrollo que pesan ~26 MB entre ellas y sus
  dependencias: `knip` (arrastra `zod`) y `concurrently` (arrastra `rxjs`).
  Se conservaron porque los scripts de la raíz las usan.

---

## 2026-09-02 · Datos reales, logo propio y la imagen para compartir

**Qué aportó el propietario**

| Dato | Valor |
|---|---|
| Dominio | `4dimensionsas.com` |
| Buzón institucional | `info@4dimensionsas.com` — `comercial@` **no existe** |
| Teléfono | `+57 316 577 5539` (el publicado, `+57 (601) 743 4400`, era erróneo) |
| Dirección | `Cra. 34a #27a-22 sur, Bogotá D.C.` |
| Logo | el archivo real |

Todo entró primero en [`02-empresa.md`](02-empresa.md) y después al código,
como manda el [ADR-002](07-decisiones.md).

**El correo, resuelto**

El buzón está en **Hostinger**, no en Google. Ese era el origen del `535`: se
autenticaba contra `smtp.gmail.com`, un servidor que no conoce esa cuenta. La
contraseña siempre estuvo bien.

```
smtp.gmail.com:587  →  smtp.hostinger.com:465 (TLS)
```

Envío real ejecutado, sin errores. Se envía **un solo correo**: el acuse de
recibo al cliente. El aviso interno se quitó por decisión del propietario.

📌 Un envío correcto **no deja rastro en el log**: `logs.minLevel` está en 8 y
solo guarda errores. El silencio es la confirmación.

**Imágenes: P0-02 cerrado**

Se descargó el logo del CDN de Hostinger —con permiso explícito— y se creó
[`tools/generate-images.js`](../apps/web/tools/generate-images.js), que produce
los tres iconos y el `og-image.jpg` de 1200×630 a partir de él. Si el logo
cambia, se vuelve a correr y se regenera todo.

🐞 **El logo es un cuadrado negro opaco, no transparente.** Las esquinas son
`[0,0,0,255]`. Al componer el og-image, ese cuadrado se recortaba contra el
degradado del fondo y se veía el borde. Se resolvió con una máscara circular.

**Y de paso, P2-02 a medias**

El logo dejó de venir del CDN de Hostinger: ahora se sirve desde el propio
dominio. Era un riesgo real — si se desactivaba ese proyecto, el sitio se
quedaba sin logo. Las 11 imágenes de producto siguen en el CDN.

**Verificado sobre el build**

| Comprobación | Resultado |
|---|---|
| `og:image` | `https://4dimensionsas.com/og-image.jpg` ✅ |
| Iconos (32, 192, apple-touch) | ✅ generados y enlazados |
| JSON-LD: logo, teléfono, dirección | ✅ los tres reales |
| Referencias al CDN de Hostinger | **0** ✅ |
| Teléfono viejo en el sitio | **0** ✅ |
| Errores de consola | ninguno |

**Estado del backlog**

P0: 6 ✅, 1 ⬜ (**P0-06**, el hosting). P1: 4 ✅, 1 ⚠️, 1 🟡. P2: 8 ✅, 1 🟡, 4 ⬜.

**Dónde quedó / qué sigue**

El sitio está listo para publicar salvo dos cosas:

1. **P0-06** — confirmar que el hosting resuelve `/nosotros` con
   `nosotros/index.html` y no con el `index.html` de la home.
2. **NIT** — es lo único que falta para la política de tratamiento de datos.

---

## 2026-09-02 · El backend corriendo en local, y dos bugs que habrían llegado a producción

**Por qué esta sesión existe**

El propietario cuestionó mi afirmación de que no se podían enviar correos, y
puso el ejemplo de otro proyecto suyo que envía por Gmail SMTP con contraseña
de aplicación desde desarrollo local, antes de desplegar.

**Tenía razón y yo estaba equivocado.** Mi conclusión ("no hay backend, luego no
hay correo") mezclaba dos cosas distintas: que el binario de Linux no arranca en
Windows —cierto— y que por tanto el correo fuera imposible —falso—. Gmail SMTP
funciona desde cualquier sitio con internet.

**Qué se hizo**

Se comprobó primero el terreno en vez de suponerlo: sin WSL, sin Docker, sin
nodemailer. Pero PocketBase publica binario oficial de Windows.

1. Descargado `pocketbase_0.39.8_windows_amd64`, **checksum verificado** contra
   el oficial (`430f36b5…`). Instalado como `pocketbase.exe`, ignorado por git.
2. Base de datos **aparte** (`pb_data_local/`), para no tocar la real: la creó
   el binario de Linux y puede tener una clave de cifrado que no tenemos.
3. Las 10 migraciones aplican, **incluidas las 4 que se habían escrito a
   ciegas**. El esquema quedó con `phone`, `consent` y `consent_at`, y
   `consent` es obligatorio a nivel de base.
4. **P1-05 cerrado:** proxy `/hcgi/platform` → `:8090` en `vite.config.js`.
5. Nuevo `pb_hooks/smtp-desde-entorno.pb.js`: configura el SMTP desde variables
   de entorno, mismo patrón que el otro proyecto. La contraseña nunca entra al
   repositorio.

**El formulario funcionó de extremo a extremo por primera vez.** Rellenado en el
navegador → "Mensaje recibido." → registro en la base con todos los campos.

**🐞 Bug 1 — Los hooks corren en un contexto aislado**

`ReferenceError: LINEAS is not defined`.

PocketBase ejecuta cada handler en su propio contexto: **las constantes del
nivel superior del archivo no existen dentro de la función**. Todo lo que el
handler necesita tiene que declararse dentro, aunque se repita.

Lo grave es cómo fallaba: el hook se disparaba, reventaba, el error quedaba en
el log interno de PocketBase que nadie mira, y la solicitud se guardaba
igualmente. **Por fuera todo parecía correcto y el correo no salía nunca.**
Documentado en `03-arquitectura.md` como trampa 2.

**🐞 Bug 2 — El mailer de Hostinger se tragaba el envío**

Arreglado el primero, apareció `Post "/api/v2/email": unsupported protocol
scheme ""`. Es `builder-mailer.pb.js` desviando el correo a la API de Hostinger
usando `BUILDER_MAILER_API_URL`, que no está definida.

Ese hook solo interviene **cuando el SMTP propio está desactivado**. Al
activarlo, se aparta.

**La cadena, verificada hasta Gmail**

Con credenciales deliberadamente falsas, para no usar ninguna real:

```
535 5.7.8 Username and Password not accepted ... gsmtp
```

Eso es **el servidor de Gmail respondiendo**: PocketBase conectó a
`smtp.gmail.com:587`, negoció STARTTLS y Gmail rechazó la clave. Todo funciona
salvo la credencial real.

**Estado del backlog**

P0: 4 ✅, 3 🟡, 1 ⬜. P1: 4 ✅, 1 ⚠️, 1 ⛔. P2: 8 ✅, 5 ⬜.

**Decisiones tomadas**

Ninguna nueva.

**Dónde quedó / qué sigue**

Arrancar PocketBase con `SMTP_USERNAME` y `SMTP_PASSWORD` reales y mandar un
mensaje de prueba. Es lo único que separa al formulario de estar terminado.

Falta también comprobar el límite de 5 envíos por hora y las copias automáticas.

**Lección**

Dos veces en esta sesión di por imposible algo que solo era "no está montado".
La diferencia entre las dos afirmaciones es enorme, y la segunda se comprueba
en diez minutos. Comprobar el terreno —¿hay WSL? ¿hay Docker? ¿publica binario
de Windows?— antes de concluir.

---

## 2026-09-02 · Responsive en todas las dimensiones y SEO técnico

**Qué se hizo**

Auditoría de comportamiento responsive en cuatro anchos y cierre del SEO
técnico que quedaba pendiente.

**Responsive: un fallo real, en el punto exacto**

Se auditó `/`, `/contacto`, `/calzado` y `/nosotros` a **360, 768, 1024 y
1440 px**, buscando desborde horizontal, texto por debajo de 12 px y áreas de
toque pequeñas. Un solo fallo, pero real:

A **768 px exactos** la página desbordaba — `scrollWidth` 790 sobre 768. La
rejilla del footer usaba `md:grid-cols-[1.2fr_repeat(4,1fr)]` y `md` en Tailwind
arranca justo en 768: cinco columnas en 768 px dejan ~120 px por columna, y
`comercial@cuartadimension.co` no cabe en 120 px.

Resuelto llevando las cinco columnas a `lg`, con dos columnas intermedias en
`sm`. De paso, los enlaces del footer medían **19 px** de alto, por debajo del
mínimo de 24 px de la WCAG 2.5.8.

**Verificado tras el arreglo:** sin desborde en ninguna combinación de página y
ancho, ningún texto bajo 12 px y ningún enlace del footer bajo 24 px.

*(Nota: el marquee aparece como "desbordado" en cualquier auditoría automática.
Es un ticker dentro de `overflow-hidden`: desborda a propósito. Se excluyó del
análisis para no perseguir un falso positivo.)*

**SEO: cuatro problemas medidos y corregidos**

| Problema | Antes | Ahora |
|---|---|---|
| Títulos demasiado largos | 4 de 6 pasaban de 60 caracteres (el peor, 81) | los 6 entre 40 y 53 |
| Descripción del home | 170 caracteres, Google la cortaba | 133 |
| Datos estructurados | ninguno | `Organization` + `WebSite` en las 6 rutas, más `BreadcrumbList` en las 5 internas |
| `meta robots` | ausente | `index, follow, max-image-preview:large, max-snippet:-1` |

`max-image-preview:large` es lo que permite que Google muestre la imagen grande
en resultados y en Discover; sin esa directiva se queda en miniatura.

**🐞 El bug que casi deja el JSON-LD en nada**

Tras añadir los datos estructurados, el HTML del build seguía sin ellos.
`tools/prerender.js` inyectaba `helmet.title`, `helmet.meta` y `helmet.link`…
pero **no `helmet.script`**. El JSON-LD se generaba correctamente en React y
**nunca llegaba al HTML servido**, que es exactamente lo único que lee Google
cuando no ejecuta JavaScript. Habría pasado por bueno sin comprobarlo sobre el
build.

Corregido, y con un comentario en el sitio para que no vuelva a pasar al añadir
otra categoría de etiqueta.

**Dónde vive el JSON-LD y por qué**

En su propio componente, [`JsonLd.jsx`](../apps/web/src/components/JsonLd.jsx),
no dentro del `<Helmet>` de cada página: `tools/generate-llms.js` lee el primer
`<Helmet>` del archivo con expresiones regulares, y un bloque JSON ahí dentro
podría romper la generación de `llms.txt`.

Solo lleva datos verificados de `02-empresa.md`. Faltan NIT, dirección exacta,
año de fundación y redes: los huecos están marcados en el componente. **Un dato
inventado en JSON-LD no es un adorno: es una afirmación que Google publica como
oficial.**

**Estado del backlog**

P0: 4 ✅, 3 🟡⚠️, 1 ⬜. P1: 3 ✅, 1 🟡, 1 ⚠️, 1 ⬜. P2: 8 ✅, 5 ⬜.

**Decisiones tomadas**

Ninguna nueva.

**Dónde quedó / qué sigue**

Sin cambios de contenido factual. Sigue pendiente **P0-06** (hosting),
**P0-07** (verificar el backend del formulario al desplegar) y el material del
propietario: logo vectorial, dominio, NIT y dirección.

---

## 2026-09-01 · Rediseño de composición

**Por qué**

Tras la sesión de pulido, el propietario dijo: *"no cambiaste nada de la parte
visual, todo sigue igual"*. **Tenía razón.** Lo hecho hasta ahí —render sin
esperar al JavaScript, accesibilidad, tiempos de motion— era ingeniería
invisible. Lo visible se limitaba a textos y a quitar botones.

Me había atenido a la regla de `04-diseno.md`: *"No lo rediseñes."* Esa regla la
escribió una sesión anterior; la decisión del propietario manda sobre ella. Se
preguntó explícitamente el alcance y eligió **rediseño de composición** — más
que pulir, menos que cambiar el lenguaje visual.

**El diagnóstico**

- Las 9 secciones de la home eran idénticas: `border-t` + `py-28` + eyebrow + H2.
  Nada rompía el patrón en 7.600 px de scroll.
- Todo en el mismo plano: sin sombras (decisión de marca) y un solo degradado en
  todo el sitio. Las imágenes eran rectángulos con borde de 1px: parecían
  pegadas.
- **Las cifras estaban desaprovechadas.** `+120K`, `12.000` y `98%` son el dato
  más creíble del sitio y vivían en tres cajitas a `text-4xl`.
- Tarjetas de proyecto planas y rejilla 2×2 previsible.

**Qué se hizo**

| Antes | Ahora |
|---|---|
| Cifras en 3 cajitas a `text-4xl`, dentro de otra sección | **Banda propia justo tras el hero**, a `text-6xl/7xl/8xl` |
| 9 secciones con el mismo fondo y el mismo alto | Fondos alternos, alturas distintas y un protagonista por sección |
| Índice de línea como etiqueta pequeña | **Marca de agua de 192 px** tras el título |
| Imagen con borde de 1px | `.media`: degradado hacia el fondo, tinte azul al pasar el cursor y zoom |
| Rejilla de proyectos 2×2 | **Asimétrica**: el primer caso ocupa el doble y va apaisado |
| Sin profundidad | Resplandores radiales de marca anclados por sección |
| Numeración de metodología a `text-sm` | Numerales en contorno a `text-5xl/6xl` |
| — | Barra de progreso de lectura y botón secundario con barrido |

**Petición explícita del propietario:** en el navbar, **"Proyectos" va primero**.
Hecho.

**Piezas nuevas y reutilizables**

`.media`, `.glow` (+ `-tr` / `-bl` / `-c`), `.watermark`, `.stat-number`,
`.sweep` y `.read-progress`, todas en `index.css` y documentadas en
[`04-diseno.md`](04-diseno.md). Toda sección nueva debe usarlas en vez de
inventar su propio tratamiento.

**Verificado**

| Comprobación | Resultado |
|---|---|
| Contraste texto principal sobre fondos alternos | **17.4:1** ✅ |
| Contraste texto secundario | **6.8:1** ✅ |
| Contraste azul primario | **4.53:1** ✅ AA, con poco margen |
| Desborde horizontal a 375 px | ninguno |
| Errores de consola | ninguno |
| `opacity: 0` fuera de los `data-reveal` | ninguno — el prerender sigue visible |
| Orden del navbar | Proyectos · Calzado · Ropa · Dotaciones · Nosotros · Contacto |

**Estado del backlog**

Sin cambios: esto no era una tarea del backlog, sino una petición directa.

**Decisiones tomadas**

- **ADR-010** — Se rehace la composición, no el lenguaje visual. Incluye la
  tabla de qué se conserva y qué se rehace, y deja constancia de que la regla
  *"no lo rediseñes"* de `04-diseno.md` queda anulada por decisión del
  propietario.

**Dónde quedó / qué sigue**

**No cambió ni un dato ni una palabra de contenido.** Siguen intactas las reglas
del ADR-001 (informar, no vender), ADR-002 (fuente de verdad) y ADR-009 (dos
enlaces de contacto por página).

Sigue pendiente **P0-06** (hosting) y el material del propietario.

⚠️ **Nota de verificación:** el panel de previsualización no consiguió
renderizar capturas de las secciones bajo el pliegue —agotaba el tiempo de
espera—, así que la composición se verificó por DOM: posiciones, tamaños,
clases y contraste medidos en vivo. Conviene que el propietario le eche un ojo
en un navegador real.

---

## 2026-09-01 · Pulido de frontend y motion

**Qué se hizo**

Pasada de calidad sobre el frontend, sin rediseñar nada — `04-diseno.md` dice
que el diseño visual es lo más sólido del proyecto y sigue siéndolo. Lo que se
tocó es cómo **entra**, cómo **responde** y cómo se **navega**.

**El hallazgo: la página entera se servía invisible**

Buscando qué pulir, apareció que el HTML prerenderizado traía **31 elementos con
`opacity: 0`**, y el primero envolvía el documento completo: `PageTransition`
arranca en `opacity: 0`, y ese estado también se renderiza en el servidor.

Es decir: desde P0-04 el HTML llegaba completo y correcto para los rastreadores,
pero **una persona veía una pantalla en negro hasta que se descargaban y
ejecutaban 411 KB de JavaScript**. El prerender servía para el SEO y no para el
visitante.

| Comprobación | Antes | Ahora |
|---|---|---|
| `opacity: 0` en el HTML servido | **31** | **0** en el envoltorio y la primera pantalla |
| Qué se ve sin ejecutar JavaScript | nada | el sitio completo |
| Qué depende de JS en el hero | todo | nada |

**Cómo se resolvió**

- `PageTransition` se salta su animación **solo en la primera carga**, con una
  bandera a nivel de módulo. Las transiciones entre rutas siguen igual.
- El hero de la home y el de las páginas de línea entran con **CSS**
  (`.rise-in`), no con framer-motion.
- El **H1 usa `.rise-solid`**: solo se desplaza, nunca se desvanece. Es el
  elemento LCP y con `opacity: 0` el navegador no lo cuenta como pintado.
- `<noscript>` en `index.html` que revela todo lo que tenga `data-reveal`.

⚠️ **Callejón sin salida documentado.** La solución obvia —`initial={false}` en
el `<AnimatePresence>` de `App.jsx`— se probó y **rompe los 25 reveals de
scroll**, porque los hereda. Se midió: los 25 pasaban a `opacity: 1` de entrada.
Quedó escrito en `04-diseno.md` para que nadie lo repita.

**Accesibilidad (P2-04, P2-05)**

Landmark `<main>`, enlace "Saltar al contenido", anillo de foco global con
`:focus-visible` en el azul de marca, y `scroll-margin-top` en todo `[id]` para
que las anclas no queden tapadas por el navbar fijo.

El menú móvil pasó de ser un div a un diálogo de verdad: `role="dialog"`,
`aria-modal`, `aria-expanded`, `aria-controls`, foco atrapado, scroll de fondo
bloqueado, cierre con `Escape` y foco devuelto al botón. Probado: al pulsar
Escape, `aria-expanded` vuelve a `false` y el scroll se restaura.

**Motion y detalle**

- Transición de ruta más corta: 0.28 s de entrada y 0.16 s de salida. Con
  `mode="wait"` el usuario espera las dos, así que cada 100 ms cuentan doble.
- Subrayado animado en el navbar para el enlace activo y en hover.
- Desvanecido en los bordes del marquee, que antes cortaba en seco.
- `text-wrap: balance` en H1 y H2, `pretty` en párrafos: se acabaron las
  líneas sueltas con una palabra.
- Fuente Manrope **variable** por `<link>` en vez de `@import` (**P2-01**): un
  archivo en lugar de siete, y deja de bloquear el render.
- **P2-07** cerrado: la sección de Metodología ya es `position: relative` y la
  barra de progreso mide bien.

**P2-12 · Un problema de build que apareció de paso**

`build:client` no vaciaba `dist`: Vite no lo hace solo cuando el `outDir` está
fuera de la raíz. Cada build dejaba el CSS y el JS anteriores. Al comprobar las
reglas compiladas aparecieron **tres** hojas de estilo donde debía haber una.
Resuelto con `--emptyOutDir`.

**Nota metodológica**

Tres veces en esta sesión el panel de previsualización dio falsos positivos: no
dispara `IntersectionObserver`, congela las animaciones y no aplica
`scrollIntoView({ behavior: 'smooth' })`. Además, la consola **retiene errores de
cargas anteriores de la misma pestaña**: los errores de hidratación que
aparecieron eran de un bundle viejo, con un hash que ya no existía. Cada
verificación se rehízo en pestaña limpia o se comprobó por diff.

**Estado del backlog**

P0: 4 ✅, 2 🟡, 1 ⬜. P1: 3 ✅, 1 ⚠️, 2 ⬜. P2: 6 ✅, 6 ⬜.

**Decisiones tomadas**

Ninguna nueva. `04-diseno.md` gana una sección — *Entradas: cuándo CSS y cuándo
framer-motion* — que es ahora la regla de motion del proyecto.

**Dónde quedó / qué sigue**

Sin cambios de contenido: ni una palabra ni un dato. Sigue pendiente **P0-06**
(hosting) y el material del propietario.

---

## 2026-09-01 · P1-01: el sitio deja de vender

**Qué se hizo**

La reescritura editorial completa (**P1-01**), el consentimiento del formulario
(**P0-05**, parcial) y los datos de contacto clicables (**P1-03**).

**De 9 llamados comerciales a 0**

| Dónde | Antes | Ahora |
|---|---|---|
| Navbar | "Hablemos ↗" | "Contacto" |
| Home, H1 | "Convertimos ideas en productos ganadores" | "Diseñamos y desarrollamos producto: calzado, ropa y dotaciones" |
| Home, hero | "Hablemos de un proyecto" | "Qué hacemos" → ancla a las líneas |
| Home, cierre | "¿Cuál será tu próxima dimensión?" + botón | "Dónde operamos" — bloque informativo con los datos de contacto |
| Líneas ×3 | "Solicitar cotización" + "Iniciar conversación" | `LineClosing`: sitúa la línea y enlaza a las otras dos |
| Nosotros | "Trabajemos juntos" | eliminado |
| Contacto | "Hablemos sobre el reto que quieres…" | "Dónde y cómo encontrarnos" |

**El hallazgo de la sesión: cuatro CTA escondidos**

Al contar los enlaces sobre el HTML del build apareció que **cada
`ProjectCard` enlazaba a `/contacto`**. Los cuatro proyectos del portafolio no
eran casos de éxito: eran botones de contacto disfrazados, y solo en la home
sumaban cuatro llamados que ninguna auditoría de texto habría detectado, porque
el problema no estaba en lo que decían sino en **a dónde llevaban**.

Ahora cada tarjeta lleva a su línea de negocio. De ahí salió el **ADR-009**, que
fija la regla estructural: dos enlaces a `/contacto` por página, navbar y
footer, y ninguno más en el cuerpo.

**Verificado sobre el HTML del build**

| Comprobación | Antes | Ahora |
|---|---|---|
| Enlaces a `/contacto` en la home | 6 | **2** |
| "Hablemos" / "Cotiza" / "cotización" | presentes | **0** |
| "Trabajemos" / "Iniciar conversación" / "Solicitar" | presentes | **0** |
| Tarjetas de proyecto que apuntan al formulario | 4 | **0** |
| `mailto:` y `tel:` reales | 0 | en home, contacto y footer |

**Voz**

De 2ª persona vendiendo a 1ª persona describiendo, en la metodología, la
sección de diferenciación, las capacidades de Ropa y Dotaciones, los compromisos
de Nosotros y la capacidad internacional.

**P0-05 · Consentimiento (parcial)**

Casilla no premarcada y obligatoria, texto de finalidad nombrando al responsable
y aviso de derechos con mención de la Ley 1581 de 2012. Probado: con todos los
campos válidos pero sin marcar la casilla, el envío se bloquea.

Falta la página `/politica-de-datos` (necesita NIT y dirección) y guardar la
marca de tiempo del consentimiento, que requiere una migración de PocketBase
**que no se puede probar en Windows** — no se escribió a ciegas.

**Desviación deliberada**

`05-contenido-y-seo.md` pedía dejar el formulario en "nombre, correo, mensaje y
ya". Se conservaron *Empresa* (opcional) y *Línea de interés*: son útiles para
clasificar la solicitud y no empujan a nada. Lo que se corrigió fue el tono de
las etiquetas. Queda anotado por si el propietario prefiere el formulario
mínimo.

**Estado del backlog**

P0: 4 ✅, 2 🟡, 1 ⬜. P1: 3 ✅, 1 ⚠️, 2 ⬜. P2: 11 ⬜.

**Decisiones tomadas**

- **ADR-009** — Dos enlaces de contacto por página, y ninguno más. Incluye el
  comando para comprobarlo sobre el build.

**Dónde quedó / qué sigue**

**No se tocó ni un dato factual.** Cifras, proyectos, clientes y datos de
contacto siguen siendo exactamente los de `02-empresa.md`.

Lo único de P0 que no depende del propietario es **P0-06**: confirmar que el
hosting resuelve `/nosotros` con `nosotros/index.html`.

⛔ Todo lo demás espera material: **logo en vectorial** (favicon y
`og-image.jpg`), **dominio definitivo**, **NIT y dirección** (política de datos
y JSON-LD).

---

## 2026-09-01 · Bloque P0: Git, build y visibilidad

**Qué se hizo**

Se ejecutó el bloque P0 del backlog. **Cinco tareas cerradas, una parcial, una
nueva descubierta.**

| Tarea | Resultado |
|---|---|
| **P0-00** Git | ✅ Repositorio inicializado, 189 archivos, `.gitignore` + `.gitattributes` |
| **P0-01** Build roto | ✅ Arreglado — eran **dos** bugs, no uno |
| **P0-02** `public/` | 🟡 favicon provisional, `robots.txt` y `sitemap.xml` generados; falta `og-image.jpg` |
| **P0-03** `index.html` | ✅ title, description, favicon, theme-color, preconnect |
| **P0-04** Prerender | ✅ Las 6 rutas, verificado en el navegador |
| **P1-04** `react-helmet-async` | ✅ Requisito de P0-04 |
| **P0-06** Hosting | 🆕 **Tarea nueva** — ver abajo |

**El segundo bug del build, que nadie había visto**

`npm run build` no compilaba por el `|| true` que `cmd.exe` no entiende. Eso ya
estaba documentado. Al arreglarlo apareció el otro: `tools/generate-llms.js`
comparaba la URL de su propio módulo contra una ruta construida a mano desde
`process.argv[1]`. En Windows **nunca coinciden**, así que `main()` no se
ejecutaba nunca. Consecuencia: **`llms.txt` no se había generado jamás en esta
máquina**. Ahora sí.

**El prerender (P0-04)**

Implementado con un script propio en vez de una dependencia — ver
[ADR-008](07-decisiones.md). Obligó a mover el `<Router>` fuera de `App.jsx`,
separar `main.jsx` de `entry-server.jsx`, hacer `Seo.jsx` compatible con Node y
centralizar dominio y rutas en `src/lib/site.js`.

Medido sobre el build servido, antes y después:

| Comprobación | Antes | Ahora |
|---|---|---|
| `og:*` por ruta | 0 | **9** |
| `twitter:*` por ruta | 0 | **4** |
| `canonical` | ausente | uno por ruta, correcto |
| `<title>` en el HTML servido | vacío | el de cada página |
| `<h1>` visible sin JavaScript | no | **sí** |
| `robots.txt` / `sitemap.xml` | devolvían HTML del SPA | archivos reales |
| Errores de hidratación | — | **ninguno** |

**P0-06: la tarea nueva, y por qué importa**

Al verificar el build apareció que `/nosotros` devolvía el HTML del **home**,
mientras que `/nosotros/` devolvía el correcto. La causa es que `vite preview`
reescribe todas las rutas a `/index.html`, como un SPA.

Es un artefacto de la herramienta de previsualización — los archivos
prerenderizados son correctos —, **pero es exactamente lo que pasaría en
producción si el hosting está configurado igual**: WhatsApp mostraría el título
del home en todos los enlaces y Google indexaría 6 URLs idénticas. Todo el
trabajo de P0-04 se perdería en silencio.

Quedó como **P0-06**, con la regla de nginx correcta y cómo comprobarlo en
producción. También se documentó en la nueva sección *Despliegue* de
[`03-arquitectura.md`](03-arquitectura.md).

**Corrección a la sesión anterior**

**P1-02** (`ScrollToTop` rompe los enlaces con ancla) estaba mal diagnosticado.
El código **sí** contempla el hash. Al probarlo el scroll no ocurrió, pero la
causa es que en ese navegador `scrollIntoView({ behavior: 'smooth' })` no hace
nada, mientras que `'instant'` sí. Es una limitación del entorno de prueba, no
del sitio. La tarea pasó a ⚠️ *sin confirmar*, pendiente de probarla en un
navegador real.

Del mismo modo, los errores de hidratación de React que aparecieron en consola
no eran del sitio: venían de cargar `/nosotros` con el HTML del home servido por
el fallback de `vite preview`. En una carga limpia la hidratación no da un solo
error.

**Estado del backlog**

P0: 4 ✅, 1 🟡, 2 pendientes. P1: 1 ✅, 1 ⚠️, 4 pendientes. P2: 10 pendientes
(uno nuevo, **P2-11**, sobre los scripts de Horizons inyectados en producción).

**Decisiones tomadas**

- **ADR-004** pasa de 💡 *Propuesta* a ✅ *Aceptada e implementada*.
- **ADR-008** nuevo: cómo se implementó el prerender y qué reglas impone al
  código de aquí en adelante.

**Dónde quedó / qué sigue**

El sitio ya es visible y compartible. **No cambió ni una palabra del contenido**:
todo el trabajo fue de infraestructura.

Siguiente: **P0-06** (confirmar el hosting) y **P0-05** (aviso de privacidad).
Después, **P1-01**, la reescritura editorial, que es lo que falta para que el
sitio deje de sonar a landing de ventas.

⛔ Sigue bloqueado por datos del propietario: logo en vectorial, dominio
definitivo, NIT y dirección.

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
