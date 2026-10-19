# 09 — Despliegue en Hostinger

**Última actualización:** 2026-09-02 *(ejecutada en producción ese mismo día)*

---

> ## Qué es este archivo
>
> El paso a paso para poner el sitio en línea en el **alojamiento web
> compartido** de Hostinger, incluido el formulario de contacto.
>
> Cubre las tareas **P0-08** (formulario) y **P0-06** (rutas) de
> [`06-backlog.md`](06-backlog.md). El porqué de esta arquitectura está en
> [`07-decisiones.md`](07-decisiones.md) → **ADR-012**.
>
> ✅ **Ejecutado y verificado en producción el 2026-09-02.** El sitio está en
> línea y el formulario funciona de extremo a extremo.

---

## ⚠️ Lee esto antes de empezar: las cuatro trampas

Ninguna es del código del proyecto, y las cuatro costaron tiempo la primera vez.

**1 · Desactiva el traductor de Chrome.** Es la peor de todas.

Google Traductor traduce el **código PHP** dentro del editor del administrador
de archivos, y lo guarda traducido:

| Muestra | Debe decir |
|---|---|
| `declarar ( tipos_estrictos = 1 )` | `declare(strict_types=1)` |
| `devolver [` | `return [` |
| `'usuario' =>` | `'user' =>` |

PHP no entiende esas palabras: el formulario devuelve un 500 sin explicación.
También traduce los **nombres de archivo** (`assets`→`activos`,
`index.html`→`índice.html`), lo que hace buscar rutas que no existen.

> **Chrome → Configuración → Idiomas → desactivar «Usar Google Traductor»**, o
> edita en **Safari**, que no traduce por su cuenta.

**2 · Prueba siempre en el dominio, nunca en `localhost`.**

`http://localhost:3100/api/contacto.php` **siempre** da 500 salvo que tengas un
PHP local escuchando en `:8099`. Es el proxy de Vite sin destino, no un fallo
del sitio. Ante cualquier 500, lo primero es mirar la **URL de la petición** en
el panel Network: si dice `localhost`, no estás probando el sitio publicado.

**3 · La contraseña del correo es una contraseña de aplicación.**

hPanel → Correos → **Contraseñas de aplicación** → *Generar*. Cópiala con el
botón, **nunca a mano**: una sola mayúscula distinta da
`535 authentication failed`, y el mensaje no dice que sea un problema de
mayúsculas.

**4 · No hay registro de errores de PHP en hPanel.**

En este plan no está. Para diagnosticar hay que subir scripts temporales a
`public_html` — no a `api/`, que está bloqueada por su `.htaccess`.

---

## Antes de empezar

Ten a mano tres cosas:

| Necesitas | Dónde está |
|---|---|
| Acceso a **hPanel** de Hostinger | `hpanel.hostinger.com` |
| La contraseña del buzón `info@4dimensionsas.com` | La creaste tú en hPanel → Correos |
| El sitio compilado | Lo genera `npm run build --prefix apps/web` |

**Tiempo:** unos 30 minutos la primera vez.

**El orden importa.** La base de datos antes que el `config.php`, y el
`config.php` antes de la prueba. Si te saltas uno, el siguiente falla.

### El menú lateral del Panel, de una vez

Casi todo vive ahí, no en la página que se ve al entrar:

| Menú lateral | Para qué | Paso |
|---|---|---|
| **Avanzado** | Configuración de PHP | 2 |
| **Bases de datos** | Crear la base y entrar a phpMyAdmin | 3 |
| **Archivos** | Administrador de archivos, `public_html` | 4 |

---

# Paso 0 · Compilar el sitio

En tu equipo, desde `C:\4 dimension`:

```bash
npm run build --prefix apps/web
```

Termina con:

```
✅ prerender: 6 rutas + sitemap.xml + robots.txt en dist/apps/web
```

El resultado queda en **`dist/apps/web`**: 22 archivos, unos 918 KB.

```
dist/apps/web/
├── index.html              ← el home
├── calzado/index.html      ← una carpeta por ruta
├── ropa/index.html
├── dotaciones/index.html
├── nosotros/index.html
├── contacto/index.html
├── assets/                 ← el JS y el CSS
├── api/                    ← el backend del formulario
│   ├── contacto.php
│   ├── smtp.php
│   ├── config.example.php
│   └── .htaccess           ← ¡archivo oculto! ojo al subirlo
├── favicon.ico  favicon-32.png  favicon-192.png  apple-touch-icon.png
├── logo-4d.png  og-image.jpg
├── googlec3de623c2936be96.html  ← verificación de Search Console
└── sitemap.xml  robots.txt  llms.txt
```

> 📌 **Dos archivos que deben viajar siempre** y que la gente pierde al
> republicar: `favicon.ico` y el de verificación de Google. Los dos viven en
> `apps/web/public/`, así que el build los incluye solo. Si desaparecen del
> servidor, Google desverifica la propiedad.

> ⚠️ **`api/config.php` no está, y es correcto.** El build lo borra a propósito
> si aparece, para que unas credenciales de desarrollo no pisen las del
> servidor. Ese archivo se crea **una sola vez, en el servidor**, en el paso 4.

---

# Paso 1 · Crear el sitio de hosting

**Sin esto no existe `public_html`, y la configuración de PHP ni siquiera
aparece** — en Hostinger, PHP se configura por sitio, no por dominio.

> ⚠️ **Cuidado con dónde buscas.** hPanel → **Dominios** administra solo el
> nombre; ahí no hay PHP ni archivos. Todo lo de esta guía vive en
> hPanel → **Sitios web**.

### 1.1 · Comprobar si ya existe

hPanel → **Sitios web**. Busca `4dimensionsas.com` en la lista y mira **qué
botones tiene**, porque ahí está la diferencia que importa:

| Botones | Qué es | ¿Sirve? |
|---|---|---|
| **Herramientas · Panel** | Hosting normal | ✅ Sí |
| Solo **Editar sitio web** | Sitio del constructor (*Modo agéntico*) | ❌ No |

Un sitio del constructor **no tiene Administrador de archivos ni configuración
de PHP**. No puedes subirle tu build. Si el dominio está conectado a uno de
esos, hay que crear uno nuevo.

> 📌 El sitio que Horizons dejó a medias aparece como
> `fourth-dimension-eso-sas-…hostingersite.com`, en un dominio temporal.
> **Déjalo como está.** Cuando el tuyo funcione, decides si lo eliminas.

### 1.2 · Crearlo

1. En **Sitios web**, pulsa **➕ Añadir sitio web**.
2. Cuando pregunte el tipo, elige la opción de **sitio vacío** — *«Crear un
   sitio web vacío»*, *«Empezar desde cero»* o *«Subir mis archivos»*.

   ⛔ **No elijas** *Creador con IA*, *WordPress* ni *Constructor de sitios
   web*: te dejan otra vez sin Panel, o te instalan WordPress dentro de
   `public_html` y habría que vaciarlo.
3. Cuando pida el dominio, elige **usar un dominio existente** →
   **`4dimensionsas.com`**.

> ⚠️ **No toques los registros MX.** El buzón `info@4dimensionsas.com` ya
> funciona y de él dependen los dos correos del formulario. Si el asistente
> ofrece restablecer o cambiar el DNS, deja los MX como están.

### Cómo saber que funcionó

`4dimensionsas.com` aparece en la lista **con los botones "Herramientas" y
"Panel"**, y su icono es `</>`. Al entrar en **Panel** ves *Base de datos*,
*Administrador de archivos* y *Copias de seguridad*.

Si solo te sale *Editar sitio web*, elegiste el constructor: deshazlo y repite
con la opción de sitio vacío.

---

# Paso 2 · Poner la versión de PHP en 8.1 o superior

Si el servidor está en PHP 8.0 o menor, el formulario
devuelve una **pantalla en blanco o un error 500 sin explicación**, porque el
código usa el tipo de retorno `never`, que existe desde PHP 8.1.

1. hPanel → **Sitios web** → `4dimensionsas.com` → **Panel**.
2. En el **menú lateral izquierdo**, el último elemento: **Avanzado**.
3. **Configuración de PHP** → pestaña **Versión de PHP**.
4. Elige **8.2** o **8.3**.
5. **Guardar**.

> 📌 **No está en la página del Panel**, por mucho que bajes: está en el menú
> lateral. También sirve el campo **Buscar** de ese mismo menú — escribe `PHP`.

> Si ya estaba en 8.1 o superior, no toques nada y sigue.

---

# Paso 3 · Crear la base de datos MySQL

### 3.1 · Crear la base y el usuario

1. hPanel → **Sitios web** → `4dimensionsas.com` → **Panel**.
2. Menú lateral → **Bases de datos** → **Administración de bases de datos MySQL**.
3. En **Crear una nueva base de datos MySQL** rellena:
   - **Nombre de la base de datos:** `4d_contacto`
   - **Nombre de usuario:** `4d_form`
   - **Contraseña:** usa el botón **Generar** y **cópiala ya**
4. Pulsa **Crear**.

> 📌 **Hostinger le añade un prefijo a los dos nombres.** Lo que escribes como
> `4d_contacto` acaba llamándose algo como **`u123456789_4d_contacto`**, y el
> usuario, **`u123456789_4d_form`**.
>
> **Apunta los nombres COMPLETOS tal como aparecen en la lista de abajo**, con
> su prefijo. Son los que van en el `config.php`. Este es el error más común de
> todo el proceso.

Anota estos cuatro datos:

```
Base de datos:  u________________4d_contacto
Usuario:        u________________4d_form
Contraseña:     ................................
Host:           localhost
```

### 3.2 · Crear la tabla

1. En esa misma pantalla, busca tu base en la lista y pulsa **Entrar en phpMyAdmin**.
2. En la columna izquierda, haz clic en el **nombre de tu base de datos**.
   Debe decir *"No se encontraron tablas en la base de datos"*: es normal.
3. Pestaña **Importar** (arriba).
4. **Seleccionar archivo** → elige `db/schema.sql` de tu proyecto.
5. Baja del todo y pulsa **Continuar**.

Debe salir un mensaje verde: *"La importación se ejecutó exitosamente"*.

**Compruébalo:** en la columna izquierda aparece ahora la tabla
**`contact_requests`**. Haz clic y ve a la pestaña **Estructura**: deben verse
12 columnas, de `id` a `mail_status`.

> **¿Y si no puedes subir el archivo?** Abre `db/schema.sql` en el Bloc de notas,
> copia todo el contenido, ve a la pestaña **SQL** de phpMyAdmin, pégalo y pulsa
> **Continuar**. Es exactamente lo mismo.

---

# Paso 4 · Subir el sitio

### 4.1 · Abrir el Administrador de archivos

1. hPanel → **Sitios web** → `4dimensionsas.com` → **Panel**.
2. Menú lateral → **Archivos** → **Administrador de archivos**.
   *(También desde «Esenciales» del Panel: **Administrador de archivos → Abrir**.)*
3. Entra en la carpeta **`public_html`**.

### 4.2 · Activar los archivos ocultos ⚠️

**No te saltes esto.** El archivo `api/.htaccess` empieza por punto, y el
Administrador de archivos **no lo muestra ni lo sube** si esta opción está
desactivada.

- Icono de **ajustes** (rueda dentada, arriba a la derecha) → marca
  **Mostrar archivos ocultos (dotfiles)**.

### 4.3 · Vaciar lo que haya

Si `public_html` trae un `index.html` o `default.php` de Hostinger, bórralo.
Si hay un sitio anterior que quieras conservar, descárgalo antes.

### 4.4 · Subir

Sube **el contenido de `dist/apps/web`**, no la carpeta.

> ❌ Mal: `public_html/web/index.html`
> ✅ Bien: `public_html/index.html`

Lo más cómodo: en tu equipo, entra en `dist/apps/web`, selecciona **todo** lo de
dentro, comprímelo en un ZIP, súbelo a `public_html` y usa **Extraer** en el
Administrador de archivos. Después borra el ZIP.

### 4.5 · Comprobar que subió completo

En `public_html` deben verse:

- `index.html`
- las carpetas `calzado`, `ropa`, `dotaciones`, `nosotros`, `contacto`, `assets`, `api`
- `sitemap.xml`, `robots.txt`, `logo-4d.png`, `og-image.jpg`

Y **dentro de `api/`**, cuatro archivos: `contacto.php`, `smtp.php`,
`config.example.php` y **`.htaccess`**.

> Si `.htaccess` no aparece, vuelve al punto 4.2 y súbelo suelto. Sin él el
> sitio funciona igual, pero pierdes un cerrojo de seguridad sobre el
> `config.php`.

---

# Paso 5 · Crear el `config.php` en el servidor

Aquí es donde entran las contraseñas. **Este archivo vive solo en el servidor**:
no está en el repositorio ni viaja en el build.

1. En el Administrador de archivos, entra en **`public_html/api`**.
2. Clic derecho sobre **`config.example.php`** → **Copiar**.
3. Pégalo en la misma carpeta y **renombra la copia a `config.php`**.
4. Clic derecho sobre `config.php` → **Editar**.
5. Cambia los cinco valores marcados con `CAMBIAR`:

```php
'db' => [
    'host'   => 'localhost',
    'nombre' => 'u123456789_4d_contacto',   // ← el nombre COMPLETO, con prefijo
    'user'   => 'u123456789_4d_form',       // ← el usuario COMPLETO, con prefijo
    'clave'  => 'la-contraseña-de-la-base',
],

'smtp' => [
    'host'   => 'smtp.hostinger.com',       // ← NO lo cambies
    'puerto' => 465,                        // ← NO lo cambies
    'user'   => 'info@4dimensionsas.com',
    'clave'  => 'la-contraseña-del-buzón',  // ← la del correo, no la de hPanel
],
```

6. **Guardar**.

### Los tres errores que se cometen aquí

| Error | Qué verás | Arreglo |
|---|---|---|
| Olvidar el prefijo `u123456789_` | `sin_base_de_datos` | Cópialo de la lista de bases de datos |
| Poner la contraseña de tu cuenta de Hostinger | El correo falla, la solicitud se guarda | Es la del **buzón** `info@`, otra distinta |
| Cambiar `smtp.hostinger.com` por `smtp.gmail.com` | `535 Username and Password not accepted` | El buzón está en Hostinger. Ver [`03-arquitectura.md`](03-arquitectura.md) → Correo |

---

# Paso 6 · Probar

### 6.1 · Que el sitio carga

Abre `https://4dimensionsas.com`. Debe verse el home con el fondo oscuro y el
cubo animado.

### 6.2 · Que las rutas funcionan — esto es **P0-06**

Abre **`https://4dimensionsas.com/nosotros`** (sin barra al final).

- ✅ **Bien:** sale la página *Nosotros*, y la pestaña del navegador dice
  *"Nosotros — 4D Cuarta Dimensión ES S.A.S."*
- ❌ **Mal:** sale el home, o un error 404.

**Si sale mal**, crea un archivo `.htaccess` en `public_html` con esto:

```apache
Options -MultiViews
DirectoryIndex index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    # Si la URL corresponde a una carpeta con index.html, sírvelo.
    RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
    RewriteRule ^(.*[^/])$ /$1/index.html [L]
</IfModule>
```

> ⚠️ **No pongas la típica regla de SPA** que manda todo a `/index.html`. Con
> ella las 6 páginas devolverían el home: WhatsApp mostraría el título
> equivocado en cada enlace y Google indexaría 6 URLs idénticas. Es justo lo
> que el prerender existe para evitar.

**La prueba de verdad:** pega `https://4dimensionsas.com/nosotros` en un chat de
WhatsApp. La vista previa debe decir *"Nosotros — 4D Cuarta Dimensión ES
S.A.S."*, no el título del home.

### 6.3 · Que la configuración está protegida

Abre `https://4dimensionsas.com/api/config.php`.

- ✅ **Bien:** error **403 Forbidden**, o una página en blanco.
- ❌ **Mal:** si ves tus contraseñas en pantalla, **cambia ahora mismo la del
  buzón y la de la base de datos** y revisa el paso 4.2 — falta el `.htaccess`.

### 6.4 · Que el formulario funciona — la prueba completa

1. Ve a `https://4dimensionsas.com/contacto`.
2. Rellena el formulario **con tu propio correo personal** en el campo de correo
   (así recibes el acuse y compruebas cómo se ve).
3. Marca la casilla de autorización.
4. **Tómate más de 3 segundos**: hay una trampa antibots que descarta los
   envíos instantáneos.
5. **Enviar mensaje**.

Debe aparecer **"Mensaje recibido."**

Ahora comprueba las **tres** cosas:

| # | Dónde | Qué debe pasar |
|---|---|---|
| 1 | Bandeja de `info@4dimensionsas.com` | Llega *"Nueva solicitud de contacto — …"*. Al responder, va directo a quien escribió |
| 2 | Tu correo personal | Llega *"Recibimos tu mensaje — 4D Cuarta Dimensión"* |
| 3 | phpMyAdmin → `contact_requests` | Hay una fila, y **`mail_status` dice `aviso:ok acuse:ok`** |

**`mail_status` es el diagnóstico.** Léelo así:

| Valor | Significa |
|---|---|
| `aviso:ok acuse:ok` | Todo perfecto |
| `aviso:fallo acuse:fallo` | La solicitud **se guardó**, pero el correo no salió → revisa el paso 5 |
| `pendiente` | Se cortó a mitad. Mira el registro de errores de PHP |
| `omitido_por_limite` | Se guardó y no se envió correo: topaste el límite por hora |

### 6.5 · Borrar la prueba

En phpMyAdmin, pestaña **Examinar**, marca la fila de prueba y pulsa **Borrar**.

---

# Si algo falla

**Dónde mirar primero:** hPanel → tu dominio → **Avanzado** → **Registro de
errores de PHP**. Todos los mensajes del formulario empiezan por `[contacto]`.

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| Pantalla en blanco al enviar | PHP en 8.0 o menor | Paso 2: súbelo a 8.2 |
| `sin_configuracion` | No existe `api/config.php` | Paso 5 |
| `sin_base_de_datos` | Nombre, usuario o contraseña mal | Paso 5: revisa el **prefijo** |
| `no_guardado` | La tabla no existe | Paso 3.2 |
| Se guarda pero no llega correo | Contraseña del buzón, o SMTP bloqueado | Paso 4, y mira `mail_status` |
| `datos_invalidos` | Algún campo no cumple | Es correcto: el formulario está validando |
| El formulario "no hace nada" | Enviaste en menos de 3 s | Es la trampa antibots. Espera y reintenta |

**Regla de oro:** si la fila está en la base de datos, **la solicitud no se
perdió**, aunque el correo haya fallado. Está diseñado así a propósito
(**ADR-012**).

---

# Cuando vuelvas a subir el sitio

Cada vez que cambies algo del sitio:

1. `npm run build --prefix apps/web`
2. Sube de nuevo el contenido de `dist/apps/web`

> 🔴 **NO borres `public_html/api/config.php`.** No está en el build; si lo
> borras, el formulario deja de funcionar hasta que lo vuelvas a crear.
>
> Lo más seguro: al subir, **sobrescribe** en vez de borrar la carpeta entera.

La base de datos y sus solicitudes **no se tocan** al volver a subir el sitio.

---

# Límite de envíos por hora ⚠️

Pendiente de confirmar, anotado en **P1-05**: el buzón de Hostinger tiene un
límite de correos por hora, y **cada solicitud consume dos** (aviso + acuse).

Si resultara ser 5 por hora, son **2 solicitudes por hora** antes de topar. Al
topar, `contacto.php` **guarda la solicitud igual** y solo omite los correos:
la fila queda con `mail_status = 'omitido_por_limite'`.

Hay además un límite propio, de **5 solicitudes por hora y por visitante**, para
que un bot no agote tu cupo. Se ajusta en `config.php`:

```php
'limite_por_hora' => 5,
```

---

# Lo que queda pendiente después de publicar

| Tarea | Qué falta |
|---|---|
| **P0-05** | La página `/politica-de-datos`. Bloqueada: falta el **NIT** |
| **P2-02** | 11 imágenes de producto siguen en `images.hostinger.com` |

Ver [`06-backlog.md`](06-backlog.md).
