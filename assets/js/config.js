/* =========================================================================
   CONFIGURACIÓN GENERAL
   -------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para:
     1. Cambiar los datos de tu negocio (marca, WhatsApp, precios).
     2. Cambiar la pareja de la invitación demo (nombres, fecha, lugares,
        fotos, regalos, etc.).
   Las rutas de fotos son relativas a la raíz del proyecto.
   ========================================================================= */

window.SITE = {
  marca: "Nupcia",
  eslogan: "Invitaciones digitales de boda",
  // Número de WhatsApp con código de país, sin espacios ni signos.
  whatsapp: "5210000000000",
  correo: "hola@nupcia.com",
  instagram: "https://instagram.com/",
  moneda: "MXN",
  extras: [
    { nombre: "Canción personalizada", precio: 150 },
    { nombre: "Video de apertura", precio: 450 },
    { nombre: "Dominio propio (.com)", precio: 390 },
    { nombre: "Código QR para impresos", precio: 120 },
    { nombre: "Versión en inglés", precio: 300 },
    { nombre: "Lista de confirmados en Excel", precio: 200 }
  ],
  planes: [
    {
      nombre: "Esencial",
      precio: 890,
      descripcion: "Todo lo necesario para una invitación elegante y clara.",
      incluye: [
        "Sobre animado de apertura",
        "Portada con fotografía",
        "Cuenta regresiva",
        "Ceremonia y recepción con mapa",
        "Confirmación por WhatsApp",
        "Entrega en 72 horas"
      ],
      destacado: false
    },
    {
      nombre: "Premium",
      precio: 1490,
      descripcion: "La experiencia completa que sus invitados van a recordar.",
      incluye: [
        "Todo lo del plan Esencial",
        "Galería 3D de fotografías",
        "Pases personalizados por invitado",
        "Itinerario y código de vestimenta",
        "Mesa de regalos y datos bancarios",
        "Música de fondo",
        "Botón para agregar al calendario"
      ],
      destacado: true
    },
    {
      nombre: "Signature",
      precio: 2490,
      descripcion: "Diseño a la medida con atención personalizada.",
      incluye: [
        "Todo lo del plan Premium",
        "Paleta y tipografía a la medida",
        "Monograma exclusivo",
        "Dominio personalizado",
        "Lista de confirmados en hoja de cálculo",
        "Cambios ilimitados hasta el evento"
      ],
      destacado: false
    }
  ]
};

window.BODA = {
  novio: "Cristiano",
  novia: "Georgina",
  iniciales: ["C", "G"],
  // Fecha y hora de la ceremonia (formato ISO, hora local).
  fecha: "2027-06-19T17:00:00",
  fechaTexto: "Sábado 19 de junio de 2027",
  ciudad: "Funchal, Madeira",
  frase: "Hay encuentros que cambian el rumbo de una vida entera. El nuestro fue uno de ellos, y queremos celebrarlo con quienes lo han hecho posible.",
  padres: {
    novio: ["María Dolores dos Santos", "José Dinis Aveiro"],
    novia: ["Ana María Hernández", "Jorge Rodríguez"]
  },

  fotos: {
    portada: "assets/img/demo/foto3.jpg",
    // Fotos que se alternan en la portada (la primera es la principal)
    portadas: ["assets/img/demo/foto3.jpg", "assets/img/demo/foto1.jpg", "assets/img/demo/foto4.jpg"],
    bienvenida: "assets/img/demo/foto5.jpg",
    sobre: "assets/img/demo/foto5.jpg",
    historia: [
      "assets/img/demo/foto2.jpg",
      "assets/img/demo/foto4.jpg",
      "assets/img/demo/foto1.jpg"
    ],
    galeria: [
      "assets/img/demo/foto1.jpg",
      "assets/img/demo/foto3.jpg",
      "assets/img/demo/foto4.jpg",
      "assets/img/demo/foto2.jpg",
      "assets/img/demo/foto5.jpg"
    ]
  },

  historia: [
    { anio: "2016", titulo: "Nos conocimos", texto: "Una tarde cualquiera en Madrid, una conversación breve que ninguno de los dos pudo olvidar." },
    { anio: "2017", titulo: "Empezamos a caminar juntos", texto: "Desde entonces cada ciudad, cada viaje y cada logro lo hemos vivido de la mano." },
    { anio: "2026", titulo: "Dijimos que sí", texto: "Frente al mar y con el sol cayendo, la pregunta más sencilla tuvo la respuesta más fácil." }
  ],

  // Cifras de la pareja que se animan en "Nuestra historia"
  cifras: [
    { numero: 11, texto: "Años juntos" },
    { numero: 5, texto: "Hijos" },
    { numero: 23, texto: "Países recorridos" },
    { numero: 1, texto: "Sí para siempre" }
  ],

  eventos: [
    {
      tipo: "Ceremonia religiosa",
      lugar: "Igreja do Colégio",
      direccion: "Praça do Município, 9000-072 Funchal",
      hora: "17:00",
      mapa: "https://maps.google.com/?q=Igreja+do+Colegio+Funchal",
      waze: "https://waze.com/ul?q=Igreja%20do%20Colegio%20Funchal",
      nota: "Les pedimos llegar 20 minutos antes. La ceremonia empieza puntual."
    },
    {
      tipo: "Recepción",
      lugar: "Quinta do Palheiro",
      direccion: "Rua do Balançal 1, 9060-415 Funchal",
      hora: "19:30",
      mapa: "https://maps.google.com/?q=Quinta+do+Palheiro+Funchal",
      waze: "https://waze.com/ul?q=Quinta%20do%20Palheiro%20Funchal",
      nota: "Habrá traslado gratuito desde la iglesia al terminar la ceremonia."
    }
  ],

  itinerario: [
    { hora: "17:00", titulo: "Ceremonia", icono: "anillos" },
    { hora: "18:30", titulo: "Cóctel de bienvenida", icono: "copa" },
    { hora: "19:30", titulo: "Recepción y cena", icono: "cena" },
    { hora: "21:30", titulo: "Primer baile", icono: "baile" },
    { hora: "22:00", titulo: "Fiesta", icono: "fiesta" }
  ],

  padrinos: [
    { rol: "Padrinos de velación", nombres: "Hugo y Elma Aveiro" },
    { rol: "Padrinos de anillos", nombres: "Katia Aveiro y Odilio Pereira" },
    { rol: "Padrinos de lazo", nombres: "Ivana Rodríguez y Jorge Gómez" },
    { rol: "Padrinos de arras", nombres: "Ricardo Regufe y Elsa Martins" }
  ],

  hospedaje: [
    { nombre: "Belmond Reid's Palace", detalle: "A 5 minutos de la ceremonia. Tarifa preferencial con el código BODA27.", enlace: "https://maps.google.com/?q=Belmond+Reids+Palace+Funchal" },
    { nombre: "The Vine Hotel", detalle: "En el centro de Funchal, a 3 minutos caminando de la iglesia.", enlace: "https://maps.google.com/?q=The+Vine+Hotel+Funchal" }
  ],

  // Recomendaciones para quienes viajan
  recomendaciones: [
    { lugar: "Mercado dos Lavradores", texto: "Frutas tropicales, flores y el ambiente más local de Funchal." },
    { lugar: "Teleférico a Monte", texto: "Vistas de toda la bahía y bajada en los famosos carros de cesta." },
    { lugar: "Cabo Girão", texto: "Un mirador de cristal a 580 metros sobre el Atlántico." }
  ],

  // Trivia: la respuesta correcta es el índice de la opción (empieza en 0)
  trivia: [
    { pregunta: "¿En qué ciudad se conocieron?", opciones: ["Lisboa", "Madrid", "Turín"], correcta: 1 },
    { pregunta: "¿Quién dijo te quiero primero?", opciones: ["Cristiano", "Georgina", "Los dos a la vez"], correcta: 0 },
    { pregunta: "¿Cuál es su plan favorito juntos?", opciones: ["Cine en casa", "Viajar en familia", "Ir al estadio"], correcta: 1 }
  ],

  // Preguntas frecuentes de los invitados
  preguntas: [
    { p: "¿Puedo llevar a mis hijos?", r: "Amamos a los niños, pero esta celebración será solo para adultos. Los pases indican el número exacto de lugares." },
    { p: "¿Hasta cuándo puedo confirmar?", r: "Les pedimos confirmar antes del 1 de mayo de 2027 para organizar cada detalle." },
    { p: "¿Habrá estacionamiento?", r: "Sí, ambos lugares tienen estacionamiento y habrá traslado entre la iglesia y la recepción." },
    { p: "¿Qué clima hace en junio?", r: "Funchal tiene alrededor de 24 °C durante el día. En la noche refresca, conviene llevar un abrigo ligero." }
  ],

  // Opciones de menu que aparecen en el formulario de confirmacion
  menu: ["Sin restricciones", "Vegetariano", "Vegano", "Sin gluten", "Infantil"],

  vestimenta: {
    titulo: "Formal",
    detalle: "Caballeros de traje oscuro. Damas con vestido largo.",
    nota: "Les pedimos reservar el color blanco para la novia.",
    paleta: ["#2B2A26", "#5B5B3A", "#A89A7E", "#7A2E2E"]
  },

  regalos: [
    {
      titulo: "Mesa de regalos",
      texto: "El Corte Inglés, evento número 51234567.",
      boton: "Ver mesa",
      enlace: "https://www.elcorteingles.es/"
    },
    {
      titulo: "Transferencia",
      texto: "Banco Santander. Titular: Cristiano y Georgina.",
      copiar: "ES00 0000 0000 0000 0000 0000",
      boton: "Copiar cuenta"
    }
  ],

  confirmarHasta: "1 de mayo de 2027",
  // WhatsApp donde llegan las confirmaciones.
  whatsappRSVP: "5210000000000",
  // Lugares reservados cuando el enlace no trae el parámetro ?p=
  pasesPorDefecto: 2,
  hashtag: "#CristianoYGeorgina",
  // Ruta a un archivo .mp3 (por ejemplo "assets/audio/cancion.mp3").
  // Vacío = suena una caja musical generada por el navegador (Canon de Pachelbel).
  musica: "",
  // Nombre que aparece en el reproductor
  musicaTitulo: "Canon en Re, Pachelbel"
};
