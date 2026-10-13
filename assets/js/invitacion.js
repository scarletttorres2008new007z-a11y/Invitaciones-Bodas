/* =========================================================================
   Invitacion digital | Demo
   Lee todos los datos de assets/js/config.js (objeto BODA).
   Parametros de URL opcionales:
     ?n=Familia%20Perez   nombre del invitado (pase personalizado)
     ?p=4                 lugares reservados
     ?tema=noir           olivo | noir | terracota | medianoche | rubor
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

  /* ---------- Tema ---------- */
  var temas = ["olivo", "noir", "terracota", "medianoche", "rubor"];
  var tema = params.get("tema");
  if (temas.indexOf(tema) > -1) document.documentElement.setAttribute("data-tema", tema);
  var meta = $('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();

  if (!hasGSAP) document.documentElement.classList.add("no-gsap");

  /* ---------- Textos ---------- */
  var fecha = new Date(B.fecha);
  var pad = function (n) { return String(n).padStart(2, "0"); };
  document.title = (B.novio || "") + " & " + (B.novia || "") + " | Nuestra boda";
  $$("[data-novio]").forEach(function (e) { e.textContent = B.novio; });
  $$("[data-novia]").forEach(function (e) { e.textContent = B.novia; });
  $$("[data-ini]").forEach(function (e) { e.textContent = (B.iniciales || [])[+e.getAttribute("data-ini")] || ""; });
  $$("[data-fecha-texto]").forEach(function (e) { e.textContent = B.fechaTexto; });
  $$("[data-fecha-corta]").forEach(function (e) { e.textContent = pad(fecha.getDate()) + " . " + pad(fecha.getMonth() + 1) + " . " + fecha.getFullYear(); });
  $$("[data-ciudad]").forEach(function (e) { e.textContent = B.ciudad; });
  $$("[data-frase]").forEach(function (e) { e.textContent = B.frase; });
  $$("[data-confirmar]").forEach(function (e) { e.textContent = B.confirmarHasta; });
  $$("[data-hashtag]").forEach(function (e) { e.textContent = B.hashtag; });
  $$("[data-marca]").forEach(function (e) { e.textContent = SITE.marca || e.textContent; });

  // Pase personalizado
  var pases = Math.max(1, Math.min(20, parseInt(params.get("p"), 10) || B.pasesPorDefecto || 2));
  var invitado = (params.get("n") || "").trim().slice(0, 60);
  $$("[data-pases]").forEach(function (e) { e.textContent = pases; });
  $$("[data-pases-label]").forEach(function (e) { e.textContent = pases === 1 ? "Lugar" : "Lugares"; });
  if (invitado) {
    $$("[data-guest-line]").forEach(function (e) { e.textContent = invitado + ", hemos reservado para ustedes"; });
  }

  // Fotos
  var foto = function (src) { return ROOT + src; };
  $$("[data-foto]").forEach(function (img) { img.src = foto(B.fotos[img.getAttribute("data-foto")]); });

  // Padres
  if (B.padres) {
    $("#parents").innerHTML =
      "<div><h4>Padres del novio</h4><p>" + B.padres.novio.map(esc).join("<br>") + "</p></div>" +
      "<div><h4>Padres de la novia</h4><p>" + B.padres.novia.map(esc).join("<br>") + "</p></div>";
  }

  // Historia
  var pol = $("#polaroids");
  var poses = [
    { r: -9, x: -48, y: -8 },
    { r: 7, x: 46, y: 6 },
    { r: -2, x: 0, y: 14 }
  ];
  pol.innerHTML = (B.fotos.historia || []).map(function (src, i) {
    var h = B.historia[i] || {};
    var p = poses[i % poses.length];
    return '<figure class="polaroid" style="--r:' + p.r + "deg;--x:" + p.x + "px;--y:" + p.y + 'px;transform:translate(-50%,-50%) translate(var(--x),var(--y)) rotate(var(--r))">' +
      '<img src="' + foto(src) + '" alt="" loading="lazy"><span>' + esc(h.anio || "") + "</span></figure>";
  }).join("");
  $("#storyList").innerHTML = (B.historia || []).map(function (h) {
    return "<li><b>" + esc(h.anio) + "</b><div><h4>" + esc(h.titulo) + "</h4><p>" + esc(h.texto) + "</p></div></li>";
  }).join("");

  // Eventos
  var icons = [
    '<svg viewBox="0 0 32 32"><path d="M16 3v6M13 6h6M8 29V16l8-6 8 6v13M4 29h24M13 29v-6a3 3 0 0 1 6 0v6"/></svg>',
    '<svg viewBox="0 0 32 32"><path d="M10 4h12l-1 9a5 5 0 0 1-10 0z"/><path d="M16 18v9M11 28h10M10.5 9h11"/></svg>'
  ];
  $("#events").innerHTML = (B.eventos || []).map(function (e, i) {
    return '<article class="event">' +
      '<div class="event__icon">' + icons[i % icons.length] + "</div>" +
      "<h4>" + esc(e.tipo) + "</h4>" +
      '<p class="event__place">' + esc(e.lugar) + "</p>" +
      '<p class="event__addr">' + esc(e.direccion) + "</p>" +
      '<p class="event__time">' + esc(e.hora) + "<small>HRS</small></p>" +
      '<a class="btn btn--solid" href="' + esc(e.mapa) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>Cómo llegar</a>' +
      "</article>";
  }).join("");

  // Itinerario
  $("#timeline").insertAdjacentHTML("beforeend", (B.itinerario || []).map(function (t) {
    return '<div class="titem"><span class="titem__time">' + esc(t.hora) + '</span><span class="titem__dot"></span><span class="titem__name">' + esc(t.titulo) + "</span></div>";
  }).join(""));

  // Vestimenta
  var v = B.vestimenta || {};
  $$("[data-vest-titulo]").forEach(function (e) { e.textContent = v.titulo || ""; });
  $$("[data-vest-detalle]").forEach(function (e) { e.textContent = v.detalle || ""; });
  $$("[data-vest-nota]").forEach(function (e) { e.textContent = v.nota || ""; });
  $("#swatches").innerHTML = (v.paleta || []).map(function (c) { return '<span style="background:' + esc(c) + '"></span>'; }).join("");

  // Regalos
  $("#gifts").innerHTML = (B.regalos || []).map(function (g, i) {
    var action = g.copiar
      ? '<button class="btn btn--line" data-copy="' + esc(g.copiar) + '">' + esc(g.boton || "Copiar") + "</button>"
      : '<a class="btn btn--line" href="' + esc(g.enlace) + '" target="_blank" rel="noopener">' + esc(g.boton || "Ver") + "</a>";
    return '<div class="gift"><h4>' + esc(g.titulo) + "</h4><p>" + esc(g.texto) + "</p>" + (g.copiar ? "<code>" + esc(g.copiar) + "</code>" : "") + action + "</div>";
  }).join("");

  /* ---------- Toast ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2400);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var txt = b.getAttribute("data-copy");
    var done = function () { toast("Copiado al portapapeles"); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
    else { fallbackCopy(txt); done(); }
  });
  function fallbackCopy(t) {
    var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); } catch (err) { /* sin soporte */ }
    ta.remove();
  }

  /* ---------- Cuenta regresiva con tarjetas 3D ---------- */
  var cards = {};
  $$(".cd__card").forEach(function (c) { cards[c.getAttribute("data-unit")] = { el: c, val: null }; });
  function setCard(unit, value) {
    var c = cards[unit]; if (!c) return;
    var str = unit === "d" ? String(value).padStart(2, "0") : pad(value);
    if (c.val === str) return;
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
  function tick() {
    var diff = Math.max(0, fecha - new Date());
    var s = Math.floor(diff / 1000);
    setCard("d", Math.floor(s / 86400));
    setCard("h", Math.floor(s / 3600) % 24);
    setCard("m", Math.floor(s / 60) % 60);
    setCard("s", s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Agregar al calendario (.ics) ---------- */
  $("#addCal").addEventListener("click", function () {
    var start = fecha;
    var end = new Date(start.getTime() + 8 * 3600 * 1000);
    var f = function (d) {
      return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
    };
    var ev = (B.eventos || [])[0] || {};
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//ES", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@invitacion",
      "DTSTAMP:" + f(new Date()),
      "DTSTART:" + f(start), "DTEND:" + f(end),
      "SUMMARY:Boda de " + B.novio + " y " + B.novia,
      "LOCATION:" + (ev.lugar || "") + ", " + (ev.direccion || ""),
      "DESCRIPTION:" + (B.hashtag || ""),
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "boda-" + (B.novio + "-" + B.novia).toLowerCase().replace(/\s+/g, "-") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- Galeria coverflow 3D ---------- */
  var cf = $("#coverflow"), dotsEl = $("#dots");
  var gal = B.fotos.galeria || [];
  cf.innerHTML = gal.map(function (src) { return '<div class="cf-item"><img src="' + foto(src) + '" alt="" loading="lazy" draggable="false"></div>'; }).join("");
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
  cf.addEventListener("pointerdown", function (e) { dragging = true; startX = e.clientX; dragX = 0; cf.classList.add("is-dragging"); cf.setPointerCapture(e.pointerId); clearInterval(autoT); });
  cf.addEventListener("pointermove", function (e) { if (!dragging) return; dragX = e.clientX - startX; renderCF(dragX / 220); });
  function endCF() {
    if (!dragging) return;
    dragging = false; cf.classList.remove("is-dragging");
    var moved = Math.round(-dragX / 160);
    go(current + moved); auto();
  }
  cf.addEventListener("pointerup", endCF);
  cf.addEventListener("pointercancel", endCF);
  items.forEach(function (it, i) { it.addEventListener("click", function () { if (Math.abs(dragX) < 10 && i !== current) { go(i); auto(); } }); });
  renderCF(); auto();

  /* ---------- RSVP por WhatsApp ---------- */
  var sel = $("#personas");
  for (var i = 1; i <= pases; i++) sel.insertAdjacentHTML("beforeend", '<option value="' + i + '">' + i + (i === 1 ? " persona" : " personas") + "</option>");
  sel.value = String(pases);
  var form = $("#rsvpForm");
  if (invitado) form.nombre.value = invitado;
  $$('input[name="asiste"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      $("#fieldCount").style.display = form.asiste.value === "no" ? "none" : "";
    });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    if (!nombre) { $("#formError").textContent = "Escriban su nombre para confirmar."; form.nombre.focus(); return; }
    $("#formError").textContent = "";
    var si = form.asiste.value === "si";
    var msg = "Hola " + B.novio + " y " + B.novia + ".\n" +
      (si ? "Confirmamos nuestra asistencia a su boda.\nNombre: " + nombre + "\nPersonas: " + form.personas.value
          : "Lamentamos no poder acompañarlos en su boda.\nNombre: " + nombre) +
      (form.mensaje.value.trim() ? "\nMensaje: " + form.mensaje.value.trim() : "");
    window.open("https://wa.me/" + (B.whatsappRSVP || "") + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  /* ---------- Musica ---------- */
  var audio = $("#audio"), musicBtn = $("#music");
  var hasMusic = !!B.musica && !embed;
  if (hasMusic) {
    audio.src = ROOT + B.musica;
    musicBtn.addEventListener("click", function () {
      if (audio.paused) { audio.play(); musicBtn.classList.remove("is-paused"); musicBtn.setAttribute("aria-label", "Pausar música"); }
      else { audio.pause(); musicBtn.classList.add("is-paused"); musicBtn.setAttribute("aria-label", "Reproducir música"); }
    });
  }

  /* ---------- Apertura del sobre ---------- */
  var opened = false;
  var envelope = $("#envelope");
  function openEnvelope() {
    if (opened) return; opened = true;
    if (hasMusic) {
      audio.play().catch(function () { musicBtn.classList.add("is-paused"); });
      musicBtn.hidden = false;
    }
    if (!hasGSAP) { document.body.classList.remove("is-sealed"); $("#intro").style.display = "none"; return; }

    document.body.classList.add("is-opening");
    var tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(".seal", { scale: 1.18, duration: 0.25, ease: "power2.out" })
      .set(".seal__half", { opacity: 1 })
      .set(".seal svg", { opacity: 0 })
      .set(".seal", { background: "transparent", boxShadow: "none" })
      .to(".seal__half--l", { x: -46, y: 60, rotation: -50, opacity: 0, duration: 0.8, ease: "power2.in" })
      .to(".seal__half--r", { x: 46, y: 60, rotation: 50, opacity: 0, duration: 0.8, ease: "power2.in" }, "<")
      .to(".envelope__flap", { rotateX: 180, duration: 0.9 }, "-=.55")
      .set(".envelope__flap", { zIndex: 0 })
      .to(".envelope__letter", { yPercent: -62, duration: 0.9, ease: "power3.out" }, "-=.1")
      .to(".intro__top, .intro__hint, .intro__guest", { opacity: 0, y: -20, duration: 0.6, stagger: 0.05 }, "<")
      .to(".envelope", { scale: 1.12, duration: 0.8 }, "-=.4")
      .add(function () { document.body.classList.remove("is-sealed"); window.scrollTo(0, 0); revealContent(); })
      .to("#intro", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
      .set("#intro", { display: "none" });
  }
  envelope.addEventListener("click", openEnvelope);
  if (embed) setTimeout(openEnvelope, 3200);

  /* ---------- Animaciones de scroll ---------- */
  function revealContent() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(".cover__media img", { scale: 1.25 }, { scale: 1, duration: 2.2, ease: "expo.out" });
    gsap.from(".cover__text > *", { y: 40, opacity: 0, duration: 1.4, stagger: 0.12, ease: "expo.out", delay: 0.3 });
    if (reduceMotion) return;

    gsap.to(".cover__media img", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: true } });

    $$(".block > .caps, .block > .title, .block > .lead, .quote__text, .ornament, .parents, .countdown-block .btn, .dress__text, .swatches, .dress__note, .dress__icons").forEach(function (el) {
      gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    gsap.from(".cd", { rotateX: -90, opacity: 0, transformPerspective: 600, transformOrigin: "50% 0", duration: 1.1, stagger: 0.1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".countdown", start: "top 88%" } });

    // Polaroids caen y se acomodan en 3D
    $$(".polaroid").forEach(function (p, i) {
      gsap.from(p, {
        y: -260, rotateX: 70, rotateZ: (i % 2 ? 25 : -25), opacity: 0, duration: 1.4, delay: i * 0.18, ease: "expo.out",
        scrollTrigger: { trigger: ".polaroids", start: "top 80%" }
      });
    });
    gsap.from(".story__list li", { x: -30, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".story__list", start: "top 85%" } });

    // Tarjetas de eventos giran al entrar
    $$(".event").forEach(function (e) {
      gsap.from(e, { rotateY: -70, opacity: 0, transformOrigin: "0 50%", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 85%" } });
    });

    // Linea del itinerario se dibuja
    gsap.fromTo(".timeline__line i", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });
    $$(".titem").forEach(function (t) {
      gsap.from(t.children, { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 82%" } });
    });

    gsap.from(".coverflow", { opacity: 0, rotateX: 25, y: 60, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".coverflow", start: "top 85%" } });
    gsap.from(".gift", { y: 50, opacity: 0, rotateX: -20, transformPerspective: 800, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".gifts__list", start: "top 85%" } });
    gsap.from(".form > *", { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 85%" } });
    gsap.from(".end > *", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".end", start: "top 88%" } });
    ScrollTrigger.refresh();
  }

  // Entrada del sobre
  if (hasGSAP && !reduceMotion) {
    gsap.from(".monogram__wreath path", { strokeDasharray: 300, strokeDashoffset: 300, duration: 2.2, ease: "power2.out", stagger: 0.04 });
    gsap.from(".monogram__letters b", { opacity: 0, y: 12, duration: 1.2, stagger: 0.2, delay: 0.4, ease: "expo.out" });
    gsap.from(".intro__names, .intro__top .caps", { opacity: 0, y: 20, duration: 1.2, stagger: 0.12, delay: 0.6, ease: "expo.out" });
    gsap.from(".envelope-wrap", { opacity: 0, y: 60, rotateX: 40, duration: 1.6, delay: 0.5, ease: "expo.out" });
    gsap.from(".intro__guest > *", { opacity: 0, y: 20, duration: 1, stagger: 0.12, delay: 0.9, ease: "expo.out" });
  }
})();
