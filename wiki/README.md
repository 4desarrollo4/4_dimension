# Páginas de la wiki de GitHub

Esta carpeta es el **origen** de la wiki de
[github.com/4desarrollo4/4_dimension/wiki](https://github.com/4desarrollo4/4_dimension/wiki).

Vive aquí, dentro del repositorio, por una razón concreta: la wiki de GitHub es
**un repositorio aparte**. Si el contenido viviera solo allí, se desincronizaría
del código — que es exactamente el problema que ya tuvo este proyecto, con dos
sesiones de trabajo sin documentar.

---

## Qué hay aquí y qué no

La wiki **no duplica `docs/`**. Son dos capas distintas:

| | Dónde vive | Qué contiene |
|---|---|---|
| **Documentación técnica** | [`docs/`](../docs) | Arquitectura, despliegue, decisiones (ADR), backlog, bitácora |
| **Capa de gestión** | `wiki/` *(esta carpeta)* | Historias de usuario, metodología Scrum, material necesario |

La portada de la wiki **enlaza** a `docs/` en lugar de copiarlo.

| Archivo | Página en la wiki |
|---|---|
| `Home.md` | Portada |
| `_Sidebar.md` | Barra lateral de navegación |
| `Historias-de-usuario.md` | Las 8 historias de la v2, en 6 sprints |
| `Metodologia-Scrum.md` | Roles, tablero, definición de hecho y métricas |
| `Material-necesario.md` | **Las 14 fotos y los datos que faltan** — la página que hay que enseñar a la dirección |

---

## Cómo publicarla

GitHub **no crea el repositorio de la wiki hasta que se guarda la primera página
desde la web**. Por eso el primer paso es manual:

1. Entra en la pestaña **Wiki** del repositorio
2. **Create the first page** → escribe cualquier cosa → **Save page**

A partir de ahí ya se puede sincronizar desde la terminal:

```bash
git clone https://github.com/4desarrollo4/4_dimension.wiki.git
cp wiki/*.md 4_dimension.wiki/
cd 4_dimension.wiki
git add -A && git commit -m "Actualizar la wiki desde wiki/" && git push
```

> ⚠️ **Edita siempre aquí, nunca en la web.** Si cambias una página desde la
> interfaz de GitHub, la siguiente sincronización la sobrescribe.
