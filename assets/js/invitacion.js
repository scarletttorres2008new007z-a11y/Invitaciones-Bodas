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
  setText("[data-ciudad-corta]", (B.ciudad || "").split(",")[0]);
  setText("[data-hora-texto]", pad(fecha.getHours()) + ":" + pad(fecha.getMinutes()) + " horas");
  setText("[data-musica-titulo]", B.musicaTitulo || "Nuestra canción");
  setText("[data-frase]", B.frase || "");
  setText("[data-confirmar]", B.confirmarHasta || "");
  setText("[data-hashtag]", B.hashtag || "");
  $$("[data-marca]").forEach(function (e) { e.textContent = SITE.marca || e.textContent; });

  // Pase personalizado
  var pases = Math.max(1, Math.min(20, parseInt(params.get("p"), 10) || B.pasesPorDefecto || 2));
  var invitado = (params.get("n") || "").trim().slice(0, 60);
  setText("[data-pases]", String(pases));
  setText("[data-pases-label]", pases === 1 ? "Lugar" : "Lugares");
  if (invitado) {
    setText("[data-guest-line]", invitado + ", hemos reservado para ustedes");
    var gc = $("[data-guest-cover]");
    gc.textContent = invitado + ", los esperamos para celebrar juntos";
    gc.hidden = false;
  }

  // Fotos
  var foto = function (src) { return ROOT + src; };
  var fotos = B.fotos || {};
  $$("[data-foto]").forEach(function (img) {
    var src = fotos[img.getAttribute("data-foto")];
    if (src) img.src = foto(src);
  });

  /* ---------- Portada con fotos que se alternan ---------- */
  var portadas = (fotos.portadas && fotos.portadas.length ? fotos.portadas : [fotos.portada]).filter(Boolean);
  var slidesEl = $("#coverSlides"), barsEl = $("#coverBars");
  slidesEl.innerHTML = portadas.map(function (src, i) { return '<img src="' + esc(foto(src)) + '" alt=""' + (i ? ' loading="lazy"' : "") + ">"; }).join("");
  barsEl.innerHTML = portadas.length > 1 ? portadas.map(function () { return "<i></i>"; }).join("") : "";
  var slides = $$("img", slidesEl), bars = $$("i", barsEl), slide = -1, slideT;
  function showSlide(i) {
    slide = i % slides.length;
    slides.forEach(function (im, k) { im.classList.toggle("is-on", k === slide); });
    bars.forEach(function (b, k) {
      b.classList.remove("is-on"); void b.offsetWidth;
      b.classList.toggle("is-done", k < slide);
      if (k === slide) b.classList.add("is-on");
    });
    clearTimeout(slideT);
    if (slides.length > 1) slideT = setTimeout(function () { showSlide(slide + 1); }, 6500);
  }
  showSlide(0);

  /* ---------- Menu de secciones ---------- */
  var ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"];
  var secBtn = $("#secBtn"), secMenu = $("#secMenu");
  $("#secList").innerHTML = $$("[data-sec]").map(function (sec, i) {
    return '<li><a href="#' + sec.id + '"><small>' + ROMANOS[i] + "</small>" + esc(sec.getAttribute("data-sec")) + "</a></li>";
  }).join("");
  function toggleMenu(open) {
    secBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      secMenu.hidden = false;
      if (hasGSAP) {
        gsap.fromTo(secMenu, { clipPath: "circle(0% at calc(100% - 38px) 38px)" }, { clipPath: "circle(150% at calc(100% - 38px) 38px)", duration: 0.9, ease: "expo.inOut" });
        gsap.from("#secList li", { y: 24, opacity: 0, duration: 0.7, stagger: 0.03, delay: 0.25, ease: "expo.out" });
      }
    } else if (hasGSAP) {
      gsap.to(secMenu, { clipPath: "circle(0% at calc(100% - 38px) 38px)", duration: 0.6, ease: "expo.inOut", onComplete: function () { secMenu.hidden = true; } });
    } else secMenu.hidden = true;
  }
  secBtn.addEventListener("click", function () { toggleMenu(secBtn.getAttribute("aria-expanded") !== "true"); });
  secMenu.addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    e.preventDefault();
    toggleMenu(false);
    var target = $(a.getAttribute("href"));
    setTimeout(function () { window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 10, behavior: "smooth" }); }, 250);
  });
  var ring = $(".secbtn__progress");
  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - innerHeight;
    ring.style.strokeDashoffset = 138.2 * (1 - (max > 0 ? scrollY / max : 0));
  }, { passive: true });

  /* ---------- Cifras ---------- */
  $("#figures").innerHTML = (B.cifras || []).map(function (c) {
    return '<div class="figure"><b data-to="' + (+c.numero || 0) + '">0</b><span>' + esc(c.texto) + "</span></div>";
  }).join("");
  if (!(B.cifras || []).length) $("#figures").remove();

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
        (e.nota ? '<p class="event__note">' + esc(e.nota) + "</p>" : "") +
      "</div>" +
      '<div class="event__map">' +
        '<iframe title="Mapa de ' + esc(e.lugar) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + q + '&z=15&output=embed"></iframe>' +
        '<div class="event__links">' +
          '<a class="btn btn--solid" href="' + esc(e.mapa || "https://maps.google.com/?q=" + q) + '" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>Google Maps</a>' +
          (e.waze ? '<a class="btn btn--paper" href="' + esc(e.waze) + '" target="_blank" rel="noopener">Waze</a>' : "") +
        "</div>" +
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

  /* ---------- Que conocer ---------- */
  $("#tips").innerHTML = (B.recomendaciones || []).map(function (t, i) {
    return '<div class="tip"><small>' + pad(i + 1) + "</small><div><h5>" + esc(t.lugar) + "</h5><p>" + esc(t.texto) + "</p></div></div>";
  }).join("");
  if (!(B.recomendaciones || []).length) { $("#tips").remove(); $(".stay .subtitle").remove(); }

  /* ---------- Preguntas frecuentes ---------- */
  $("#faq").innerHTML = (B.preguntas || []).map(function (q) {
    return '<details class="qa"><summary>' + esc(q.p) + '<i></i></summary><div class="qa__a"><p>' + esc(q.r) + "</p></div></details>";
  }).join("");
  if (!(B.preguntas || []).length) $(".faq").remove();
  $$(".qa").forEach(function (d) {
    var sum = $("summary", d), body = $(".qa__a", d);
    sum.addEventListener("click", function (e) {
      if (!hasGSAP || reduceMotion) return;
      e.preventDefault();
      if (d.open) gsap.to(body, { height: 0, duration: 0.45, ease: "power2.inOut", onComplete: function () { d.open = false; body.style.height = ""; } });
      else { d.open = true; gsap.fromTo(body, { height: 0 }, { height: "auto", duration: 0.6, ease: "expo.out", clearProps: "height" }); }
    });
  });

  /* ---------- Mosaico de fotos ---------- */
  var insta = (fotos.galeria || []).concat(fotos.historia || []).slice(0, 6);
  $("#insta").innerHTML = insta.map(function (src) { return '<span><img src="' + esc(foto(src)) + '" alt="" loading="lazy"></span>'; }).join("");

  /* ---------- Trivia ---------- */
  var quiz = $("#quiz"), trivia = B.trivia || [], aciertos = 0, respondidas = 0;
  quiz.innerHTML = trivia.map(function (q, i) {
    return '<div class="q" data-q="' + i + '"><div class="q__head"><small>' + pad(i + 1) + "</small><h4>" + esc(q.pregunta) + '</h4></div><div class="q__opts">' +
      q.opciones.map(function (o, k) { return '<button class="q__opt" data-k="' + k + '">' + esc(o) + "<i></i></button>"; }).join("") + "</div></div>";
  }).join("");
  if (!trivia.length) $(".trivia").remove();
  quiz.addEventListener("click", function (e) {
    var b = e.target.closest(".q__opt"); if (!b) return;
    var qEl = b.closest(".q"); if (qEl.classList.contains("is-answered")) return;
    var q = trivia[+qEl.getAttribute("data-q")], k = +b.getAttribute("data-k");
    qEl.classList.add("is-answered");
    var right = $$(".q__opt", qEl)[q.correcta];
    right.classList.add("is-right");
    if (k === q.correcta) aciertos++;
    else b.classList.add("is-wrong");
    if (hasGSAP) gsap.fromTo(right, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: "back.out(3)" });
    if (++respondidas === trivia.length) {
      var frases = ["Nos tendremos que conocer mejor en la fiesta.", "Vamos bien, pero aún hay historias por contar.", "Nos conoce muy bien.", "Nos conoce de memoria."];
      var idx = Math.round(aciertos / trivia.length * 3);
      quiz.insertAdjacentHTML("beforeend", '<div class="quiz__score"><b>' + aciertos + " / " + trivia.length + "</b><p>" + frases[idx] + "</p></div>");
      if (hasGSAP) gsap.from(".quiz__score", { y: 30, opacity: 0, rotateX: -40, transformPerspective: 600, duration: 1, ease: "expo.out" });
    }
  });

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

  /* ---------- Agregar al calendario ---------- */
  (function () {
    var end = new Date(fecha.getTime() + 8 * 3600 * 1000);
    var g = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; };
    var ev = (B.eventos || [])[0] || {};
    $("#gCal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Boda de " + B.novio + " y " + B.novia) +
      "&dates=" + g(fecha) + "/" + g(end) +
      "&location=" + encodeURIComponent((ev.lugar || "") + ", " + (ev.direccion || "")) +
      "&details=" + encodeURIComponent(B.hashtag || "");
  })();
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

  /* Visor a pantalla completa con flechas y deslizamiento */
  var lb = $("#lightbox"), lbImg = $("img", lb), lbCount = $("#lbCount"), lbIdx = 0;
  function showLB(i, dir) {
    lbIdx = (i + gal.length) % gal.length;
    lbImg.src = foto(gal[lbIdx]);
    lbCount.textContent = (lbIdx + 1) + " / " + gal.length;
    if (hasGSAP && dir) gsap.fromTo(lbImg, { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
  }
  function openLB(i) {
    showLB(i); lb.hidden = false; clearInterval(autoT);
    if (hasGSAP) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4 }), gsap.fromTo(lbImg, { scale: 0.9, rotateX: 12 }, { scale: 1, rotateX: 0, duration: 0.7, ease: "expo.out" });
  }
  function closeLB() {
    if (lb.hidden) return;
    if (hasGSAP) gsap.to(lb, { opacity: 0, duration: 0.3, onComplete: function () { lb.hidden = true; } });
    else lb.hidden = true;
    go(lbIdx); auto();
  }
  items.forEach(function (it, i) {
    it.addEventListener("click", function () {
      if (Math.abs(dragX) > 6) return;
      if (i !== current) { go(i); auto(); }
      else openLB(i);
    });
  });
  lb.addEventListener("click", function (e) {
    if (e.target.closest(".lightbox__nav--prev")) showLB(lbIdx - 1, -1);
    else if (e.target.closest(".lightbox__nav--next")) showLB(lbIdx + 1, 1);
    else if (e.target === lb || e.target.closest(".lightbox__close")) closeLB();
  });
  var lbX = null;
  lb.addEventListener("touchstart", function (e) { lbX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (lbX == null) return;
    var dx = e.changedTouches[0].clientX - lbX; lbX = null;
    if (Math.abs(dx) > 40) showLB(lbIdx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowRight") showLB(lbIdx + 1, 1);
    if (e.key === "ArrowLeft") showLB(lbIdx - 1, -1);
  });
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
    $(".music__label", musicBtn).textContent = on ? "Sonando" : "Toque para escuchar";
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

  /* ---------- Raspa y descubre la fecha ---------- */
  (function () {
    var box = $("#scratch"), cv = $("#scratchCanvas");
    if (!box) return;
    var cx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), size, done = false, drawing = false, last = null, moves = 0;
    function paint() {
      size = cv.clientWidth * dpr;
      if (!size) return;
      cv.width = cv.height = size;
      var c = size / 2;
      cx.globalCompositeOperation = "source-over";
      cx.fillStyle = cssVar("--accent");
      cx.beginPath(); cx.arc(c, c, c, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = cssVar("--accent-ink"); cx.fillStyle = cssVar("--accent-ink");
      cx.globalAlpha = 0.35; cx.lineWidth = 1 * dpr;
      [0.92, 0.88, 0.62].forEach(function (r) { cx.beginPath(); cx.arc(c, c, c * r, 0, Math.PI * 2); cx.stroke(); });
      // pequenas hojas alrededor
      for (var i = 0; i < 36; i++) {
        var ang = i / 36 * Math.PI * 2;
        cx.save(); cx.translate(c + Math.cos(ang) * c * 0.75, c + Math.sin(ang) * c * 0.75); cx.rotate(ang + Math.PI / 2);
        cx.beginPath(); cx.ellipse(0, 0, 2.2 * dpr, 6 * dpr, 0, 0, Math.PI * 2); cx.fill(); cx.restore();
      }
      cx.globalAlpha = 1;
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.font = "400 " + Math.round(c * 0.36) + "px 'Pinyon Script', cursive";
      cx.fillText((B.iniciales || []).join(" "), c, c * 0.9);
      cx.font = "400 " + Math.round(10 * dpr) + "px Jost, sans-serif";
      cx.letterSpacing = 3 * dpr + "px";
      cx.fillText("RASPE AQUÍ", c, c * 1.3);
    }
    function reveal() {
      if (done) return; done = true;
      box.classList.add("is-done");
      if (hasGSAP) gsap.fromTo(".scratch__under > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out" });
      burst(box);
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; }
    function scratchTo(p) {
      cx.globalCompositeOperation = "destination-out";
      cx.lineWidth = 44 * dpr; cx.lineCap = "round";
      cx.beginPath(); cx.moveTo((last || p).x, (last || p).y); cx.lineTo(p.x, p.y); cx.stroke();
      last = p;
      if (++moves % 8 === 0) check();
    }
    function check() {
      var d = cx.getImageData(0, 0, size, size).data, clear = 0, total = 0;
      for (var i = 3; i < d.length; i += 4 * 24) { total++; if (d[i] < 20) clear++; }
      if (clear / total > 0.55) reveal();
    }
    cv.addEventListener("pointerdown", function (e) { drawing = true; last = null; cv.setPointerCapture(e.pointerId); scratchTo(pos(e)); });
    cv.addEventListener("pointermove", function (e) { if (drawing) scratchTo(pos(e)); });
    ["pointerup", "pointercancel"].forEach(function (t) { cv.addEventListener(t, function () { drawing = false; last = null; }); });
    $("#scratchSkip").addEventListener("click", reveal);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(paint);
    window.addEventListener("resize", function () { if (!done) paint(); });
  })();

  // Pequena lluvia de petalos alrededor de un elemento
  function burst(el) {
    if (!hasGSAP || reduceMotion) return;
    var r = el.getBoundingClientRect();
    var colors = [cssVar("--seal"), cssVar("--accent"), cssVar("--gold")];
    for (var i = 0; i < 26; i++) {
      var d = document.createElement("i");
      d.style.cssText = "position:fixed;z-index:26;pointer-events:none;width:9px;height:14px;border-radius:50% 50% 50% 0;left:" + (r.left + r.width / 2) + "px;top:" + (r.top + r.height / 2) + "px;background:" + colors[i % 3];
      document.body.appendChild(d);
      var ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 140;
      gsap.to(d, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist + 80, rotation: Math.random() * 540, opacity: 0, duration: 1.6 + Math.random(), ease: "power3.out", onComplete: d.remove.bind(d) });
    }
  }

  /* ---------- Entrada ---------- */
  var opened = false;
  function openEntrance(withMusic) {
    if (opened) return; opened = true;
    if (withMusic && useMusic) playMusic();
    if (useMusic) musicBtn.hidden = false;
    document.body.classList.remove("is-closed");
    document.body.classList.add("is-open");
    if (!hasGSAP) { $("#entrance").style.display = "none"; return; }
    window.scrollTo(0, 0);
    var tl = gsap.timeline();
    tl.to(".entrance__center", { opacity: 0, scale: 0.92, duration: 0.6, ease: "power2.in" })
      .to(".door--l", { rotateY: -110, duration: 1.8, ease: "expo.inOut" }, "-=.15")
      .to(".door--r", { rotateY: 110, duration: 1.8, ease: "expo.inOut" }, "<")
      .to(".door", { opacity: 0, duration: 0.6 }, "-=.6")
      .add(petals, "-=1.6")
      .add(revealContent, "-=1.5")
      .set("#entrance", { display: "none" });
  }
  $("#enter").addEventListener("click", function () { openEntrance(true); });
  if (embed) setTimeout(function () { openEntrance(false); }, 1400);

  /* ---------- Animaciones de scroll ---------- */
  function revealContent() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".cover__text > *", { y: 40, opacity: 0, duration: 1.4, stagger: 0.1, ease: "expo.out", delay: 0.6 });
    gsap.from(".cover__frame i", { opacity: 0, scale: 0.6, duration: 1.4, stagger: 0.08, ease: "expo.out", delay: 0.5 });
    if (reduceMotion) return;

    gsap.to(".cover__media", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".cover__text", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { trigger: ".cover", start: "center center", end: "bottom top", scrub: true } });

    // Ramitas que se dibujan
    $$(".draw").forEach(function (s) {
      gsap.fromTo(s, { strokeDasharray: 320, strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 92%" } });
    });

    $$(".block > .caps, .block > .title, .block > .lead, .welcome__lead, .quote__text, .welcome__invite, .countdown-block .btn, .dress__text, .swatches, .dress__note, .dress__icons figure, .social__tag, .gallery__hint, .calendar, .scratch, .faltan, .btn-row, .pass, .subtitle, .insta").forEach(function (el) {
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

    // Cifras que cuentan
    $$(".figure b").forEach(function (b) {
      var to = +b.getAttribute("data-to"), o = { v: 0 };
      gsap.to(o, { v: to, duration: 2, ease: "power2.out", onUpdate: function () { b.textContent = Math.round(o.v); }, scrollTrigger: { trigger: b, start: "top 90%" } });
    });
    gsap.from(".figure", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".figures", start: "top 88%" } });
    gsap.from(".q", { y: 40, opacity: 0, rotateX: -18, transformPerspective: 800, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".quiz", start: "top 86%" } });
    gsap.from(".tip", { x: -24, opacity: 0, duration: 0.9, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".tips", start: "top 88%" } });
    gsap.from(".qa", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".faq__list", start: "top 88%" } });
    gsap.from(".insta span", { scale: 0.8, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out", scrollTrigger: { trigger: ".insta", start: "top 88%" } });

    gsap.from(".sponsor", { y: 40, opacity: 0, rotateX: -30, transformPerspective: 700, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".sponsors__grid", start: "top 85%" } });
    gsap.from(".coverflow", { opacity: 0, rotateX: 25, y: 60, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".coverflow", start: "top 85%" } });
    gsap.from(".swatches span", { scale: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)", scrollTrigger: { trigger: ".swatches", start: "top 88%" } });
    gsap.from(".hotel", { x: -30, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".stay__list", start: "top 86%" } });
    gsap.from(".gift", { y: 50, opacity: 0, rotateX: -20, transformPerspective: 800, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".gifts__list", start: "top 85%" } });
    gsap.from(".form > *", { y: 30, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 85%" } });
    gsap.from(".end > *:not(.corner)", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".end", start: "top 88%" } });
    ScrollTrigger.refresh();
  }

  /* ---------- Animacion inicial de la entrada ---------- */
  if (hasGSAP && !reduceMotion) {
    gsap.from(".door--l", { xPercent: -100, duration: 1.4, ease: "expo.out" });
    gsap.from(".door--r", { xPercent: 100, duration: 1.4, ease: "expo.out" });
    gsap.from(".monogram__wreath path, .monogram__wreath circle", { strokeDasharray: 300, strokeDashoffset: 300, duration: 2.4, ease: "power2.out", stagger: 0.04, delay: 0.6 });
    gsap.from(".monogram__letters b", { opacity: 0, y: 12, duration: 1.2, stagger: 0.2, delay: 1, ease: "expo.out" });
    gsap.from(".entrance__names, .entrance__center .caps", { opacity: 0, y: 20, duration: 1.2, stagger: 0.12, delay: 1.1, ease: "expo.out" });
    gsap.from(".entrance__btn", { opacity: 0, scale: 0.6, duration: 1.2, delay: 1.5, ease: "back.out(1.6)" });
    gsap.from(".door__branch", { opacity: 0, duration: 2, delay: 1 });
  }
})();
