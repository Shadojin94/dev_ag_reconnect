/**
 * water-hero.js — champ de particules « Be water » dessinant l'emblème du Jeet Kune Do.
 *
 * Module ESM autonome. Seule dépendance : three.js servi par cdnjs (CSP stricte).
 * Contrat public :
 *   initWaterHero(canvas, { colors, reducedMotion }) -> { ok, setScrollProgress(p), destroy() }
 * Le module ne throw jamais : toute erreur retourne un objet inerte { ok: false }.
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.0/three.module.min.js';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

const DEFAULT_COLORS = {
  water: '#5fd4e8',
  ember: '#ff6a3d',
  gold: '#f5c451',
  ink: '#0b0e14',
};

/* Géométrie de l'emblème, en coordonnées normalisées (le canvas source vaut 1x1).
   Partagée par le tracé Canvas 2D et par le repli analytique, pour éviter qu'ils divergent. */
const EMB = {
  ring: 0.255,        // rayon de l'anneau du Tao
  ringW: 0.040,       // épaisseur de l'anneau
  arrow: 0.388,       // rayon des deux flèches (≈ ring * 1.52)
  arrowW: 0.022,
  // Deux arcs symétriques par rotation de 180° : ils se poursuivent autour de l'anneau,
  // l'un remontant par la droite (haut-droite), l'autre redescendant par la gauche.
  spans: [[-148 * DEG, 14 * DEG], [32 * DEG, 194 * DEG]],
};

const EMBLEM_WORLD = 5.0;   // largeur de l'emblème en unités monde
const COVER = 0.74;         // part de la plus petite dimension du viewport occupée
const FOV = 45;
const SRC_RES = 512;        // résolution du canvas de silhouette

const INERT = Object.freeze({
  ok: false,
  setScrollProgress() {},
  destroy() {},
});

/* ------------------------------------------------------------------ */
/* Silhouette : tracé vectoriel puis échantillonnage des pixels allumés */
/* ------------------------------------------------------------------ */

function createDetachedCanvas(w, h) {
  if (typeof OffscreenCanvas === 'function') {
    try { return new OffscreenCanvas(w, h); } catch (e) { /* repli ci-dessous */ }
  }
  const c = document.createElement('canvas'); // jamais inséré dans le document
  c.width = w;
  c.height = h;
  return c;
}

/** Tête de flèche pleine, orientée dans le sens de parcours de l'arc. */
function drawArrowHead(ctx, cx, cy, R, angle, S) {
  const tipA = angle + 0.11;                              // la pointe dépasse l'arc
  const tx = cx + Math.cos(tipA) * R;
  const ty = cy + Math.sin(tipA) * R;
  const tanX = -Math.sin(angle), tanY = Math.cos(angle);  // sens de parcours (horaire)
  const radX = Math.cos(angle), radY = Math.sin(angle);   // radial sortant
  const back = S * 0.058, half = S * 0.036;
  const bx = tx - tanX * back, by = ty - tanY * back;

  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(bx + radX * half, by + radY * half);
  ctx.lineTo(bx - radX * half, by - radY * half);
  ctx.closePath();
  ctx.fill();
}

/** Une flèche = amorce incurvée vers l'intérieur + arc + tête. */
function drawArrow(ctx, cx, cy, R, a0, a1, S) {
  const inner = R * 0.84;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a0 - 0.16) * inner, cy + Math.sin(a0 - 0.16) * inner);
  ctx.quadraticCurveTo(
    cx + Math.cos(a0 - 0.07) * R, cy + Math.sin(a0 - 0.07) * R,
    cx + Math.cos(a0) * R, cy + Math.sin(a0) * R
  );
  ctx.arc(cx, cy, R, a0, a1, false);
  ctx.stroke();
  drawArrowHead(ctx, cx, cy, R, a1, S);
}

function drawEmblem(ctx, S) {
  const cx = S / 2, cy = S / 2;
  const R = EMB.ring * S;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Anneau du Tao
  ctx.lineWidth = EMB.ringW * S;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TAU);
  ctx.stroke();

  // Courbe en S du taiji : deux demi-cercles de rayon R/2, bombés à droite puis à gauche.
  ctx.lineWidth = S * 0.025;
  ctx.beginPath();
  ctx.arc(cx, cy - R / 2, R / 2, -Math.PI / 2, Math.PI / 2, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + R / 2, R / 2, -Math.PI / 2, Math.PI / 2, true);
  ctx.stroke();

  // Les deux flèches qui se poursuivent
  ctx.lineWidth = EMB.arrowW * S;
  for (const span of EMB.spans) drawArrow(ctx, cx, cy, EMB.arrow * S, span[0], span[1], S);
}

/**
 * Échantillonne la silhouette : on liste une seule fois tous les pixels allumés,
 * puis on tire `count` positions dedans avec un jitter sous-pixel. Tirer dans la
 * liste (et non pixel par pixel) garantit une densité uniforme quel que soit le
 * rapport count/surface. Résultat normalisé [-0.5, 0.5], Y déjà retourné.
 */
function sampleEmblem(count) {
  const S = SRC_RES;
  let data;
  try {
    const cvs = createDetachedCanvas(S, S);
    const ctx = cvs.getContext('2d', { willReadFrequently: true });
    if (!ctx) return analyticEmblem(count);
    drawEmblem(ctx, S);
    data = ctx.getImageData(0, 0, S, S).data;
  } catch (e) {
    return analyticEmblem(count);
  }

  const lit = [];
  for (let y = 0; y < S; y++) {
    const row = y * S;
    for (let x = 0; x < S; x++) {
      if (data[(row + x) * 4] > 120) lit.push(row + x);
    }
  }
  if (lit.length < 64) return analyticEmblem(count);

  const out = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const idx = lit[(Math.random() * lit.length) | 0];
    const px = idx % S, py = (idx / S) | 0;
    out[i * 2]     = (px + Math.random()) / S - 0.5;
    out[i * 2 + 1] = 0.5 - (py + Math.random()) / S;
  }
  return out;
}

/** Repli si le contexte 2D est indisponible : mêmes rayons, tracé paramétrique. */
function analyticEmblem(count) {
  const out = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    let r, a;
    if (Math.random() < 0.62) {
      r = EMB.ring + (Math.random() - 0.5) * EMB.ringW;
      a = Math.random() * TAU;
    } else {
      const span = EMB.spans[Math.random() < 0.5 ? 0 : 1];
      r = EMB.arrow + (Math.random() - 0.5) * EMB.arrowW;
      a = span[0] + Math.random() * (span[1] - span[0]);
    }
    out[i * 2]     = Math.cos(a) * r;
    out[i * 2 + 1] = -Math.sin(a) * r;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const VERT = `
uniform float uTime;
uniform float uAmp;
uniform vec2  uMouse;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uScroll;
uniform float uIntro;
uniform float uSize;
uniform float uPixelScale;
uniform float uPixelRatio;
uniform vec3  uWater;
uniform vec3  uEmber;
uniform vec3  uGold;

attribute float aRandom;
attribute float aScale;

varying vec3  vColor;
varying float vAlpha;

// Hash scalaire déterministe (variante iq) : ni texture, ni sin() saturé aux
// grandes coordonnées — le motif reste stable d'un GPU à l'autre.
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

// Value noise 3D, interpolation quintique : dérivée seconde continue, donc la
// houle glisse au lieu de claquer aux frontières de cellules.
float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), u.x),
        mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), u.x),
        mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

void main() {
  vec3 target = position;

  // Apparition : le nuage diffus se condense sur l'emblème (uIntro 0 -> 1).
  vec3 scatter = target * 1.9 + (vec3(
      hash31(target * 3.1 + 1.0),
      hash31(target * 3.7 + 5.0),
      hash31(target * 4.3 + 9.0)) - 0.5) * 4.2;
  vec3 pos = mix(scatter, target, uIntro);

  // Houle : une basse fréquence lente qui porte, une seconde plus fine qui ride
  // dessus. Le seed par particule décale les phases pour casser l'effet de grille.
  float n1 = vnoise(vec3(pos.xy * 0.42, uTime * 0.13) + aRandom * 2.0);
  float n2 = vnoise(vec3(pos.xy * 1.30, uTime * 0.27) + aRandom * 6.0);
  float swell = (n1 - 0.5) + (n2 - 0.5) * 0.35;

  // Dérive latérale très lente : le champ coule, il ne tremble pas sur place.
  vec2 flow = vec2(
    vnoise(vec3(pos.xy * 0.33, uTime * 0.09)),
    vnoise(vec3(pos.yx * 0.33 + 11.7, uTime * 0.09))
  ) - 0.5;

  pos.xy += flow * uAmp * 1.6 * uIntro;
  pos.z  += swell * uAmp * 6.0;

  // Répulsion : influence quadratique pour un bord doux, poussée radiale + relief.
  // (smoothstep toujours écrit edge0 < edge1 : les bornes inversées sont
  //  « undefined » dans la spec GLSL ES, certains pilotes en profitent.)
  vec2 d = pos.xy - uMouse;
  float dist = length(d);
  float infl = 1.0 - smoothstep(0.0, uMouseRadius, dist);
  infl *= infl;
  pos.xy += (d / max(dist, 1e-3)) * infl * uMouseStrength;
  pos.z  += infl * uMouseStrength * 0.6;

  // Dissolution au scroll : montée + éparpillement, en quadratique pour que le
  // début du scroll reste calme et que la fin évacue franchement.
  float s = clamp(uScroll, 0.0, 1.0);
  float e = s * s;
  pos.y += e * (1.2 + aRandom * 4.5);
  pos.x += (aRandom - 0.5) * e * 2.6;
  pos.z += (hash31(target + 3.0) - 0.5) * e * 3.0;
  float fade = 1.0 - smoothstep(0.05, 0.85, s);

  // Teinte : dominante eau, ~9 % d'ember et ~5 % d'or tirés sur le seed.
  float t = aRandom;
  vec3 c = mix(uWater, uEmber, step(0.86, t) * (1.0 - step(0.95, t)));
  c = mix(c, uGold, step(0.95, t));
  float depth = clamp(pos.z * 0.9 + 0.5, 0.0, 1.0);
  vColor = c * (0.62 + 0.62 * depth);
  vAlpha = fade * uIntro * (0.45 + 0.55 * depth);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = clamp(
    uSize * aScale * uPixelScale / max(-mv.z, 0.001),
    uPixelRatio, 7.0 * uPixelRatio);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = `
uniform float uOpacity;

varying vec3  vColor;
varying float vAlpha;

void main() {
  // Disque à bord adouci : on raisonne en rayon² pour éviter un sqrt par fragment.
  vec2 uv = gl_PointCoord - 0.5;
  float a = (1.0 - smoothstep(0.015, 0.25, dot(uv, uv))) * vAlpha * uOpacity;
  if (a < 0.004) discard;
  // Le renderer est en premultipliedAlpha : additive = (ONE, ONE). On prémultiplie
  // donc nous-mêmes, sinon les particules faibles écraseraient le fond.
  gl_FragColor = vec4(vColor * a, a);
}
`;

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

function hasWebGL() {
  try {
    if (typeof WebGLRenderingContext === 'undefined') return false;
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return false;
    // On rend le contexte de test immédiatement : certains navigateurs plafonnent
    // le nombre de contextes WebGL vivants.
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Parse un hex CSS en composantes 0..1 *brutes*, sans passer par THREE.Color :
 * le shader écrit directement dans le framebuffer (pas de chunk colorspace), on
 * veut donc les mêmes valeurs sRGB que les tokens CSS, sans conversion linéaire.
 */
function parseHex(str) {
  if (typeof str !== 'string') return null;
  let s = str.trim();
  if (s.charAt(0) !== '#') return null;
  s = s.slice(1);
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  if (s.length !== 6 || /[^0-9a-fA-F]/.test(s)) return null;
  const n = parseInt(s, 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function toColor(value, fallback) {
  return parseHex(value) || parseHex(fallback);
}

/** Budget particules : la largeur pilote la densité, le DPR la charge fragment. */
function pickCount(width, dpr) {
  let n = width < 768 ? 9000 : (width < 1280 ? 14000 : 18000);
  if (dpr > 1.75) n = Math.round(n * 0.72);
  else if (dpr > 1.25) n = Math.round(n * 0.85);
  return Math.max(6000, n);
}

/* ------------------------------------------------------------------ */
/* API publique                                                        */
/* ------------------------------------------------------------------ */

export function initWaterHero(canvas, options = {}) {
  if (!canvas || typeof canvas !== 'object' || typeof canvas.getContext !== 'function') return INERT;
  if (!hasWebGL()) return INERT;

  const opts = options || {};
  const reduced = opts.reducedMotion === true;
  const src = opts.colors || {};

  let renderer = null;
  let geometry = null;
  let material = null;
  let scene = null;
  let points = null;
  let resizeObs = null;
  let interObs = null;
  let rafId = 0;
  let resizeTimer = 0;
  let destroyed = false;

  /** Libération des ressources GPU + observers. Idempotent. */
  function teardown() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    clearTimeout(resizeTimer);
    try { if (interObs) interObs.disconnect(); } catch (e) {}
    try { if (resizeObs) resizeObs.disconnect(); } catch (e) {}
    interObs = null;
    resizeObs = null;
    try { if (scene && points) scene.remove(points); } catch (e) {}
    try { if (geometry) geometry.dispose(); } catch (e) {}
    try { if (material) material.dispose(); } catch (e) {}
    try {
      if (renderer) {
        renderer.dispose();
        if (typeof renderer.forceContextLoss === 'function') renderer.forceContextLoss();
      }
    } catch (e) {}
    geometry = null;
    material = null;
    points = null;
    scene = null;
    renderer = null;
  }

  try {
    const palette = {
      water: toColor(src.water, DEFAULT_COLORS.water),
      ember: toColor(src.ember, DEFAULT_COLORS.ember),
      gold: toColor(src.gold, DEFAULT_COLORS.gold),
    };

    const dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, 2);
    let width = Math.max(1, canvas.clientWidth || canvas.width || 1);
    let height = Math.max(1, canvas.clientHeight || canvas.height || 1);

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,          // inutile sur des points additifs, et coûteux
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);  // false : la mise en page reste au CSS
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    const halfFovTan = Math.tan((FOV * DEG) / 2);

    /* --- construction du nuage ---------------------------------------- */
    const total = pickCount(width, dpr);
    const haloCount = Math.round(total * 0.10);   // voile d'eau autour de l'emblème
    const embCount = total - haloCount;
    const shape = sampleEmblem(embCount);

    const positions = new Float32Array(total * 3);
    const randoms = new Float32Array(total);
    const scales = new Float32Array(total);

    for (let i = 0; i < embCount; i++) {
      positions[i * 3]     = shape[i * 2] * EMBLEM_WORLD;
      positions[i * 3 + 1] = shape[i * 2 + 1] * EMBLEM_WORLD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.38;
      randoms[i] = Math.random();
      scales[i] = 0.72 + Math.random() * 0.70;
    }
    for (let i = embCount; i < total; i++) {
      // Disque uniforme en aire (sqrt) : pas d'agglutination au centre.
      const a = Math.random() * TAU;
      const r = Math.sqrt(Math.random()) * EMBLEM_WORLD * 0.86;
      positions[i * 3]     = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.82;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.7;
      randoms[i] = Math.random();
      scales[i] = 0.30 + Math.random() * 0.35;
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), EMBLEM_WORLD * 2.5);

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.052 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseRadius: { value: 1.15 },
      uMouseStrength: { value: 0.55 },
      uScroll: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uSize: { value: 0.0145 },
      uPixelScale: { value: 1 },
      uPixelRatio: { value: dpr },
      uOpacity: { value: 1 },
      uWater: { value: palette.water },
      uEmber: { value: palette.ember },
      uGold: { value: palette.gold },
    };

    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    /* --- cadrage : on recule la caméra jusqu'à ce que l'emblème tienne -- */
    let viewH = 1, viewW = 1;
    function fit(w, h) {
      width = Math.max(1, Math.round(w));
      height = Math.max(1, Math.round(h));
      const aspect = width / height;
      // En portrait, c'est la largeur qui contraint : on divise par l'aspect.
      viewH = EMBLEM_WORLD / COVER / Math.min(1, aspect);
      viewW = viewH * aspect;
      camera.aspect = aspect;
      camera.position.z = (viewH / 2) / halfFovTan;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      // Conversion rayon monde -> pixels du framebuffer pour gl_PointSize.
      uniforms.uPixelScale.value = (height * dpr) / (2 * halfFovTan);
    }
    fit(width, height);

    function render() {
      if (destroyed || !renderer) return;
      renderer.render(scene, camera);
    }

    function observeResize(onSize) {
      // Garde de disponibilité : sur un moteur sans ResizeObserver on perd le
      // re-cadrage, pas le hero (mieux qu'un { ok: false } pour si peu).
      if (typeof ResizeObserver !== 'function') return null;
      const obs = new ResizeObserver(function (entries) {
        if (destroyed) return;
        const box = entries[0] && entries[0].contentRect;
        const w = canvas.clientWidth || (box ? box.width : width);
        const h = canvas.clientHeight || (box ? box.height : height);
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (destroyed) return;
          onSize(w, h);
        }, 120);
      });
      obs.observe(canvas);
      return obs;
    }

    /* ---------------- mode statique : une frame, aucune boucle ---------- */
    if (reduced) {
      uniforms.uTime.value = 7.3;      // instantané figé sur une phase agréable
      uniforms.uMouseStrength.value = 0; // sinon uMouse=(0,0) creuse un trou au centre
      render();

      resizeObs = observeResize(function (w, h) {
        fit(w, h);
        render();                   // re-cadrage, pas d'animation
      });

      return {
        ok: true,
        // Pas de re-rendu : la dissolution est du mouvement, on la neutralise.
        setScrollProgress() {},
        destroy: function () {
          if (destroyed) return;
          destroyed = true;
          teardown();
        },
      };
    }

    /* ---------------- mode animé --------------------------------------- */
    const mouseTarget = new THREE.Vector2(0, 0);
    let pointerClientX = 0, pointerClientY = 0;
    let pointerSeen = false, rectDirty = true, mouseReady = false;
    let rect = canvas.getBoundingClientRect();

    const onPointerMove = function (e) {
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      pointerSeen = true;
    };
    const onPointerLeave = function () { pointerSeen = false; };
    // Le canvas bouge avec la page : on invalide le rect au scroll plutôt que de
    // le relire à chaque frame (un getBoundingClientRect force un reflow).
    const onScroll = function () { rectDirty = true; };

    // On écoute sur window : le canvas est en arrière-plan et peut être
    // pointer-events:none, il ne recevrait alors jamais l'événement.
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let inView = true;
    let tabVisible = document.visibilityState !== 'hidden';
    let elapsed = 0, intro = 0, last = 0;

    function tick(now) {
      if (destroyed) return;
      rafId = requestAnimationFrame(tick);

      // dt plafonné : après une pause d'onglet, pas de saut de phase brutal.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      elapsed += dt;
      uniforms.uTime.value = elapsed;

      if (intro < 1) {
        intro = Math.min(1, intro + dt / 1.7);
        uniforms.uIntro.value = 1 - Math.pow(1 - intro, 3);   // easeOutCubic
      }

      if (pointerSeen) {
        if (rectDirty) { rect = canvas.getBoundingClientRect(); rectDirty = false; }
        const nx = ((pointerClientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const ny = 1 - ((pointerClientY - rect.top) / Math.max(rect.height, 1)) * 2;
        mouseTarget.set(nx * viewW * 0.5, ny * viewH * 0.5);
      } else {
        // Pas de pointeur (tactile) : le point de répulsion dérive en Lissajous.
        mouseTarget.set(
          Math.sin(elapsed * 0.21) * viewW * 0.26,
          Math.cos(elapsed * 0.17) * viewH * 0.22
        );
      }
      // Inertie indépendante du framerate : lerp exponentiel sur dt. La toute
      // première frame se cale d'un coup, sinon le point traverse l'écran.
      if (mouseReady) uniforms.uMouse.value.lerp(mouseTarget, 1 - Math.pow(0.001, dt));
      else { uniforms.uMouse.value.copy(mouseTarget); mouseReady = true; }

      render();
    }

    function start() {
      if (destroyed || rafId || !inView || !tabVisible) return;
      last = 0;
      rectDirty = true;
      rafId = requestAnimationFrame(tick);
    }
    function stop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }

    const onVisibility = function () {
      tabVisible = document.visibilityState !== 'hidden';
      if (tabVisible) start(); else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Pause dès que le hero sort du viewport : pas de GPU brûlé en arrière-plan.
    if (typeof IntersectionObserver === 'function') {
      interObs = new IntersectionObserver(function (entries) {
        inView = entries.some(function (en) { return en.isIntersecting; });
        if (inView) start(); else stop();
      }, { threshold: 0 });
      interObs.observe(canvas);
    }

    // ResizeObserver débouncé : capte aussi les changements de layout que
    // window.resize ignore (panneau qui s'ouvre, barre d'URL mobile...).
    resizeObs = observeResize(function (w, h) {
      fit(w, h);
      rectDirty = true;
      if (!rafId) render();
    });

    const onContextLost = function (e) { e.preventDefault(); stop(); };
    const onContextRestored = function () {
      fit(canvas.clientWidth || width, canvas.clientHeight || height);
      start();
    };
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    render();   // première image immédiate, sans attendre le premier RAF
    start();

    return {
      ok: true,
      setScrollProgress: function (p) {
        if (destroyed) return;
        const v = (typeof p === 'number' && isFinite(p)) ? Math.min(1, Math.max(0, p)) : 0;
        uniforms.uScroll.value = v;
        rectDirty = true;                 // la page a bougé, le rect aussi
        if (!rafId) render();             // reste juste même si le RAF est en pause
      },
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        stop();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
        teardown();
      },
    };
  } catch (err) {
    // Aucune exception ne remonte : le HTML affichera son fallback CSS.
    destroyed = true;
    try { teardown(); } catch (e) {}
    return INERT;
  }
}

export default initWaterHero;
