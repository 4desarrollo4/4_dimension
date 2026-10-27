/*
    Registro único de las fotos PROPIAS del sitio.

    Lo pedía el sprint 3 de docs/10-plan-v2.md: una sola lista con ruta,
    dimensiones y `alt`, para que ningún componente escriba una ruta de imagen
    a mano y para que los textos alternativos se revisen en un solo sitio.

    ⚠️ No confundir con `IMAGES` de `data/projects.js`: aquello son las 11
    imágenes de banco servidas desde CDN externo, que siguen pendientes de
    sustituir (P1-13 / P2-10). Esto es lo que vive en `public/fotos/`.

    Reglas:
    - `alt` descriptivo en español, que describa LO QUE SE VE. Nunca afirmar
      que una imagen muestra algo que no se puede comprobar.
    - `width` y `height` reales del archivo: sin ellos el navegador no reserva
      el hueco y la página da un salto al cargar (CLS).
    - Las fotos se optimizan antes de entrar aquí. La de insumos pasó de
      397 KB a 190 KB.
*/

export const FOTOS = {
    insumos: {
        src: '/fotos/insumos-materiales.webp',
        width: 1400,
        height: 788,
        alt: 'Mesa de trabajo con insumos para calzado y confección: cueros, rollos de tela, conos de hilo, suelas, cremalleras, cordones y herrajes metálicos, con un taller de confección al fondo.',
    },
    // Hero de /calzado desde el 2026-10-26. Recortada a 3:2 (la proporción del
    // hero) antes de optimizarla: de 479 KB a 120 KB.
    calzadoHero: {
        src: '/fotos/calzado-cuero-cafe.webp',
        width: 1400,
        height: 934,
        alt: 'Par de tenis de cuero café con suela blanca, apoyados en el suelo junto a una puerta de madera, con luz natural de ventana.',
    },
    // Hero de /ropa desde el 2026-10-27, en lugar de la chaqueta de banco.
    // VERTICAL (4:5): es una persona sentada de cuerpo entero. Donde se pinta
    // en 3:2 o 4:3 (home y cierres de línea) `posicion` sube el encuadre para
    // no cortarle la cabeza. De 2,5 MB a 60 KB.
    // «Personalización total» de /ropa desde el 2026-10-27, en lugar de la
    // foto de banco de telas y cinta métrica. Es un collage de fondo blanco:
    // va entero (4:3, sin recorte) y sin el velo de `.media`. 2,6 MB → 166 KB.
    ropaPersonalizacion: {
        src: '/fotos/ropa-collage.webp',
        width: 1440,
        height: 1075,
        alt: 'Collage de fotos de botas negras de cuero con hebillas, tachas y cordones, llevadas por mujeres en una azotea, en calles de ciudad y frente a una cafetería.',
    },
    // Tarjeta destacada «Greenloop» de la home desde el 2026-10-27, en lugar
    // del tenis de running de banco. Fondo blanco: se pinta entera
    // (`object-contain`) sobre el blanco de la tarjeta, sin velo. 2 MB → 121 KB.
    calzadoGreenloop: {
        src: '/fotos/calzado-greenloop.webp',
        width: 1600,
        height: 1195,
        alt: 'Tenis bajo de gamuza gris con textura afelpada, cordones beige y suela café moteada, de perfil sobre fondo blanco.',
    },
    ropaHero: {
        src: '/fotos/ropa-modelo.webp',
        width: 960,
        height: 1200,
        posicion: '50% 10%',
        alt: 'Mujer sentada en un bloque de concreto con chaqueta de cuero negra, jean negro ajustado con rotos en las rodillas y botines negros de tacón, sobre un fondo de estuco beige.',
    },
};

/*
    Galería «Algunos de nuestros diseños» de /calzado, pedida el 2026-10-26 en
    sustitución de los casos de éxito.

    Cada diseño lleva DOS fotos, como las entregó el propietario: la de producto
    (fondo neutro) y la ambientada. Se muestran lado a lado, alternando el lado
    fila a fila.

    Todas están recortadas a 3:2 y a 1200×800 en `public/fotos/disenos/`. El
    recorte se centró en el ZAPATO, no en la imagen, y se comprobó que ninguno
    pierde puntera ni talón. Las 8 pasaron de 2,76 MB a 561 KB.

    Para añadir un diseño: recortar sus dos fotos a 3:2 con el mismo criterio,
    optimizarlas y añadir aquí una entrada. `nombre` es opcional; si no hay
    nombre, la fila muestra solo «Diseño 0N».

    Si la lista se queda vacía, la sección no se pinta (ni título, ni huecos).
*/
const disenio = (ruta, producto, ambiente, nombre = null, { width = 1200, height = 800 } = {}) => ({
    nombre,
    producto: { src: `/fotos/${ruta}-producto.webp`, width, height, alt: producto },
    ambiente: { src: `/fotos/${ruta}-ambiente.webp`, width, height, alt: ambiente },
});

export const GALERIA_CALZADO = [
    disenio(
        'disenos/01',
        'Tenis de cuña en gamuza negra con paneles de acabado metalizado gris y tachas piramidales, sobre fondo blanco.',
        'El mismo tenis de cuña negro y metalizado sobre un pedestal de piedra oscura, con luz cálida a contraluz.',
    ),
    disenio(
        'disenos/02',
        'Tenis bajo en lona negra con bordes deshilachados, detalles beige, cordones beige y fucsia, y suela clara moteada, sobre fondo gris.',
        'Persona con el mismo tenis negro de cordones fucsia, apoyada en el bordillo de una calle con grafitis al atardecer.',
    ),
    disenio(
        'disenos/03',
        'Tenis en tejido crudo con dos franjas café, puntera beige y suela color miel, sobre fondo blanco.',
        'El mismo tenis de tejido crudo y franjas café sobre una losa de piedra, en un taller con luz natural.',
    ),
    disenio(
        'disenos/04',
        'Tenis con estampado de vaca en blanco y negro, piezas negras, talón plateado y suela color miel, sobre fondo blanco.',
        'El mismo tenis de estampado de vaca sobre el suelo de un estudio industrial de ladrillo.',
    ),
];

/*
    «Nuestros productos» de /dotaciones, pedida el 2026-10-27 en sustitución de
    los casos de éxito. Mismo formato que la galería de calzado: dos fotos por
    referencia, producto y ambientada.

    El nombre de cada referencia es el del ARCHIVO que entregó el propietario
    (`polar.jpg` → «Polar»). Están registrados en docs/02-empresa.md: no los
    cambies sin que lo pida.

    Recorte a 3:2 y 1200×800 en `public/fotos/dotaciones/`, centrado en las
    botas. Soldador y Vigilante son más altas que un 3:2: en vez de cortarles
    la caña, se ensanchó el fondo blanco por los lados. Las 14 pasaron de
    37 MB a 1,1 MB.
*/
export const GALERIA_DOTACIONES = [
    disenio(
        'dotaciones/soldador',
        'Par de botas altas de caña, sin cordones, en cuero negro con suela gris y negra, sobre fondo blanco.',
        'Las mismas botas negras de caña alta en el suelo de un taller metalúrgico, con un soldador trabajando al fondo.',
        'Soldador',
    ),
    disenio(
        'dotaciones/petrolera',
        'Par de botas altas de caña en cuero café, con cierre de velcro en la parte superior, sobre fondo blanco.',
        'Las mismas botas café sobre terreno de grava junto a tubos oxidados, con una torre de perforación petrolera al fondo.',
        'Petrolera',
    ),
    disenio(
        'dotaciones/vigilante',
        'Par de botas altas de cordones en cuero negro con suela gris y negra, una de ellas mostrando la suela, sobre fondo blanco.',
        'Persona con pantalón cargo negro y las mismas botas altas de cordones, en un callejón mojado de noche.',
        'Vigilante',
    ),
    disenio(
        'dotaciones/polar',
        'Par de botines de cordones en cuero blanco con caña de lona gris, puntera y suela grises, sobre fondo blanco.',
        'Los mismos botines blancos sobre la nieve, con un glaciar y montañas nevadas al fondo.',
        'Polar',
    ),
    disenio(
        'dotaciones/work-confort',
        'Par de botines de cordones en cuero café con costuras naranja y suela negra, uno de ellos mostrando la suela, sobre fondo blanco.',
        'Persona sentada en un banco de carpintería con los mismos botines café, sobre un suelo con virutas de madera.',
        'Work Confort',
    ),
    disenio(
        'dotaciones/work-confort-n',
        'Par de botines de cordones en cuero negro con forro rojo y suela gris y negra, uno de ellos mostrando la suela, sobre fondo blanco.',
        'Los mismos botines negros en el suelo de un vestidor de obra, junto a un banco de madera con un chaleco reflectivo.',
        'Work Confort N',
    ),
    disenio(
        'dotaciones/work-520-sin-puntera',
        'Par de botines de cordones en cuero negro con forro rojo y suela gris y negra, uno de ellos mostrando la suela, sobre fondo blanco.',
        'Los mismos botines negros sobre una mesa de madera junto a un casco amarillo, guantes y una caja de regalo, en una obra en construcción.',
        'Work 520 sin puntera',
    ),
];

/*
    «Algunos de nuestros productos» de /ropa, pedida el 2026-10-27 en
    sustitución de los casos de éxito. Sin nombre: el propietario pidió
    «Diseño 1, Diseño 2…».

    VERTICALES, 3:4 y 900×1200, en `public/fotos/ropa/`: seis de las ocho fotos
    llegaron así, y en 3:2 las ambientadas (personas de cuerpo entero) perdían
    cabeza o pies. Las dos del jean negro llegaron apaisadas: se recortaron a
    3:4 centradas en la prenda y en la persona, sin cortar nada de ninguna.
    Las 8 pasaron de 20 MB a 540 KB.
*/
const VERTICAL = { width: 900, height: 1200 };

export const GALERIA_ROPA = [
    disenio(
        'ropa/01',
        'Buzo con capucha y cremallera completa en azul marino, cordones crudos con punteras azules y bolsillo canguro, sobre fondo blanco.',
        'Hombre caminando por un parque arbolado en otoño con el mismo buzo azul marino de capucha, una mochila y un café en la mano.',
        null,
        VERTICAL,
    ),
    disenio(
        'ropa/02',
        'Pantalón de jean negro de pierna ancha y curva, con lavado desgastado café en muslos y rodillas y bragueta de botones, sobre fondo blanco.',
        'Mujer caminando por una acera de ciudad con el mismo jean negro desgastado de pierna ancha, chaqueta negra y camiseta corta.',
        null,
        VERTICAL,
    ),
    disenio(
        'ropa/03',
        'Buzo de cuello alto con media cremallera en tela polar roja, interior del cuello azul marino y bolsillos laterales con vivo azul, sobre fondo blanco.',
        'Hombre sonriendo en un sendero de bosque en otoño con el mismo buzo rojo de media cremallera y pantalón gris oscuro.',
        null,
        VERTICAL,
    ),
    disenio(
        'ropa/04',
        'Pantalón de jean negro de corte recto con cinco bolsillos, sobre fondo blanco.',
        'Mujer caminando por una calle arbolada con el mismo jean negro de corte recto, camiseta blanca, chaqueta verde oliva y tenis blancos.',
        null,
        VERTICAL,
    ),
];
