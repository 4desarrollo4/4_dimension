# 01 — El proyecto

**Última actualización:** 2026-09-01

---

## Objetivo del sitio

Que el mercado **conozca a 4D Cuarta Dimensión**: quiénes son, qué hacen y
cómo trabajan.

Es un sitio de **presencia institucional y reconocimiento de marca**. No es un
e-commerce, no es un catálogo y no es una landing de captación de leads.

### Qué significa "informativo" en la práctica

El visitante debe poder responder, sin fricción y sin hablar con nadie:

1. ¿Qué es 4D Cuarta Dimensión?
2. ¿Qué hace exactamente?
3. ¿Con qué seriedad y capacidad lo hace?
4. ¿Cómo los contacto si me interesa?

La conversión no es una meta. **La comprensión sí.**

---

## Público objetivo

| Perfil | Qué busca |
|---|---|
| **Marcas de moda y calzado** (LatAm, NA, EU) | Un socio de desarrollo de producto, no un proveedor de catálogo |
| **Empresas que compran dotación** | Capacidad, cumplimiento y cobertura para programas de uniformes y EPP |
| **Aliados y distribuidores** | Entender el modelo de negocio y la seriedad de la operación |
| **Talento y proveedores** | Saber quién es la empresa antes de acercarse |

Idioma: **español**. Mercado principal Colombia, con operación internacional.

---

## Alcance actual

Seis rutas, todas públicas:

| Ruta | Página | Rol |
|---|---|---|
| `/` | `HomePage.jsx` | Presentación general: identidad, líneas, valores, proyectos, metodología |
| `/calzado` | `CalzadoPage.jsx` | Línea de negocio 01 |
| `/ropa` | `RopaPage.jsx` | Línea de negocio 02 |
| `/dotaciones` | `DotacionesPage.jsx` | Línea de negocio 03 |
| `/nosotros` | `NosotrosPage.jsx` | Historia, capacidad internacional, compromisos |
| `/contacto` | `ContactoPage.jsx` | Datos de contacto + formulario |

**No hay** área privada, ni blog, ni catálogo de productos, ni carrito.
`AuthContext` y `ProtectedRoute` existen en el código pero **no se usan** —
son residuo del scaffold de Horizons.

---

## Criterios de éxito

El sitio está "bien" cuando:

- [ ] Al compartir cualquier URL en WhatsApp o LinkedIn aparece título,
      descripción e imagen de marca. *(hoy: no)*
- [ ] Buscar "4D Cuarta Dimensión" en Google devuelve el sitio con datos
      de empresa correctos. *(hoy: no indexable de forma fiable)*
- [ ] Ninguna sección presiona al visitante a "cotizar". *(hoy: 9 CTA comerciales)*
- [ ] Un visitante entiende qué hace la empresa en menos de 15 segundos.
- [ ] Todo dato publicado es verificable. *(hoy: sí — validado 2026-09-01)*
- [ ] El sitio cumple Ley 1581 de 2012 al recoger datos por formulario.
      *(hoy: no hay aviso de privacidad)*

---

## Fuera de alcance (por ahora)

- Venta en línea o precios públicos
- Multi-idioma (inglés vendrá cuando el mercado internacional lo pida)
- Área de clientes / seguimiento de pedidos
- Blog o gestor de contenidos
