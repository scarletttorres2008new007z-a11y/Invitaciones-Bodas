/* Tarjeta PDF: lee config.js y arma el enlace personalizado a la invitacion.
   Parametros de URL opcionales: ?n=Familia%20Perez&p=4&tema=noir */
(function () {
  "use strict";
  var B = window.BODA || {}, SITE = window.SITE || {};
  var params = new URLSearchParams(location.search);
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var fecha = new Date(B.fecha);

  $$("[data-novio]").forEach(function (e) { e.textContent = B.novio; });
  $$("[data-novia]").forEach(function (e) { e.textContent = B.novia; });
  $$("[data-ini]").forEach(function (e) { e.textContent = (B.iniciales || [])[+e.getAttribute("data-ini")] || ""; });
  $$("[data-fecha-corta]").forEach(function (e) { e.textContent = pad(fecha.getDate()) + " . " + pad(fecha.getMonth() + 1) + " . " + fecha.getFullYear(); });
  document.title = "Tarjeta | " + B.novio + " & " + B.novia;

  var fName = $("#fName"), fPases = $("#fPases"), fTema = $("#fTema"), link = $("#fLink"), env = $("#envLink");
  fName.value = params.get("n") || "";
  fPases.value = parseInt(params.get("p"), 10) || B.pasesPorDefecto || 2;
  fTema.value = params.get("tema") || "olivo";

  function update() {
    var nombre = fName.value.trim().slice(0, 60);
    var pases = Math.max(1, Math.min(20, parseInt(fPases.value, 10) || 1));
    var tema = fTema.value;
    document.documentElement.setAttribute("data-tema", tema);
    $$("[data-guest]").forEach(function (e) { e.textContent = nombre || "Nuestros invitados"; });
    $$("[data-pases]").forEach(function (e) { e.textContent = pases; });
    $$("[data-pases-label]").forEach(function (e) { e.textContent = pases === 1 ? "Lugar" : "Lugares"; });
    var base = SITE.urlInvitacion || "../invitacion/index.html";
    var q = new URLSearchParams();
    if (nombre) q.set("n", nombre);
    q.set("p", pases);
    if (tema !== "olivo") q.set("tema", tema);
    var url = base + (base.indexOf("?") > -1 ? "&" : "?") + q.toString();
    env.href = url; link.href = url; link.textContent = url;
  }
  [fName, fPases, fTema].forEach(function (el) { el.addEventListener("input", update); });
  $("#fPrint").addEventListener("click", function () {
    var nombre = fName.value.trim();
    var prev = document.title;
    document.title = "Invitacion " + (nombre || "boda");
    window.print();
    document.title = prev;
  });
  update();
})();
