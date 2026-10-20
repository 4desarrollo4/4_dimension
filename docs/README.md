# Documentación del proyecto 4D

**Última actualización:** 2026-09-02

Este directorio es **el estado del proyecto**. El sitio se trabaja en sesiones
de chat que no recuerdan nada de la anterior, así que lo que no esté escrito
aquí, se pierde.

`CLAUDE.md`, en la raíz, es la puerta de entrada y se carga sola en cada sesión.
Este archivo explica **cómo mantener** la documentación.

---

## Orden de lectura para una sesión nueva

| # | Archivo | Léelo si… |
|---|---|---|
| 1 | [`01-proyecto.md`](01-proyecto.md) | Siempre. Objetivo, público y criterios de éxito |
| 2 | [`02-empresa.md`](02-empresa.md) | **Siempre.** Fuente de verdad de todo dato factual |
| 3 | [`05-contenido-y-seo.md`](05-contenido-y-seo.md) | **Siempre.** Reglas de voz y estado del SEO |
| 4 | [`06-backlog.md`](06-backlog.md) | Siempre. Qué está pendiente y en qué orden |
| 5 | [`08-bitacora.md`](08-bitacora.md) | Siempre. Dónde quedó la sesión anterior |
| 6 | [`03-arquitectura.md`](03-arquitectura.md) | Vas a tocar código, build o backend |
| 7 | [`04-diseno.md`](04-diseno.md) | Vas a tocar estilos o añadir una sección |
| 8 | [`07-decisiones.md`](07-decisiones.md) | Algo te parece mal hecho — mira si fue deliberado |
| 9 | [`09-despliegue.md`](09-despliegue.md) | Vas a publicar el sitio o a tocar el formulario en producción |
| 10 | [`10-plan-v2.md`](10-plan-v2.md) | **Siempre, mientras dure la v2.** Diagnóstico, sprints e historias |

**Mínimo antes de editar cualquier cosa:** 1, 2, 3, 4 y 5.

---

## Qué archivo tocar según lo que cambies

| Si cambias… | Actualiza |
|---|---|
| Un dato real de la empresa | `02-empresa.md` **primero**, luego el código |
| Texto visible del sitio | `05-contenido-y-seo.md` si cambia una regla |
| Stack, comandos o backend | `03-arquitectura.md` |
| Algo del despliegue o del hosting | `09-despliegue.md` |
| Tokens, tipografía o un patrón visual | `04-diseno.md` |
| El estado de una tarea | `06-backlog.md` |
| Algo estructural y costoso de revertir | `07-decisiones.md` (ADR nuevo) |
| Cualquier cosa | `08-bitacora.md` al cerrar |

---

## Las dos reglas que no se negocian

**1 · El sitio informa, no vende.** Es un sitio de presencia institucional. La
métrica no es la conversión, es la comprensión. Máximo 2 CTA en toda la home,
voz en 1ª persona describiendo. → [ADR-001](07-decisiones.md)

**2 · No se inventa contenido.** Cifras, clientes, proyectos, certificaciones y
datos de contacto salen **solo** de [`02-empresa.md`](02-empresa.md). Si falta un
dato, se pregunta al propietario — nunca se estima ni se rellena.
→ [ADR-002](07-decisiones.md)

---

## Antes de cerrar una sesión

1. Actualiza el estado de las tareas en [`06-backlog.md`](06-backlog.md).
2. Añade una entrada en [`08-bitacora.md`](08-bitacora.md) — arriba del todo,
   siguiendo la plantilla que está en la cabecera de ese archivo.
3. Si tomaste una decisión estructural, regístrala en
   [`07-decisiones.md`](07-decisiones.md) como ADR nuevo.
4. Actualiza la fecha de *Última actualización* de cada archivo que tocaste.

---

## Higiene de esta documentación

- **Un dato, un sitio.** Si algo está en `02-empresa.md`, los demás archivos lo
  enlazan; no lo copian. La duplicación se desincroniza sola.
- **Distingue lo medido de lo supuesto.** Si verificaste algo, escribe el dato y
  la fecha. Si es una impresión, dilo. Estos documentos solo sirven si se puede
  confiar en ellos sin volver a comprobarlo todo.
- **No borres historial.** Las tareas cerradas se marcan ✅, no se eliminan: hay
  otros archivos que las referencian por ID. Las entradas viejas de la bitácora
  se quedan.
- **Los ADR aceptados no se editan.** Si la decisión cambia, se escribe uno nuevo
  que sustituye al anterior.
