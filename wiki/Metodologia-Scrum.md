# Metodología — Scrum ligero

Scrum adaptado a un equipo de una persona. Se conservan las piezas que aportan algo real —backlog priorizado, sprints cerrados, una revisión con quien aprueba— y se dejan fuera las ceremonias que con una sola persona son teatro.

---

## Roles

| Rol | Quién | Qué hace |
|---|---|---|
| **Product Owner** | La dirección de 4D | Prioriza, aporta el material y **aprueba al final de cada sprint**. Es quien dice si algo está bien, no el desarrollo |
| **Equipo de desarrollo** | Una persona | Estima, implementa y verifica |
| **Scrum Master** | — | No aplica con una persona. Lo que haría —quitar impedimentos— se resuelve en la revisión |

---

## El tablero

**Issues de GitHub + Projects.** Un hito (*milestone*) por sprint.

| Columna | Significa |
|---|---|
| **Backlog** | Identificado, aún sin sprint |
| **Sprint actual** | Comprometido para este sprint |
| **En curso** | Se está trabajando. **Máximo 2 a la vez** |
| **En revisión** | Hecho y verificado, esperando el visto bueno de la dirección |
| **Hecho** | Aprobado y desplegado |

### Etiquetas

`historia` · `bug` · `tarea-tecnica` · `bloqueado` · `necesita-material` · `necesita-dato`

Las dos últimas son las importantes de este proyecto: marcan lo que **no depende del desarrollo** sino de que llegue una foto o un dato. Sirven para que en la revisión quede claro qué está parado y por culpa de qué.

---

## Sprints

**Duración: una semana.** Corto a propósito: así la dirección ve avance seguido y una decisión equivocada cuesta como mucho una semana.

| Momento | Qué pasa |
|---|---|
| **Inicio** | Se eligen las historias del sprint y se escribe qué se va a poder enseñar al final |
| **Durante** | Un commit por unidad de trabajo coherente, con su número de historia |
| **Cierre** | Se despliega, se verifica en producción y se enseña a la dirección |
| **Después** | Lo aprendido va a `docs/08-bitacora.md`; lo estructural, a `docs/07-decisiones.md` como ADR |

> **No se cierra un sprint sin desplegar.** Algo que funciona en local pero no está publicado no está hecho — este proyecto ya tuvo un `.htaccess` preparado que estuvo seis semanas sin subir, y el error que arreglaba siguió vivo todo ese tiempo.

---

## Definición de hecho

Una historia está terminada cuando cumple **todo** esto:

1. `npm run build --prefix apps/web` compila y prerenderiza las 6 rutas
2. `npm run lint --prefix apps/web` sin avisos
3. Las 6 rutas abiertas en el navegador: sin errores de consola y **sin desborde horizontal** a 360 / 768 / 1024 / 1440
4. Con `prefers-reduced-motion` activo, **nada se mueve**
5. Ningún H1 se prerenderiza con `opacity: 0`
6. Contraste de todo texto nuevo **≥ 4,5:1**
7. Ninguna frase de ≥12 palabras se repite entre rutas *(automático desde el sprint 2)*
8. **Desplegado en producción y verificado ahí**
9. La documentación afectada, actualizada en el mismo commit
10. La dirección lo ha visto y lo aprueba

---

## Métricas de la v2

Para que la aprobación sea sobre hechos y no sobre opiniones:

| | Al empezar | Objetivo |
|---|---|---|
| Fotos propias de la empresa | **0** | ≥ 14 |
| Frases literales repetidas entre rutas | varias | **0** |
| Plantillas de sección distintas | 4 | ≥ 9 |
| Texto a ≤14px | **75 %** | < 10 % |
| Páginas indexadas en Google | **1 de 6** | 6 de 6 |
| Personas con nombre en el sitio | **0** | ≥ 3 |

---

## Las dos reglas que no se negocian

Están por encima de cualquier historia. Vienen de `CLAUDE.md` y de los ADR.

**1 · El sitio informa, no vende.** Ninguna historia puede introducir lenguaje de captación. Máximo 2 llamados a la acción en toda la home.

**2 · No se inventa contenido.** Cifras, clientes, casos y certificaciones salen **solo** de `docs/02-empresa.md`. Si falta un dato se pregunta a la dirección — nunca se estima ni se rellena. La Ley 1480 de 2011 obliga a poder sustentar toda afirmación publicitaria, y la Ley 1581 de 2012 rige el tratamiento de los datos del formulario.
