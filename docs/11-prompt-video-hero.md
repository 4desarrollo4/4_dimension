# 11 — Prompt para el vídeo del hero (Google Flow)

**Última actualización:** 2026-10-20
**Para:** sustituir el cubo giratorio de la portada por un zapato real de 4D.

---

## Lo primero, y es lo que de verdad importa

**Sube una foto de un zapato real de la empresa y usa el modo imagen-a-vídeo.**

No generes el zapato desde cero con texto. Si Flow inventa el zapato, el vídeo
vuelve a caer exactamente en la objeción de la dirección —*«las imágenes no nos
representan»*— con un paso más de por medio. Partiendo de una foto real, Flow
anima **vuestro** producto.

### Cómo hacer la foto de partida

| | |
|---|---|
| **Fondo** | Blanco o gris muy claro, liso. El sitio ahora es de fondo blanco |
| **Luz** | Difusa y lateral. Nada de flash directo ni sombras duras |
| **Encuadre** | Zapato entero, centrado, con aire alrededor. Perfil o 3/4 |
| **Resolución** | La mayor que tengas. Mínimo 2000 px en el lado largo |
| **Limpieza** | Sin manos, sin etiquetas colgando, sin logos de terceros |

> 💡 El zapato de 3/4 gira mejor que el de perfil puro: el modelo tiene más
> información de volumen con la que trabajar.

---

## El prompt

Pégalo tal cual en Flow, con la foto cargada como imagen de referencia.

```text
Fotografía de producto en estudio. El zapato de la imagen de referencia gira
lentamente sobre su propio eje vertical, en rotación continua y a velocidad
constante, como sobre una base giratoria de fotografía de producto.

Fondo blanco puro, limpio y sin textura, uniforme en todo el plano.
Iluminación de estudio suave y difusa, con luz principal lateral y relleno
frontal. Sombra de contacto muy suave bajo el zapato. Sin reflejos duros, sin
destellos, sin flash directo.

La cámara permanece completamente fija a la altura del producto, en un plano
medio. No hay zoom, ni paneo, ni movimiento de cámara de ningún tipo: lo único
que se mueve es el zapato girando.

El zapato mantiene en todo momento su forma, color, costuras, cordones, suela y
proporciones exactamente como en la imagen de referencia. Sin deformaciones,
sin cambios de diseño, sin añadir ni quitar detalles.

Sin texto, sin logotipos, sin marcas de agua, sin personas, sin manos, sin
elementos adicionales en el encuadre.

Estilo: catálogo de producto premium, nítido, limpio, realista.
```

### Variante en inglés

Los modelos de vídeo suelen responder mejor en inglés. Si el resultado en
español no convence, prueba con esta:

```text
Studio product photography. The shoe from the reference image rotates slowly
and continuously around its own vertical axis at a constant speed, as if on a
product photography turntable.

Pure white seamless background, clean and untextured. Soft diffused studio
lighting with a lateral key light and frontal fill. Very soft contact shadow
beneath the shoe. No harsh reflections, no lens flare, no direct flash.

The camera is completely static at product height, medium shot. No zoom, no
pan, no camera movement whatsoever: the only motion is the shoe rotating.

The shoe keeps its exact shape, color, stitching, laces, sole and proportions
from the reference image at all times. No deformation, no design changes, no
added or removed details.

No text, no logos, no watermarks, no people, no hands, no extra props.

Style: premium product catalogue, sharp, clean, photorealistic.
```

---

## Ajustes en Flow

| Opción | Qué poner | Por qué |
|---|---|---|
| **Modo** | Imagen a vídeo | Es lo que garantiza que sea vuestro zapato |
| **Proporción** | **1:1** | El hueco del hero es una columna casi cuadrada |
| **Duración** | La máxima disponible | Cuanto más largo, más lento puede girar |
| **Movimiento de cámara** | Ninguno / fijo | Si Flow lo ofrece aparte, ponlo a cero |

---

## El problema del bucle, y cómo esquivarlo

Un giro de 360° que cierre perfecto es justo lo que peor hacen hoy los modelos
de vídeo: al volver al punto de partida, los cordones y las costuras ya no son
los mismos y **se ve un salto**.

Tres formas de evitarlo, de mejor a peor:

1. **Media vuelta y espejo.** Genera un giro de ~180° y en el montaje duplica
   el clip invertido. El zapato va y vuelve, y el bucle cierra **perfecto**
   porque el último fotograma es idéntico al primero. Es lo más fiable.
2. **Fundido cruzado.** Deja el giro completo y solapa medio segundo de
   principio y final con un *crossfade*. Disimula, no arregla.
3. **Giro parcial y parada.** El zapato gira y se detiene. No es un bucle, pero
   nada falla a la vista.

> 📌 Si eliges la 1, dímelo: el componente del hero se monta igual, pero el
> vídeo hay que prepararlo con esa duplicación antes de subirlo.

---

## Antes de dármelo

- [ ] El zapato es **real y de 4D**, no inventado por el modelo.
- [ ] Fondo blanco de verdad, no gris sucio ni degradado.
- [ ] El zapato **no se deforma** en ningún momento. Míralo entero, dos veces.
- [ ] No aparece texto, logo ni marca de agua generada.
- [ ] Formato `.mp4` (H.264) y, a ser posible, también `.webm`.
- [ ] **Menos de 2 MB.** Va en el hero: es lo primero que carga el visitante.
      Si pesa más, hay que recortarlo o bajar la resolución.

Cuando lo tengas, lo monto en el hero con `autoplay muted loop playsinline`,
respetando `prefers-reduced-motion` (quien tenga el movimiento reducido activado
verá un fotograma fijo, no el vídeo) tal y como exige
[`04-diseno.md`](04-diseno.md).

---

## Y aun así, sigo recomendando el turntable real

El vídeo generado resuelve el *«muy básico»*, pero el *turntable* fotográfico
—24 fotos de un zapato real girando— sigue siendo mejor en tres cosas: pesa
unas seis veces menos, cierra el bucle **exacto** sin trucos, y no hay ningún
riesgo de que el modelo deforme el producto.

No es caro: un zapato, una mesa giratoria (sirve el plato de un microondas),
una sábana blanca y 24 disparos con el móvil sin mover el trípode. Media hora.

Ver [`10-plan-v2.md`](10-plan-v2.md) → sección A, las 14 fotos.
