# Nupcia | Invitaciones digitales de boda

Landing page para vender invitaciones digitales de boda, más una invitación demo completa y funcional.

- `index.html`: la landing.
  - Pantalla de carga con sello y escena 3D real hecha con Three.js (sobre, tarjeta, sello de lacre y anillos dorados que siguen el mouse o el giroscopio del celular).
  - Manifiesto que se ilumina palabra por palabra.
  - Estudio en vivo: escribes el nombre del invitado, eliges lugares y paleta, y el teléfono muestra la invitación real al instante con su enlace listo para copiar.
  - Recorrido horizontal por las ocho partes de la invitación.
  - Detalles interactivos: sobre que se abre, cuenta regresiva, calendario, chat de WhatsApp, paletas, tipografía y panel de confirmaciones.
  - Carrusel 3D de diseños, proceso en cuatro pasos, comparativa contra la invitación impresa, planes con extras, preguntas frecuentes y cierre con sello giratorio.
- `invitacion/index.html`: la invitación demo.
  - Sobre con forro, estampilla y nombre del invitado, sello de lacre que se parte al tocarlo, carta que sale y lluvia de pétalos.
  - Portada (dividida en computadora), bienvenida con foto en arco y nombres de los padres, cuenta regresiva con tarjetas que giran y calendario del mes con el día marcado.
  - Historia en capítulos con fotos tipo polaroid, ceremonia y recepción con mapa de Google integrado, itinerario con íconos, padrinos.
  - Galería coverflow 3D con visor a pantalla completa, código de vestimenta con paleta, hospedaje sugerido, regalos con botón de copiar, hashtag.
  - Confirmación por WhatsApp con número de personas, menú especial, canción y mensaje; archivo para agregar al calendario.
  - Música de caja musical (Canon de Pachelbel) generada en el navegador, con botón para pausar.

## Cómo verla

Abre `index.html` con doble clic. No necesita servidor ni internet: Three.js, GSAP, ScrollTrigger y Lenis vienen incluidos en `assets/vendor/` (solo las tipografías de Google Fonts y los mapas de Google se cargan desde internet).

## Cómo cambiar la pareja, los precios o el WhatsApp

Todo está en un solo archivo: **`assets/js/config.js`**.

- `SITE`: nombre de la marca (hoy "Nupcia", cámbialo por el tuyo y se actualiza en toda la página), número de WhatsApp, correo, Instagram, moneda y los tres planes con sus precios.
- `BODA`: nombres, iniciales, fecha, frase, padres, fotos, historia, lugares, itinerario, padrinos, hospedaje, opciones de menú, vestimenta, regalos, fecha límite de confirmación, WhatsApp para confirmaciones, hashtag y música.

Los precios y el número de WhatsApp que trae la demo son de ejemplo.

Las fotos van en `assets/img/` y se indican con su ruta desde la raíz del proyecto (por ejemplo `assets/img/demo/foto1.jpg`).

Si `BODA.musica` está vacío suena una caja musical generada en el navegador. Para usar una canción propia, copia un `.mp3` (por ejemplo a `assets/audio/cancion.mp3`) y pon esa ruta en `BODA.musica`. La música empieza al abrir el sobre.

## Pases personalizados

Cada invitado puede recibir su propio enlace:

```
invitacion/index.html?n=Familia%20Ortega&p=4
```

- `n`: nombre que aparece en el sobre y se rellena en el formulario.
- `p`: lugares reservados (el formulario no deja elegir más).

## Paletas de color

La invitación tiene cinco temas de colores sólidos. Se eligen con `?tema=`:

`olivo` (por defecto), `noir`, `terracota`, `medianoche`, `rubor`.

Ejemplo: `invitacion/index.html?tema=noir&n=Familia%20Ortega&p=2`

## Publicar

Es un sitio estático: sube la carpeta completa a Netlify (arrastrar y soltar), Vercel, GitHub Pages o cualquier hosting.

## Créditos técnicos

- [Three.js r149](https://threejs.org) para la escena 3D de la landing.
- [GSAP 3.12.5 y ScrollTrigger](https://gsap.com) para animaciones.
- [Lenis 1.1.13](https://github.com/darkroomengineering/lenis) para el scroll suave.
- Tipografías: Bodoni Moda, Jost y Pinyon Script (Google Fonts).

## Aviso sobre la demo

La demo usa nombres y fotografías de personas famosas como ejemplo interno. Usar la imagen de una persona real para promocionar un producto sin su autorización puede traer problemas legales; antes de publicar la landing, reemplaza la pareja y las fotos en `assets/js/config.js` por una pareja ficticia o por clientes que hayan dado su permiso.
