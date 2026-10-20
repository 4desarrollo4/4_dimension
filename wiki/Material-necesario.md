# Material necesario

Esta página es la que hay que enseñar a la dirección. **La v2 no puede terminarse sin esto.**

El motivo es directo: hoy el sitio tiene **11 imágenes y ninguna es de la empresa**. Son todas de banco externo. Por eso la objeción «las imágenes no nos representan» no se arregla con diseño — se arregla con fotos.

---

## 📸 Las 14 fotos imprescindibles

### Reglas técnicas

Vienen del código, no son preferencias de estilo:

- **Mínimo 2400 px** en el lado largo. Originales sin recomprimir — no las pases por WhatsApp.
- ⚠️ **El 30 % inferior de cada foto horizontal debe estar libre de caras y rótulos.** El sitio aplica un degradado hacia el fondo desde abajo: lo que esté ahí se pierde. **Es lo más fácil de incumplir.**
- Fondos oscuros o neutros. El sitio es solo modo oscuro.
- Luz lateral o difusa. Sin flash directo ni HDR agresivo de teléfono.
- **Sin logos de clientes visibles**, salvo autorización escrita de esa empresa.
- Nombres en minúsculas con guiones y sin tildes.

### La lista

| Archivo | Qué debe mostrar | Proporción |
|---|---|---|
| `oficina-fachada.jpg` | Entrada o fachada de la oficina de Bogotá, con luz de día | 3/2 |
| `equipo-grupo-oficina.jpg` | El equipo junto trabajando sobre una mesa con muestras. **No** en fila mirando a cámara | 16/9 |
| `retrato-01.jpg` … `retrato-03.jpg` | Retrato de medio cuerpo de cada persona. **Misma luz y mismo fondo en todos** | 4/5 |
| `proceso-01-descubrimiento.jpg` | Manos sobre la mesa con muestras de referencia y datos de mercado | 3/2 |
| `proceso-02-diseno.jpg` | Boceto o render en pantalla junto a la muestra física con la que se compara | 3/2 |
| `proceso-03-desarrollo.jpg` | Producción real: máquina de coser, horma o mesa de corte | 3/2 |
| `proceso-04-evolucion.jpg` | Verificación pre-embarque: cajas rotulándose, o una muestra junto a su segunda versión | 3/2 |
| `materiales-calzado-mesa.jpg` | Cenital: cueros, suelas y hormas sobre mesa oscura | 4/3 |
| `materiales-ropa-mesa.jpg` | Cenital: rollos de tela, patrones, cinta métrica | 4/3 |
| `materiales-dotaciones-mesa.jpg` | Cenital: casco, guantes, gafas, chaleco reflectivo y bota | 4/3 |
| `producto-calzado-runner.jpg` | El Runner X-40 real, terminado | 4/3 |
| `producto-ropa-coleccion.jpg` | Prendas reales de la Colección Origin | 4/3 |
| `producto-dotacion-atlas.jpg` | Dotación real del Programa Atlas, completa | 4/3 |
| `producto-calzado-executive.jpg` | Calzado real de la Línea Executive | 4/3 |

> 💡 **Si solo se pueden hacer tres fotos, que sean las tres de materiales.** Son las más baratas de producir —una mesa y luz— y son justo lo que hace que `/calzado`, `/ropa` y `/dotaciones` dejen de parecer la misma página.

### Deseables, no bloquean

`taller-corte` · `taller-costura` · `taller-control-calidad` · `anatomia-par-calzado` (un par despiezado) · `kit-dotacion-cargo` · macros de costura, horma y bordado.

---

## 📋 Datos que faltan

Cada uno bloquea una sección entera:

| Dato | Qué bloquea |
|---|---|
| **Año de fundación** | La historia con fechas en `/nosotros`. Hoy dice «nace», «empezamos», «hoy» — **sin un solo año** |
| **Nombres y cargos del equipo** | La sección de equipo entera. Hoy el sitio no tiene **ni un nombre de persona** |
| **NIT** | La página de política de datos. Lleva pendiente desde septiembre |
| Certificaciones reales | Hoy se dice «aliados certificados» sin poder nombrar ninguna |
| Perfiles de redes sociales | Los datos estructurados para buscadores |
| Logo en vectorial (SVG) | Icono perfecto a cualquier tamaño, e impresión |
| ¿Hay alguna cifra propia de **ropa**? | Hoy solo hay cifras de calzado y dotaciones, y `/ropa` se queda coja |

---

## ❓ Dos cosas que hay que verificar

No son datos nuevos — son contradicciones que hay que resolver.

**1 · La dirección física.** El sitio publica `Cra. 34a #27a-22 sur` en cinco sitios distintos, pero `docs/02-empresa.md` —que es la fuente de verdad— **sigue marcándola como faltante**. O el dato es correcto y hay que registrarlo, o está en producción sin que nadie lo haya validado.

**2 · «Empezamos desarrollando calzado».** Esa frase está en el código de `/nosotros` pero **no está en la fuente de verdad**. Según la regla del propio proyecto: primero el documento, después el código.

---

## 📤 Cómo entregarlo

Las fotos a `material-recibido/` en la carpeta del proyecto, o por el canal que se acuerde. **No por WhatsApp**: recomprime y las deja inservibles para web.

De ahí salen optimizadas a `apps/web/public/fotos/`, que sí se versiona.
