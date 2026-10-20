# 4D Cuarta Dimensión — sitio web

Sitio institucional e informativo de **4D Cuarta Dimensión ES S.A.S.**, comercializadora internacional colombiana de diseño y desarrollo de producto en tres líneas: calzado, ropa y dotaciones.

🌐 **En producción:** https://4dimensionsas.com

---

## 🎯 La regla número uno

**El sitio informa, no vende.** El objetivo es que conozcan a la empresa, no captar clientes.

Cada vez que se escribe o edita un texto, la pregunta no es *«¿esto convierte?»* sino ***«¿esto hace que nos entiendan?»***

| ❌ No | ✅ Sí |
|---|---|
| «Hablemos», «Cotiza», «Trabajemos juntos» | «Contacto», «Conócenos», «Qué hacemos» |
| 2ª persona vendiendo («tu mercado», «tu reto») | 1ª persona describiendo («partimos del mercado») |
| Promesas comerciales en titulares | Afirmaciones de identidad |
| Un CTA al final de cada sección | Máximo 2 en toda la home |

---

## 📍 Estado actual

| | |
|---|---|
| **Publicado** | Sí, desde el 2026-09-02 |
| **Formulario** | Funcionando: guarda en MySQL y envía dos correos |
| **Indexación** | ⚠️ 1 de 6 páginas — hay un error de redirección pendiente de arreglar |
| **Versión en curso** | **v2** — rediseño de contenido, legibilidad y fotos reales |

### Por qué existe la v2

La dirección revisó el sitio y lo rechazó con tres objeciones, más una cuarta posterior. Las cuatro se auditaron y las cuatro son ciertas:

| Objeción | Qué encontramos |
|---|---|
| «Muy básico» | ~34 secciones, pero solo **4 plantillas** repetidas 28 veces |
| «Las imágenes no nos representan» | **11 de 11 imágenes son de banco externo. Cero fotos de la empresa** |
| «Muchas secciones repiten lo mismo» | El cierre de las 3 páginas de línea es la **misma cadena literal** |
| «Se ve borroso o muy pequeño» | **75 % del texto a ≤14px**, y `font-smoothing: antialiased` adelgaza los trazos |

➡️ **[Historias de usuario](Historias-de-usuario)** · **[Metodología Scrum](Metodologia-Scrum)**

---

## 🚧 Lo que bloquea el avance

La v2 **no puede terminarse** sin material que debe aportar la empresa.

➡️ **[Material necesario](Material-necesario)** — las 14 fotos y los datos que faltan

---

## 📚 Documentación técnica

Vive en la carpeta [`docs/`](https://github.com/4desarrollo4/4_dimension/tree/main/docs) del repositorio, **no aquí**. Así viaja con el código, entra en los mismos commits y no se desincroniza.

| Documento | Para qué |
|---|---|
| [`01-proyecto.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/01-proyecto.md) | Objetivo, público y criterios de éxito |
| [`02-empresa.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/02-empresa.md) | **Fuente de verdad** de todo dato factual |
| [`03-arquitectura.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/03-arquitectura.md) | Stack, estructura y trampas conocidas |
| [`04-diseno.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/04-diseno.md) | Color, tipografía, componentes, movimiento |
| [`05-contenido-y-seo.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/05-contenido-y-seo.md) | Reglas editoriales y estado del SEO |
| [`06-backlog.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/06-backlog.md) | Pendientes priorizados P0/P1/P2 |
| [`07-decisiones.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/07-decisiones.md) | Bitácora de decisiones (ADR) |
| [`08-bitacora.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/08-bitacora.md) | Registro de cada sesión de trabajo |
| [`09-despliegue.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/09-despliegue.md) | **Cómo publicar en Hostinger**, paso a paso |

---

## ⚡ Levantar el proyecto

```bash
npm install
npm run dev --prefix apps/web -- --port 3100
```

→ `http://localhost:3100`

Para probar **el formulario** hace falta además un PHP sirviendo `public/`, un MySQL con `db/schema.sql` aplicado y un `api/config.php`. Ver [`09-despliegue.md`](https://github.com/4desarrollo4/4_dimension/blob/main/docs/09-despliegue.md).

```bash
npm run build --prefix apps/web   # build con prerender de las 6 rutas
npm run lint --prefix apps/web
```

---

## ⚠️ Dos cosas que muerden

**1 · Desactiva el traductor de Chrome antes de editar código en el navegador.** Google Traductor traduce el **código PHP** dentro del editor de archivos de Hostinger: `declare` → `declarar`, `return` → `devolver`, `'user'` → `'usuario'`. Guardarlo así deja el archivo con un error de sintaxis y el formulario devuelve un 500 sin explicación.

**2 · Ante cualquier error 500, mira primero la URL de la petición.** Si dice `localhost:3100`, no estás probando el sitio publicado: es el proxy de Vite sin un PHP detrás. Costó media hora descubrirlo.
