# Nupcia | Invitaciones digitales de boda

Landing page para vender invitaciones digitales de boda, más una invitación demo completa y funcional.

- `index.html`: la landing (hero con teléfono 3D que muestra la invitación en vivo, características, carrusel 3D de diseños, proceso, comparativa, planes, preguntas frecuentes y llamada a la acción por WhatsApp).
- `invitacion/index.html`: la invitación demo (sobre con sello de lacre que se abre en 3D, portada, cuenta regresiva con tarjetas que giran, historia con polaroids, ceremonia y recepción con mapa, itinerario, galería coverflow 3D, código de vestimenta, regalos, confirmación por WhatsApp y archivo para agregar al calendario).

## Cómo verla

Abre `index.html` con doble clic. No necesita servidor ni internet: GSAP, ScrollTrigger y Lenis vienen incluidos en `assets/vendor/` (solo las tipografías de Google Fonts se cargan desde internet; sin conexión se usan tipografías de respaldo).

## Cómo cambiar la pareja, los precios o el WhatsApp

Todo está en un solo archivo: **`assets/js/config.js`**.

- `SITE`: nombre de la marca, número de WhatsApp, correo, Instagram, moneda y los tres planes con sus precios.
- `BODA`: nombres, iniciales, fecha, frase, padres, fotos, historia, lugares, itinerario, vestimenta, regalos, fecha límite de confirmación, WhatsApp para confirmaciones, hashtag y música.

Las fotos van en `assets/img/` y se indican con su ruta desde la raíz del proyecto (por ejemplo `assets/img/demo/foto1.jpg`).

Para agregar música, copia un `.mp3` (por ejemplo a `assets/audio/cancion.mp3`) y pon esa ruta en `BODA.musica`.

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

- [GSAP 3.12.5 y ScrollTrigger](https://gsap.com) para animaciones.
- [Lenis 1.1.13](https://github.com/darkroomengineering/lenis) para el scroll suave.
- Tipografías: Bodoni Moda, Jost y Pinyon Script (Google Fonts).

## Aviso sobre la demo

La demo usa nombres y fotografías de personas famosas como ejemplo interno. Usar la imagen de una persona real para promocionar un producto sin su autorización puede traer problemas legales; antes de publicar la landing, reemplaza la pareja y las fotos en `assets/js/config.js` por una pareja ficticia o por clientes que hayan dado su permiso.
