# 10 — Plan de la versión 2

**Última actualización:** 2026-10-20

> Plan aprobado por el propietario el 2026-10-19. Las historias de usuario
> derivadas están en [`../wiki/Historias-de-usuario.md`](../wiki/Historias-de-usuario.md)
> y la metodología en [`../wiki/Metodologia-Scrum.md`](../wiki/Metodologia-Scrum.md).

---

## Contexto

El sitio de 4D Cuarta Dimensión está publicado en `4dimensionsas.com` desde el 2026-09-02 y funciona. Pero la dirección de la empresa lo rechazó con tres objeciones: **«muy básico»**, **«las imágenes no nos representan»** y **«muchas secciones repiten lo mismo»**. A eso se añade una cuarta queja posterior: **los textos «se ven borrosos o muy pequeños»**.

Audité el código y el sitio en producción para convertir esas cuatro frases en hechos medibles. Las cuatro son ciertas y las cuatro tienen causa identificada. Además quedaron tres cosas sin terminar de septiembre que siguen abiertas.

El objetivo de este plan es: arreglar las cuatro objeciones, cerrar lo pendiente, y montar un gobierno del proyecto (GitHub privado + wiki + Scrum) para que esto deje de depender de que alguien recuerde lo que pasó.

---

## Diagnóstico, con evidencia

### 1 · «Muy básico» — solo hay 4 formas de sección, repetidas 28 veces

El sitio tiene ~34 secciones y ~2.030 palabras, pero solo **cuatro plantillas**: lista numerada, rejilla de celdas con borde de 1px, imagen+texto, y eyebrow+H2+párrafo. Todo lo demás es relleno de esas cuatro.

### 2 · «Las imágenes no nos representan» — es literal

**11 de 11 imágenes de contenido son de CDN externo**: 10 de `images.hostinger.com` y 1 de Unsplash. **Cero fotos de la empresa.** Lo más grave: `NosotrosPage.jsx:57` tiene `alt="Equipo de diseño de 4D revisando prototipos…"` sobre un render genérico. El sitio afirma mostrar al equipo y no lo hace.

No existe en ninguna parte: una persona, un nombre, un cargo, las instalaciones, el proceso real, una fecha de fundación, una certificación.

### 3 · «Muchas secciones repiten lo mismo» — confirmado

| Repetición | Evidencia |
|---|---|
| El párrafo de cierre de las 3 páginas de línea | **Misma cadena literal, carácter por carácter** (`CalzadoPage.jsx:60`, `RopaPage.jsx:59`, `DotacionesPage.jsx:62`) |
| H2 «Capacidades» y «Resultados que hablan por sí solos» | Idénticos en las 3 líneas, *hardcodeados* en `ProductLine.jsx:32` y `:98-99` |
| «No comercializamos catálogos» | **3 veces solo en la home** (`HomePage.jsx:106`, `:183`, `:345`) |
| «Comercializamos y entregamos en Latinoamérica, Norteamérica y Europa» | Literal en `HomePage.jsx:360` y `NosotrosPage.jsx:71` |
| Los 4 proyectos | Se renderizan **8 veces**. Ni un caso exclusivo de una página de línea |
| `/nosotros` | No aporta **ni un hecho** que la home no tenga |
| Tres cuartetos incoherentes | Home: Visión/Precisión/Innovación/Resultados · Nosotros: Calidad/Cumplimiento/Transparencia/Relaciones · H1 de Nosotros: visión/diseño/desarrollo/resultados |

Las 3 páginas de línea usan **los mismos 6 componentes en el mismo orden**. Lo único que las separa visualmente es un espejo horizontal (`reverse`).

### 4 · «Borroso o muy pequeño» — medido en producción

| Hallazgo | Dato |
|---|---|
| `-webkit-font-smoothing: antialiased` | Desactiva el subpíxel y **adelgaza los trazos en Mac**. Causa clásica del «borroso» |
| Texto a ≤14px | **43 elementos — el 75 % del texto de la página** |
| Peso del cuerpo | **400** sobre fondo casi negro. El texto claro sobre oscuro necesita más peso para verse igual de sólido |
| Contraste | 7,08:1 — correcto. **El problema no es el color, es el grosor** |

### 5 · Pendiente de septiembre, sin cerrar

- **El `.htaccess` nunca se subió.** `/nosotros` sigue devolviendo **301**, y Google lo reportó como *Error de redirección*: **solo 1 de 6 páginas indexadas**.
- **`/favicon.ico` devuelve 404** y el HTML publicado no lo declara. Es parte de por qué no sale el logo en el buscador.
- **Nada está commiteado.** 154 cambios en el árbol de trabajo sobre `master`; el último commit es de antes de toda la limpieza de septiembre.
- **Sin cabeceras de seguridad.** La auditoría del 2026-09-03 encontró 5 hallazgos y ninguno se aplicó ni se documentó.
- **Dos archivos se colaron en `public/`**: un PDF de 9,3 MB y una imagen de WhatsApp. No están publicados todavía, pero `public/` se copia entera al build.

---

## Lo que necesito de ti

### A · Las 14 fotos imprescindibles

**Reglas técnicas** (vienen del código, no son preferencias):

- Mínimo **2400 px** en el lado largo, originales sin recomprimir.
- ⚠️ **El 30 % inferior de cada foto horizontal debe estar libre de caras y rótulos.** `index.css` aplica un degradado al fondo desde abajo (`.media::after`): lo que esté ahí se pierde. Es lo más fácil de incumplir.
- Fondos oscuros o neutros — el sitio es solo modo oscuro.
- Luz lateral o difusa. Sin flash directo.
- **Sin logos de clientes visibles** salvo autorización escrita.
- Nombres en minúsculas con guiones, sin tildes.

| Archivo | Qué debe mostrar | Proporción |
|---|---|---|
| `oficina-fachada.jpg` | Entrada o fachada de la oficina de Bogotá, con luz de día | 3/2 |
| `equipo-grupo-oficina.jpg` | El equipo junto trabajando sobre una mesa con muestras — **no** en fila mirando a cámara | 16/9 |
| `retrato-01…03.jpg` *(mín. 3)* | Retrato de medio cuerpo, **misma luz y mismo fondo en todos** | 4/5 |
| `proceso-01-descubrimiento.jpg` | Manos sobre la mesa con muestras de referencia y datos de mercado | 3/2 |
| `proceso-02-diseno.jpg` | Boceto o render en pantalla junto a la muestra física con la que se compara | 3/2 |
| `proceso-03-desarrollo.jpg` | Producción real: máquina de coser, horma o mesa de corte | 3/2 |
| `proceso-04-evolucion.jpg` | Verificación pre-embarque: cajas rotulándose, o una muestra junto a su v2 | 3/2 |
| `materiales-calzado-mesa.jpg` | Cenital: cueros, suelas y hormas sobre mesa oscura | 4/3 |
| `materiales-ropa-mesa.jpg` | Cenital: rollos de tela, patrones, cinta métrica | 4/3 |
| `materiales-dotaciones-mesa.jpg` | Cenital: casco, guantes, gafas, chaleco reflectivo, bota | 4/3 |
| `producto-calzado-runner.jpg` | El Runner X-40 real | 4/3 |
| `producto-ropa-coleccion.jpg` | Prendas reales de la Colección Origin | 4/3 |
| `producto-dotacion-atlas.jpg` | Dotación real del Programa Atlas, completa | 4/3 |
| `producto-calzado-executive.jpg` | Calzado real de la Línea Executive | 4/3 |

*Deseables (no bloquean):* `taller-corte`, `taller-costura`, `taller-control-calidad`, `anatomia-par-calzado`, `kit-dotacion-cargo`, macros de costura/horma/bordado.

**Las tres fotos de materiales son las de mejor retorno por esfuerzo:** una mesa y luz, y son lo que hace que `/calzado`, `/ropa` y `/dotaciones` dejen de parecer la misma página.

### B · Datos que bloquean secciones enteras

| Dato | Qué bloquea |
|---|---|
| **Año de fundación** | La historia con fechas en `/nosotros` y `foundingDate` del JSON-LD |
| **Nombres y cargos del equipo** | La sección de equipo entera |
| **NIT** | La página de política de datos (lleva pendiente desde septiembre) |
| Certificaciones reales | Hoy se dice «aliados certificados» sin poder nombrar ninguna |
| Redes sociales | `sameAs` del JSON-LD |
| Logo vectorial (SVG) | Favicon perfecto a cualquier tamaño, impresión |
| ¿Hay una cifra propia de **ropa**? | Hoy solo hay cifras de calzado y dotaciones; `/ropa` se queda coja |

### C · Dos cosas que hay que **verificar**, no añadir

1. **La dirección física.** El sitio publica `Cra. 34a #27a-22 sur` en 5 sitios, pero `docs/02-empresa.md` —que es la fuente de verdad— **sigue marcándola como faltante**. O el dato es bueno y hay que registrarlo, o está en producción sin validar.
2. **«Empezamos desarrollando calzado»** (`NosotrosPage.jsx:47`) no está en `02-empresa.md`. Según vuestra propia regla, primero el documento y después el código.

---

## Decisiones ya tomadas

| | |
|---|---|
| **Colores** | Se mantienen intactos |
| **Tipografía** | **Archivo** en todo el sitio, sustituyendo a Manrope. Requiere ADR nuevo (hoy la tipografía está declarada «cerrada») |
| **Escala** | Subida clara: cuerpo 16→18px, tarjetas y listas 14→16px, eyebrows 12→13px |
| **Alcance** | Se mantiene el lenguaje visual, se enriquece el contenido. ADR-010 sigue vigente |
| **Fotos** | El propietario las aporta |
| **Repositorio** | GitHub **privado**, con wiki |
| **Método** | Scrum ligero: una persona desarrollando, la dirección como Product Owner que aprueba cada sprint |

---

## Sprint 0 — Fundamentos *(no depende de fotos)*

> **HU-01** · Como responsable del proyecto, quiero el código en GitHub con su wiki, para que el trabajo no dependa de una carpeta en un portátil.

- Crear repo privado `4dimensionsas-web`, rama `main`.
- **Commitear los 154 cambios pendientes** antes de nada.
- Wiki con: Inicio · Arquitectura · Despliegue · Decisiones (ADR) · Bitácora · Guía de contenido · Sistema de diseño. Se alimenta de `docs/`, que ya existe y está bien.
- Issues + GitHub Projects como tablero. Milestone por sprint.
- Plantillas de issue: historia de usuario, bug, tarea técnica.

> **HU-02** · Como visitante, quiero que todas las páginas aparezcan en Google, no solo la portada.

- **Subir el `.htaccess`** ya preparado: elimina el 301 de `/nosotros` y añade las 5 cabeceras de seguridad.
- Subir `favicon.ico` y republicar para que el HTML lo declare.
- Pedir reindexación en Search Console.
- Verificar: `/nosotros` → 200 sin redirección, cabeceras presentes, las 6 rutas rastreables.

> **HU-03** · Como responsable, quiero la documentación al día para no repetir diagnósticos.

- Documentar las dos sesiones sin registrar (auditoría de seguridad del 03-sep, error de redirección del 07-sep).
- Crear **P1-08** — hoy el `.htaccess` la referencia y no existe.
- Sacar de `public/` el PDF de 9,3 MB y la imagen de WhatsApp.
- Cambiar la contraseña de la base de datos (quedó expuesta en una captura).

---

## Sprint 1 — Legibilidad *(la queja de la dirección; no depende de fotos)*

> **HU-04** · Como lector, quiero leer el sitio sin forzar la vista.

Cuatro cambios, en orden de impacto:

1. **Quitar `-webkit-font-smoothing: antialiased`** de `index.css`. Coste cero, es el mayor salto percibido.
2. **Archivo** sustituye a Manrope: una familia variable de Google Fonts, altura de x mayor y trazos que aguantan sobre fondo oscuro.
3. **Subir la escala**: cuerpo 18px, tarjetas y listas 16px, eyebrows 13px. Revisar que no desborde ninguna composición a 360 / 768 / 1024 / 1440.
4. **Peso del cuerpo 400 → 500.** Archivo es variable, así que no cuesta descarga.

**Entregable para aprobación:** una página de comparación con el texto real del sitio, antes y después, para que la dirección lo apruebe viendo, no leyendo. Nuevo ADR que deroga el cierre de la tipografía.

---

## Sprint 2 — Matar la repetición *(no depende de fotos)*

> **HU-05** · Como visitante, quiero que cada página me diga algo que las otras no.

**Nuevo ADR: «una idea, una página».** Cada hecho tiene una sola página propietaria; las demás enlazan o usan su propia versión.

| Duplicación | Dueño | Las demás |
|---|---|---|
| Párrafo de cierre de las líneas | Nadie lo conserva literal; el hecho pasa a `/nosotros` | Cada línea recibe un cierre propio sobre **qué la hace distinta** |
| «Capacidades» | Se elimina el valor por defecto; el título pasa a ser obligatorio | «Seis decisiones que definen un par» · «Del boceto al escalado de tallas» · «Un programa de dotación, paso a paso» |
| «Resultados que hablan por sí solos» | Se borra con la sección entera | La sustituye un caso expandido cuyo H2 **es el nombre del proyecto** |
| «No comercializamos catálogos» | Solo en la sección de diferenciación | El hero pasa a descriptor factual; «Quiénes somos» se muda a `/nosotros` |
| Cobertura internacional | `/nosotros` | La home la sustituye por un bloque **Bogotá** con foto de fachada |
| Los 4 proyectos | Home = índice corto | Cada línea muestra **solo su caso, expandido y con otra forma** |
| Tres cuartetos | **Uno solo: las 4 fases** — que además explica el nombre 4D | Los pilares desaparecen como sección; los compromisos se quedan solo en `/nosotros` |

**Dos correcciones que son bugs, no mejoras:**
- `NosotrosPage.jsx:33` y el hero de `ContactoPage` envuelven su H1 en `Reveal`: esas páginas **se prerenderizan con el titular a `opacity: 0`**, justo lo que vuestra propia guía de diseño prohíbe. Pasan a `.rise-in` / `.rise-solid`.
- Retirar el `alt` falso del supuesto equipo. **Mejor sin foto que con una que miente** — y se quita ya, antes de que llegue material.

**Guardia antirrepetición:** `tools/check-duplicados.js` lee los 6 HTML prerenderizados, extrae frases de ≥12 palabras y **falla el build** si una aparece en dos rutas. Es la única forma de que esto no vuelva en seis meses.

---

## Sprint 3 — Fotos reales y `/nosotros`

> **HU-06** · Como visitante, quiero ver quién es 4D, dónde trabaja y cómo hace un producto.

Es el sprint de mayor retorno: la página que hoy no aporta nada se convierte en la que tiene personas, lugar y proceso.

**Canalización:** `public/fotos/`, `data/media.js` como registro único (ruta, dimensiones, alt) y `tools/optimize-fotos.js` para reencuadrar y comprimir.

**Regla de diseño de todos los componentes nuevos:** si falta la foto, la sección se renderiza **sin el hueco de imagen** — nunca una imagen rota ni un render genérico de relleno. Así se puede construir antes de que llegue el material.

`/nosotros` pasa de 4 a 7 secciones: hero con foto de oficina · historia con fechas · **proceso fotografiado** (4 fases con su entregable y raíl de progreso vertical) · **equipo** · **instalaciones** (mosaico asimétrico) · cobertura · compromisos.

Componentes nuevos: `ProcessSteps`, `TeamGrid` (degrada a foto de grupo si hay menos de 3 retratos), `PhotoMosaic`.

---

## Sprint 4 — Que las tres líneas dejen de ser la misma página

> **HU-07** · Como visitante interesado en dotaciones, quiero una página distinta a la de calzado.

**Común a las tres:** hero, capacidades (con título propio) y cierre (con texto propio).
**Propio de cada una:** una sección firma, un orden distinto y una cifra distinta.

| | `/calzado` | `/ropa` | `/dotaciones` |
|---|---|---|---|
| Sección firma | **Anatomía de un par** — foto despiezada con rótulos numerados | **De la ficha a la prenda** — el mismo diseño en 3 estados | **Una dotación por cargo** — tabla por rol con su kit |
| Cifra | +120K pares | *(sin dato — pendiente)* | 12.000 en 4 países |
| Secciones | 8 | 7 | 9 |

Componentes nuevos: `MaterialBoard`, `CaseStudy`, `LineStat`, `AnnotatedPhoto`, `SequenceStrip`, `KitTable`. El contenido de las 3 líneas sale de las páginas a `data/lines.js`, lo que hace visible la divergencia e impide que vuelva el copia-pega.

---

## Sprint 5 — Movimiento, home y cierre

> **HU-08** · Como visitante, quiero que el sitio se sienta vivo sin que me moleste.

Todo con la infraestructura que ya existe (curva `[0.22,1,0.36,1]`, 0.6s, `y:24`):

- **`.rule-draw`** — los filetes de las listas se dibujan de izquierda a derecha al entrar. Reutiliza la técnica del subrayado del navbar.
- **`.media-reveal`** — la foto entra de `scale(1.04)` a `1`. Mismo transform que ya usa el hover.
- **Raíl vertical** de progreso en el proceso.
- **Marquesina por línea** con el vocabulario de cada una.
- ❌ **Sin paralaje**: coste de scroll y riesgo de salto visual a cambio de poco.
- ⚠️ Cada keyframe nuevo entra en los dos bloques de `prefers-reduced-motion` que ya existen. Nada de la primera pantalla anima `opacity`.

La home baja de 10 a 8 secciones y el JSON-LD se completa con los datos nuevos.

---

## Verificación

**Por sprint, antes de dar nada por hecho:**

1. `npm run build --prefix apps/web` compila y prerenderiza las 6 rutas.
2. `npm run lint --prefix apps/web` limpio.
3. `node tools/check-duplicados.js` — cero frases de ≥12 palabras repetidas entre rutas *(desde el sprint 2)*.
4. Las 6 rutas abiertas en el navegador: sin errores de consola, sin desborde horizontal a **360 / 768 / 1024 / 1440**.
5. Ningún H1 con `opacity: 0` en el HTML prerenderizado.
6. Con `prefers-reduced-motion` activo, nada se mueve.
7. Contraste de los nuevos tamaños de texto ≥ 4,5:1.

**En producción, tras cada despliegue:**

- `/nosotros` → **200 sin redirección** y las 5 cabeceras de seguridad presentes.
- El formulario sigue guardando: fila nueva con `mail_status = aviso:ok acuse:ok`.
- Enlace pegado en WhatsApp: título, descripción e imagen propios de cada página.
- `site:4dimensionsas.com` en Google: las 6 rutas, no una.

**Métrica de éxito del proyecto**, para que la apruebe la dirección y no sea opinable:

| | Hoy | Objetivo |
|---|---|---|
| Fotos propias de la empresa | **0** | ≥ 14 |
| Frases literales repetidas entre rutas | varias | **0** |
| Plantillas de sección distintas | 4 | ≥ 9 |
| Texto a ≤14px | **75 %** | < 10 % |
| Páginas indexadas en Google | **1 de 6** | 6 de 6 |
| Personas con nombre en el sitio | **0** | ≥ 3 |

---

## Archivos críticos

- `apps/web/src/index.css` — tipografía, escala, utilidades de movimiento
- `apps/web/src/components/ProductLine.jsx` — quitar títulos por defecto y la sección de casos
- `apps/web/src/pages/NosotrosPage.jsx` — reescritura completa
- `apps/web/src/pages/HomePage.jsx` — de 10 a 8 secciones
- `apps/web/src/data/` — nuevos `media.js` y `lines.js`
- `apps/web/public/.htaccess` — ya preparado, **solo falta subirlo**
- `docs/02-empresa.md` — primero el dato, después el código
