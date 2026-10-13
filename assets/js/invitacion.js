/* =========================================================================
   Invitacion digital | Demo
   Lee todos los datos de assets/js/config.js (objeto BODA).
   Parametros de URL opcionales:
     ?n=Familia%20Perez   nombre del invitado (pase personalizado)
     ?p=4                 lugares reservados
     ?tema=noir           olivo | noir | terracota | medianoche | rubor
     ?embed=1             vista previa (se abre sola y sin musica)
   ========================================================================= */
(function () {
  "use strict";

  var B = window.BODA || {};
  var SITE = window.SITE || {};
  var ROOT = "../";
  var params = new URLSearchParams(location.search);
  var embed = params.has("embed");
  var hasGSAP = typeof window.gsap !== "undefined";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var setText = function (sel, txt) { $$(sel).forEach(function (e) { e.textContent = txt; }); };

  /* ---------- Tema ---------- */
  var temas = ["olivo", "noir", "terracota", "medianoche", "rubor"];
  var tema = params.get("tema");
  if (temas.indexOf(tema) > -1) document.documentElement.setAttribute("data-tema", tema);
  var css = getComputedStyle(document.documentElement);
  var cssVar = function (n) { return css.getPropertyValue(n).trim(); };
  var meta = $('meta[name="theme-color"]');
  if (meta) meta.content = cssVar("--bg");
  if (!hasGSAP) document.documentElement.classList.add("no-gsap");

  /* ---------- Fechas ---------- */
  var DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  function romano(n) {
    var m = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    var r = "";
    m.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
    return r;
  }
  var fecha = new Date(B.fecha);

  /* ---------- Textos ---------- */
  document.title = (B.novio || "") + " & " + (B.novia || "") + " | Nuestra boda";
  setText("[data-novio]", B.novio || "");
  setText("[data-novia]", B.novia || "");
  $$("[data-ini]").forEach(function (e) { e.textContent = (B.iniciales || [])[+e.getAttribute("data-ini")] || ""; });
  setText("[data-fecha-texto]", B.fechaTexto || "");
  setText("[data-fecha-corta]", pad(fecha.getDate()) + " . " + pad(fecha.getMonth() + 1) + " . " + fecha.getFullYear());
  setText("[data-fecha-romana]", romano(fecha.getDate()) + " . " + romano(fecha.getMonth() + 1) + " . " + romano(fecha.getFullYear()));
  setText("[data-dia-semana]", DIAS[fecha.getDay()]);
  setText("[data-dia]", pad(fecha.getDate()));
  setText("[data-mes-anio]", MESES[fecha.getMonth()] + " " + fecha.getFullYear());
  setText("[data-anio]", String(fecha.getFullYear()));
  setText("[data-ciudad]", B.ciudad || "");
  setText("[data-frase]", B.frase || "");
  setText("[data-confirmar]", B.confirmarHasta || "");
  setText("[data-hashtag]", B.hashtag || "");
  $$("[data-marca]").forEach(function (e) { e.textContent = SITE.marca || e.textContent; });

  // Pase personalizado
  var pases = Math.max(1, Math.min(20, parseInt(params.get("p"), 10) || B.pasesPorDefecto || 2));
  var invitado = (params.get("n") || "").trim().slice(0, 60);
  setText("[data-pases]", String(pases));
  setText("[data-pases-label]", pases === 1 ? "Lugar" : "Lugares");
  setText("[data-guest]", invitado || "Nuestros invitados");
  if (invitado) setText("[data-guest-line]", invitado + ", hemos reservado para ustedes");

  // Fotos
  var foto = function (src) { return ROOT + src; };
  var fotos = B.fotos || {};
  $$("[data-foto]").forEach(function (img) {
    var src = fotos[img.getAttribute("data-foto")];
    if (src) img.src = foto(src);
  });

  // Padres
  if (B.padres) {
    $("#parents").innerHTML =
      "<div><h4>Padres del novio</h4><p>" + (B.padres.novio || []).map(esc).join("<br>") + "</p></div>" +
      "<div><h4>Padres de la novia</h4><p>" + (B.padres.novia || []).map(esc).join("<br>") + "</p></div>";
  }

  /* ---------- Calendario ---------- */
  (function () {
    var y = fecha.getFullYear(), m = fecha.getMonth();
    var first = (new Date(y, m, 1).getDay() + 6) % 7; // lunes primero
    var total = new Date(y, m + 1, 0).getDate();
    var html = '<div class="calendar__head"><b>' + MESES[m] + "</b><span>" + y + '</span></div><div class="calendar__grid">';
    ["L", "M", "M", "J", "V", "S", "D"].forEach(function (d) { html += '<span class="dn">' + d + "</span>"; });
    for (var i = 0; i < first; i++) html += "<span></span>";
    for (var d = 1; d <= total; d++) html += "<span" + (d === fecha.getDate() ? ' class="is-day"' : "") + ">" + d + "</span>";
    $("#calendar").innerHTML = html + "</div>";
  })();

  /* ---------- Historia ---------- */
  $("#storyList").insertAdjacentHTML("beforeend", (B.historia || []).map(function (h, i) {
    var src = (fotos.historia || [])[i];
    return '<article class="chapter">' +
      '<figure class="chapter__photo">' + (src ? '<img src="' + esc(foto(src)) + '" alt="" loading="lazy">' : "") + "<span>" + esc(h.anio) + "</span></figure>" +
      '<div class="chapter__text"><b>' + esc(h.anio) + "</b><h4>" + esc(h.titulo) + "</h4><p>" + esc(h.texto) + "</p></div>" +
      "</article>";
  }).join(""));

  /* ---------- Eventos con mapa ---------- */
  var eventIcons = [
    '<svg viewBox="0 0 32 32"><path d="M16 3v6M13 6h6M8 29V16l8-6 8 6v13M4 29h24M13 29v-6a3 3 0 0 1 6 0v6"/></svg>',
    '<svg viewBox="0 0 32 32"><path d="M10 4h12l-1 9a5 5 0 0 1-10 0z"/><path d="M16 18v9M11 28h10M10.5 9h11"/></svg>'
  ];
  $("#events").innerHTML = (B.eventos || []).map(function (e, i) {
    var q = encodeURIComponent((e.lugar || "") + ", " + (e.direccion || ""));
    return '<article class="event">' +
      '<div class="event__body">' +
        '<div class="event__icon">' + eventIcons[i % eventIcons.length] + "</div>" +
        "<h4>" + esc(e.tipo) + "</h4>" +
        '<p class="event__place">' + esc(e.lugar) + "</p>" +
        '<p class="event__addr">' + esc(e.direccion) + "</p>" +
        '<p class="event__time">' + esc(e.hora) + "<small>HRS</small></p>" +
      "</div>" +
      '<div class="event__map">' +
        '<iframe title="Mapa de ' + esc(e.lugar) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + q + '&z=15&output=embed"></iframe>' +
        '<a class="btn btn--solid" href="' + esc(e.mapa) + '" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>Cómo llegar</a>' +
      "</div>" +
      "</article>";
  }).join("");

  /* ---------- Itinerario ---------- */
  $("#timeline").insertAdjacentHTML("beforeend", (B.itinerario || []).map(function (t) {
    return '<div class="titem"><span class="titem__time">' + esc(t.hora) + '</span>' +
      '<span class="titem__icon"><svg><use href="#i-' + esc(t.icono || "anillos") + '"/></svg></span>' +
      '<span class="titem__name">' + esc(t.titulo) + "</span></div>";
  }).join(""));

  /* ---------- Padrinos ---------- */
  $("#sponsors").innerHTML = (B.padrinos || []).map(function (p) {
    return '<div class="sponsor"><small>' + esc(p.rol) + "</small><p>" + esc(p.nombres) + "</p></div>";
  }).join("");
  if (!(B.padrinos || []).length) $(".sponsors").remove();

  /* ---------- Vestimenta ---------- */
  var v = B.vestimenta || {};
  setText("[data-vest-titulo]", v.titulo || "");
  setText("[data-vest-detalle]", v.detalle || "");
  setText("[data-vest-nota]", v.nota || "");
  $("#swatches").innerHTML = (v.paleta || []).map(function (c) { return '<span style="background:' + esc(c) + '"></span>'; }).join("");

  /* ---------- Hospedaje ---------- */
  $("#stay").innerHTML = (B.hospedaje || []).map(function (h, i) {
    return '<div class="hotel"><span class="hotel__icon">' + pad(i + 1) + "</span>" +
      "<div><h4>" + esc(h.nombre) + "</h4><p>" + esc(h.detalle) + "</p></div>" +
      (h.enlace ? '<a href="' + esc(h.enlace) + '" target="_blank" rel="noopener" aria-label="Ver ' + esc(h.nombre) + ' en el mapa"><svg><use href="#i-pin"/></svg></a>' : "") +
      "</div>";
  }).join("");
  if (!(B.hospedaje || []).length) $(".stay").remove();

  /* ---------- Regalos ---------- */
  var giftIcons = [
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="7" y="18" width="34" height="24" rx="2"/><path d="M4 12h40v6H4zM24 12v30M24 12c-3-6-12-8-12-2 0 2 3 2 12 2Zm0 0c3-6 12-8 12-2 0 2-3 2-12 2Z"/></svg>',
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="5" y="11" width="38" height="26" rx="3"/><path d="M5 18h38M11 30h10M31 30h6"/></svg>'
  ];
  $("#gifts").innerHTML = (B.regalos || []).map(function (g) {
    var action = g.copiar
      ? '<button class="btn btn--line" data-copy="' + esc(g.copiar) + '"><svg><use href="#i-copy"/></svg>' + esc(g.boton || "Copiar") + "</button>"
      : '<a class="btn btn--line" href="' + esc(g.enlace) + '" target="_blank" rel="noopener">' + esc(g.boton || "Ver") + "</a>";
    return '<div class="gift"><div class="gift__icon">' + giftIcons[g.copiar ? 1 : 0] + "</div><h4>" + esc(g.titulo) + "</h4><p>" + esc(g.texto) + "</p>" +
      (g.copiar ? "<code>" + esc(g.copiar) + "</code>" : "") + action + "</div>";
  }).join("");

  /* ---------- Copiar al portapapeles ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2400);
  }
  function fallbackCopy(t) {
    var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); } catch (err) { /* sin soporte */ }
    ta.remove();
  }
  function copy(txt) {
    var done = function () { toast("Copiado al portapapeles"); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
    else { fallbackCopy(txt); done(); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (b) copy(b.getAttribute("data-copy"));
  });
  $("#copyTag").addEventListener("click", function () { copy(B.hashtag || ""); });

  /* ---------- Cuenta regresiva con tarjetas que giran ---------- */
  var cards = {};
  $$(".cd__card").forEach(function (c) { cards[c.getAttribute("data-unit")] = { el: c, val: null }; });
  function setCard(unit, value) {
    var c = cards[unit]; if (!c) return;
    var str = pad(value);
    if (c.val === str) return;
    if (unit === "d") setWide(c.el, str.length > 2);
    var old = c.val == null ? str : c.val;
    c.val = str;
    var el = c.el;
    $(".cd__top", el).textContent = str;
    $(".cd__flip-front", el).textContent = old;
    $(".cd__flip-back", el).textContent = str;
    $(".cd__bottom", el).textContent = old;
    if (old === str || reduceMotion) { $(".cd__bottom", el).textContent = str; return; }
    el.classList.remove("is-flipping");
    void el.offsetWidth;
    el.classList.add("is-flipping");
    clearTimeout(c.t);
    c.t = setTimeout(function () { $(".cd__bottom", el).textContent = str; el.classList.remove("is-flipping"); }, 640);
  }
  function setWide(el, wide) { el.classList.toggle("is-wide", wide); }
  var endDays = $("#endDays");
  function tick() {
    var diff = Math.max(0, fecha - new Date());
    var s = Math.floor(diff / 1000);
    setCard("d", Math.floor(s / 86400));
    setCard("h", Math.floor(s / 3600) % 24);
    setCard("m", Math.floor(s / 60) % 60);
    setCard("s", s % 60);
    var dias = Math.ceil(diff / 86400000);
    endDays.textContent = fecha < new Date() ? "Gracias por acompañarnos"
      : dias > 1 ? "Nos vemos en " + dias + " días"
      : dias === 1 ? "Nos vemos mañana" : "Hoy es el gran día";
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Agregar al calendario (.ics) ---------- */
  $("#addCal").addEventListener("click", function () {
    var end = new Date(fecha.getTime() + 8 * 3600 * 1000);
    var f = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
    var ev = (B.eventos || [])[0] || {};
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//ES", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@invitacion",
      "DTSTAMP:" + f(new Date()),
      "DTSTART:" + f(fecha), "DTEND:" + f(end),
      "SUMMARY:Boda de " + B.novio + " y " + B.novia,
      "LOCATION:" + (ev.lugar || "") + "\\, " + (ev.direccion || "").replace(/,/g, "\\,"),
      "DESCRIPTION:" + (B.hashtag || ""),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Mañana es la boda", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "boda-" + (B.novio + "-" + B.novia).toLowerCase().replace(/\s+/g, "-") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    toast("Evento descargado");
  });

  /* ---------- Galeria coverflow 3D + visor ---------- */
  var cf = $("#coverflow"), dotsEl = $("#dots");
  var gal = fotos.galeria || [];
  cf.innerHTML = gal.map(function (src) { return '<div class="cf-item"><img src="' + esc(foto(src)) + '" alt="" loading="lazy" draggable="false"></div>'; }).join("");
  dotsEl.innerHTML = gal.map(function (_, i) { return '<button aria-label="Foto ' + (i + 1) + '"></button>'; }).join("");
  var items = $$(".cf-item", cf), dots = $$("button", dotsEl);
  var current = Math.floor(gal.length / 2), dragX = 0, startX = 0, dragging = false, autoT;
  function renderCF(offset) {
    offset = offset || 0;
    items.forEach(function (it, i) {
      var k = i - current + offset;
      var ak = Math.abs(k);
      it.style.transform = "translateX(" + (k * 62) + "%) translateZ(" + (-ak * 160) + "px) rotateY(" + (-Math.max(-1.6, Math.min(1.6, k)) * 34) + "deg)";
      it.style.zIndex = 100 - Math.round(ak * 10);
      it.style.opacity = ak > 2.4 ? 0 : 1;
      it.style.filter = "brightness(" + (1 - Math.min(ak, 2) * 0.22) + ")";
    });
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
  }
  function go(i) { current = (i + items.length) % items.length; renderCF(); }
  function auto() { clearInterval(autoT); autoT = setInterval(function () { go(current + 1); }, 4200); }
  dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); auto(); }); });
  cf.addEventListener("pointerdown", function (e) { dragging = true; startX = e.clientX; dragX = 0; clearInterval(autoT); });
  cf.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    dragX = e.clientX - startX;
    if (Math.abs(dragX) > 6) { cf.classList.add("is-dragging"); renderCF(dragX / 220); }
  });
  function endCF() {
    if (!dragging) return;
    dragging = false; cf.classList.remove("is-dragging");
    if (Math.abs(dragX) > 6) go(current + Math.round(-dragX / 160));
    auto();
  }
  cf.addEventListener("pointerup", endCF);
  cf.addEventListener("pointercancel", endCF);
  cf.addEventListener("pointerleave", endCF);

  var lb = $("#lightbox"), lbImg = $("img", lb);
  function openLB(src) {
    lbImg.src = src; lb.hidden = false; clearInterval(autoT);
    if (hasGSAP) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4 }), gsap.fromTo(lbImg, { scale: 0.9, rotateX: 12 }, { scale: 1, rotateX: 0, duration: 0.7, ease: "expo.out" });
  }
  function closeLB() {
    if (lb.hidden) return;
    if (hasGSAP) gsap.to(lb, { opacity: 0, duration: 0.3, onComplete: function () { lb.hidden = true; } });
    else lb.hidden = true;
    auto();
  }
  items.forEach(function (it, i) {
    it.addEventListener("click", function () {
      if (Math.abs(dragX) > 6) return;
      if (i !== current) { go(i); auto(); }
      else openLB($("img", it).src);
    });
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox__close")) closeLB(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLB(); });
  renderCF(); auto();

  /* ---------- Confirmacion por WhatsApp ---------- */
  var form = $("#rsvpForm"), thanks = $("#thanks"), whenYes = $(".when-yes", form);
  var people = "";
  for (var i = 1; i <= pases; i++) {
    people += '<label><input type="radio" name="personas" value="' + i + '"' + (i === pases ? " checked" : "") + "><b>" + i + "</b></label>";
  }
  $("#people").innerHTML = people;
  $("#menu").innerHTML = (B.menu || ["Sin restricciones"]).map(function (m) { return "<option>" + esc(m) + "</option>"; }).join("");
  if (invitado) form.nombre.value = invitado;
  $$('input[name="asiste"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      var si = form.asiste.value === "si";
      if (!hasGSAP || reduceMotion) { whenYes.style.display = si ? "" : "none"; return; }
      if (si) { whenYes.style.display = ""; gsap.fromTo(whenYes, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.6, ease: "expo.out", clearProps: "height,overflow", overwrite: true }); }
      else gsap.to(whenYes, { height: 0, opacity: 0, overflow: "hidden", duration: 0.45, ease: "power2.inOut", overwrite: true, onComplete: function () { whenYes.style.display = "none"; } });
    });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    var err = $("#formError");
    if (!nombre) { err.textContent = "Escriban su nombre para confirmar."; form.nombre.focus(); return; }
    err.textContent = "";
    var si = form.asiste.value === "si";
    var lineas = ["Hola " + B.novio + " y " + B.novia + "."];
    if (si) {
      lineas.push("Confirmamos nuestra asistencia a su boda.", "Nombre: " + nombre, "Personas: " + form.personas.value, "Menú: " + form.menu.value);
      if (form.cancion.value.trim()) lineas.push("Canción: " + form.cancion.value.trim());
    } else {
      lineas.push("Lamentamos no poder acompañarlos en su boda.", "Nombre: " + nombre);
    }
    if (form.mensaje.value.trim()) lineas.push("Mensaje: " + form.mensaje.value.trim());
    window.open("https://wa.me/" + (B.whatsappRSVP || "") + "?text=" + encodeURIComponent(lineas.join("\n")), "_blank", "noopener");
    form.hidden = true; thanks.hidden = false;
    if (hasGSAP) {
      gsap.from(".thanks__seal", { scale: 0, rotation: -120, duration: 1, ease: "back.out(1.6)" });
      gsap.from(".thanks > :not(.thanks__seal)", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "expo.out" });
    }
  });
  $("#rsvpAgain").addEventListener("click", function () { thanks.hidden = true; form.hidden = false; });

  /* ---------- Musica ----------
     Si BODA.musica tiene un archivo se reproduce ese.
     Si esta vacio se genera en el navegador una caja musical con el Canon de Pachelbel. */
  var audio = $("#audio"), musicBtn = $("#music");
  var useMusic = !embed;
  var box = null;

  function MusicBox() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ctx = new AC();
    var master = ctx.createGain(); master.gain.value = 0.16;
    var delay = ctx.createDelay(); delay.delayTime.value = 0.3;
    var fb = ctx.createGain(); fb.gain.value = 0.28;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(ctx.destination);

    var N = { "F#3": 54, "G3": 55, "A3": 57, "B3": 59, "D3": 50, "E3": 52, "F#4": 66, "G4": 67, "A4": 69, "B4": 71, "C#5": 73, "D5": 74, "E5": 76, "F#5": 78, "G5": 79, "A5": 81, "B5": 83, "C#4": 61, "D4": 62, "E4": 64 };
    var hz = function (n) { return 440 * Math.pow(2, (N[n] - 69) / 12); };
    // Progresion del Canon: D A Bm F#m G D G A
    var bajo = ["D3", "A3", "B3", "F#3", "G3", "D3", "G3", "A3"];
    var acorde = [["D4", "F#4", "A4"], ["C#4", "E4", "A4"], ["D4", "F#4", "B4"], ["C#4", "F#4", "A4"], ["D4", "G4", "B4"], ["D4", "F#4", "A4"], ["D4", "G4", "B4"], ["C#4", "E4", "A4"]];
    var melodias = [
      [["F#5"], ["E5"], ["D5"], ["C#5"], ["B4"], ["A4"], ["B4"], ["C#5"]],
      [["D5", "C#5"], ["B4", "A4"], ["B4", "D5"], ["C#5", "A4"], ["G4", "B4"], ["A4", "F#4"], ["G4", "B4"], ["C#5", "E5"]],
      [["D5", "F#5", "A5", "F#5"], ["E5", "C#5", "A4", "C#5"], ["D5", "F#5", "B5", "F#5"], ["C#5", "E5", "A5", "E5"], ["B4", "D5", "G5", "D5"], ["A4", "D5", "F#5", "D5"], ["B4", "D5", "G5", "B5"], ["A5", "G5", "F#5", "E5"]]
    ];
    var beat = 0.62, bar = beat * 2;
    var step = 0, next = 0, timer = null;

    function nota(f, t, vol, dur) {
      [[1, 1], [2, 0.32], [4.2, 0.08]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f * p[0];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol * p[1], t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur / p[0]);
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + dur + 0.05);
      });
    }
    function compas(i, t) {
      var c = i % 8, mel = melodias[Math.floor(i / 8) % melodias.length][c];
      nota(hz(bajo[c]), t, 0.5, 2.6);
      acorde[c].forEach(function (n, k) { nota(hz(n), t + beat * (0.5 + k * 0.5), 0.16, 1.4); });
      mel.forEach(function (n, k) { nota(hz(n), t + k * (bar / mel.length), 0.42, 1.8); });
    }
    function schedule() {
      while (next < ctx.currentTime + 0.5) { compas(step++, next); next += bar; }
    }
    return {
      play: function () {
        ctx.resume();
        if (!timer) { next = ctx.currentTime + 0.1; schedule(); timer = setInterval(schedule, 120); }
      },
      pause: function () { ctx.suspend(); },
      get paused() { return ctx.state !== "running"; }
    };
  }

  function setPlaying(on) {
    musicBtn.classList.toggle("is-paused", !on);
    musicBtn.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
  }
  function playMusic() {
    if (B.musica) {
      if (!audio.src) audio.src = ROOT + B.musica;
      audio.play().then(function () { setPlaying(true); }, function () { setPlaying(false); });
    } else {
      if (!box) box = MusicBox();
      if (!box) { musicBtn.hidden = true; return; }
      box.play(); setPlaying(true);
    }
  }
  function pauseMusic() {
    if (B.musica) audio.pause(); else if (box) box.pause();
    setPlaying(false);
  }
  musicBtn.addEventListener("click", function () {
    musicBtn.classList.contains("is-paused") ? playMusic() : pauseMusic();
  });

  /* ---------- Petalos al abrir ---------- */
  function petals() {
    if (reduceMotion) return;
    var cv = $("#petals"), cx = cv.getContext("2d");
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
    var colors = [cssVar("--seal"), cssVar("--flap"), cssVar("--accent"), cssVar("--liner-a") || cssVar("--gold")].filter(Boolean);
    var list = [], t0 = performance.now(), last = t0, spawnFor = 2400, maxLife = 9000;
    function add() {
      list.push({
        x: Math.random() * W, y: -30 * dpr, s: (7 + Math.random() * 8) * dpr,
        vy: (110 + Math.random() * 120) * dpr, sway: Math.random() * 6.28, sw: 30 + Math.random() * 50,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 3, flip: Math.random() * 6.28,
        c: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    for (var k = 0; k < 30; k++) { add(); list[k].y = -Math.random() * H * 0.6; }
    cv.style.opacity = 1;
    (function frame(now) {
      var el = now - t0, dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (el < spawnFor && Math.random() < 0.6) add();
      if (el > maxLife - 800) cv.style.opacity = Math.max(0, (maxLife - el) / 800);
      cx.clearRect(0, 0, W, H);
      list = list.filter(function (p) {
        p.y += p.vy * dt; p.sway += dt * 1.6; p.x += Math.cos(p.sway) * p.sw * dt * dpr; p.r += p.vr * dt; p.flip += dt * 3;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
        cx.fillStyle = p.c; cx.globalAlpha = 0.9;
        cx.beginPath(); cx.moveTo(0, -p.s);
        cx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
        cx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
        cx.fill(); cx.restore();
        return p.y < H + 40 * dpr;
      });
      if (list.length && el < maxLife) requestAnimationFrame(frame); else cx.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ---------- Apertura del sobre ---------- */
  var opened = false;
  function openEnvelope() {
    if (opened) return; opened = true;
    if (useMusic) { musicBtn.hidden = false; playMusic(); }
    if (!hasGSAP) { document.body.classList.remove("is-sealed"); $("#intro").style.display = "none"; return; }

    document.body.classList.add("is-opening");
    var tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.set(".seal", { transition: "none" })
      .to(".seal", { scale: 1.15, duration: 0.22, ease: "power2.out" })
      .set(".seal__half", { opacity: 1 })
      .set(".seal__wax, .seal__mark", { opacity: 0 })
      .to(".seal__half--l", { x: -50, y: 70, rotation: -60, opacity: 0, duration: 0.85, ease: "power2.in" })
      .to(".seal__half--r", { x: 50, y: 70, rotation: 60, opacity: 0, duration: 0.85, ease: "power2.in" }, "<")
      .to(".envelope__flap", { rotateX: 180, duration: 0.9 }, "-=.6")
      .set(".envelope__flap", { zIndex: 0 })
      .to(".envelope__letter", { yPercent: -64, duration: 1, ease: "power3.out" }, "-=.1")
      .to(".intro__top, .intro__hint, .intro__guest", { opacity: 0, y: -20, duration: 0.6, stagger: 0.04 }, "<")
      .to(".intro .corner", { opacity: 0, duration: 0.6 }, "<")
      .add(petals, "<.2")
      .to(".envelope", { scale: 1.1, y: 30, duration: 0.8 }, "-=.45")
      .add(function () { document.body.classList.remove("is-sealed"); window.scrollTo(0, 0); revealContent(); })
      .to("#intro", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
      .set("#intro", { display: "none" });
  }
  $("#envelope").addEventListener("click", openEnvelope);
  if (embed) setTimeout(openEnvelope, 3200);

  /* ---------- Animaciones de scroll ---------- */
  function revealContent() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(".cover__media img", { scale: 1.3 }, { scale: 1, duration: 2.4, ease: "expo.out" });
    gsap.from(".cover__text > *", { y: 40, opacity: 0, duration: 1.4, stagger: 0.12, ease: "expo.out", delay: 0.35 });
    gsap.from(".cover__frame i", { opacity: 0, scale: 0.6, duration: 1.4, stagger: 0.08, ease: "expo.out", delay: 0.5 });
    if (reduceMotion) return;

    gsap.to(".cover__media img", { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".cover__text", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: ".cover", start: "center center", end: "bottom top", scrub: true } });

    // Ramitas que se dibujan
    $$(".draw").forEach(function (s) {
      gsap.fromTo(s, { strokeDasharray: 320, strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 92%" } });
    });

    $$(".block > .caps, .block > .title, .block > .lead, .welcome__lead, .quote__text, .welcome__invite, .countdown-block .btn, .dress__text, .swatches, .dress__note, .dress__icons figure, .social__tag, .gallery__hint, .calendar").forEach(function (el) {
      gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // Arco de la bienvenida
    gsap.from(".arch", { y: 70, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".arch", start: "top 88%" } });
    gsap.fromTo(".arch img", { scale: 1.5 }, { scale: 1.15, duration: 2.2, ease: "expo.out", scrollTrigger: { trigger: ".arch", start: "top 88%" } });
    gsap.from(".parents > div", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: ".parents", start: "top 88%" } });

    gsap.from(".cd", { rotateX: -90, opacity: 0, transformPerspective: 600, transformOrigin: "50% 0", duration: 1.1, stagger: 0.1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".countdown", start: "top 88%" } });
    gsap.from(".calendar__grid span:not(.dn)", { opacity: 0, scale: 0.4, duration: 0.5, stagger: 0.012, ease: "back.out(2)", scrollTrigger: { trigger: ".calendar", start: "top 80%" } });

    // Historia: linea que crece y capitulos que entran por los lados
    gsap.fromTo(".story__line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".story__list", start: "top 70%", end: "bottom 70%", scrub: true } });
    $$(".chapter").forEach(function (c, i) {
      var dir = i % 2 ? -1 : 1;
      gsap.from($(".chapter__photo", c), { x: 60 * dir, y: 40, rotation: 18 * dir, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 82%" } });
      gsap.from($(".chapter__text", c).children, { y: 24, opacity: 0, duration: 1, stagger: 0.08, delay: 0.15, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 82%" } });
    });

    // Tarjetas de eventos giran en 3D al entrar
    $$(".event").forEach(function (e, i) {
      gsap.from(e, { rotateY: i % 2 ? 60 : -60, rotateX: 10, z: -200, opacity: 0, transformOrigin: i % 2 ? "100% 50%" : "0 50%", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 86%" } });
    });

    // Itinerario
    gsap.fromTo(".timeline__line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });
    $$(".titem").forEach(function (t) {
      gsap.from($(".titem__icon", t), { scale: 0, rotation: -90, duration: 0.9, ease: "back.out(1.8)", scrollTrigger: { trigger: t, start: "top 82%" } });
      gsap.from([$(".titem__time", t), $(".titem__name", t)], { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 82%" } });
    });

    gsap.from(".sponsor", { y: 40, opacity: 0, rotateX: -30, transformPerspective: 700, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".sponsors__grid", start: "top 85%" } });
    gsap.from(".coverflow", { opacity: 0, rotateX: 25, y: 60, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".coverflow", start: "top 85%" } });
    gsap.from(".swatches span", { scale: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)", scrollTrigger: { trigger: ".swatches", start: "top 88%" } });
    gsap.from(".hotel", { x: -30, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".stay__list", start: "top 86%" } });
    gsap.from(".gift", { y: 50, opacity: 0, rotateX: -20, transformPerspective: 800, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".gifts__list", start: "top 85%" } });
    gsap.from(".form > *", { y: 30, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 85%" } });
    gsap.from(".end > *:not(.corner)", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".end", start: "top 88%" } });
    ScrollTrigger.refresh();
  }

  /* ---------- Entrada del sobre ---------- */
  if (hasGSAP && !reduceMotion) {
    gsap.from(".monogram__wreath path, .monogram__wreath circle", { strokeDasharray: 300, strokeDashoffset: 300, duration: 2.4, ease: "power2.out", stagger: 0.04 });
    gsap.from(".monogram__letters b", { opacity: 0, y: 12, duration: 1.2, stagger: 0.2, delay: 0.4, ease: "expo.out" });
    gsap.from(".intro__names, .intro__top .caps", { opacity: 0, y: 20, duration: 1.2, stagger: 0.12, delay: 0.6, ease: "expo.out" });
    gsap.from(".envelope-wrap", { opacity: 0, y: 70, rotateX: 40, duration: 1.6, delay: 0.5, ease: "expo.out" });
    gsap.from(".seal__wax, .seal__mark", { scale: 0, rotation: -90, duration: 1, delay: 1.3, ease: "back.out(1.8)" });
    gsap.from(".intro__guest > *", { opacity: 0, y: 20, duration: 1, stagger: 0.12, delay: 0.9, ease: "expo.out" });
    gsap.from(".intro .corner", { opacity: 0, duration: 1.8, ease: "power2.out", delay: 0.2 });
  }
})();
