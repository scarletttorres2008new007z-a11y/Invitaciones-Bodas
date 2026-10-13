/* =========================================================================
   Nupcia | Escena 3D del hero (Three.js r149)
   Invitacion, sobre, sello de lacre y anillos de oro reales en WebGL.
   Las texturas se dibujan en canvas con los datos de config.js, asi que
   cambian solas al cambiar la pareja.
   ========================================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("hero3d");
  if (!canvas) return;
  var B = window.BODA || {};

  function webglOK() {
    try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); }
    catch (e) { return false; }
  }
  if (typeof THREE === "undefined" || !webglOK()) {
    document.documentElement.classList.add("no-webgl");
    window.Hero3D = { start: function () {} };
    return;
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLORS = { paper: "#FBF8F2", ivory: "#F4EFE6", olive: "#53532F", wine: "#7A2E2E", wineDeep: "#5E2121", gold: "#B8975A", env: "#E9E1CF", flap: "#DED4BE", ink: "#2B2A26", muted: "#77725F" };
  var fecha = new Date(B.fecha || Date.now());
  var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  /* ---------- Renderer ---------- */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.2, 13);

  /* ---------- Entorno para reflejos del oro ---------- */
  (function buildEnv() {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var env = new THREE.Scene();
    var room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xcfc4ae, side: THREE.BackSide }));
    env.add(room);
    function panel(w, h, x, y, z, ry, k) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 0.92), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); if (ry) m.rotation.y += ry; env.add(m);
    }
    panel(8, 5, -6, 6, 6, 0, 5);
    panel(6, 3, 7, 3, 2, 0, 3);
    panel(10, 2, 0, 9, -4, 0, 2.5);
    panel(4, 8, -9, 0, -3, 0, 1.6);
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: 0x5b5a3a }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -9.5; env.add(floor);
    scene.environment = pmrem.fromScene(env, 0.035).texture;
  })();

  /* ---------- Luces ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe6e0d4, 0.62));
  var key = new THREE.DirectionalLight(0xfffaf3, 0.6);
  key.position.set(-3, 5, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.radius = 16; key.shadow.blurSamples = 24; key.shadow.bias = -0.0006;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xe8dcc4, 0.25);
  rim.position.set(6, -2, 4);
  scene.add(rim);

  // Pared invisible que recibe las sombras
  var wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.1 }));
  wall.position.z = -1.6; wall.receiveShadow = true;
  scene.add(wall);

  /* ---------- Utilidades de canvas ---------- */
  function mkCanvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function spaced(ctx, text, x, y, spacing) {
    // Texto con tracking manual, centrado en x
    var chars = text.split(""), total = 0, i;
    for (i = 0; i < chars.length; i++) total += ctx.measureText(chars[i]).width + (i < chars.length - 1 ? spacing : 0);
    var cx = x - total / 2;
    for (i = 0; i < chars.length; i++) { ctx.fillText(chars[i], cx, y); cx += ctx.measureText(chars[i]).width + spacing; }
  }
  function leaf(ctx, x, y, len, ang, fill) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -len * 0.32, len, 0);
    ctx.quadraticCurveTo(len * 0.5, len * 0.32, 0, 0);
    if (fill) ctx.fill(); else ctx.stroke();
    ctx.restore();
  }
  function wreath(ctx, cx, cy, r, color) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2;
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI / 2 + side * 0.25, Math.PI / 2 + side * 2.3, side < 0);
      ctx.stroke();
      for (var k = 0; k < 9; k++) {
        var a = Math.PI / 2 + side * (0.42 + k * 0.21);
        var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        var tangent = a + side * Math.PI / 2;
        leaf(ctx, px, py, 34 - k * 1.4, tangent - side * 0.7, false);
        leaf(ctx, px, py, 30 - k * 1.4, tangent + side * 0.9 + Math.PI, false);
      }
    });
  }
  function texFrom(c) {
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  /* ---------- Textura de la invitacion ---------- */
  function drawCard() {
    var W = 1024, H = 1442, c = mkCanvas(W, H), x = c.getContext("2d");
    x.fillStyle = COLORS.paper; x.fillRect(0, 0, W, H);
    // Grano sutil de papel
    for (var i = 0; i < 9000; i++) { x.fillStyle = "rgba(120,100,70," + (Math.random() * 0.05) + ")"; x.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4); }
    x.strokeStyle = COLORS.olive; x.lineWidth = 3; x.strokeRect(46, 46, W - 92, H - 92);
    x.strokeStyle = COLORS.gold; x.lineWidth = 1.5; x.strokeRect(62, 62, W - 124, H - 124);
    // Esquinas ornamentales
    x.strokeStyle = COLORS.gold; x.lineWidth = 2;
    [[62, 62, 1, 1], [W - 62, 62, -1, 1], [62, H - 62, 1, -1], [W - 62, H - 62, -1, -1]].forEach(function (p) {
      x.save(); x.translate(p[0], p[1]); x.scale(p[2], p[3]);
      x.beginPath(); x.arc(0, 0, 54, 0, Math.PI / 2); x.stroke();
      x.beginPath(); x.arc(0, 0, 70, 0.15, Math.PI / 2 - 0.15); x.stroke();
      x.fillStyle = COLORS.gold; leaf(x, 40, 40, 30, Math.PI / 4, true);
      x.restore();
    });
    x.textAlign = "left"; x.textBaseline = "alphabetic";
    x.fillStyle = COLORS.olive; x.font = "400 26px Jost";
    spaced(x, "NUESTRA BODA", W / 2, 190, 12);
    wreath(x, W / 2, 330, 108, COLORS.olive);
    x.fillStyle = "#3F3F22"; x.font = "96px 'Pinyon Script'"; x.textAlign = "center";
    var ini = (B.iniciales || ["A", "B"]);
    x.fillText(ini[0], W / 2 - 26, 340); x.fillText(ini[1], W / 2 + 30, 392);
    x.font = "150px 'Pinyon Script'";
    x.fillText(B.novio || "Novio", W / 2, 640);
    x.font = "italic 58px 'Bodoni Moda'"; x.fillStyle = COLORS.wine;
    x.fillText("&", W / 2, 730);
    x.font = "150px 'Pinyon Script'"; x.fillStyle = "#3F3F22";
    x.fillText(B.novia || "Novia", W / 2, 860);
    x.textAlign = "left";
    x.strokeStyle = COLORS.gold; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(W / 2 - 220, 950); x.lineTo(W / 2 - 30, 950); x.moveTo(W / 2 + 30, 950); x.lineTo(W / 2 + 220, 950); x.stroke();
    x.save(); x.translate(W / 2, 950); x.rotate(Math.PI / 4); x.strokeRect(-9, -9, 18, 18); x.restore();
    x.fillStyle = COLORS.ink; x.font = "400 30px Jost";
    var dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    spaced(x, dias[fecha.getDay()], W / 2, 1030, 10);
    x.font = "400 128px 'Bodoni Moda'"; x.textAlign = "center";
    x.fillText(String(fecha.getDate()), W / 2, 1160);
    x.textAlign = "left"; x.font = "400 30px Jost";
    spaced(x, (meses[fecha.getMonth()] + " " + fecha.getFullYear()).toUpperCase(), W / 2, 1220, 10);
    x.fillStyle = COLORS.muted; x.font = "italic 34px 'Bodoni Moda'"; x.textAlign = "center";
    x.fillText(B.ciudad || "", W / 2, 1300);
    return texFrom(c);
  }

  /* ---------- Textura del sobre ---------- */
  function drawEnvelope() {
    var W = 1400, H = 940, c = mkCanvas(W, H), x = c.getContext("2d");
    x.fillStyle = COLORS.env; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 9000; i++) { x.fillStyle = "rgba(110,90,60," + (Math.random() * 0.05) + ")"; x.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
    // Pliegues del bolsillo
    x.fillStyle = "#E3DAC6";
    x.beginPath(); x.moveTo(0, H); x.lineTo(W / 2, H * 0.5); x.lineTo(W, H); x.closePath(); x.fill();
    x.strokeStyle = "rgba(120,100,70,.22)"; x.lineWidth = 3;
    x.beginPath(); x.moveTo(0, H); x.lineTo(W / 2, H * 0.5); x.lineTo(W, H); x.stroke();
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W * 0.42, H * 0.56); x.moveTo(W, 0); x.lineTo(W * 0.58, H * 0.56); x.stroke();
    // Solapa
    x.fillStyle = COLORS.flap;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W / 2, H * 0.6); x.closePath(); x.fill();
    x.strokeStyle = "rgba(120,100,70,.28)"; x.stroke();
    // Destinatario manuscrito
    x.fillStyle = COLORS.olive; x.font = "64px 'Pinyon Script'"; x.textAlign = "left";
    x.fillText("Para la Familia Ortega", 90, H - 90);
    x.strokeStyle = "rgba(83,83,47,.35)"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(90, H - 70); x.lineTo(700, H - 70); x.stroke();
    // Estampilla
    x.save(); x.translate(W - 230, H - 250); x.rotate(0.06);
    x.fillStyle = COLORS.paper; x.fillRect(0, 0, 150, 180);
    x.strokeStyle = COLORS.wine; x.lineWidth = 3; x.setLineDash([6, 6]); x.strokeRect(10, 10, 130, 160); x.setLineDash([]);
    x.fillStyle = COLORS.wine; x.font = "92px 'Pinyon Script'"; x.textAlign = "center"; x.fillText(B.iniciales ? B.iniciales[0] : "A", 75, 120);
    x.font = "400 16px Jost"; spacedCenter(x, String(fecha.getFullYear()), 75, 156);
    x.restore();
    function spacedCenter(ctx, t, cx, cy) { ctx.textAlign = "left"; spaced(ctx, t, cx, cy, 6); }
    return texFrom(c);
  }

  /* ---------- Textura del sello ---------- */
  function drawSeal() {
    var S = 512, c = mkCanvas(S, S), x = c.getContext("2d");
    x.fillStyle = COLORS.wine; x.fillRect(0, 0, S, S);
    x.strokeStyle = COLORS.wineDeep; x.lineWidth = 14;
    x.beginPath(); x.arc(S / 2, S / 2, S * 0.4, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 4; x.beginPath(); x.arc(S / 2, S / 2, S * 0.34, 0, Math.PI * 2); x.stroke();
    var ini = (B.iniciales || ["A", "B"]).join("");
    x.textAlign = "center"; x.textBaseline = "middle"; x.font = "190px 'Pinyon Script'";
    x.fillStyle = "#9A4545"; x.fillText(ini, S / 2 - 3, S / 2 + 10 - 3);
    x.fillStyle = COLORS.wineDeep; x.fillText(ini, S / 2 + 3, S / 2 + 10 + 3);
    x.fillStyle = "#6A2828"; x.fillText(ini, S / 2, S / 2 + 10);
    return texFrom(c);
  }

  /* ---------- Construccion ---------- */
  var group = new THREE.Group();
  scene.add(group);
  var cardMesh, envMesh, sealGroup, rings, leaves = [];

  function build() {
    var paperBack = new THREE.MeshStandardMaterial({ color: 0xf1ead9, roughness: 0.9 });
    var edge = new THREE.MeshStandardMaterial({ color: 0xe6dcc6, roughness: 0.9 });

    // Sobre
    var envTex = drawEnvelope();
    var envMats = [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: envTex, roughness: 0.85 }), paperBack];
    envMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.08, 0.05), envMats);
    envMesh.position.set(-1.25, -1.05, -0.55);
    envMesh.rotation.set(0.04, 0.2, 0.16);
    envMesh.castShadow = true; envMesh.receiveShadow = true;
    group.add(envMesh);

    // Sello sobre el sobre
    sealGroup = new THREE.Group();
    var shape = new THREE.Shape();
    var N = 64;
    for (var i = 0; i <= N; i++) {
      var a = i / N * Math.PI * 2;
      var r = 0.46 + Math.sin(a * 7) * 0.018 + Math.sin(a * 13 + 1) * 0.012 + (Math.random() - 0.5) * 0.006;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r); else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    var sealGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 6, curveSegments: 48 });
    var sealMat = new THREE.MeshStandardMaterial({ color: 0x6e2626, roughness: 0.45, metalness: 0.05 });
    var sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.castShadow = true;
    sealGroup.add(sealMesh);
    var decal = new THREE.Mesh(new THREE.CircleGeometry(0.4, 64), new THREE.MeshStandardMaterial({ map: drawSeal(), roughness: 0.42 }));
    decal.position.z = 0.112;
    sealGroup.add(decal);
    sealGroup.position.set(-1.1, -1.32, -0.45);
    sealGroup.rotation.set(0.04, 0.2, 0.16);
    group.add(sealGroup);

    // Invitacion
    var cardTex = drawCard();
    var cardMats = [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: cardTex, roughness: 0.75 }), paperBack];
    cardMesh = new THREE.Mesh(new THREE.BoxGeometry(2.9, 4.08, 0.03), cardMats);
    cardMesh.castShadow = true; cardMesh.receiveShadow = true;
    cardMesh.userData.home = { x: 0.95, y: 0.55, z: 0.35, rx: -0.04, ry: -0.24, rz: -0.08 };
    cardMesh.userData.start = { x: -1.2, y: -1.4, z: -0.7, rx: 0, ry: 0.2, rz: 0.16 };
    var s = reduce ? cardMesh.userData.home : cardMesh.userData.start;
    cardMesh.position.set(s.x, s.y, s.z); cardMesh.rotation.set(s.rx, s.ry, s.rz);
    group.add(cardMesh);

    // Anillos de oro
    rings = new THREE.Group();
    var gold = new THREE.MeshStandardMaterial({ color: 0xc9a14f, metalness: 1, roughness: 0.2, envMapIntensity: 1.1 });
    var goldRose = new THREE.MeshStandardMaterial({ color: 0xd7a27a, metalness: 1, roughness: 0.22, envMapIntensity: 1.0 });
    var r1 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.075, 48, 160), gold);
    var r2 = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.065, 48, 160), goldRose);
    r1.castShadow = r2.castShadow = true;
    r2.position.set(0.42, 0.1, 0);
    r2.rotation.set(1.25, 0.2, 0.3);
    // Piedra en el anillo menor
    var gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.02, envMapIntensity: 2.2 }));
    gem.position.set(0, 0.5, 0); gem.scale.set(1, 1.2, 1);
    r2.add(gem);
    rings.add(r1, r2);
    rings.position.set(2.1, -1.9, 1.0);
    rings.rotation.set(0.5, -0.4, 0.2);
    group.add(rings);

    // Hojas flotando
    var leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(0.12, 0.14, 0, 0.36); leafShape.quadraticCurveTo(-0.12, 0.14, 0, 0);
    var leafGeo = new THREE.ShapeGeometry(leafShape, 12);
    var leafMats = [
      new THREE.MeshStandardMaterial({ color: 0x6b6b45, roughness: 0.8, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0x8a8a5c, roughness: 0.8, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0xd8c39a, roughness: 0.6, side: THREE.DoubleSide })
    ];
    for (var k = 0; k < 14; k++) {
      var m = new THREE.Mesh(leafGeo, leafMats[k % 3]);
      m.castShadow = true;
      var ang = k / 14 * Math.PI * 2;
      m.userData = { r: 3 + Math.random() * 1.4, a: ang, y: (Math.random() - 0.5) * 4.6, s: 0.15 + Math.random() * 0.25, z: (Math.random() - 0.2) * 2 };
      m.scale.setScalar(0.7 + Math.random() * 0.8);
      group.add(m); leaves.push(m);
    }
  }

  /* ---------- Tamano ---------- */
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Ajusta la distancia para que todo quepa en pantallas angostas
    var aspect = w / h;
    camera.position.z = Math.max(w < 900 ? 15 : 13, 4.4 / (Math.tan(15 * Math.PI / 180) * aspect));
    group.position.x = aspect < 1 ? 0.35 : 0;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  /* ---------- Interaccion ---------- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", function (e) {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
  });
  // Giroscopio en celulares
  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma == null) return;
    tx = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
    ty = Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 80));
  });

  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
  }

  var introStart = -1;
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = clock.getElapsedTime();
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    var scroll = Math.min(1, window.scrollY / window.innerHeight);

    group.rotation.y = mx * 0.5 + scroll * 0.35;
    group.rotation.x = my * 0.28 + scroll * 0.2;
    group.position.y = scroll * 1.4;

    if (cardMesh) {
      var h = cardMesh.userData.home, s0 = cardMesh.userData.start;
      var k = 1;
      if (introStart >= 0) k = ease(Math.min(1, (t - introStart) / 2.2));
      else if (!reduce) k = 0;
      var fy = reduce ? 0 : Math.sin(t * 0.9) * 0.08;
      cardMesh.position.set(lerp(s0.x, h.x, k), lerp(s0.y, h.y, k) + fy * k, lerp(s0.z, h.z, k) + Math.sin(k * Math.PI) * 0.9);
      cardMesh.rotation.set(lerp(s0.rx, h.rx, k) + Math.sin(t * 0.7) * 0.02 * k, lerp(s0.ry, h.ry, k), lerp(s0.rz, h.rz, k));
      envMesh.position.y = -1.05 + (reduce ? 0 : Math.sin(t * 0.8 + 1) * 0.05);
      sealGroup.position.y = envMesh.position.y - 0.27;
    }
    if (rings) {
      rings.rotation.y = t * 0.45;
      rings.rotation.x = 0.5 + Math.sin(t * 0.6) * 0.15;
      rings.position.y = -1.9 + Math.sin(t * 1.1) * 0.12;
    }
    leaves.forEach(function (l, i) {
      var d = l.userData;
      var a = d.a + t * d.s * 0.25;
      l.position.set(Math.cos(a) * d.r, d.y + Math.sin(t * d.s + i) * 0.3, d.z + Math.sin(a) * 0.6);
      l.rotation.set(t * d.s, t * d.s * 0.7 + i, Math.sin(t * 0.5 + i));
    });
    renderer.render(scene, camera);
  }

  function init() {
    build();
    // El entorno solo debe dar brillo al metal: el papel y la cera casi no lo reciben
    group.traverse(function (o) {
      if (!o.material) return;
      [].concat(o.material).forEach(function (m) { if (m.metalness < 0.5) m.envMapIntensity = 0.18; });
    });
    resize();
    frame();
  }

  // Esperar tipografias para dibujar las texturas con la letra correcta
  var fontsReady = document.fonts && document.fonts.load
    ? Promise.all([
        document.fonts.load("150px 'Pinyon Script'"),
        document.fonts.load("italic 58px 'Bodoni Moda'"),
        document.fonts.load("400 128px 'Bodoni Moda'"),
        document.fonts.load("400 30px Jost")
      ])
    : Promise.resolve();
  var timeout = new Promise(function (r) { setTimeout(r, 2500); });
  Promise.race([fontsReady, timeout]).then(init, init);

  window.Hero3D = {
    start: function () { introStart = clock.getElapsedTime() + 0.2; }
  };
})();
