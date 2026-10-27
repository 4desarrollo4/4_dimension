# 05 — Contenido y SEO

**Última actualización:** 2026-10-27

---

# Parte 1 · Reglas editoriales

## La regla que gobierna todo

**El sitio informa, no vende.**

El objetivo es que conozcan a la empresa. Cada vez que escribas o edites un
texto, la pregunta no es *"¿esto convierte?"* sino ***"¿esto hace que nos
entiendan?"***

---

## Voz

| Atributo | Sí | No |
|---|---|---|
| **Persona** | 1ª plural describiendo ("desarrollamos", "operamos") | 2ª persona vendiendo ("tu reto", "tu mercado") |
| **Tono** | Sobrio, técnico, seguro | Entusiasta, publicitario, urgente |
| **Afirmaciones** | Hechos verificables | Superlativos sin respaldo |
| **Cierre de sección** | Información | Llamado a la acción |

---

## Política de CTA

**Máximo 2 llamados a la acción en toda la home.** Uno en la barra de
navegación (`Contacto`) y opcionalmente uno al cerrar la página.

> ✅ **Cumplido desde el 2026-09-01** (**P1-01**). Cada página del sitio tiene
> exactamente **dos** enlaces a `/contacto` — navbar y footer — y ambos se
> llaman "Contacto". No queda ni un CTA comercial en el cuerpo.
>
> ⚠️ Ojo con los CTA disfrazados: las tarjetas de proyecto enlazaban a
> `/contacto`, lo que sumaba cuatro llamados encubiertos solo en la home. Ahora
> llevan a su línea de negocio. Si añades un bloque nuevo, pregúntate a dónde
> lleva, no solo qué dice.

### Reemplazos acordados ✅ *(aplicados el 2026-09-01)*

| Texto actual | Reemplazo |
|---|---|
| H1 "Convertimos ideas en productos ganadores" | Titular de identidad, p. ej. "Diseñamos y desarrollamos producto: calzado, ropa y dotaciones" |
| Botón hero "Hablemos de un proyecto" | "Qué hacemos" (ancla a las líneas) |
| Navbar "Hablemos ↗" | "Contacto" |
| "Trabajemos juntos" (Nosotros) | "Conócenos" o eliminar |
| "¿Cuál será tu próxima dimensión? → Iniciar conversación" | Cierre informativo, sin CTA |
| "PROPUESTA DE VALOR" | "CÓMO TRABAJAMOS" |
| Meta desc. de Contacto: "Cotiza tu proyecto" | "Datos de contacto de 4D Cuarta Dimensión" |
| Formulario: "Tu proyecto… volúmenes, países, tiempos" | "Mensaje" — nombre, correo, mensaje y ya |

### Reescritura de la metodología
Hoy vende en 2ª persona. Debe describir en 1ª:

- ❌ "Entendemos **tu** mercado, **tu** cliente y el reto que **quieres** convertir en oportunidad."
- ✅ "Partimos del mercado y del usuario final para definir qué producto tiene sentido desarrollar."

---

## Qué NO se puede escribir

1. **Cifras, clientes o casos que no estén en [`02-empresa.md`](02-empresa.md).**
   Si falta un dato, se pregunta. Nunca se estima ni se rellena.
2. Afirmaciones objetivas sin soporte. La **Ley 1480 de 2011** obliga a poder
   sustentar toda afirmación publicitaria.
3. Nombres de marca de clientes sin autorización escrita.
4. Certificaciones que la empresa no tenga.

---

# Parte 2 · SEO

## Auditoría del 2026-10-27 — el código está bien, el servidor no

El propietario preguntó si el sitio «tiene buen SEO y buen posicionamiento».
Se auditó el build (las 7 rutas) y el sitio publicado.

**En el build: bien.** Un `<title>`, una descripción, un `canonical`, un H1,
JSON-LD, Open Graph y Twitter Card por ruta; `lang="es"`; todas las imágenes
con `alt`; `sitemap.xml` con las 7 rutas; `robots.txt` correcto.

**En el servidor publicado: tres fallos, y son los que frenan el
posicionamiento** (medido con peticiones GET el 2026-10-27):

| Petición | Responde | Efecto |
|---|---|---|
| `/nosotros` (y las demás rutas) | **301 → `/nosotros/`** | El canonical dice `/nosotros`: Google ve que la página buena redirige y **no la indexa**. Por eso solo está indexada la home |
| `https://www.4dimensionsas.com/` | **200** (copia del sitio) | Dos direcciones para el mismo contenido: reparten la autoridad |
| `/favicon.ico` | **404** | Sin icono en los resultados de Google |
| `/insumos` | **404** | La v2 no está subida |

Los cuatro se arreglan **subiendo la v2** con su `.htaccess` (ver
`09-despliegue.md`). No hay nada más que tocar en el código para ellos.

**Cambios hechos en el código ese día:**

- **Títulos con palabras clave y lugar.** Antes «Calzado — Diseño y
  desarrollo»; ahora «Diseño y desarrollo de calzado en Colombia». Ver la
  tabla de abajo. Pasan de 60 caracteres a propósito: Google corta el final, y
  lo que queda cortado es la marca, que ya sale en la URL. Primero va lo que
  la gente busca.
- **Imagen propia al compartir cada línea** (`public/og/*.jpg`, 1200×630,
  sacadas de las fotos propias). Antes las 7 rutas compartían `og-image.jpg`.
- **Insumos:** descripción de 59 a 152 caracteres, y ya en literal: con una
  variable, `llms.txt` publicaba «No description available».
- **`.htaccess`:** `www` → sin `www` con 301, y caché del navegador (un año
  para `assets/` con hash, 30 días para fotos, sin caché para el HTML).

**Lo que no depende del código** (en orden de impacto):

1. Subir la v2 (arregla la tabla de arriba).
2. Google Search Console: enviar `sitemap.xml` y pedir la indexación de las 7
   rutas.
3. **Perfil de Empresa de Google** (Google Maps) con la dirección de Bogotá:
   es lo que más pesa para búsquedas locales como «dotaciones en Bogotá».
4. Completar el JSON-LD (NIT, año de fundación, redes) → **P1-06**.
5. Sustituir las 7 imágenes de banco que quedan → **P2-10**.

### Títulos desde el 2026-10-27

| Ruta | `<title>` |
|---|---|
| `/` | 4D Cuarta Dimensión \| Diseño de calzado, ropa y dotaciones en Colombia |
| `/calzado` | Diseño y desarrollo de calzado en Colombia \| 4D Cuarta Dimensión |
| `/ropa` | Diseño y desarrollo de ropa en Colombia \| 4D Cuarta Dimensión |
| `/dotaciones` | Dotaciones y uniformes empresariales en Colombia \| 4D Cuarta Dimensión |
| `/insumos` | Insumos para calzado y textil en Colombia \| 4D Cuarta Dimensión |
| `/nosotros` `/contacto` | sin cambios |

## Estado del 2026-09-01: 9/10 — era 3/10

El bloque de visibilidad (**P0-02**, **P0-03**, **P0-04**) se resolvió el
2026-09-01. Lo que queda son dos cosas que dependen del propietario y una
verificación de hosting.

| Elemento | Estado |
|---|---|
| `<title>` en `index.html` | ✅ completo |
| `<meta name="description">` en `index.html` | ✅ completo |
| `<meta name="generator">` de Hostinger | ✅ eliminado |
| Favicon | 🟡 SVG **provisional** — falta el logo oficial |
| Meta description por ruta | ✅ en el HTML servido, sin JavaScript |
| `og:title` / `og:description` | ✅ 9 etiquetas `og:*` por ruta |
| `og:image` | ⛔ **falta el archivo** — se declara pero no existe |
| Twitter Card | ✅ 4 etiquetas por ruta |
| `canonical` | ✅ correcto y único por ruta |
| `robots.txt` | ✅ generado en el build |
| `sitemap.xml` | ✅ generado en el build, 6 rutas |
| `llms.txt` | ✅ generado (nunca había corrido en Windows) |
| Prerender de las 6 rutas | ✅ |
| JSON-LD | ✅ `Organization` + `WebSite` + `BreadcrumbList` en las 6 rutas |
| `meta robots` | ✅ `max-image-preview:large`, para que Google muestre imagen grande |
| Longitud de títulos | ✅ los 6 por debajo de 60 caracteres |
| Longitud de descripciones | ✅ las 6 entre 120 y 160 caracteres |
| `lang="es"` | ✅ |
| Jerarquía de encabezados | ✅ un H1 por página, H2/H3 coherentes |
| `alt` en imágenes | ✅ descriptivos, en español |

### Lo que sigue faltando

1. **`og-image.jpg` (1200×630).** Al compartir un enlace ya salen título y
   descripción, pero **no sale imagen**. Es lo que más se nota en WhatsApp y
   LinkedIn. Necesita el logo oficial. → **P0-02**
2. **Completar el JSON-LD.** Ya se emite con lo verificado; faltan NIT,
   dirección exacta, año de fundación y redes sociales. → **P1-06**
3. **Confirmar la configuración de rutas del hosting.** Si el servidor reescribe
   todo a `/index.html`, todo lo anterior se pierde. → **P0-06**

---

## Cómo se generan hoy los meta tags

Cada página declara **dos** bloques, y los dos importan:

```jsx
<Helmet>
    <title>…</title>
    <meta name="description" content="…" />
</Helmet>
<Seo title="…" description="…" />
```

| Bloque | Para qué sirve |
|---|---|
| `<Helmet>` | `<title>` y `description`. **Literales obligatorios**: `tools/generate-llms.js` los lee del código fuente y no admite variables |
| `<Seo>` | Open Graph, Twitter Card y `canonical`. Toma el dominio de `src/lib/site.js` |

⚠️ Si cambias un título, **cámbialo en los dos**. Están duplicados a propósito:
es el precio de que `llms.txt` se pueda generar leyendo el código.

📁 [`apps/web/src/components/Seo.jsx`](../apps/web/src/components/Seo.jsx) ·
[`apps/web/src/lib/site.js`](../apps/web/src/lib/site.js)

---

## Meta tags por ruta

| Ruta | Estado |
|---|---|
| `/` | ✅ title + description + OG |
| `/calzado` `/ropa` `/dotaciones` | ✅ title + description + OG |
| `/nosotros` | ✅ title + description + OG |
| `/contacto` | ✅ title + description + OG, ya sin lenguaje de venta |

---

# Parte 3 · Cumplimiento legal (Colombia)

| Norma | Qué exige | Estado |
|---|---|---|
| **Ley 1581 de 2012** (habeas data) | Aviso de privacidad y autorización expresa al recoger datos personales | ❌ **el formulario recoge datos sin aviso** → P0-05 |
| **Ley 1480 de 2011** (consumidor) | Poder sustentar toda afirmación publicitaria objetiva | ✅ datos validados; conservar soportes |
| **Decreto 1074 de 2015** | Política de tratamiento de datos publicada | ❌ pendiente |
