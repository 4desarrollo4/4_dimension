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

### Reemplazos acordados

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

## Estado actual: 3/10 — es el punto más débil del sitio

Para un sitio cuyo objetivo es *"que nos conozcan"*, esto es lo que más
importa arreglar.

| Elemento | Estado |
|---|---|
| `<title>` en `index.html` | ❌ **vacío** |
| `<meta name="generator">` | ❌ dice "Hostinger AI Builder" |
| Favicon | ❌ roto (apunta a `/vite.svg`, que no existe) |
| Meta description | ⚠️ solo vía JS (react-helmet) |
| `og:image` | ❌ **ninguna página la define** |
| `og:title` / `og:description` | ❌ `Seo.jsx` existe pero no se usa en ningún lado |
| `canonical` | ❌ ausente |
| JSON-LD `Organization` | ❌ ausente |
| `robots.txt` | ❌ no existe (devuelve el HTML del SPA) |
| `sitemap.xml` | ❌ no existe |
| SSR / prerender | ❌ SPA puro |
| `lang="es"` | ✅ correcto |
| Jerarquía de encabezados | ✅ un H1 por página, H2/H3 coherentes |
| `alt` en imágenes | ✅ descriptivos, en español |

---

## Por qué el prerender es prioridad P0

Los rastreadores de **WhatsApp, LinkedIn, Facebook, X y Slack no ejecutan
JavaScript**. Como todo el contenido y los meta tags se inyectan en el cliente,
esas plataformas ven el `index.html` crudo con el `<title>` vacío.

**Consecuencia:** compartir cualquier enlace del sitio muestra una URL pelada,
sin título, sin descripción y sin imagen. Para una web de reconocimiento de
marca cuyo canal principal será WhatsApp y LinkedIn, eso anula el objetivo.

**Solución mínima:** prerenderizar las 6 rutas en tiempo de build
(`vite-plugin-ssg`, `react-snap` o similar). No requiere migrar de framework.

---

## Meta tags por ruta

Cada página debe declarar `<title>` y `<meta name="description">` **literales**
dentro de su `<Helmet>` — el script `tools/generate-llms.js` los lee del código
fuente, así que no pueden ser variables.

| Ruta | Estado |
|---|---|
| `/` | ✅ title + description |
| `/calzado` `/ropa` `/dotaciones` | ✅ title + description |
| `/nosotros` | ✅ title + description |
| `/contacto` | ⚠️ description con lenguaje de venta ("Cotiza") |

**Todas** deben además usar `<Seo>` para OG, Twitter Card y canonical.

---

## JSON-LD pendiente

Añadir `Organization` en el home con los datos de [`02-empresa.md`](02-empresa.md):
razón social, logo, dirección, teléfono, correo, área de servicio y `sameAs`
con las redes sociales. Es lo que alimenta el panel de conocimiento de Google
— literalmente, lo que hace que "te conozcan".

---

# Parte 3 · Cumplimiento legal (Colombia)

| Norma | Qué exige | Estado |
|---|---|---|
| **Ley 1581 de 2012** (habeas data) | Aviso de privacidad y autorización expresa al recoger datos personales | ❌ **el formulario recoge datos sin aviso** → P0-05 |
| **Ley 1480 de 2011** (consumidor) | Poder sustentar toda afirmación publicitaria objetiva | ✅ datos validados; conservar soportes |
| **Decreto 1074 de 2015** | Política de tratamiento de datos publicada | ❌ pendiente |
