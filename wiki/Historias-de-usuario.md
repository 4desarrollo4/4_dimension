# Historias de usuario — v2

Cada historia es un issue en el repositorio y pertenece a un sprint. El formato es el de siempre: **como** *(rol)*, **quiero** *(algo)*, **para** *(un motivo)*.

Una historia está **terminada** cuando cumple la [definición de hecho](Metodologia-Scrum#definición-de-hecho).

---

## Sprint 0 — Fundamentos
*No depende de las fotos. Se puede hacer ya.*

### HU-01 · Poner el proyecto en GitHub
> **Como** responsable del proyecto, **quiero** el código en GitHub con su wiki, **para que** el trabajo no dependa de una carpeta en un portátil.

- [x] Repositorio creado
- [x] El trabajo de septiembre commiteado en 4 commits con historia legible
- [x] Credenciales retiradas de los archivos versionados
- [ ] Wiki con portada, Scrum e historias
- [ ] Tablero de issues con un hito por sprint

### HU-02 · Que Google indexe las 6 páginas
> **Como** visitante, **quiero** encontrar cualquier página del sitio en Google, **no solo** la portada.

**Hoy está indexada 1 de 6.** Google reporta *Error de redirección*: el sitemap entrega `/nosotros`, el servidor redirige a `/nosotros/`, y esa página declara como canónica la versión que redirige.

- [ ] Subir el `.htaccess` ya preparado *(elimina el 301 y añade 5 cabeceras de seguridad)*
- [ ] Subir `favicon.ico` — hoy devuelve 404, y es parte de por qué no sale el logo en el buscador
- [ ] Pedir reindexación en Search Console
- [ ] Verificar: `/nosotros` responde **200 sin redirección**

### HU-03 · Documentación al día
> **Como** responsable, **quiero** que todo quede escrito, **para no** repetir diagnósticos que ya se hicieron.

- [ ] Documentar la auditoría de seguridad del 3-sep y el error de redirección del 7-sep
- [ ] Crear la tarea P1-08, que hoy se referencia desde el `.htaccess` y no existe
- [ ] Cambiar la contraseña de la base de datos *(quedó expuesta en una captura)*

---

## Sprint 1 — Legibilidad
*La queja directa de la dirección. No depende de las fotos.*

### HU-04 · Leer sin forzar la vista
> **Como** lector, **quiero** leer el sitio cómodamente, **para no** tener que acercarme a la pantalla.

Medido en producción: **el 75 % del texto está a 14px o menos**, el cuerpo va a peso 400 sobre fondo casi negro, y `-webkit-font-smoothing: antialiased` adelgaza los trazos en Mac. El contraste (7,08:1) es correcto — **el problema no es el color, es el grosor**.

- [ ] Quitar `-webkit-font-smoothing: antialiased` — coste cero, mayor salto percibido
- [ ] **Archivo** sustituye a Manrope: altura de x mayor y trazos que aguantan sobre oscuro
- [ ] Subir la escala: cuerpo 16→18px, tarjetas y listas 14→16px, eyebrows 12→13px
- [ ] Peso del cuerpo 400→500
- [ ] Página de comparación antes/después **para que la dirección lo apruebe viendo, no leyendo**
- [ ] Sin desbordes a 360 / 768 / 1024 / 1440

---

## Sprint 2 — Matar la repetición
*No depende de las fotos.*

### HU-05 · Que cada página aporte algo propio
> **Como** visitante, **quiero** que cada página me diga algo que las otras no, **para no** sentir que leo lo mismo tres veces.

La evidencia: el párrafo de cierre de las 3 páginas de línea es **la misma cadena literal, carácter por carácter**. «No comercializamos catálogos» aparece **3 veces solo en la home**. Los 4 proyectos se renderizan **8 veces**. Y `/nosotros` no aporta **ni un hecho** que la home no tenga.

- [ ] Nuevo ADR: **«una idea, una página»** — cada hecho tiene una sola página propietaria
- [ ] Cada línea recibe un cierre propio sobre qué la hace distinta
- [ ] Títulos propios donde hoy hay uno genérico compartido
- [ ] Un solo cuarteto canónico: las 4 fases *(que además explican el nombre 4D)*
- [ ] **Corregir dos bugs:** `/nosotros` y `/contacto` se prerenderizan con el H1 a `opacity: 0`
- [ ] **Retirar el `alt` falso** que dice mostrar al equipo sobre una imagen de banco. Mejor sin foto que con una que miente
- [ ] Guardia automática: el build **falla** si una frase de ≥12 palabras aparece en dos rutas

---

## Sprint 3 — Fotos reales y `/nosotros`
*🚧 Bloqueado por [Material necesario](Material-necesario).*

### HU-06 · Ver quién es 4D de verdad
> **Como** visitante, **quiero** ver quién es la empresa, dónde trabaja y cómo hace un producto, **para** saber con quién estoy tratando.

`/nosotros` pasa de 4 a 7 secciones y se convierte en la página con más razón de existir.

- [ ] Canalización de fotos: `public/fotos/`, registro único y script de optimización
- [ ] Historia **con fechas**
- [ ] **Proceso fotografiado**: las 4 fases, cada una con su entregable
- [ ] **Equipo**: retratos con nombre y cargo
- [ ] **Instalaciones**: mosaico asimétrico
- [ ] Regla de todos los componentes nuevos: **si falta la foto, la sección se renderiza sin hueco** — nunca una imagen rota ni un render de relleno

---

## Sprint 4 — Que las tres líneas dejen de ser la misma página
*🚧 Necesita las 6 fotos de materiales y producto.*

### HU-07 · Páginas de línea distintas entre sí
> **Como** visitante interesado en dotaciones, **quiero** una página distinta a la de calzado, **para** encontrar lo que busco sin releer lo mismo.

Hoy las tres usan **los mismos 6 componentes en el mismo orden**. Lo único que las separa visualmente es un espejo horizontal.

| | `/calzado` | `/ropa` | `/dotaciones` |
|---|---|---|---|
| Sección firma | **Anatomía de un par** | **De la ficha a la prenda** | **Una dotación por cargo** |
| Cifra | +120K pares | *(falta dato)* | 12.000 en 4 países |
| Secciones | 8 | 7 | 9 |

---

## Sprint 5 — Movimiento y cierre

### HU-08 · Un sitio vivo, sin molestar
> **Como** visitante, **quiero** que el sitio se sienta vivo, **pero sin** que las animaciones me estorben.

- [ ] Los filetes de las listas se dibujan al entrar
- [ ] Las fotos entran con una escala sutil
- [ ] Raíl vertical de progreso en el proceso
- [ ] ❌ **Sin paralaje**: coste de scroll y riesgo de salto visual a cambio de poco
- [ ] ⚠️ Todo lo nuevo respeta `prefers-reduced-motion`, y **nada de la primera pantalla anima opacidad**
