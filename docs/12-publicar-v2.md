# 12 — Guía para publicar la versión 2

**Última actualización:** 2026-10-27

> Guía paso a paso para **actualizar** `4dimensionsas.com` con la versión 2.
> El sitio ya está publicado y el formulario ya funciona: aquí **no se crea
> nada desde cero**, se actualiza.
>
> Si algún día hay que montar el sitio en un hosting nuevo, la guía completa
> es [`09-despliegue.md`](09-despliegue.md).

**Tiempo:** 30–45 minutos, más la revisión en Google unas semanas después.

---

## Resumen en una tabla

| # | Qué | Dónde | Tiempo |
|---|---|---|---|
| 0 | Preparar: traductor apagado y copia de seguridad | Chrome y hPanel | 5 min |
| 1 | **Actualizar la base de datos — PRIMERO** | phpMyAdmin | 2 min |
| 2 | Subir el sitio | Administrador de archivos | 10 min |
| 3 | Comprobar que todo funciona | El navegador | 10 min |
| 4 | Avisar a Google | Search Console | 10 min |
| 5 | Cambiar la contraseña de la base de datos | hPanel + `config.php` | 5 min |
| 6 | Crear el Perfil de Empresa de Google | Google | 15 min + verificación |
| 7 | Revisar en 2–4 semanas | Search Console | 5 min |

> 🔴 **El orden 1 → 2 no se puede cambiar.** Si subes el sitio antes de
> actualizar la base de datos, las solicitudes de la línea **Insumos** fallan
> al guardarse. Las demás líneas siguen funcionando.

---

## Paso 0 · Preparar

### 0.1 · Apagar el traductor de Chrome

Es la trampa que más tiempo costó la primera vez: Google Traductor **traduce el
código PHP** dentro del editor del Administrador de archivos y lo guarda
traducido, y también cambia nombres de archivo (`assets` → `activos`). El
formulario se rompe sin explicación.

> **Chrome → Configuración → Idiomas → desactivar «Usar Google Traductor».**
> O trabaja en Safari o Firefox, que no traducen solos.

### 0.2 · Tener el paquete del sitio

El sitio ya está compilado y empaquetado:

```
C:\4 dimension\dist\4dimension-v2-2026-10-27.zip
```

Lleva 66 archivos (unos 4,9 MB): las 7 páginas, las fotos, el vídeo del inicio,
las imágenes para compartir (`og/`), el formulario (`api/`) y los dos
`.htaccess`. **No lleva `config.php`**, y es correcto: ese archivo ya está en
el servidor con las contraseñas y no se debe tocar.

> Si cambias algo del sitio antes de publicar, hay que recompilar
> (`npm run build --prefix apps/web`) y volver a comprimir el **contenido** de
> `dist\apps\web` (no la carpeta). Pídeselo a Claude y lo deja listo.

### 0.3 · Copia de seguridad (por si hay que volver atrás)

1. hPanel → **Sitios web** → `4dimensionsas.com` → **Panel**.
2. Menú lateral → **Archivos** → **Administrador de archivos** → entra en
   `public_html`.
3. Selecciona **todo** → clic derecho → **Comprimir** → formato ZIP → nombre
   `respaldo-v1.zip`.
4. Clic derecho sobre `respaldo-v1.zip` → **Descargar**. Guárdalo en tu equipo.
5. Borra `respaldo-v1.zip` del servidor.

Con esto, si algo sale mal, se vuelve a la versión anterior en dos minutos.

---

## Paso 1 · Actualizar la base de datos (primero)

1. hPanel → **Panel** de `4dimensionsas.com` → menú lateral → **Bases de
   datos** → **Administración de bases de datos MySQL**.
2. En la lista, junto a tu base (`u…_4d_contacto`), pulsa **Entrar en
   phpMyAdmin**.
3. En la columna izquierda, clic en el nombre de la base.
4. Pestaña **SQL** (arriba).
5. Pega exactamente esto:

```sql
ALTER TABLE contact_requests
    MODIFY line ENUM('calzado', 'ropa', 'dotaciones', 'otro', 'insumos') NOT NULL DEFAULT 'calzado';
```

6. Pulsa **Continuar**.

✅ **Debe salir** un mensaje verde del tipo *«0 filas afectadas»* o *«La
consulta se ejecutó con éxito»*. «0 filas» es lo normal: no cambia ninguna
solicitud guardada, solo añade «insumos» como opción válida.

> Si lo ejecutas dos veces no pasa nada. El archivo original está en
> [`db/migraciones/2026-10-26-linea-insumos.sql`](../db/migraciones/2026-10-26-linea-insumos.sql).

---

## Paso 2 · Subir el sitio

1. Administrador de archivos → entra en **`public_html`**.
2. Icono de **ajustes** (rueda, arriba a la derecha) → marca **Mostrar
   archivos ocultos**. Sin esto, los `.htaccess` no se suben.
3. Botón **Subir** → elige `4dimension-v2-2026-10-27.zip`.
4. Clic derecho sobre el ZIP → **Extraer** → destino: `public_html` (la
   carpeta actual, **no** una subcarpeta nueva).
5. Si pregunta qué hacer con los archivos que ya existen → **Sobrescribir**.
6. Borra el ZIP del servidor.

> 🔴 **No borres `public_html` entera ni la carpeta `api`.** Dentro está
> `api/config.php`, con las contraseñas de la base de datos y del correo, y no
> viene en el ZIP. Si desaparece, el formulario deja de funcionar.

### Comprueba que quedó bien

Dentro de `public_html` deben verse:

- [ ] `index.html` y `.htaccess`
- [ ] las carpetas `calzado`, `ropa`, `dotaciones`, **`insumos`**, `nosotros`,
      `contacto`, `assets`, `fotos`, `video`, **`og`**, `api`
- [ ] `favicon.ico`, `sitemap.xml`, `robots.txt`
- [ ] `googlec3de623c2936be96.html` (verificación de Google: **no lo borres
      nunca**)

Y dentro de `api/`:

- [ ] `contacto.php`, `smtp.php`, `config.example.php`, `.htaccess`
- [ ] **`config.php`** (el de antes, intacto)

> Quedarán también archivos viejos de la versión 1 (por ejemplo, JavaScript
> antiguo en `assets/`). No molestan y no hace falta borrarlos.

---

## Paso 3 · Comprobar que todo funciona

Siempre en el **dominio real**, nunca en `localhost`. Si ves la versión vieja,
pulsa **Ctrl + F5**.

### 3.1 · Las páginas

- [ ] `https://4dimensionsas.com` → el inicio con el zapato girando.
- [ ] `https://4dimensionsas.com/ropa` → la modelo arriba, «Capacidades» en
      azul claro, el collage y los 4 diseños.
- [ ] `https://4dimensionsas.com/dotaciones` → «Nuestros productos» con las 7
      referencias.
- [ ] `https://4dimensionsas.com/insumos` → la página nueva (antes daba 404).

### 3.2 · Lo que arregla el SEO

- [ ] `https://4dimensionsas.com/nosotros` → abre **directamente**, y en la
      barra de direcciones **sigue diciendo `/nosotros`**, sin barra al final.
      Esto es lo que hoy impide que Google indexe 6 de las 7 páginas.
- [ ] `https://www.4dimensionsas.com/ropa` → salta solo a
      `https://4dimensionsas.com/ropa` (sin `www`).
- [ ] `https://4dimensionsas.com/favicon.ico` → se ve el icono (antes, 404).

### 3.3 · La seguridad

- [ ] `https://4dimensionsas.com/api/config.php` → **403 Forbidden** o página
      en blanco. ❌ Si ves contraseñas en pantalla: cambia **ya** la del buzón
      y la de la base de datos, y revisa que `api/.htaccess` se subió.

### 3.4 · El formulario, de punta a punta

1. `https://4dimensionsas.com/contacto`.
2. Rellénalo con **tu correo personal**, elige la línea **Insumos**, marca la
   autorización.
3. Espera **más de 3 segundos** antes de enviar (hay una trampa antibots).
4. **Enviar** → debe salir *«Mensaje recibido.»*

Y luego comprueba:

- [ ] Llega el aviso a `info@4dimensionsas.com`.
- [ ] Llega el acuse a tu correo personal. **Ya no repite tu mensaje**: es a
      propósito (evita que alguien use el formulario para mandar spam).
- [ ] En phpMyAdmin → `contact_requests` → **Examinar**: hay una fila nueva con
      `line = insumos` y `mail_status = aviso:ok acuse:ok`.
- [ ] Borra esa fila de prueba (márcala → **Borrar**).

### 3.5 · Al compartir por WhatsApp

- [ ] Pega `https://4dimensionsas.com/ropa` en un chat: la vista previa debe
      mostrar la **foto de la modelo** y el título *«Diseño y desarrollo de
      ropa en Colombia»*. (WhatsApp guarda vistas previas viejas un tiempo: si
      sale la antigua, prueba con `https://4dimensionsas.com/ropa?v=2`.)

### Si algo falla

| Síntoma | Qué hacer |
|---|---|
| Todo el sitio da **error 500** | Borra `public_html/.htaccess` (el de la raíz, **no** el de `api/`). El sitio vuelve a funcionar al instante; avísale a Claude |
| Solo falla `www` | Borra del `.htaccess` el bloque «0 · Un solo dominio» |
| El formulario da error | Mira que `api/config.php` siga ahí. Si no, vuelve a crearlo (paso 5 de `09-despliegue.md`) |
| Insumos da error y las demás líneas no | Falta el paso 1: ejecútalo ahora |
| Quieres volver atrás | Sube `respaldo-v1.zip` (paso 0.3) y extráelo sobrescribiendo |

---

## Paso 4 · Avisar a Google

La propiedad de Search Console ya está verificada (por eso existe el archivo
`googlec3de623c2936be96.html`).

1. Entra en **search.google.com/search-console** → propiedad
   `4dimensionsas.com`.
2. Menú → **Sitemaps** → escribe `sitemap.xml` → **Enviar**.
3. Menú → **Inspección de URLs** → pega cada una de estas direcciones → cuando
   cargue, **Solicitar indexación**:
   - [ ] `https://4dimensionsas.com/`
   - [ ] `https://4dimensionsas.com/calzado`
   - [ ] `https://4dimensionsas.com/ropa`
   - [ ] `https://4dimensionsas.com/dotaciones`
   - [ ] `https://4dimensionsas.com/insumos`
   - [ ] `https://4dimensionsas.com/nosotros`
   - [ ] `https://4dimensionsas.com/contacto`

> Google limita cuántas solicitudes acepta al día. Si te dice que alcanzaste el
> límite, sigue al día siguiente con las que falten.

---

## Paso 5 · Cambiar la contraseña de la base de datos

Quedó visible en una captura de pantalla, así que hay que cambiarla. Son **dos
pasos seguidos**: entre uno y otro, el formulario no puede guardar
solicitudes, así que hazlos sin pausa.

1. hPanel → **Bases de datos** → **Administración de bases de datos MySQL** →
   en la lista de usuarios, junto a `u…_4d_form` → **Cambiar contraseña** →
   **Generar** → **cópiala con el botón** (no a mano) → guardar.
2. Administrador de archivos → `public_html/api/config.php` → clic derecho →
   **Editar** → en el bloque `'db'`, cambia **solo** el valor de `'clave'` por
   la contraseña nueva → **Guardar**.
3. Repite la prueba del formulario (3.4) para confirmar que guarda.

> 🔒 **Nunca** pegues esa contraseña en un chat, un correo ni un archivo del
> proyecto. El repositorio de GitHub es público.

---

## Paso 6 · Perfil de Empresa de Google

Es lo que hace que la empresa salga en **Google Maps** y en el recuadro de la
derecha cuando alguien busca «4D Cuarta Dimensión», y lo que más pesa en
búsquedas locales como «dotaciones en Bogotá».

1. Entra en **business.google.com** con la cuenta de Google de la empresa.
2. **Agregar empresa** → nombre: **4D Cuarta Dimensión ES S.A.S.**
3. Categoría: elige la que mejor describa lo que hacen (Google sugiere
   opciones al escribir «calzado», «uniformes» o «diseño»).
4. Ubicación: **Cra. 34a #27a-22 sur, Bogotá D.C.**
5. Teléfono: **+57 316 577 5539** · Sitio web: **https://4dimensionsas.com**
6. Google pide **verificar** la empresa (por correo postal, llamada o vídeo).
   Puede tardar unos días.

> Usa exactamente el mismo nombre, dirección y teléfono que aparecen en el
> sitio: Google compara los dos y la coincidencia suma.

---

## Paso 7 · Revisar en 2–4 semanas

Google no indexa al instante. Pasadas 2–4 semanas:

1. Search Console → **Páginas** (o **Indexación**).
2. Debe haber **7 páginas indexadas**. Hoy hay **1**.
3. Si alguna sigue «Excluida», copia el motivo que da Google y pásaselo a
   Claude.

Y en Google, busca `site:4dimensionsas.com`: deben salir las 7 páginas.

---

## Pendientes que no bloquean la publicación

| Pendiente | Qué se necesita |
|---|---|
| Datos de empresa completos para Google (P1-06) | NIT, año de fundación, redes sociales |
| Página de política de datos (P0-05) | El NIT |
| 7 imágenes de banco que quedan | Fotos propias de: camisetas dobladas (Greenloop ropa), dotación de logística, calzado Línea Executive, hero y detalle de dotaciones, detalle de calzado, foto del estudio |
| Logo de Carhartt en la foto del Diseño 02 de ropa | Decidir: dejarla, retocarla o cambiarla |
| Marcas visibles en las botas (G/M, Velectric, LEH) | Confirmar si son de clientes y si hay autorización |
| Nombres de los 4 diseños de calzado | Opcional |
| DMARC del correo en `p=quarantine` | Ajuste de DNS, cuando el correo lleve semanas estable |

---

## Lista rápida para imprimir

```
[ ] 0  Traductor de Chrome apagado
[ ] 0  Copia de seguridad respaldo-v1.zip descargada
[ ] 1  SQL de Insumos ejecutado en phpMyAdmin (mensaje verde)
[ ] 2  ZIP subido y extraído en public_html, sobrescribiendo
[ ] 2  api/config.php sigue ahí
[ ] 3  /insumos abre · /nosotros sin barra final · www redirige · favicon se ve
[ ] 3  /api/config.php da 403
[ ] 3  Prueba del formulario con Insumos: aviso, acuse y fila OK — fila borrada
[ ] 4  sitemap.xml enviado · 7 URLs con indexación solicitada
[ ] 5  Contraseña de la base cambiada en hPanel Y en config.php · formulario probado
[ ] 6  Perfil de Empresa de Google creado (pendiente de verificación)
[ ] 7  (en 2–4 semanas) 7 páginas indexadas en Search Console
```
