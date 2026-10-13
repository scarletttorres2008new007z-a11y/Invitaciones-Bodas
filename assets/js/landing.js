/* =========================================================================
   Nupcia | Landing v2
   GSAP + ScrollTrigger para animaciones, Lenis para scroll suave.
   Si las librerias no cargan, el contenido sigue visible y funcional.
   ========================================================================= */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var BODA = window.BODA || {};
  var hasGSAP = typeof window.gsap !== "undefined";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad = function (n, l) { return String(n).padStart(l || 2, "0"); };
  var fmt = new Intl.NumberFormat("es-MX");

  var THEMES = [
    { id: "olivo", nombre: "Olivo", bg: "#F4EFE6", ink: "#2B2A26", accent: "#53532F", env: "#E9E1CF", flap: "#DDD3BD", seal: "#7A2E2E" },
    { id: "noir", nombre: "Noir", bg: "#1C1B19", ink: "#EDE6D8", accent: "#C9B88F", env: "#2C2A26", flap: "#3A3731", seal: "#8E7A4E" },
    { id: "terracota", nombre: "Terracota", bg: "#F1E4D8", ink: "#3A2A22", accent: "#A4502F", env: "#E6D2C0", flap: "#D9BFA7", seal: "#8A3B20" },
    { id: "medianoche", nombre: "Medianoche", bg: "#1E2838", ink: "#E9E6DF", accent: "#CBB98F", env: "#2A3547", flap: "#364359", seal: "#8A2F35" },
    { id: "rubor", nombre: "Rubor", bg: "#F3E6E3", ink: "#3B2C2C", accent: "#9C5B5B", env: "#EAD6D1", flap: "#DDC1BA", seal: "#8A4646" }
  ];

  /* ---------- Datos desde config.js ---------- */
  function waLink(text) { return "https://wa.me/" + (SITE.whatsapp || "") + "?text=" + encodeURIComponent(text || ""); }
  $$("[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-brand]").forEach(function (el) { el.textContent = SITE.marca || el.textContent; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$("[data-mail]").forEach(function (el) { el.href = "mailto:" + (SITE.correo || ""); });
  $$("[data-ig]").forEach(function (el) { el.href = SITE.instagram || "#"; });
  $$("[data-novio]").forEach(function (el) { el.textContent = BODA.novio || el.textContent; });
  $$("[data-novia]").forEach(function (el) { el.textContent = BODA.novia || el.textContent; });
  if (BODA.iniciales) $$("[data-initials]").forEach(function (el) { el.textContent = BODA.iniciales.join(" "); });

  /* ---------- Planes y extras ---------- */
  var plansEl = $("#plans");
  if (plansEl && SITE.planes) {
    var labels = ["Para empezar", "La experiencia completa", "Hecho a la medida"];
    plansEl.innerHTML = SITE.planes.map(function (p, i) {
      return '<article class="plan tilt reveal-card' + (p.destacado ? " plan--featured" : "") + '">' +
        (p.destacado ? '<span class="plan__tag">Más elegido</span>' : "") +
        '<span class="plan__k">' + (labels[i] || "") + "</span>" +
        "<h3>" + p.nombre + "</h3>" +
        '<p class="plan__desc">' + p.descripcion + "</p>" +
        '<div class="plan__price"><sup>$</sup><span data-price="' + p.precio + '">' + fmt.format(p.precio) + "</span><small>" + (SITE.moneda || "") + "</small></div>" +
        "<ul>" + p.incluye.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        '<a class="btn btn--dark magnetic" target="_blank" rel="noopener" href="' +
        waLink("Hola, me interesa el plan " + p.nombre + " de invitación digital.") + '"><span>Elegir ' + p.nombre + '</span><svg><use href="#arrow"/></svg></a>' +
        "</article>";
    }).join("");
  }
  var addonsEl = $("#addons");
  if (addonsEl && SITE.extras) {
    addonsEl.innerHTML = SITE.extras.map(function (e) { return "<li>" + e.nombre + "<b>+$" + fmt.format(e.precio) + "</b></li>"; }).join("");
  }

  /* ---------- Demo en vivo (estudio) ---------- */
  var frame = $("#demoFrame");
  var stName = $("#stName"), stPases = $("#stPases"), stLink = $("#stLink"), stOpen = $("#stOpen");
  var studio = { n: "Familia Ortega", p: 4, tema: "olivo" };
  var themesEl = $("#stThemes");
  if (themesEl) {
    themesEl.innerHTML = THEMES.map(function (t, i) {
      return '<button type="button" class="swatch" role="radio" aria-checked="' + (i === 0) + '" data-tema="' + t.id + '" style="--a:' + t.bg + ";--b:" + t.accent + '"><i></i>' + t.nombre + "</button>";
    }).join("");
  }
  var reloadT;
  function studioUrl(embed) {
    var q = [];
    if (embed) q.push("embed=1");
    if (studio.n) q.push("n=" + encodeURIComponent(studio.n));
    q.push("p=" + studio.p);
    if (studio.tema !== "olivo") q.push("tema=" + studio.tema);
    return "invitacion/index.html?" + q.join("&");
  }
  function updateStudio(reload) {
    stPases.textContent = studio.p;
    $("#noteName").textContent = studio.n || "Invitado";
    $("#notePases").textContent = studio.p;
    stLink.textContent = studioUrl(false);
    stOpen.href = studioUrl(false);
    if (reload) {
      clearTimeout(reloadT);
      reloadT = setTimeout(function () { frame.src = studioUrl(true); }, 450);
    }
  }
  if (frame) {
    stName.addEventListener("input", function () { studio.n = stName.value.trim(); updateStudio(true); });
    $$("[data-step]").forEach(function (b) {
      b.addEventListener("click", function () {
        studio.p = Math.max(1, Math.min(12, studio.p + (+b.getAttribute("data-step"))));
        updateStudio(true);
      });
    });
    $$(".swatch", themesEl).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".swatch", themesEl).forEach(function (o) { o.setAttribute("aria-checked", "false"); });
        b.setAttribute("aria-checked", "true");
        studio.tema = b.getAttribute("data-tema");
        updateStudio(true);
      });
    });
    $("#studio").addEventListener("submit", function (e) { e.preventDefault(); });
    updateStudio(false);
  }
  // Reloj del telefono
  var clockEl = $("[data-clock]");
  function setClock() { var d = new Date(); if (clockEl) clockEl.textContent = d.getHours() + ":" + pad(d.getMinutes()); }
  setClock(); setInterval(setClock, 30000);

  /* ---------- Bento: sobre, cuenta regresiva, calendario, paletas ---------- */
  var miniEnv = $("#miniEnv");
  if (miniEnv) miniEnv.addEventListener("click", function () { miniEnv.classList.toggle("is-open"); });

  var target = new Date(BODA.fecha || Date.now());
  var mcEls = {};
  $$("#miniCount b").forEach(function (b) { mcEls[b.getAttribute("data-u")] = b; });
  function setMini(u, v) {
    var el = mcEls[u]; if (!el || el.textContent === v) return;
    el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
  }
  function tickMini() {
    var s = Math.max(0, Math.floor((target - new Date()) / 1000));
    setMini("d", pad(Math.floor(s / 86400), 3)); setMini("h", pad(Math.floor(s / 3600) % 24));
    setMini("m", pad(Math.floor(s / 60) % 60)); setMini("s", pad(s % 60));
  }
  tickMini(); setInterval(tickMini, 1000);

  var cal = $("#miniCal");
  if (cal) {
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var first = new Date(target.getFullYear(), target.getMonth(), 1);
    var days = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    var offset = (first.getDay() + 6) % 7;
    var html = '<div class="mini-cal__head"><b>' + meses[target.getMonth()] + "</b><span>" + target.getFullYear() + '</span></div><div class="mini-cal__grid">';
    ["L", "M", "M", "J", "V", "S", "D"].forEach(function (d) { html += '<span class="dn">' + d + "</span>"; });
    for (var i = 0; i < offset; i++) html += "<span></span>";
    for (var d = 1; d <= days; d++) html += "<span" + (d === target.getDate() ? ' class="is-day"' : "") + ">" + d + "</span>";
    cal.innerHTML = html + "</div>";
  }

  var pals = $("#palettes");
  if (pals) {
    pals.innerHTML = THEMES.map(function (t) {
      return '<a class="pal" target="_blank" rel="noopener" href="invitacion/index.html?tema=' + t.id + '" data-cursor="Ver" style="--c1:' + t.bg + ";--c3:" + t.accent + '">' +
        '<div class="pal__top">' + (BODA.iniciales || ["A", "B"]).join("") + "</div>" +
        '<div class="pal__bars"><i style="background:' + t.accent + '"></i><i style="background:' + t.env + '"></i><i style="background:' + t.seal + '"></i><i style="background:' + t.ink + '"></i></div>' +
        "<p>" + t.nombre + "</p></a>";
    }).join("");
  }

  /* ---------- Carrusel 3D de disenos ---------- */
  var track = $("#ringTrack"), ring = $("#ring"), label = $("#ringLabel"), idxEl = $("#ringIdx");
  if (track) {
    var names = (BODA.novio || "Él") + "<small>y</small>" + (BODA.novia || "Ella");
    var ini = (BODA.iniciales || ["A", "B"]).join("");
    var dateTxt = (BODA.fechaTexto || "").replace(/^\S+\s/, "");
    track.innerHTML = THEMES.map(function (t) {
      return '<div class="card3d" style="--c-bg:' + t.bg + ";--c-ink:" + t.ink + ";--c-accent:" + t.accent +
        ";--c-env:" + t.env + ";--c-flap:" + t.flap + ";--c-seal:" + t.seal + '">' +
        '<div class="card3d__top"><span class="card3d__name">' + t.nombre + '</span><div class="card3d__mono">' + ini + "</div></div>" +
        '<div class="card3d__names">' + names + "</div>" +
        '<div class="card3d__env"></div>' +
        '<span class="card3d__date">' + dateTxt + "</span>" +
        '<a class="card3d__link" target="_blank" rel="noopener" data-cursor="Abrir" href="invitacion/index.html?tema=' + t.id + '">Ver demo</a></div>';
    }).join("");

    var cards = $$(".card3d", track), step = 360 / cards.length;
    var radius = 0, angle = 0, targetA = 0, velocity = 0, dragging = false, lastX = 0, autoplay = true, idleTimer;
    var layout = function () {
      radius = Math.round((track.offsetWidth / 2) / Math.tan(Math.PI / cards.length)) + 70;
      cards.forEach(function (c, i) { c.style.transform = "rotateY(" + (i * step) + "deg) translateZ(" + radius + "px)"; });
    };
    var activeIndex = function () { return ((Math.round(-angle / step) % cards.length) + cards.length) % cards.length; };
    var render = function () {
      track.style.transform = "translateZ(" + (-radius) + "px) rotateY(" + angle + "deg)";
      var a = activeIndex();
      cards.forEach(function (c, i) {
        var rel = ((i * step + angle) % 360 + 360) % 360;
        c.classList.toggle("is-back", rel > 50 && rel < 310);
        c.style.pointerEvents = i === a ? "auto" : "none";
      });
      label.textContent = THEMES[a].nombre; idxEl.textContent = pad(a + 1);
    };
    var tick = function () { if (!dragging) angle += (targetA - angle) * 0.07; render(); requestAnimationFrame(tick); };
    var pauseAuto = function () { autoplay = false; clearTimeout(idleTimer); idleTimer = setTimeout(function () { autoplay = true; }, 6000); };
    var snap = function () { targetA = Math.round(targetA / step) * step; };
    ring.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".card3d__link")) return;
      dragging = true; lastX = e.clientX; velocity = 0; ring.classList.add("is-dragging");
      ring.setPointerCapture(e.pointerId); pauseAuto();
    });
    ring.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX; velocity = dx * 0.3; angle += velocity; targetA = angle;
    });
    var endDrag = function () { if (!dragging) return; dragging = false; ring.classList.remove("is-dragging"); targetA = angle + velocity * 6; snap(); };
    ring.addEventListener("pointerup", endDrag);
    ring.addEventListener("pointercancel", endDrag);
    $("#ringPrev").addEventListener("click", function () { pauseAuto(); targetA = Math.round(targetA / step) * step + step; });
    $("#ringNext").addEventListener("click", function () { pauseAuto(); targetA = Math.round(targetA / step) * step - step; });
    setInterval(function () { if (autoplay && !dragging && !reduceMotion) targetA = Math.round(targetA / step) * step - step; }, 3800);
    window.addEventListener("resize", layout);
    layout(); render(); requestAnimationFrame(tick);
  }

  /* ---------- Inclinacion 3D ---------- */
  function tilt(el, max) {
    if (!finePointer || reduceMotion) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "rotateX(" + (-y * max) + "deg) rotateY(" + (x * max) + "deg)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  }

  // Telefono del demo sigue al mouse
  var phone = $("#phone"), stage = $("#demoStage");
  if (phone && finePointer && !reduceMotion) {
    var prx = 6, pry = -16, trx = 6, try_ = -16;
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      try_ = -16 + ((e.clientX - r.left) / r.width - 0.5) * 20;
      trx = 6 - ((e.clientY - r.top) / r.height - 0.5) * 10;
    });
    stage.addEventListener("pointerleave", function () { trx = 6; try_ = -16; });
    (function loop() {
      prx += (trx - prx) * 0.08; pry += (try_ - pry) * 0.08;
      phone.style.transform = "rotateY(" + pry.toFixed(2) + "deg) rotateX(" + prx.toFixed(2) + "deg)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Cursor y botones magneticos ---------- */
  var cursor = $(".cursor");
  if (finePointer && cursor && !reduceMotion) {
    var dot = $(".cursor__dot"), ringC = $(".cursor__ring"), ringLabel = $(".cursor__ring span");
    var cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
    window.addEventListener("pointermove", function (e) { cx = e.clientX; cy = e.clientY; dot.style.transform = "translate(" + cx + "px," + cy + "px)"; });
    (function loop() {
      rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16;
      ringC.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", function (e) {
      var lab = e.target.closest("[data-cursor]");
      var hov = e.target.closest("a, button, summary, input, .ring");
      cursor.classList.toggle("is-label", !!lab);
      cursor.classList.toggle("is-hover", !!hov && !lab);
      if (lab) ringLabel.textContent = lab.getAttribute("data-cursor");
      else if (e.target.closest(".ring")) { cursor.classList.add("is-label"); ringLabel.textContent = "Arrastrar"; }
    });
    $$("#demoFrame, .hero__visual").forEach(function (el) {
      el.addEventListener("pointerenter", function () { cursor.style.opacity = 0; });
      el.addEventListener("pointerleave", function () { cursor.style.opacity = 1; });
    });
  }
  function magnetic(el) {
    if (!finePointer || reduceMotion) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = "translate(" + x * 0.22 + "px," + y * 0.3 + "px)";
    });
    el.addEventListener("pointerleave", function () {
      el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
      el.style.transform = "";
      setTimeout(function () { el.style.transition = ""; }, 600);
    });
  }

  /* ---------- Menu movil ---------- */
  var burger = $(".nav__burger");
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
    $(".menu").setAttribute("aria-hidden", !open);
  });
  $$(".menu a").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- Nav y progreso ---------- */
  var nav = $("#nav"), lastY = 0, prog = $(".progress i");
  var sections = $$(".nav__links a").map(function (a) { return { a: a, el: $(a.getAttribute("href")) }; });
  function onScroll(y) {
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 600 && !document.body.classList.contains("menu-open"));
    lastY = y;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    var mid = y + innerHeight * 0.4;
    sections.forEach(function (s) {
      if (!s.el) return;
      var top = s.el.offsetTop, bottom = top + s.el.offsetHeight;
      s.a.classList.toggle("is-active", mid >= top && mid < bottom);
    });
  }

  /* ---------- FAQ ---------- */
  $$(".qa").forEach(function (d) {
    var s = $("summary", d), body = $(".qa__body", d);
    s.addEventListener("click", function (e) {
      if (!hasGSAP) return;
      e.preventDefault();
      if (d.open) gsap.to(body, { height: 0, duration: 0.5, ease: "power3.inOut", onComplete: function () { d.open = false; body.style.height = ""; } });
      else { d.open = true; gsap.fromTo(body, { height: 0 }, { height: "auto", duration: 0.6, ease: "power3.out" }); }
    });
  });

  /* ---------- Division de texto ---------- */
  function splitWords(el) {
    var out = [];
    (function walk(node, wrapEm) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { out.push(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = part;
            if (wrapEm) { var em = document.createElement("em"); em.appendChild(i); w.appendChild(em); } else w.appendChild(i);
            out.push(w);
          });
        } else if (n.nodeType === 1) walk(n, n.tagName === "EM");
      });
    })(el, false);
    el.innerHTML = ""; out.forEach(function (n) { el.appendChild(n); });
  }
  var manifesto = $("#manifesto");
  if (manifesto) {
    manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map(function (w) { return '<span class="mw">' + w + "</span>"; }).join(" ");
  }

  /* ---------- Loader ---------- */
  var loader = $(".loader");
  function runLoader(done) {
    var countEl = $(".loader__count b");
    if (!hasGSAP || reduceMotion) { loader.classList.add("is-done"); document.body.classList.remove("is-loading"); done(); return; }
    var o = { v: 0 };
    gsap.timeline({ onComplete: function () { loader.classList.add("is-done"); document.body.classList.remove("is-loading"); } })
      .to(".loader__ring circle", { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(o, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: function () { countEl.textContent = Math.round(o.v); } }, 0)
      .to(".loader__seal span", { scale: 1.15, duration: 0.25, ease: "power2.out" })
      .to(".loader__seal, .loader__count, .loader__word", { opacity: 0, y: -20, duration: 0.5, stagger: 0.05, ease: "power3.in" })
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=.15")
      .add(done, "-=.6");
  }

  $$(".tilt").forEach(function (el) { tilt(el, 8); });
  $$(".magnetic").forEach(magnetic);

  if (!hasGSAP) {
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
    $$(".manifesto__text .mw").forEach(function (w) { w.style.opacity = 1; });
    runLoader(function () { if (window.Hero3D) window.Hero3D.start(); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href"); if (id.length < 2) return;
        var t = $(id); if (!t) return;
        e.preventDefault(); lenis.scrollTo(t, { offset: id === "#inicio" ? -200 : -40, duration: 1.6 });
      });
    });
  } else {
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
  }

  $$(".split").forEach(splitWords);
  gsap.set(".split .w > span", { yPercent: 115 });
  gsap.set(".reveal", { y: 30, opacity: 0 });
  gsap.set(".reveal-card", { y: 70, opacity: 0, rotateX: -14, transformPerspective: 900, transformOrigin: "50% 100%" });
  gsap.set(".hero__visual", { opacity: 0, scale: 0.92 });

  function intro() {
    if (window.Hero3D) window.Hero3D.start();
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".hero .split .w > span", { yPercent: 0, duration: 1.5, stagger: 0.045 })
      .to(".hero .reveal", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, "-=1.2")
      .to(".hero__visual", { opacity: 1, scale: 1, duration: 2 }, "-=1.6")
      .from(".hero__tag", { opacity: 0, x: 20, duration: 1, stagger: 0.15 }, "-=1")
      .from(".nav", { yPercent: -100, duration: 1.2, clearProps: "transform" }, 0.2);
    $$("[data-count]").forEach(function (el) {
      var o = { v: 0 };
      tl.to(o, { v: +el.getAttribute("data-count"), duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } }, 0.8);
    });
  }

  function scrollAnimations() {
    $$(".split").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.to($$(".w > span", el), { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: el, start: "top 86%" } });
    });
    $$(".reveal").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    ScrollTrigger.batch(".reveal-card", {
      start: "top 90%",
      onEnter: function (els) {
        gsap.to(els, { y: 0, opacity: 1, rotateX: 0, duration: 1.3, ease: "expo.out", stagger: 0.09, clearProps: "transform" });
      }
    });

    // Manifiesto: las palabras se encienden con el scroll
    gsap.to(".manifesto__text .mw", {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ".manifesto__text", start: "top 75%", end: "bottom 45%", scrub: true }
    });
    gsap.from(".manifesto__sprig", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".manifesto__sign", start: "top 90%" } });

    gsap.to(".hero__copy", { yPercent: -12, opacity: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.fromTo(".marquee", { rotate: -1.4 }, { rotate: 1.4, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true } });

    // Telefono del demo entra girando
    gsap.from(".demo__phone-wrap", { rotateY: 50, rotateX: 20, y: 120, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: "#demo", start: "top 70%" } });

    // Scroll horizontal fijado (escritorio)
    var mm = gsap.matchMedia();
    mm.add("(min-width: 981px)", function () {
      var tr = $("#hTrack");
      var dist = function () { return tr.scrollWidth - innerWidth; };
      gsap.to(tr, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: ".hscroll", start: "top top", end: function () { return "+=" + dist(); },
          scrub: 1, pin: ".hscroll__pin", invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) { $(".hscroll__bar i").style.transform = "scaleX(" + self.progress + ")"; }
        }
      });
    });
    gsap.from(".hcard", { y: 80, opacity: 0, rotateY: -20, duration: 1.2, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".hscroll", start: "top 70%" } });

    // Gauge
    gsap.to(".gauge__fg", { strokeDashoffset: 30, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: ".gauge", start: "top 90%" } });

    gsap.from("#ring", { rotateX: 30, opacity: 0, y: 90, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: "#ring", start: "top 85%" } });

    // Linea del proceso
    gsap.to(".steps__line i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#steps", start: "top 65%", end: "bottom 65%", scrub: true } });
    $$(".step").forEach(function (s) {
      ScrollTrigger.create({ trigger: s, start: "top 65%", onEnter: function () { s.classList.add("is-on"); }, onLeaveBack: function () { s.classList.remove("is-on"); } });
      gsap.from($(".step__num", s), { rotateY: 90, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%" } });
      gsap.from($("div", s), { x: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%" } });
    });

    // Precios cuentan hacia arriba
    $$("[data-price]").forEach(function (el) {
      var o = { v: 0 }, to = +el.getAttribute("data-price");
      gsap.to(o, { v: to, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: function () { el.textContent = fmt.format(Math.round(o.v)); } });
    });

    gsap.fromTo(".cta__seal", { rotate: -30, scale: 0.85 }, { rotate: 15, scale: 1, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".footer__word", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });
  }

  var started = false;
  function start() {
    if (started) return; started = true;
    scrollAnimations();
    runLoader(intro);
  }
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  setTimeout(start, 3000);
})();
