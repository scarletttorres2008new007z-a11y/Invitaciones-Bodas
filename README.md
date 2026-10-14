# Nupcia | Invitaciones digitales de boda

Landing page para vender invitaciones digitales de boda, más una invitación demo completa y funcional.

- `index.html`: la landing.
  - Pantalla de carga con sello y escena 3D real hecha con Three.js (sobre, tarjeta, sello de lacre y anillos dorados que siguen el mouse o el giroscopio del celular).
  - Manifiesto que se ilumina palabra por palabra.
  - Estudio en vivo: escribes el nombre del invitado, eliges lugares y paleta, y el teléfono muestra la invitación real al instante con su enlace listo para copiar.
  - Recorrido horizontal por las ocho partes de la invitación.
  - Detalles interactivos: sobre que se abre, cuenta regresiva, calendario, chat de WhatsApp, paletas, tipografía y panel de confirmaciones.
  - Carrusel 3D de diseños, proceso en cuatro pasos, comparativa contra la invitación impresa, planes con extras, preguntas frecuentes y cierre con sello giratorio.
- `invitacion/index.html`: la página de la boda (15 secciones con menú para saltar entre ellas).
  - Entrada con dos puertas que se abren en 3D y lluvia de pétalos.
  - Portada con tres fotos que se alternan, nombre del invitado y fecha.
  - Dos franjas de foto a pantalla completa con una frase que aparece palabra por palabra.
  - Bienvenida con foto en arco y padres; "raspe y descubra" la fecha con el dedo, cuenta regresiva con tarjetas que giran, calendario y botones para Google Calendar y Apple/Outlook.
  - Historia en capítulos con fotos tipo polaroid y cifras de la pareja que se cuentan solas.
  - Ceremonia y recepción con mapa de Google integrado, botones de Google Maps y Waze y una nota para cada lugar; itinerario con íconos; padrinos.
  - Galería coverflow 3D con visor de flechas, código de vestimenta con paleta, trivia "¿Cuánto nos conoce?" con puntaje, hospedaje y qué conocer en la ciudad, regalos con botón de copiar, preguntas frecuentes y mosaico de fotos con el hashtag.
  - Confirmación por WhatsApp con el pase de lugares, número de personas, menú, canción y mensaje.
  - Caja musical (Canon de Pachelbel) generada en el navegador, con reproductor para pausar.
- `tarjeta/index.html`: la tarjeta en PDF que se manda por WhatsApp. Lleva el sobre con sello de lacre y, al tocar el sobre, abre la página de la boda con el nombre y los lugares del invitado. `tarjeta/tarjeta-familia-ortega.pdf` es un ejemplo ya generado.

## Cómo verla

Abre `index.html` con doble clic. No necesita servidor ni internet: Three.js, GSAP, ScrollTrigger y Lenis vienen incluidos en `assets/vendor/` (solo las tipografías de Google Fonts y los mapas de Google se cargan desde internet).

## Cómo cambiar la pareja, los precios o el WhatsApp

Todo está en un solo archivo: **`assets/js/config.js`**.

- `SITE`: nombre de la marca (hoy "Nupcia", cámbialo por el tuyo y se actualiza en toda la página), número de WhatsApp, correo, Instagram, moneda y los tres planes con sus precios.
- `BODA`: nombres, iniciales, fecha, frase, padres, fotos, franjas de foto con frase, historia, cifras, lugares, itinerario, padrinos, hospedaje, opciones de menú, vestimenta, regalos, fecha límite de confirmación, WhatsApp para confirmaciones, hashtag y música.

Los precios y el número de WhatsApp que trae la demo son de ejemplo.

Las fotos van en `assets/img/` y se indican con su ruta desde la raíz del proyecto (por ejemplo `assets/img/demo/foto1.jpg`).

Si `BODA.musica` está vacío suena una caja musical generada en el navegador. Para usar una canción propia, copia un `.mp3` (por ejemplo a `assets/audio/cancion.mp3`) y pon esa ruta en `BODA.musica`. La música empieza al tocar "Entrar".

## Pases personalizados

Cada invitado puede recibir su propio enlace:

```
invitacion/index.html?n=Familia%20Ortega&p=4
```

- `n`: nombre que aparece en la portada y en la confirmación, y se rellena en el formulario.
- `p`: lugares reservados (el formulario no deja elegir más).

## Tarjeta PDF para cada invitado

1. Publica la página y pon su dirección en `SITE.urlInvitacion` dentro de `assets/js/config.js`.
2. Abre `tarjeta/index.html`, escribe el nombre del invitado y los lugares, y elige la paleta.
3. Pulsa "Descargar PDF" y en la ventana de impresión elige "Guardar como PDF" (en Chrome). El sobre queda como enlace dentro del PDF.

También se puede abrir con los datos ya puestos: `tarjeta/index.html?n=Familia%20Ortega&p=4`.

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
