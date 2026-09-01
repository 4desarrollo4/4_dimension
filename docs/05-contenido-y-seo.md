# 05 — Contenido y SEO

**Última actualización:** 2026-09-01

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

## Estado actual: 8/10 — era 3/10 el 2026-09-01

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
| JSON-LD `Organization` | ⛔ pendiente — **P1-06** |
| `lang="es"` | ✅ |
| Jerarquía de encabezados | ✅ un H1 por página, H2/H3 coherentes |
| `alt` en imágenes | ✅ descriptivos, en español |

### Lo que sigue faltando

1. **`og-image.jpg` (1200×630).** Al compartir un enlace ya salen título y
   descripción, pero **no sale imagen**. Es lo que más se nota en WhatsApp y
   LinkedIn. Necesita el logo oficial. → **P0-02**
2. **JSON-LD `Organization`.** Es lo que alimenta el panel de conocimiento de
   Google. Necesita NIT, dirección y redes. → **P1-06**
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
