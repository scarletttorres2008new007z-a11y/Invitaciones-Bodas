/* =========================================================================
   Nupcia | Landing
   GSAP + ScrollTrigger para animaciones, Lenis para scroll suave.
   Todo degrada con elegancia: si las librerias no cargan, el contenido
   sigue visible y funcional.
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

  /* ---------- Datos desde config.js ---------- */
  function waLink(text) {
    return "https://wa.me/" + (SITE.whatsapp || "") + "?text=" + encodeURIComponent(text || "");
  }
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-brand]").forEach(function (el) { el.textContent = SITE.marca || el.textContent; });
  $$("[data-brand-text]").forEach(function (el) { el.textContent = SITE.marca || el.textContent; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$("[data-mail]").forEach(function (el) { el.href = "mailto:" + (SITE.correo || ""); });
  $$("[data-ig]").forEach(function (el) { el.href = SITE.instagram || "#"; });
  if (BODA.iniciales) $$("[data-initials]").forEach(function (el) { el.textContent = BODA.iniciales.join(" "); });

  var heroDays = $("[data-hero-days]");
  if (heroDays && BODA.fecha) {
    var d = Math.max(0, Math.ceil((new Date(BODA.fecha) - new Date()) / 864e5));
    heroDays.textContent = d;
  }

  /* ---------- Planes ---------- */
  var plansEl = $("#plans");
  if (plansEl && SITE.planes) {
    var fmt = new Intl.NumberFormat("es-MX");
    plansEl.innerHTML = SITE.planes.map(function (p) {
      return '<article class="plan tilt reveal-card' + (p.destacado ? " plan--featured" : "") + '">' +
        (p.destacado ? '<span class="plan__tag">Más elegido</span>' : "") +
        "<h3>" + p.nombre + "</h3>" +
        '<p class="plan__desc">' + p.descripcion + "</p>" +
        '<div class="plan__price"><sup>$</sup>' + fmt.format(p.precio) + "<small>" + (SITE.moneda || "") + "</small></div>" +
        "<ul>" + p.incluye.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
        '<a class="btn btn--dark" target="_blank" rel="noopener" href="' +
        waLink("Hola, me interesa el plan " + p.nombre + " de invitación digital.") + '">Elegir ' + p.nombre + "</a>" +
        "</article>";
    }).join("");
  }

  /* ---------- Carrusel 3D de disenos ---------- */
  var THEMES = [
    { id: "olivo", nombre: "Olivo", bg: "#F4EFE6", ink: "#2B2A26", accent: "#53532F", env: "#E9E1CF", flap: "#DDD3BD", seal: "#7A2E2E" },
    { id: "noir", nombre: "Noir", bg: "#1C1B19", ink: "#EDE6D8", accent: "#C9B88F", env: "#2C2A26", flap: "#3A3731", seal: "#8E7A4E" },
    { id: "terracota", nombre: "Terracota", bg: "#F1E4D8", ink: "#3A2A22", accent: "#A4502F", env: "#E6D2C0", flap: "#D9BFA7", seal: "#A4502F" },
    { id: "medianoche", nombre: "Medianoche", bg: "#1E2838", ink: "#E9E6DF", accent: "#CBB98F", env: "#2A3547", flap: "#364359", seal: "#8A2F35" },
    { id: "rubor", nombre: "Rubor", bg: "#F3E6E3", ink: "#3B2C2C", accent: "#9C5B5B", env: "#EAD6D1", flap: "#DDC1BA", seal: "#9C5B5B" }
  ];
  var track = $("#ringTrack");
  var ring = $("#ring");
  var label = $("#ringLabel");
  if (track) {
    var names = (BODA.novio || "Él") + "<small>&amp;</small>" + (BODA.novia || "Ella");
    var ini = (BODA.iniciales || ["A", "B"]).join("");
    track.innerHTML = THEMES.map(function (t) {
      return '<div class="card3d" style="--c-bg:' + t.bg + ";--c-ink:" + t.ink + ";--c-accent:" + t.accent +
        ";--c-env:" + t.env + ";--c-flap:" + t.flap + ";--c-seal:" + t.seal + '">' +
        '<span class="card3d__name">' + t.nombre + "</span>" +
        '<div class="card3d__mono">' + ini + "</div>" +
        '<div class="card3d__names">' + names + "</div>" +
        '<div class="card3d__env"></div>' +
        '<span class="card3d__date">' + (BODA.fechaTexto || "").replace(/^\S+\s/, "") + "</span>" +
        '<a class="card3d__link" target="_blank" rel="noopener" href="invitacion/index.html?tema=' + t.id + '">Ver demo</a>' +
        "</div>";
    }).join("");

    var cards = $$(".card3d", track);
    var step = 360 / cards.length;
    var radius = 0;
    var angle = 0, target = 0, velocity = 0;
    var dragging = false, lastX = 0, autoplay = true, idleTimer;

    function layout() {
      var w = track.offsetWidth;
      radius = Math.round((w / 2) / Math.tan(Math.PI / cards.length)) + 60;
      cards.forEach(function (c, i) {
        c.style.transform = "rotateY(" + (i * step) + "deg) translateZ(" + radius + "px)";
      });
    }
    function activeIndex() {
      var i = Math.round(-angle / step) % cards.length;
      return (i + cards.length) % cards.length;
    }
    function render() {
      track.style.transform = "translateZ(" + (-radius) + "px) rotateY(" + angle + "deg)";
      var a = activeIndex();
      cards.forEach(function (c, i) {
        var rel = ((i * step + angle) % 360 + 360) % 360;
        c.classList.toggle("is-back", rel > 60 && rel < 300);
        c.style.pointerEvents = i === a ? "auto" : "none";
      });
      if (label) label.textContent = THEMES[a].nombre;
    }
    function tick() {
      if (!dragging) angle += (target - angle) * 0.08;
      render();
      requestAnimationFrame(tick);
    }
    function pauseAuto() {
      autoplay = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { autoplay = true; }, 5000);
    }
    function snap() { target = Math.round(target / step) * step; }

    ring.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".card3d__link")) return;
      dragging = true; lastX = e.clientX; velocity = 0;
      ring.classList.add("is-dragging");
      ring.setPointerCapture(e.pointerId);
      pauseAuto();
    });
    ring.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      velocity = dx * 0.35;
      angle += velocity; target = angle;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false; ring.classList.remove("is-dragging");
      target = angle + velocity * 6; snap();
    }
    ring.addEventListener("pointerup", endDrag);
    ring.addEventListener("pointercancel", endDrag);
    $("#ringPrev").addEventListener("click", function () { pauseAuto(); target = Math.round(target / step) * step + step; });
    $("#ringNext").addEventListener("click", function () { pauseAuto(); target = Math.round(target / step) * step - step; });
    window.addEventListener("resize", layout);
    setInterval(function () { if (autoplay && !dragging && !reduceMotion) target = Math.round(target / step) * step - step; }, 3600);
    layout(); render(); requestAnimationFrame(tick);
  }

  /* ---------- Inclinacion 3D con el mouse ---------- */
  function tilt(el, max) {
    if (!finePointer || reduceMotion) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "rotateX(" + (-y * max) + "deg) rotateY(" + (x * max) + "deg)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  }
  $$(".tilt").forEach(function (el) { tilt(el, 10); });
  $$(".tilt-soft").forEach(function (el) { tilt(el, 4); });

  // Escenario del hero: el telefono sigue al mouse en toda la pantalla.
  var stage = $(".stage__inner");
  if (stage) {
    var rx = 4, ry = -14, trx = 4, try_ = -14;
    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", function (e) {
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        try_ = -14 + x * 22;
        trx = 4 - y * 14;
      });
    }
    (function loop() {
      rx += (trx - rx) * 0.06; ry += (try_ - ry) * 0.06;
      stage.style.setProperty("--rx", rx.toFixed(2) + "deg");
      stage.style.setProperty("--ry", ry.toFixed(2) + "deg");
      requestAnimationFrame(loop);
    })();
    $$(".chip", stage).forEach(function (c) {
      c.style.transform = "translateZ(" + (c.getAttribute("data-depth") || 50) + "px)";
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
    a.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Nav al hacer scroll ---------- */
  var nav = $("#nav"), lastY = 0;
  function onScroll(y) {
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 500 && !document.body.classList.contains("menu-open"));
    lastY = y;
  }

  /* ---------- FAQ con animacion de altura ---------- */
  $$(".qa").forEach(function (d) {
    var s = $("summary", d), body = $(".qa__body", d);
    s.addEventListener("click", function (e) {
      if (!hasGSAP) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: 0.5, ease: "power3.inOut", onComplete: function () { d.open = false; body.style.height = ""; } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: "auto", duration: 0.6, ease: "power3.out" });
      }
    });
  });

  /* ---------- Division de titulos en palabras ---------- */
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
            if (wrapEm) { var em = document.createElement("em"); em.appendChild(i); w.appendChild(em); }
            else w.appendChild(i);
            out.push(w);
          });
        } else if (n.nodeType === 1) {
          walk(n, n.tagName === "EM");
        }
      });
    })(el, false);
    el.innerHTML = "";
    out.forEach(function (n) { el.appendChild(n); });
  }

  /* ---------- Arranque ---------- */
  var loader = $(".loader");
  function hideLoader(cb) {
    if (!hasGSAP || reduceMotion) { loader.classList.add("is-done"); document.body.classList.remove("is-loading"); cb && cb(); return; }
    gsap.timeline({ onComplete: function () { loader.classList.add("is-done"); document.body.classList.remove("is-loading"); } })
      .to(".loader__mark", { scale: 0.6, opacity: 0, duration: 0.5, ease: "power3.in" })
      .to(loader, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=.1")
      .add(function () { cb && cb(); }, "-=.55");
  }

  if (!hasGSAP) {
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
    window.addEventListener("load", function () { hideLoader(); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("is-loading");

  // Scroll suave
  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = $(id); if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -60, duration: 1.4 });
      });
    });
  } else {
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
  }

  $$(".split").forEach(splitWords);

  // Estados iniciales (solo con JS, para que sin JS todo sea visible)
  gsap.set(".split .w > span", { yPercent: 110 });
  gsap.set(".reveal", { y: 28, opacity: 0 });
  gsap.set(".reveal-card", { y: 60, opacity: 0, rotateX: -12, transformPerspective: 900, transformOrigin: "50% 100%" });
  gsap.set(".hero__stage", { opacity: 0, y: 60, scale: 0.94 });

  function intro() {
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".hero .split .w > span", { yPercent: 0, duration: 1.4, stagger: 0.05 })
      .to(".hero .reveal", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, "-=1.1")
      .to(".hero__stage", { opacity: 1, y: 0, scale: 1, duration: 1.8 }, "-=1.4")
      .from(".chip", { opacity: 0, scale: 0.6, duration: 1, stagger: 0.12, ease: "back.out(1.6)" }, "-=1.2");

    // Flotacion de las tarjetas alrededor del telefono
    $$(".chip").forEach(function (c, i) {
      gsap.to(c, { y: i % 2 ? 14 : -14, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
    });
  }

  function scrollAnimations() {
    $$(".split").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.to($$(".w > span", el), {
        yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
    $$(".reveal").forEach(function (el) {
      if (el.closest(".hero")) return;
      gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    ScrollTrigger.batch(".reveal-card", {
      start: "top 90%",
      onEnter: function (els) {
        gsap.to(els, { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, clearProps: "transform",
          onComplete: function () { els.forEach(function (e) { e.classList.add("is-in"); }); } });
      }
    });

    // El telefono se inclina y aleja al hacer scroll fuera del hero
    gsap.to(".stage__scroll", {
      yPercent: 14, rotateX: 18, scale: 0.92, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero__copy", {
      yPercent: -10, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Marquesina acelera con el scroll
    gsap.fromTo(".marquee", { rotate: -1.5 }, {
      rotate: 1.5, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true }
    });

    // El carrusel entra girando
    gsap.from("#ring", {
      rotateX: 30, opacity: 0, y: 80, duration: 1.6, ease: "expo.out",
      scrollTrigger: { trigger: "#ring", start: "top 85%" }
    });

    // Numeros de pasos
    $$(".step__num").forEach(function (n) {
      gsap.from(n, { rotateY: 90, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 88%" } });
    });

    // Sello del CTA gira con el scroll
    gsap.fromTo(".cta__seal", { rotate: -40 }, {
      rotate: 20, ease: "none",
      scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  // Seguridad: si la carga tarda demasiado (por ejemplo el iframe), arrancar igual.
  var started = false;
  setTimeout(start, 2500);
  function start() {
    if (started) return; started = true;
    hideLoader(intro);
    scrollAnimations();
  }
})();
