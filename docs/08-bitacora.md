# 08 — Bitácora de sesiones

**Última actualización:** 2026-10-27

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

## 2026-10-27 · Auditoría de SEO antes de publicar la v2

El propietario preguntó si el sitio tiene buen SEO y posicionamiento, y pidió
arreglarlo si no. Detalle completo en `05-contenido-y-seo.md` → «Auditoría del
2026-10-27».

- **El build estaba bien; el servidor no.** El sitio publicado redirige
  `/nosotros` → `/nosotros/` (Google no indexa esas páginas), sirve una copia
  en `www`, y da 404 en `/favicon.ico` e `/insumos`. Todo se arregla al subir
  la v2 con su `.htaccess`.
- Títulos con palabra clave + «en Colombia»; imagen propia para compartir
  cada línea (`public/og/`); descripción de Insumos ampliada y en literal
  (`llms.txt` decía «No description available»); `.htaccess` con 301 de
  `www` y caché del navegador.
- Al tocar Insumos, el reemplazo cambió también el texto visible del hero; se
  devolvió a su texto original.
- eslint ✅ · build ✅ · títulos y `og:image` comprobados en el HTML generado.

---

## 2026-10-27 · Foto propia en la tarjeta «Greenloop» (calzado) de la home

El propietario pidió cambiar el tenis de running de banco de la tarjeta
destacada «Greenloop» por un tenis bajo de gamuza gris con suela moteada.

- `fotos/calzado-greenloop.webp` (1600×1195, 2 MB → 123 KB). El fondo de la
  foto era gris 246–250 y la tarjeta es blanca 255: se notaba un recuadro.
  Se subió el punto blanco (×255/244) para dejar el fondo en 255 exacto.
- `ProjectCard` acepta `fondoBlanco` en el proyecto: foto entera
  (`object-contain` con margen, sin cortar puntera ni talón), sin el velo de
  `.media`, y zoom suave al pasar el cursor.
- `IMAGES.runner` borrado: quedan 7 imágenes de banco.

---

## 2026-10-27 · Collage en «Personalización total» y bloques texto + foto animados

- **/ropa · Personalización total:** la foto de banco (telas y cinta
  métrica) se sustituyó por el collage de botas que aportó el propietario
  (`fotos/ropa-collage.webp`, 4:3 entero, 2,6 MB → 166 KB, sin el velo de
  `.media` porque tiene fondo blanco). `IMAGES.ropaDetail` borrado: quedan 8
  imágenes de banco.
- **Los tres `DetailSplit` animados** (detalle en `04-diseno.md`): filete
  vertical, etiquetas desde el propio texto, cortina + zoom en la foto y
  marco azul desplazado. Nuevas piezas `Cortina` y `FileteVertical` en
  `Movimiento.jsx`.
- **La banda de «Capacidades» pasa de azul marino a azul claro**: el
  propietario la veía «muy molesta». Fondo `hsl(214 60% 94%)`, texto oscuro,
  números en azul de marca, la fila se pone en blanco al pasar el cursor.
  Contraste 15,6 / 7,2 / 10,1 : 1.
- Verificado midiendo el estado final en el navegador (foto destapada, filete
  a altura completa, 6 etiquetas, collage sin recorte); eslint ✅ · build ✅.

---

## 2026-10-27 · «Capacidades» y «Tipos» dejan de ser planas

El propietario, sobre /ropa: «Capacidades» y «Tipos de prenda» se veían
«muy básicas, muy planas, no hay nada de atención». Afecta a las tres páginas
de línea, que comparten los componentes.

**Qué se hizo** (detalle en `04-diseno.md` → «La banda de marca» y «Tarjetas
con icono»):

- **Capacidades** pasa a una banda azul marino a todo el ancho con retícula
  tenue (`.banda-marca`): título, «Lo que hacemos» y el recuento («06», sale
  del array) fijos a la izquierda; lista a la derecha con números grandes en
  tinte azul; la fila se aclara y le sale un filete al pasar el cursor.
- **Tipos / Sectores**: icono de lucide-react por tarjeta (ya instalado, sin
  dependencias nuevas), número grande de marca de agua, y barrido azul al
  pasar el cursor que deja la tarjeta en blanco sobre marino.
- Sin texto nuevo salvo el rótulo «Lo que hacemos».

**Verificación:** eslint ✅ · build ✅ · /ropa a 1280 px: banda con título
fijo, hover de filas y de tarjetas (color final medido: blanco).

---

## 2026-10-27 · Ropa: fuera los casos de éxito, dentro «Algunos de nuestros productos»

El propietario pidió en /ropa lo mismo que en /dotaciones: quitar «Casos de
éxito» y poner sus productos, dos fotos por diseño, rotulados «Diseño 1,
Diseño 2…» (sin nombre). Llegaron 8 fotos: 4 diseños.

**Qué se hizo:**

- Fotos en `public/fotos/ropa/0N-{producto,ambiente}.webp`, **verticales 3:4 a
  900×1200**. Seis de las ocho llegaron así; en 3:2, como calzado y
  dotaciones, las ambientadas (personas de cuerpo entero) perdían cabeza o
  pies. Las dos del jean negro llegaron apaisadas y se recortaron a 3:4
  centradas en la prenda y en la persona, sin cortar nada. 20 MB → 540 KB.
- `disenio()` de `data/media.js` acepta `width`/`height`; `GALERIA_ROPA` usa
  `VERTICAL`. El marco de `GalleryPhoto` toma la proporción de la foto, no un
  `aspect-[3/2]` fijo.
- Dos fotos 3:4 a todo el ancho medían 720 px de alto y una fila no cabía en
  la pantalla de un portátil: las filas verticales se ciñen a `max-w-4xl`
  (583 px de alto) y se arriman a izquierda y derecha alternando, como los
  lados de las fotos.
- **`CasesSection` borrada**: era /ropa la última página que la usaba.
  `ProjectCard` sigue vivo en «Proyectos con resultado» de la home.

**Abierto:** parche de Carhartt visible en la ambientada del Diseño 02 (ver
`02-empresa.md` y P1-28).

**Después, el mismo día, dos ajustes más pedidos por el propietario:**

- **Rótulo vertical.** Las filas verticales dejaban un hueco al lado de las
  fotos. Con un boceto, pidió llevar «Diseño» a ese hueco: en escritorio
  (`lg+`) el rótulo va ahí en grande (72 px), en vertical, de abajo arriba,
  con un filete azul del lado de las fotos (`RotuloVertical` en
  `ProductLine.jsx`). La cabecera horizontal se oculta en `lg` y sigue en
  móvil y tableta, donde no hay hueco. Calzado y dotaciones (3:2) no cambian.
- **Hero de /ropa con foto propia.** La chaqueta de banco (Unsplash) se
  sustituyó por la foto de una modelo con chaqueta de cuero y jean negro
  (`fotos/ropa-modelo.webp`, 4:5, 960×1200, 2,5 MB → 60 KB). `LineHero` acepta
  `imageWidth`/`imageHeight`: si la foto es vertical, el marco toma su
  proporción y se ciñe a `max-w-md`. También es ya la foto de Ropa en la home
  y en los cierres de línea (`data/lineas.js`), con `posicion: '50% 10%'`
  para que el recorte 3:2 / 4:3 no le corte la cabeza. `IMAGES.ropaHero`
  borrado de `projects.js`: quedan 9 imágenes de banco.

Verificado en el navegador a 1280 px y a 375 px; eslint ✅ · build ✅.

**Verificación:** eslint ✅ · build ✅ (7 rutas) · /ropa en el navegador: 4
filas «Diseño 01–04», 8 imágenes 900×1200 servidas, sin «Casos de éxito», 0
errores de consola.

---

## 2026-10-27 · Las líneas en azul y negro

El propietario pidió color azul en las líneas de los cuadros y de separación,
repartido «para que se vea bien y no sobrecargado».

**Qué se hizo:** una jerarquía de tres niveles, documentada en
`04-diseno.md` → «Las líneas»: **azul** para lo que agrupa contenido
(tarjetas, filas de listas, cabeceras de la galería, línea bajo las cifras),
**negro al 30 %** para lo que separa secciones, y **neutro** para marcos de
fotos, divisiones internas y campos del formulario. Las tarjetas llevan además
un acento azul corto arriba a la izquierda que se estira al pasar el cursor
(antes la línea solo aparecía con el cursor encima).

**Medido, no supuesto:** al primer intento (azul al 30 %) las capturas
mostraban las líneas grises. Se subió a 40 % en tarjetas y 60 % en filas.

**Verificación:** eslint ✅ · build ✅ · capturas a 1280 px de /dotaciones
(capacidades, sectores, galería) y de la home (líneas, «Dónde operamos»).

---

## 2026-10-27 · Dotaciones: fuera los casos de éxito, dentro «Nuestros productos»

El propietario pidió, antes de publicar, quitar de /dotaciones la sección
«Casos de éxito» y poner sus productos con el mismo formato que la galería de
/calzado: dos fotos por referencia, y como nombre **el del archivo** de la
primera foto (`polar.jpg` → «Polar»).

**Qué se hizo**
- 7 referencias, 14 fotos, tomadas de `Descargas` con sus nombres originales:
  Soldador, Petrolera, Vigilante, Polar, Work Confort, Work Confort N y Work
  520 sin puntera. Registradas en `docs/02-empresa.md` (dato nuevo del
  propietario → primero ahí).
- Recorte a 3:2 y 1200×800, **centrado en las botas** midiendo su caja sobre
  el fondo blanco. Soldador y Vigilante no cabían en un 3:2 sin perder unos
  píxeles de caña: en vez de cortar, se **ensanchó el fondo** repitiendo el
  borde fila a fila (el fondo es casi plano: 243–254). De 37 MB a 1,1 MB.
- `DesignGallery` acepta `etiqueta` y `rotulo`; en /dotaciones dice
  «Calzado de dotación · Nuestros productos.» y «Referencia 0N». El helper
  `disenio()` de `media.js` recibe ahora la carpeta, y lleva el nombre.
- `CasesSection` ya solo la usa /ropa.

**Lo que NO se publicó:** la ficha de catálogo de «Soldador» (normas ASTM,
DIN, NTC-ISO y la marca «Work Life»). No se pidió para el sitio; publicar
normas exige la ficha de cada referencia.

**Verificación:** eslint ✅ · build ✅ (7 rutas) · en /dotaciones: 7 filas en el
orden enviado, lados alternos, 14 fotos servidas a 1200×800, sin «Casos de
éxito», 0 errores de consola · la galería de /calzado sigue igual (8 fotos,
«Diseño 0N»). No hubo captura: el panel no pinta con la ventana en segundo
plano.

**Dónde quedó / qué sigue**
- Fotos de ropa.
- Marcas visibles en las botas («G/M», «Velectric», «LEH»): confirmar que no
  son de clientes, como «REBORN».

---

## 2026-10-26/27 · Seguridad del formulario, y una pasada visual a todo el sitio

El propietario pidió, antes de mandar las fotos de ropa y dotaciones, revisar
la seguridad, que todo el backend funcione (correos, enlaces, la tabla de
contactos), que se le explique cómo funciona el formulario, y mejorar el sitio
«en todos los sentidos», también lo visual y las transiciones.

### 1 · El formulario, probado de verdad

Banco local desechable, sin tocar la base del propietario ni producción:
PHP 8.3 de Laragon, un **MySQL 8.4 nuevo en el puerto 3399** creado para la
prueba (modo estricto, como Hostinger) y un **SMTP falso con TLS** que guarda
cada correo en un archivo para leerlo. La batería son 18 casos.

**Primera pasada: cinco problemas reales** (detalle en **ADR-019**): Insumos
daba 422, el formulario aceptaba envíos desde cualquier web, el límite por IP
podía contar por nodo de CDN, no había tope de almacenamiento (60 envíos
seguidos → 60 filas) y el acuse repetía el mensaje del visitante a una
dirección que pone él — servía para mandar spam firmado por 4D.

**Segunda pasada, ya corregido: 18 de 18.** Lo más importante:

| Caso | Resultado |
|---|---|
| Solicitud válida | 200 · `aviso:ok acuse:ok` · 2 correos capturados |
| Insumos | 200 · `line = insumos` |
| `Origin` ajeno / `text/plain` | 403 / 415 · **0 filas** |
| 7 envíos seguidos | 5 con correo, 2 `omitido_por_limite` |
| 25 envíos seguidos | 20 guardados, **5 rechazados con 429** |
| Dos clientes tras el mismo nodo de CDN | cuentan por separado |
| Cae el SMTP | **la solicitud se guarda** · `aviso:fallo acuse:fallo` |
| Cae la base | 500 con JSON genérico, sin rutas ni avisos de PHP |
| Spam por el acuse | el enlace **no** llega a la víctima |

La migración `db/migraciones/2026-10-26-linea-insumos.sql` se ejecutó dos
veces seguidas sobre la tabla con datos: idempotente, sin pérdida.

### 2 · Lo que se miró en producción (solo lectura)

Sin enviar nada por el formulario real. `config.php` y `smtp.php` → **403**
(bien). `contacto.php` por GET → 405 (bien). `/nosotros` → **301** (el
`.htaccess` sigue sin subir, P1-08). Sin cabeceras de seguridad (las pone el
`.htaccess`). `/favicon.ico` → 404. SPF y DKIM correctos, **DMARC en
`p=none`** (P1-10). Historial de Git: **ninguna credencial real**, solo
marcadores de ejemplo. `npm audit`: 0 vulnerabilidades.

**Enlaces:** 182 revisados en las 7 rutas, 0 rotos. `wa.me` y el enlace de
Maps responden 200.

### 3 · Pasada visual

- **Contraste:** la auditoría del 20-oct trataba el color con alfa como opaco.
  Rehecha mezclando con el fondo real, salieron dos fallos: la numeración
  `.text-outline` a **1,59:1** y los textos de ayuda del formulario. Ambos
  corregidos → 0 fallos.
- **Dos H1 invisibles en el HTML prerenderizado** (`/contacto`, `/nosotros`):
  estaban en un `Reveal`. Pasan a `.rise-solid`.
- **Tarjetas en vez de celdas pegadas:** las rejillas `gap-px bg-border` de la
  home, las páginas de línea y Nosotros pasan a `.tarjeta` (blanca, borde que
  se tiñe y línea azul que se dibuja al pasar el cursor). «Dónde operamos» en
  la home: cada tarjeta entera es el enlace.
- **Proyectos de la home:** el huérfano de la tablet ocupa la fila entera y
  todas las tarjetas igualan altura.
- **Transiciones nuevas** (`components/Movimiento.jsx`): filetes que se dibujan
  en las listas numeradas y fotos que entran con un zoom leve. Ambas respetan
  `prefers-reduced-motion` y llevan `data-reveal` para el `<noscript>`.
- **Plantillas de correo** con la paleta actual (blanco y PMS 295).

### Verificación

Build ✅ · eslint ✅ · 7 rutas sin errores de consola · 0 fallos de contraste ·
sin desborde horizontal en móvil · los H1 presentes en el HTML prerenderizado.

⚠️ **No verificado:** el movimiento en sí. El panel de vista previa midió
**0 fps** con la ventana en segundo plano, así que las animaciones no se pueden
ver desde aquí → **P1-26**.

**Estado del backlog**
- Nuevos: **P1-24** (migración antes del PHP) ⬜ · **P1-25** (`X-Forwarded-For`
  en la CDN) ⬜ · **P1-26** (revisar transiciones) ⬜
- P1-08 (`.htaccess`) y P1-10 (DMARC) siguen ⬜

**Decisiones tomadas**
- **ADR-019**: endurecimiento del formulario y acuse sin contenido del visitante.

**Dónde quedó / qué sigue**
- Publicar la v2 en el orden de `09-despliegue.md` (migración primero).
- Fotos de ropa y dotaciones, que el propietario manda a continuación.
- Siguen abiertas: secciones de proyectos de la home, /ropa y /dotaciones;
  nombres de los 4 diseños; la marca «REBORN» del diseño 02; el commit.

---

## 2026-10-26 · Nuevo vídeo del hero, con bucle sin costura

El propietario generó un segundo vídeo con Flow —un zapato de **denim**— y
pidió sustituir el anterior y que «parezca bucle».

### Lo que traía el original

| | |
|---|---|
| Formato | **Vertical**, 720×1280, 24 fps, 10 s (240 fotogramas) |
| Peso | 5,49 MB, con pista de audio |
| Fondo | `rgb(234,234,234)` — **el mismo gris que el vídeo anterior** |

Como el fondo es idéntico, **`--background` no hubo que tocarlo** (la regla del
ADR-016 se comprobó, no se supuso).

### Tres problemas, medidos antes de tocar nada

1. **El giro no cierra.** Se comparó cada fotograma con el primero: el mejor
   cierre natural es el fotograma 237, con una diferencia de **5,35** frente a
   **1,64** entre fotogramas consecutivos. El giro se queda corto de 360° y al
   reiniciar habría un brinco cada 10 s.
2. **De perfil, el vídeo de origen corta la puntera** contra el borde izquierdo
   (comprobado a tamaño real en el fotograma de 3,5 s). No se puede recuperar.
3. **El WebM pesaba más que el MP4** (1,1 MB frente a 482 KB) por la textura del
   denim, y el navegador elige el WebM primero.

### Cómo se resolvió

**Bucle — fundido de la cola con la cabeza.** Se descartan los primeros 15
fotogramas del cuerpo y se funden con los 15 últimos, de modo que el vídeo
termina en el fotograma 14 del original y empieza en el 15: consecutivos.

```
[0:v]fps=24,crop=720:720:0:402,scale=640:640:flags=lanczos,setsar=1,split[a][b];
[a]trim=start_frame=15,setpts=PTS-STARTPTS,fps=24,settb=1/24[main];
[b]trim=end_frame=15,setpts=PTS-STARTPTS,fps=24,settb=1/24[head];
[main][head]xfade=transition=fade:duration=0.625:offset=8.75,format=yuv420p[v]
```

`xfade` exige tasa de fotogramas constante: sin el `fps=24,settb=1/24` tras
cada `trim`, falla con «current rate of 1/0 is invalid».

**Resultado medido sobre el archivo final:** costura de **2,08** frente a un
paso medio de **3,71** entre fotogramas. El salto del final al principio es
ahora más suave que el propio movimiento del giro.

**Recorte:** cuadrado de 720 centrado en el zapato (envolvente vertical
y 510–1015 en todo el giro → recorte desde y=402), escalado a 640.

**Puntera cortada:** la máscara `.shoe-feather` pasó de una elipse radial (que
en los laterales solo desvanecía un ~27 %) a **dos fundidos lineales cruzados**:
16 % en horizontal y 10 % en vertical. De perfil la puntera se funde con el
gris en vez de verse cortada; de frente y de espaldas el zapato ocupa el 28–72 %
central y la máscara no lo toca.

**Peso:** WebM a **dos pasadas con objetivo de 380 kb/s** → 436 KB, por debajo
del MP4. Comparado a nivel de textura con el MP4: conserva el tejido diagonal
del denim.

| Archivo | Peso |
|---|---|
| `zapato.webm` | 436 KB |
| `zapato.mp4` | 482 KB |
| `zapato-poster.jpg` | 21 KB |

El visitante descarga **uno** de los dos vídeos más el póster: **~460 KB**.
Más que los ~190 KB del vídeo anterior, porque el denim tiene mucho más detalle
y este giro es completo. De 5,49 MB a 460 KB igualmente.

### Verificación

- Servido en `localhost:3100`: el navegador carga el WebM, 9,38 s, 640×640,
  en bucle, sin `autoplay` en el atributo, máscara con `intersect` aplicada.
- Sin errores de consola. Build 7 rutas ✅ · `eslint src` limpio ✅
- Como las capturas del panel no pintan vídeo, se reconstruyó en un lienzo lo
  que ve el visitante (fotograma + máscara sobre el gris de la página) en 0,1 ·
  2,9 · 5,3 · 9,3 s: **el primero y el último son el mismo fotograma de frente**
  y la puntera de perfil se desvanece sin corte.

El vídeo anterior quedó como copia de seguridad en el scratchpad de la sesión;
**no estaba en git** (nunca se commiteó).

### Segunda iteración: el difuminado se comía la puntera y el talón

El propietario aprobó el bucle, pero no el difuminado: *«cuando el zapato está
totalmente vertical se le difumina la punta y la parte de atrás»*. Tenía razón,
y medirlo explicó por qué no había arreglo con ese vídeo: **el original
vertical no tiene la puntera** en 68 de sus 240 fotogramas (entre 2,4 y 4,3 s
corta hasta 190 filas contra el borde, es decir, la puntera entera).

Se probó a darle margen con un lienzo pintado fila a fila y a difuminar solo
la puntera y solo en esos tramos. Funcionaba, pero en esos tramos la puntera
seguía sin existir. Entonces el propietario aportó **el mismo giro en
horizontal** (1280×720), y ahí el zapato **nunca toca los bordes**
(x 196–1082). Se rehizo todo con ese.

#### Proceso final

1. **Recorte 3:2** (1080×720 desde x=99), no cuadrado: de perfil el zapato
   mide 886 px y el vídeo 720 de alto. Escalado a 960×640.
2. **Aplanado del fondo al gris de la página (235)**, fotograma a fotograma y
   solo en lo que es fondo: píxeles claros y sin color. El denim es azul y
   cordones, forro y suela son crema, así que no se tocan. Sin esto se veía la
   peana blanca (244) y la pared de los lados (226–230) como un recuadro.
3. **Bucle** con el mismo `xfade` de 0,625 s que en la primera iteración.
4. Codificación: MP4 `crf 30` y WebM a dos pasadas a 400 kb/s.

```python
# aplanar.py — RGB24 por stdin/stdout:  python aplanar.py 1080 720
import sys, numpy as np
PAGINA = 235.0
LUM_DESDE, LUM_RAMPA = 200.0, 18.0   # < 200 no se toca; a 218 pesa del todo
SAT_LLENO, SAT_NADA = 7.0, 12.0      # saturación ≤ 7 se corrige entera; ≥ 12 nada
w, h = int(sys.argv[1]), int(sys.argv[2]); tam = w*h*3
while len(buf := sys.stdin.buffer.read(tam)) == tam:
    a = np.frombuffer(buf, np.uint8).reshape(h, w, 3).astype(np.float32)
    lum, sat = a.mean(2), a.max(2) - a.min(2)
    peso = np.clip((lum-LUM_DESDE)/LUM_RAMPA, 0, 1) * np.clip((SAT_NADA-sat)/(SAT_NADA-SAT_LLENO), 0, 1)
    sys.stdout.buffer.write(np.clip(a + (PAGINA-a)*peso[..., None], 0, 255).astype(np.uint8).tobytes())
```

```
ffmpeg -i ORIGINAL -vf "fps=24,crop=1080:720:99:0" -f rawvideo -pix_fmt rgb24 - \
 | python aplanar.py 1080 720 \
 | ffmpeg -f rawvideo -pix_fmt rgb24 -s 1080x720 -r 24 -i - \
     -vf "scale=960:640:flags=lanczos,setsar=1,format=yuv444p" -c:v ffv1 compuesto.mkv
```

Y después, sobre `compuesto.mkv`, el `xfade` de la primera iteración.

#### Dos callejones sin salida, para no repetirlos

- **Un modelo de fondo por mediana temporal** dejaba **halos blancos** pegados
  al contorno del zapato: justo ahí el modelo es menos fiable, porque esos
  píxeles están tapados buena parte del giro. Decidir fotograma a fotograma
  qué es fondo lo resolvió.
- **El filtro `blend` de ffmpeg** con una imagen en bucle como segunda entrada
  dejaba **las dos últimas columnas en negro** en el vídeo completo (en pruebas
  cortas no). No se averiguó la causa; se sustituyó por el script de Python
  entre dos ffmpeg, que es determinista.

#### Medido

| | Resultado |
|---|---|
| Borde del vídeo frente a la página | **< 1,5 niveles** (antes 5–6) |
| Cambio en el zapato | **0,75 niveles de media**: imperceptible |
| Cordones, flecos, etiqueta del forro | Comparados a tamaño real: idénticos |
| Costura del bucle | 2,71 frente a 2,93 de paso medio: sin salto |
| Peso servido | **~485 KB** (WebM 459 · MP4 478 · póster 25) |
| Calidad | WebM 39,0 dB · MP4 38,3 dB de PSNR |

En la web: el vídeo pasa a 960×640 y `max-w-[520px]` (452×301 en escritorio,
331×221 en móvil), y la máscara `.shoe-feather` se quedó en el 6 % lateral, 12 %
arriba y 5 % abajo — zonas donde el zapato no entra en ningún fotograma.

Verificado en el navegador pintando el fotograma de perfil en un lienzo con la
misma clase CSS: puntera y talón completos, sin recuadro visible.

### Tercera iteración: el zapato, más grande

El propietario: *«siento que está muy pequeño para el espacio que tiene»*.
Había dos frenos, y se soltaron los dos:

1. **El margen dentro del vídeo.** El zapato ocupaba el 82 % del ancho y el
   66 % del alto. Se midió su contorno en todo el giro con tres criterios
   distintos (denim y suela; + flecos y crema; + sombras suaves) y los tres
   coinciden: x 194–1084, y 162–647. Nuevo recorte **960×600 a resolución
   nativa** (sin reescalar, así además gana nitidez): el zapato ocupa el
   **93 %** del ancho. Ningún píxel del zapato cae en los 20 px del borde en
   ningún fotograma.
2. **El reparto de columnas del hero.** Pasa a 50/50 **solo desde 1280 px**
   (`xl:grid-cols-2`). La palabra más larga del titular, «desarrollamos», mide
   497 px: a 1024 px no cabría en una columna a partes iguales (468), así que
   por debajo de `xl` se mantiene el reparto anterior.

| Ancho | Zapato antes | Zapato ahora |
|---|---|---|
| 1440 px | ~371 px | **~493 px (+33 %)** |
| 1024 px | ~320 px | ~363 px (+13 %) |
| 375 px | ~271 px | ~307 px (+13 %) |

Verificado en 1440, 1280, 1100, 1024, 768 y 375: el titular no se sale de su
columna, el vídeo no pisa el texto y la página no desborda.

**Y destapó dos halos que había que quitar.** El hero tenía `glow-tr`, un
degradado del azul de marca anclado arriba a la derecha: con el vídeo más
grande, su esquina caía encima y la página quedaba **5 niveles más oscura**
justo ahí, dejando ver el recuadro. Y el componente traía un halo heredado del
cubo que en móvil (256 px) asomaba por encima y por debajo del vídeo (207 px).
Los dos eran decoración del tema oscuro; retirados.

Archivos: `zapato-denim-960.*` (WebM 460 KB · MP4 584 KB · póster 28 KB).
Bucle: costura 3,72 frente a 4,13 de paso medio.

⚠️ **Los archivos van con nombre nuevo** (`zapato-denim-3x2.*`). Al sustituir
el primer vídeo con el mismo nombre, una pestaña con el anterior en caché pidió
un rango de bytes que ya no existía y el servidor respondió **416**. En
producción le pasaría a cualquier visitante recurrente.

---

## 2026-10-26 · Enlaces en azul en todo el sitio y nuevo cierre de las líneas

### 1 · Todo lo que se pulsa, en azul

El propietario pidió que los datos que llevan a un enlace se vean en azul, y
revisar **toda** la web. Se hizo con un inventario automático de las 7 páginas
(cada enlace de contenido que no fuera azul, con su texto y su sección), no a
ojo. Salieron:

| Dónde | Qué |
|---|---|
| Home, «Dónde operamos» | correo, teléfono (WhatsApp) y dirección (Maps) |
| /nosotros, «Nuestra historia» | los cuatro enlaces a las líneas, dentro del párrafo |
| /contacto, «Datos de contacto» | correo y teléfono |
| Footer, en las 7 páginas | todos sus enlaces |

Se resolvió con **dos clases** (`.enlace` y `.enlace-texto`, ver
`04-diseno.md`) en lugar de colores sueltos. Los enlaces dentro de un párrafo
van **siempre subrayados**, porque el azul marino y el gris del cuerpo se
parecen demasiado en luminosidad para distinguirse solo por color (WCAG 1.4.1).

**Y destapó dos incoherencias en /contacto**, corregidas leyendo de
`lib/contacto.js` como el resto del sitio: el teléfono abría una **llamada**
(`tel:`) en vez de WhatsApp con el mensaje, y la **dirección no era un enlace**.
De paso, el correo del mensaje de error del formulario también pasó a enlace.

Resultado: **0 enlaces de contenido sin azul** en las 7 páginas, y **0 fallos
de contraste**; el enlace con menos contraste da 5,66:1.

### 2 · El cierre de las páginas de línea, rehecho

El propietario lo veía «muy cuadrado, muy genérico». Además tenía **un fallo
de fondo**: cada página enseña las otras tres líneas en una rejilla de dos
columnas, así que **siempre quedaba una celda vacía** (el bloque gris de su
captura).

- **Registro único `data/lineas.js`** con las cuatro líneas. La home y el
  cierre leen de ahí; `LineClosing` recibe `actual` y enseña las demás. Se
  acabaron las listas de «otras líneas» copiadas en cada página, que ya se
  habían desincronizado una vez («las otras dos líneas» tras añadir Insumos).
- **Tres tarjetas con la foto de cada línea**: número de dimensión en azul,
  título y un botón de flecha azul que se rellena al pasar el cursor; la foto
  se acerca ligeramente (`motion-safe:`). En móvil, filas compactas con
  miniatura de 110 px y botón de 44 px.

Verificado: cada página de línea muestra exactamente las otras tres; sin
errores de consola en ninguna de las 7 páginas; sin desborde a 375 px; build ✅
y `eslint src` ✅.

### 3 · «Proyectos» sale también del footer

El propietario vio que el footer seguía enlazando a proyectos. Se quitaron el
enlace «Proyectos» de la columna Empresa y **la columna Proyectos entera**; la
rejilla pasa de marca + 4 columnas a marca + 3. La columna de líneas pasó a leer
de `data/lineas.js` (estaba copiada a mano).

Con eso **ya no queda ningún enlace a `#proyectos` en todo el sitio**. Pero el
**contenido** de proyectos sigue en tres sitios, pendiente de que el
propietario decida: la sección «Proyectos con resultado» de la home, y los
casos de éxito de /ropa y /dotaciones.

⚠️ Durante la edición la consola mostró `LINEAS is not defined`: era un estado
intermedio de la recarga en caliente (componente editado antes que su import).
Comprobado con una carga limpia de las 7 páginas: ningún error.

---

## 2026-10-26 · Calzado: foto propia, galería de diseños y fuera «Proyectos»

Tres peticiones del propietario, y una cuarta a mitad de camino.

1. **«Proyectos» sale del menú** (escritorio y móvil). La sección sigue en la
   home y el footer conserva su enlace. Se midió si el menú volvía a caber a
   1024 px: quedarían **53 px** de holgura, menos que los 65 que ya se daban por
   justos, así que el menú horizontal sigue empezando en 1280 px.
2. **Hero de /calzado:** fuera el zapato blanco de banco, entra una foto de un
   par de tenis de cuero café. **Recortada a 3:2** —la proporción en que la
   muestra el hero— antes de optimizarla, para no descargar píxeles que nunca se
   ven: de 479 KB a **120 KB**. Registrada en `data/media.js`.
3. **Los casos de éxito de /calzado se sustituyen** por una galería, «Algunos de
   nuestros diseños», para enseñar zapatos propios. Componente nuevo
   `DesignGallery`, alimentado por `GALERIA_CALZADO` en `data/media.js`.
   ⚠️ **La galería está vacía y por eso no se ve**: con cero fotos no pinta nada,
   ni el título — ni huecos ni relleno genérico. Aparece sola en cuanto lleguen
   las fotos.
4. *(A mitad de tarea)* **La tarjeta de Calzado de la home** también pasa a la
   foto café. El zapato blanco (`IMAGES.calzadoHero`) quedó sin uso y se retiró
   de `projects.js`.

La galería **se probó con datos temporales** (las dos fotos propias que ya
existen) antes de vaciarla: tres columnas, pie de foto, entradas con `Reveal`.
La prueba sirvió para corregir una decisión: las fotos iban en **vertical
4:5**, pero un zapato es un objeto apaisado y en un marco vertical quedaba
pequeño o cortado. Ahora son **cuadradas**.

#### La galería, ya con fotos

El propietario envió **4 diseños con dos fotos cada uno**: una de producto
(fondo blanco o gris) y una ambientada. Venían en proporciones distintas
(cuadradas y 16:9), así que:

- **Las 8 se recortaron a 3:2**, centrando el recorte en el **zapato** y no en
  la imagen, y se comprobó una a una que ninguno pierde puntera ni talón.
- Optimizadas a 1200×800 en WebP: **de 2,76 MB a 561 KB**, y con carga diferida.
- **Maqueta:** una fila por diseño, ambientada y producto lado a lado, y el lado
  de la ambientada **alterna** fila a fila (mismo recurso que las líneas de la
  home). Encabezado «Diseño 0N». En móvil se apilan, primero la ambientada.
- La estructura de datos pasó de «una foto por entrada» a «un diseño con dos
  fotos». El encuadre cuadrado que se había decidido para fotos sueltas ya no
  aplica: ahora es 3:2.
- El zoom al pasar el cursor va con `motion-safe:`, así que no se mueve con
  `prefers-reduced-motion`. No se reutilizó `.media` porque su tinte azul sobre
  una foto de producto con fondo blanco quedaba sucio.

**Sin nombres:** el propietario no los dio y no se inventaron. Si se añaden
(`nombre` en `data/media.js`), salen junto a «Diseño 0N».

⚠️ La foto de producto del **diseño 02** lleva grabado en el lateral un texto
que parece **«REBORN»** — posible marca de un cliente. Anotado en **P1-23**.

Verificado: 8/8 fotos cargan, la alternancia es correcta en las cuatro filas,
sin desborde a 375 px, la galería está en el HTML prerenderizado, build ✅ y
`eslint src` ✅.

Ojo: /ropa y /dotaciones **siguen con su sección de casos de éxito**. Solo se
cambió /calzado, que es lo que se pidió.

Verificado: build 7 rutas ✅ · `eslint src` limpio ✅ · sin errores de consola ·
el HTML prerenderizado de /calzado lleva la foto nueva y ya no contiene
«Resultados que hablan por sí solos».

---

## 2026-10-20 · Tema claro, barra negra y los primeros textos de la v2

Primera sesión de cambios de la v2. El propietario fue pidiendo punto por punto.

### Textos (5 cambios en la home)

- **H1:** desaparece la palabra «producto» y el acento azul se traslada a
  «calzado, ropa y dotaciones», para no perder el color en el titular.
- **Entradilla:** «comercializadora internacional colombiana» → «empresa
  colombiana»; «desarrollamos producto a medida» → «Diseñamos soluciones a
  medida».
- **Cifra:** `12.000 · Dotaciones entregadas en 4 países` → `130 · Dotaciones
  entregadas`. Se actualizó **primero** [`02-empresa.md`](02-empresa.md), según
  la regla del proyecto.
- **Quiénes somos:** «comercializadora internacional» → «empresa colombiana»;
  caen «en mercados exigentes» y «verificable».

⚠️ **Quedó una contradicción publicada:** la ficha del Programa Atlas sigue
diciendo «12.000 colaboradores dotados en cuatro países». Abierta como
**P1-12**, bloqueada a la espera del propietario.

### Tema claro — ADR-013

El propietario aportó una captura de referencia y pidió su paleta. Los valores
**no se estimaron a ojo**: GDI+ no decodifica WebP, así que se cargó la imagen
en un lienzo del navegador y se muestreó píxel a píxel, buscando el píxel más
oscuro de cada zona de texto para no caer en el antialiasing entre letras.

Salió: primary `hsl(198 96% 31%)` (#036D9B), fondo blanco, titulares
`hsl(228 11% 9%)`, párrafos `hsl(210 4% 38%)`.

El cambio fue pequeño porque el color estaba **bien centralizado**: bastó el
bloque `:root` más cuatro literales (`body`, `::selection`, `.text-outline`,
`.watermark`) y el cubo del hero. Navbar y footer voltearon solos.

### Barra superior en negro

Pedida a mitad de sesión. Se resolvió con `.navbar-dark`, que **redefine los
tokens dentro del `<header>`** en lugar de reescribir una docena de clases de
`Navbar.jsx`. El menú móvil es hermano del header, así que se queda en blanco
—correcto, porque ocupa toda la pantalla.

### Verificación

- Build con prerender: **6 rutas** ✅
- Contraste automático sobre todo el texto de las 6 rutas: **0 fallos AA**.
  Petróleo sobre blanco 5,74:1; navbar sobre negro 10,33:1.
- Sin desborde horizontal a 375 px. Menú móvil correcto.
- Sin errores de consola.

### Tres hallazgos que no estaban previstos

1. **`.media::after` jugaba en contra.** Ese degradado fundía una foto oscura
   en una página oscura; sobre blanco lavaba el tercio inferior de cada imagen.
   Suavizado. Efecto secundario: la regla de «30 % inferior libre» del plan v2
   se relaja a ~20 %.
2. **`npm run lint` ya fallaba antes de esta sesión** (`sharp` sin instalar en
   `tools/generate-images.js`). Comprobado revirtiendo los cambios: falla
   igual. Abierto como **P1-14**.
3. **El H1 de `/nosotros` se sigue prerenderizando con `opacity:0`**, como
   anticipaba el plan para el sprint 2. Confirmado sobre el HTML generado.

### Segunda tanda del mismo día: cuarta línea de negocio

El propietario siguió pidiendo cambios en la misma sesión.

- **Se elimina el difuminado de las fotos** (`.media::after`). Lo rechazó
  explícitamente: *«eso se ve feo»*. Consecuencia documentada: **decae la regla
  de «30 % inferior libre de caras y rótulos»** del plan v2 — ya no hay
  degradado que se coma esa zona.
- **«Tres dimensiones de producto» → «Cuatro dimensiones de producto».**
- **Reescritas las tres descripciones** de las líneas en la home.
- **Nuevo orden del menú**: Calzado · Ropa · Dotaciones · Insumos · Proyectos ·
  Nosotros · Contacto. Antes Proyectos iba primero.
- **Nueva línea 04 «Insumos»** con ruta propia `/insumos`, registrada en
  `App.jsx` **y** en `site.js` como exige la regla del proyecto. Entra en el
  sitemap y en el prerender: el sitio pasa de **6 a 7 rutas**.
- **La cifra de 130 queda confirmada** por el propietario.

⚠️ **`/insumos` es una página mínima a propósito.** Lo único que se aportó fue
una frase. No se inventaron capacidades, tipos, cifras ni casos: la página
lleva hero y cierre, y nada más, hasta que haya material real (**P1-15**).
Ni la tarjeta 04 de la home ni el hero de `/insumos` tienen foto, así que se
renderizan **sin hueco de imagen** — se tocó `LineHero` para que `image` y
`claim` sean opcionales.

⚠️ **El navbar quedó al límite:** 6 enlaces más el botón dejan **65 px libres a
1024 px**. Entra, pero uno más lo rompe (**P1-17**).

### Verificación de esta segunda tanda

- Build: **7 rutas** prerenderizadas ✅ · `/insumos` en el sitemap ✅
- `eslint src` limpio ✅ *(el fallo de `sharp` en `tools/` sigue, es P1-14)*
- Contraste en las **7** rutas: **0 fallos** · sin desborde horizontal
- Menú correcto a 1024 y 1440; menú móvil sin cambios

### Lo que se entregó sin implementar

- **El prompt para Google Flow**, detallado, para que el propietario genere el
  vídeo del zapato giratorio con **un zapato real de la empresa** (que es lo
  que resuelve la objeción, no el vídeo en sí).
- **El análisis de las tres vías para el sitio trilingüe** (ES/EN/PT), con
  coste y consecuencias de SEO. Pedido explícitamente como *«primero dime cómo
  hacerlo y yo miro si lo apruebo»*. Abierto como **P1-16**.

### Tercera tanda: el zapato, los contactos y la tipografía

#### El vídeo del hero

El propietario generó el vídeo con Flow **partiendo de la foto de un zapato
real de la empresa**, que era la parte importante. Llegó así: 1280×720, 9,17 s,
pista de audio AAC y **8,69 MB**.

No se podía publicar: es el elemento que mide el LCP. Se encontró un ffmpeg que
venía con el paquete `imageio_ffmpeg` de Python y se procesó:

```
crop=720:720:260:0,scale=640:640:flags=lanczos
libx264 crf 30 · sin audio · +faststart        → 171 KB
libvpx-vp9 crf 38                               → 210 KB
póster JPG                                      →  18 KB
```

El recorte **no se eligió a ojo**: se midió la envolvente del zapato en cinco
fotogramas del giro (x 291–948) para garantizar que no se corta en ningún
momento. Resultado: **de 8,69 MB a 404 KB en total**.

También se midió la costura del bucle comparando el primer y el último
fotograma: **1 % de diferencia media**, lo bastante poco para que no se note.

`Tesseract.jsx` se borró — ya no se usaba y el proyecto no guarda código
muerto (ADR-011). Está en git.

#### El fondo de la página cambió por culpa del vídeo

El propietario detectó que *«el fondo del zapato con el fondo de la página no
coinciden»*. Cierto: el vídeo tiene fondo gris, no blanco. Se muestreó el
archivo — **`rgb(234,234,234)` = `hsl(0 0% 92%)`** — y la página adoptó ese
color.

No bastaba con eso: el fondo del vídeo **no es plano**, va del 88 % al 95 %,
así que un gris liso seguiría sin casar en las esquinas. Se añadió una máscara
radial (`.shoe-feather`) que desvanece los bordes. Las dos cosas, no una.

`--card` pasó a blanco puro para que las superficies elevadas sigan leyéndose
por encima del fondo, y `--border` se oscureció al 78 % para seguir viéndose.

#### Contactos

Nuevo `src/lib/contacto.js` como punto único. De ahí salen el `mailto`, el
enlace de WhatsApp **con el mensaje ya escrito** y el de Google Maps con la
dirección ya buscada. La sección «Dónde operamos» ahora tiene los tres
enlazados, y hay un **botón flotante de WhatsApp** en las siete rutas.

⚠️ Ese botón **rompe el ADR-009**. Queda registrado en el **ADR-014**: es el
tercer punto de contacto del sitio y está en todas las páginas. Si la dirección
vuelve a decir que «parece que vende», es lo primero que hay que mirar.

#### Tipografía — el sprint 1 del plan, completo

Cuatro cambios y uno que no estaba previsto:

1. **Fuera `-webkit-font-smoothing: antialiased`.** Coste cero, mayor impacto.
2. **Archivo sustituye a Manrope.**
3. **Escala arriba.** En vez de reescribir las **63** clases `text-sm`/`text-xs`
   del código, se redefinió la escala en `tailwind.config.js`. Un solo cambio.
4. **Peso del cuerpo 400 → 450.**
5. **Los números delineados pasan a relleno.** El propietario avisó de que «se
   ven medio delineados». Eran `-webkit-text-stroke` de 1 px: a baja densidad
   el antialiasing se come el trazo. Ya no queda ni un `text-stroke`.

**Medido sobre el texto renderizado de las 7 rutas: el texto a ≤14 px bajó del
75 % al 12 %.** Y ese 12 % restante son los eyebrows a los 13 px que el propio
plan fijó, más el enlace «Saltar al contenido», que está oculto. El objetivo
del plan era «< 10 %», así que queda por encima en la métrica — pero no hay
nada que bajar sin contradecir el plan.

### Verificación de la tercera tanda

- Build: **7 rutas** ✅ · `eslint src` limpio ✅
- Contraste tras el cambio de fondo: **0 fallos AA en las 7 rutas**
- Sin desborde horizontal a 375 ni a 1440
- Botón de WhatsApp 56×56 px — por encima del mínimo táctil de 44 px de WCAG
- Vídeo: sin atributo `autoplay`, con `playsInline`, `loop`, `muted` y póster.
  Comprobado que la rama de pausa funciona

⚠️ **Lo que NO se pudo verificar aquí:** el panel del navegador no permite
emular `prefers-reduced-motion`, así que la rama que muestra el póster fijo se
comprobó por estructura (ausencia de `autoplay`, pausa efectiva), no con la
preferencia real del sistema. Conviene probarlo a mano en un equipo con el
movimiento reducido activado.

⚠️ **Las capturas del panel no componen fotogramas de vídeo**, así que el hero
sale vacío en ellas. Se confirmó que el vídeo se decodifica dibujándolo en un
lienzo y midiendo el rango de luminancia (37–250).

### Cuarta tanda: el footer, y lo que destapó

El propietario señaló que el footer estaba desactualizado. Lo estaba, pero el
problema de fondo era otro: **los nombres de los proyectos estaban copiados a
mano** en `Footer.jsx`, así que al renombrarlos en `projects.js` el footer
siguió anunciando «Runner X-40», «Colección Origin» y «Programa Atlas» —
proyectos que ya no existen en el sitio.

Arreglado de raíz: ahora **se derivan de `data/projects.js`**. No pueden volver
a desincronizarse. De paso, los dos «Greenloop» se desambiguan con su línea
(«Greenloop · Calzado» / «Greenloop · Ropa»), que es el apaño del **P1-19**
aplicado al footer.

Lo demás del footer:

- **Descripción:** «Comercializadora internacional…» → «Empresa colombiana de
  diseño y desarrollo de producto: calzado, ropa, dotaciones e insumos».
  Se alinea con el lenguaje nuevo y suma la cuarta línea.
- **Contacto enlazado**, leyendo de `lib/contacto.js`: correo, WhatsApp con el
  mensaje escrito y Maps con la dirección buscada.
- La dirección es **un solo enlace en dos líneas**, no dos enlaces al mismo
  destino: así un lector de pantalla no anuncia «ver en Google Maps» dos veces.

#### 🔴 Lo que destapó: el sitio se contradice sobre dónde opera

Al cambiar «Dónde operamos» en la home a **«Latinoamérica y Centroamérica»**,
el resto del sitio se quedó anunciando lo contrario. El footer se corrigió,
pero **la contradicción sigue viva en cuatro sitios más**:

| Dónde | Qué sigue diciendo |
|---|---|
| `ContactoPage.jsx:282` | «Latinoamérica · Norteamérica · Europa» |
| `NosotrosPage.jsx:71` | «Comercializamos y entregamos en Latinoamérica, Norteamérica y Europa» |
| `NosotrosPage.jsx:77` | Una tarjeta entera dedicada a **Norteamérica** |
| `JsonLd.jsx:48` | `areaServed` incluye Norteamérica — **es lo que lee Google** |
| `02-empresa.md:172` | La fuente de verdad sigue listando Norteamérica |

**No se tocaron a propósito.** Si la empresa ya no opera en Norteamérica y
Europa, no es un cambio de texto: es retirar una afirmación comercial de cinco
sitios, incluida la que leen los buscadores. Y si sí opera, entonces lo que
está mal es la frase nueva de la home. Hace falta que lo diga el propietario.
Abierto como **P1-22**.

Además, `NosotrosPage.jsx:50` sigue diciendo **«tres líneas de negocio»**
cuando ya son cuatro. Es consecuencia directa de añadir Insumos. Incluido en
el mismo **P1-22** porque está en el mismo párrafo.

### Quinta tanda: se zanja dónde opera 4D (cierra el P1-22)

El propietario resolvió la contradicción que había destapado el footer, y de
paso reescribió «Nuestra historia».

**La cobertura real es Colombia · Latinoamérica · Centroamérica**, y los
aliados de manufactura están en **Colombia, Guatemala, Ecuador y Bolivia**.
Fuera Norteamérica, Europa y Asia.

No era cambiar un texto: la afirmación estaba copiada en **siete sitios**.

| Dónde | Qué se corrigió |
|---|---|
| `NosotrosPage` · historia | Texto nuevo, con las **cuatro líneas enlazadas** a su página |
| `NosotrosPage` · capacidad | Párrafo + las tres tarjetas (Colombia / Latinoamérica / Centroamérica) |
| `ContactoPage:282` | «Latinoamérica · Norteamérica · Europa» → cobertura nueva |
| `Footer` | Línea de cobertura |
| `JsonLd` | **`areaServed` y la descripción** — es lo que indexa Google |
| Cierres de las 4 páginas de línea | Aliados, y «otras **dos** líneas» → «otras **tres**» |
| `02-empresa.md` | La fuente de verdad |

⚠️ **Hay que pedir reindexación en Search Console.** El `areaServed` anterior,
con Norteamérica y Europa, ya está indexado por Google. Cambiar el marcado no
borra lo indexado.

Las cuatro líneas de la historia van enlazadas dentro del párrafo. **No cuentan
como CTA** a efectos del ADR-009: son navegación dentro del texto, no llamadas
a contactar.

### Verificación

- Build 7 rutas ✅ · `eslint src` limpio ✅
- Contraste en las 7 rutas: **0 fallos** · sin desborde
- `areaServed` publicado comprobado sobre el HTML generado
- Cero apariciones de «Norteamérica», «Asia y Europa», «tres líneas de
  negocio» y «otras dos líneas» en todo `src/`

⚠️ **Una cosa que no apliqué:** el propietario escribió el nombre como «4D
Cuarta Dimensión S.A.S.», **sin el «ES»**. Se mantuvo **«4D Cuarta Dimensión ES
S.A.S.»**, que es la razón social registrada según `02-empresa.md`. Si el «ES»
sobra de verdad, hay que cambiarlo en la fuente de verdad primero — aparece
también en el JSON-LD y en los títulos de página.

### Sexta tanda: PMS 295 y el botón de Inicio

#### El azul de marca

El propietario aportó el color corporativo real —**PMS 295**— en una
fotografía de un muestrario impreso. Se muestreó el área central: la moda de
color da **`rgb(15,55,106)` = `#0F376A` = `hsl(214 75% 24%)`**.

⚠️ **Queda dicho que es un escaneo, no el Pantone exacto.** Las conversiones
publicadas de Pantone 295 C quedan algo más oscuras (`#002F5F`–`#003057`). Si
existe el valor del manual de marca, ese manda.

**Destapó un problema real:** PMS 295 es un azul marino muy oscuro, y la barra
superior es negra. Ahí el azul se usa en el subrayado de 1 px del enlace activo
y en el botón «Contacto» — habría quedado **invisible**. Se resolvió
redefiniendo `--primary` dentro de `.navbar-dark` a un **tinte del mismo
color** (`hsl(214 75% 58%)`): mismo matiz, misma saturación, solo más claro.

**El cambio mejora la accesibilidad**, no la empeora:

| | Antes (petróleo) | Ahora (PMS 295) |
|---|---|---|
| Acento sobre la página | 4,77:1 | **9,92:1** |
| Blanco sobre el acento | 5,74:1 | **11,83:1** |

#### El botón de Inicio, y lo que rompió

Se añadió «Inicio» como primer enlace, con `end: true` en el `NavLink` — sin
eso React Router da por activa la ruta `/` en **todas** las páginas y el enlace
se quedaría resaltado siempre.

**Y activó el P1-17**, que estaba avisado desde la segunda tanda:

| a 1024 px | Antes de «Inicio» | Con «Inicio» |
|---|---|---|
| Hueco libre en el navbar | 65 px | **0 px** |
| Nombre del logo | Una línea | **Partido en dos** |

Mitigado subiendo el punto de ruptura del menú de `lg` (1024) a `xl` (1280),
bajando el espaciado a `gap-7` y poniendo `whitespace-nowrap` al logo. Entre
1024 y 1279 px se usa la hamburguesa, que ya existía.

**Medido a 1024, 1280, 1440 y 1680 px**, abriendo la página en un iframe de
cada ancho: a 1280 el menú entra con **77 px** de holgura y el logo en una
línea.

⚠️ El P1-17 **sigue abierto**: con 77 px no cabe otro enlace. El siguiente
obliga a agrupar las cuatro líneas en un desplegable.

### Verificación de la sexta tanda

- Build 7 rutas ✅ · `eslint src` limpio ✅
- Contraste en las 7 rutas: **0 fallos** · sin desborde
- Cero restos del azul anterior (`198 96% 31%` / `#036D9B`) en `src/`
- Subrayado del enlace activo comprobado visualmente sobre la barra negra

### Séptima tanda: la primera foto que no es de banco

El propietario aportó una imagen para **Insumos**: una mesa de trabajo con
cueros, rollos de tela, conos de hilo, suelas, cremalleras, cordones y
herrajes, con un taller al fondo.

- **Optimizada antes de entrar:** de **397 KB a 190 KB** (escalada a 1400 px de
  ancho y reencodeada a WebP con calidad 80).
- **Se creó `src/data/media.js`**, el registro de fotos propias que pedía el
  sprint 3 del plan. Lleva `src`, `width`, `height` y `alt`. Las medidas no son
  decorativas: sin ellas el navegador no reserva el hueco y la página salta al
  cargar.
- Se usa en **dos sitios**: el hero de `/insumos` y la tarjeta 04 de la home.

**Lo bonito:** no hubo que tocar ni `LineHero` ni la tarjeta de la home. Ambos
aceptaban `image` nulo desde la segunda tanda, así que **volvieron solos a dos
columnas** en cuanto la foto existió. La regla de «si falta la foto, no hay
hueco» se pagó sola.

⚠️ **Dos registros de imagen, y no se mezclan:** `data/media.js` para las fotos
propias de `public/fotos/`, e `IMAGES` de `data/projects.js` para las 11
imágenes de banco en CDN externo que siguen pendientes de sustituir.

### Verificación

- Build 7 rutas ✅ · `eslint src` limpio ✅
- Imagen comprobada en las dos ubicaciones: carga, dimensiones naturales
  1400×788, `loading="lazy"` en la tarjeta de la home
- La tarjeta 04 pasó a rejilla de dos columnas (520 px + 520 px)

### Pendiente de decisión del propietario

- ✅ ~~El zapato giratorio del hero~~ — resuelto: vídeo de Flow con un zapato
  real, comprimido y publicado (ADR-016).
- ✅ ~~La cifra de 130~~ — confirmada. *(Lo del Programa Atlas decayó: el
  proyecto se renombró a «Diseño Personalizado» y su cifra es ahora
  +20.000 prendas.)*
- **Aprobar la vía del sitio trilingüe** (P1-16).
- **El contenido de `/insumos`** (P1-15).
- **Si se mantiene el `+120K` de portada**, que se quedó sin soporte (P1-18).
- **Si es intencionado que dos proyectos se llamen «Greenloop»** (P1-19).
- ✅ ~~Si el sitio sigue anunciando Norteamérica y Europa~~ — resuelto: la
  cobertura es Colombia · Latinoamérica · Centroamérica (P1-22).
- **Si la razón social lleva «ES» o no** — hoy el sitio publica «4D Cuarta
  Dimensión ES S.A.S.» en siete sitios, incluido el JSON-LD.
- **Si el PMS 295 muestreado del escaneo (`#0F376A`) vale**, o hay que usar el
  valor oficial del manual de marca (ADR-017).

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
