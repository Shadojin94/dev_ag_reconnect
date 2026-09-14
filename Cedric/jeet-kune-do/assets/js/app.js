/**
 * app.js — comportements de la landing page « Académie Jeet Kune Do ».
 *
 * Script classique (pas un module) : aucun import statique, aucun top-level await.
 * Le hero WebGL est le seul morceau chargé à part, en import() dynamique différé.
 *
 * Principe : chaque bloc est facultatif. Si un hook disparaît du HTML, le bloc
 * correspondant ne fait rien et le reste de la page continue de fonctionner.
 */
(function () {
  'use strict';

  /* document.currentScript ne vaut plus rien dès qu'on sort de l'exécution
     synchrone : on capture l'URL du script maintenant. Elle sert ensuite de base
     pour résoudre water-hero.js, sans dépendre de l'URL de base du document. */
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';

  var root = document.documentElement;
  var hasIO = typeof IntersectionObserver === 'function';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function all(selector, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
  }

  /* Paliers fins : le rail compare des surfaces visibles, il lui faut mieux
     qu'un déclenchement tout ou rien sur des sections plein écran. */
  var STEPS = [];
  for (var s = 0; s <= 20; s++) STEPS.push(s / 20);

  /* ------------------------------------------------------------------ */
  /* 01 · marqueur JS                                                    */
  /* ------------------------------------------------------------------ */

  /* Le CSS ne masque .reveal que sous .js. Sans IntersectionObserver on
     n'ajoute pas la classe : mieux vaut une page sans animation qu'une page
     dont le contenu resterait invisible. */
  if (hasIO) root.classList.add('js');

  /* ------------------------------------------------------------------ */
  /* 02 · révélations au scroll                                          */
  /* ------------------------------------------------------------------ */

  (function reveals() {
    var items = all('.reveal');
    if (!items.length) return;

    if (!hasIO || reduced) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    // Le décalage de cascade est porté par --i côté CSS : ici on ne pose que la classe.
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (el) { obs.observe(el); });
  }());

  /* ------------------------------------------------------------------ */
  /* 03 · animation des charts SVG                                       */
  /* ------------------------------------------------------------------ */

  (function charts() {
    var items = all('.chart');
    if (!items.length || !hasIO || reduced) return;

    /* .chart--anim n'est pas dans le HTML : sans JS les charts sont dessinés
       tels quels. On la pose ici pour installer l'état initial (barres à zéro,
       courbe non tracée), puis .is-in lance l'animation. */
    items.forEach(function (el) { el.classList.add('chart--anim'); });

    // Un frame d'écart garantit que l'état initial est bien calculé avant la transition.
    requestAnimationFrame(function () {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });

      items.forEach(function (el) { obs.observe(el); });
    });
  }());

  /* ------------------------------------------------------------------ */
  /* 04 · barre de progression (repli JS uniquement)                     */
  /* ------------------------------------------------------------------ */

  (function progress() {
    var bar = document.querySelector('.progress__bar');
    if (!bar) return;

    // Si le moteur sait animer sur la timeline de scroll, le CSS s'en charge seul.
    var native = !!(window.CSS && window.CSS.supports && window.CSS.supports('animation-timeline', 'scroll()'));
    if (native) return;

    var queued = false;

    function update() {
      queued = false;
      var max = root.scrollHeight - root.clientHeight;
      var p = max > 0 ? (window.scrollY || root.scrollTop || 0) / max : 0;
      bar.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, p)).toFixed(4));
    }

    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  }());

  /* ------------------------------------------------------------------ */
  /* 05 · rail de navigation                                             */
  /* ------------------------------------------------------------------ */

  (function rail() {
    var links = all('.rail a[data-rail]');
    if (!links.length || !hasIO) return;

    var linkById = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('data-rail');
      var section = id && document.getElementById(id);
      if (!section) return;               // lien orphelin : ignoré sans bruit
      linkById[id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

    var visible = {};
    var current = '';

    function apply() {
      var best = '';
      var bestArea = 0;
      sections.forEach(function (section) {
        var area = visible[section.id] || 0;
        if (area > bestArea) { bestArea = area; best = section.id; }
      });
      if (!best || best === current) return;
      if (current && linkById[current]) linkById[current].removeAttribute('aria-current');
      current = best;
      linkById[current].setAttribute('aria-current', 'true');
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        /* On compare la hauteur réellement visible, pas le ratio : sinon une
           section courte l'emporterait toujours sur une section plein écran. */
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRect.height : 0;
      });
      apply();
    }, { threshold: STEPS });

    sections.forEach(function (section) { obs.observe(section); });
  }());

  /* ------------------------------------------------------------------ */
  /* 06 · compteurs                                                      */
  /* ------------------------------------------------------------------ */

  (function counters() {
    var items = all('.counter[data-to]');
    if (!items.length) return;

    function format(el, value) {
      var n = Math.round(value);
      // "plain" = une année, jamais de séparateur de milliers (1967, pas 1 967).
      if (el.getAttribute('data-format') === 'plain') return String(n);
      return n.toLocaleString('fr-FR');
    }

    function target(el) {
      var to = parseFloat(el.getAttribute('data-to'));
      return isFinite(to) ? to : null;
    }

    if (!hasIO || reduced) {
      items.forEach(function (el) {
        var to = target(el);
        if (to !== null) el.textContent = format(el, to);
      });
      return;
    }

    function run(el) {
      var to = target(el);
      if (to === null) return;
      var start = 0;
      var duration = 1100;

      function step(now) {
        if (!start) start = now;
        var k = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - k, 3);
        el.textContent = format(el, to * eased);
        if (k < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);       // une seule animation par élément
        run(entry.target);
      });
    }, { threshold: 0.4 });

    items.forEach(function (el) { obs.observe(el); });
  }());

  /* ------------------------------------------------------------------ */
  /* 07 · barre CTA collante                                             */
  /* ------------------------------------------------------------------ */

  (function stickyCta() {
    var cta = document.getElementById('sticky-cta');
    if (!cta || !hasIO) return;

    var hero = document.getElementById('hero');
    var essai = document.getElementById('essai');
    if (!hero && !essai) return;

    var heroIn = !!hero;        // au chargement, le hero occupe l'écran
    var essaiIn = false;

    function sync() { cta.hidden = heroIn || essaiIn; }

    function watch(el, set) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { set(entry.isIntersecting); });
        sync();
      }, { threshold: 0 });
      obs.observe(el);
    }

    if (hero) watch(hero, function (v) { heroIn = v; });
    if (essai) watch(essai, function (v) { essaiIn = v; });
    sync();
  }());

  /* ------------------------------------------------------------------ */
  /* 08 · formulaire d'essai (démonstration, aucun envoi)                */
  /* ------------------------------------------------------------------ */

  (function trialForm() {
    var form = document.getElementById('trial-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    var labels = {};
    all('label[for]', form).forEach(function (label) {
      labels[label.getAttribute('for')] = label.textContent.trim();
    });

    function fieldName(el) {
      return labels[el.id] || el.name || 'Ce champ';
    }

    function describe(el) {
      var v = el.validity;
      if (v.valueMissing) return fieldName(el) + ' : ce champ est obligatoire.';
      if (v.typeMismatch) return fieldName(el) + ' : le format attendu est celui d’une adresse e-mail.';
      return fieldName(el) + ' : ' + (el.validationMessage || 'valeur invalide.');
    }

    /* .form__status est un <p> : on empile des <span>, que la grille du CSS
       espace correctement, plutôt qu'une liste interdite à cet endroit. */
    function show(state, lines) {
      status.textContent = '';
      lines.forEach(function (line) {
        var span = document.createElement('span');
        span.textContent = line;
        status.appendChild(span);
      });
      if (state === 'error') status.setAttribute('data-state', 'error');
      else status.removeAttribute('data-state');
      status.hidden = false;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();              // aucune requête réseau, jamais

      var invalid = Array.prototype.filter.call(form.elements, function (el) {
        return el.willValidate && !el.checkValidity();
      });

      if (invalid.length) {
        show('error', ['Demande non envoyée : il reste quelque chose à corriger.']
          .concat(invalid.map(describe)));
        invalid[0].focus();
        return;
      }

      var prenom = form.elements.prenom ? form.elements.prenom.value.trim() : '';
      show('ok', [
        prenom ? 'Merci ' + prenom + ', le formulaire est complet.' : 'Le formulaire est complet.',
        'Ceci est une démonstration : aucune donnée n’a été envoyée, rien n’a été enregistré, '
          + 'et personne ne recevra cette demande.',
        'Pour une mise en ligne réelle, branchez ce formulaire sur un vrai backend (voir le README).'
      ]);
    });

    // Le message d'erreur disparaît dès que l'utilisateur corrige ; la confirmation reste.
    form.addEventListener('input', function () {
      if (status.getAttribute('data-state') !== 'error') return;
      status.hidden = true;
      status.removeAttribute('data-state');
    });
  }());

  /* ------------------------------------------------------------------ */
  /* 09 · hero WebGL                                                     */
  /* ------------------------------------------------------------------ */

  (function waterHero() {
    var canvas = document.getElementById('water-canvas');
    var hero = document.querySelector('.hero');
    if (!canvas || !hero || !SCRIPT_SRC) return;

    /* En file://, l'import d'un module local est bloqué par la politique
       d'origine et logue une erreur CORS. On n'essaie même pas : le fallback
       CSS du hero est prévu pour ça. Servir la page en HTTP pour le WebGL. */
    if (window.location.protocol === 'file:') return;

    var later = typeof window.requestIdleCallback === 'function'
      ? function (fn) { window.requestIdleCallback(fn, { timeout: 2000 }); }
      : function (fn) { window.setTimeout(fn, 250); };

    later(function () {
      var url;
      try {
        url = new URL('water-hero.js', SCRIPT_SRC).href;
      } catch (e) {
        return;
      }

      try {
        import(url).then(function (mod) {
          var init = mod && (mod.initWaterHero || mod.default);
          if (typeof init !== 'function') return;

          var instance = init(canvas, {
            colors: { water: '#5fd4e8', ember: '#ff6a3d', gold: '#f5c451', ink: '#0b0e14' },
            reducedMotion: reduced
          });

          // ok === false : on ne touche à rien, le fallback CSS reste affiché.
          if (!instance || instance.ok !== true) return;
          hero.classList.add('is-webgl');

          window.addEventListener('pagehide', function () {
            try { instance.destroy(); } catch (e) { /* déjà détruit */ }
          }, { once: true });

          // En mouvement réduit, setScrollProgress est inerte : pas de rAF pour rien.
          if (reduced) return;

          var queued = false;

          function push() {
            queued = false;
            var rect = hero.getBoundingClientRect();
            var height = rect.height || 1;
            instance.setScrollProgress(Math.min(1, Math.max(0, -rect.top / height)));
          }

          function schedule() {
            if (queued) return;
            queued = true;
            requestAnimationFrame(push);
          }

          window.addEventListener('scroll', schedule, { passive: true });
          window.addEventListener('resize', schedule, { passive: true });
          push();
        }).catch(function () {
          /* CDN injoignable, WebGL absent, three.js en échec : le fallback
             CSS suffit et le reste de la page n'en sait rien. */
        });
      } catch (e) {
        /* import() indisponible sur ce moteur : idem, on laisse le fallback. */
      }
    });
  }());

}());
