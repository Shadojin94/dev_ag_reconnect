/* =============================================================================
   ONZE — interactions de la page
   Données de démonstration : joueurs, clubs et notes sont fictifs.
   ========================================================================== */
'use strict';

/* ------------------------------- DONNÉES -------------------------------- */

/* Sept profils de poste. `axes` liste les cinq critères notés de ce poste,
   `ref` le profil type attendu par le club sur ces mêmes axes. */
const ROLES = {
  gb: {
    name: "Gardien de but",
    brief: "Un gardien qui sécurise sa surface mais qui est surtout le premier relanceur : la sortie de balle commence à ses pieds.",
    criteria: ["Jeu au pied sous pression", "Prise d'information avant réception", "Domination de la surface", "Communication avec la ligne"],
    axes: ["Réflexes", "Jeu au pied", "Jeu aérien", "Sorties", "Communication"],
    ref: [80, 78, 76, 74, 75],
    talents: [
      { name: "Y. Traoré",    age: 18, club: "Racing Belleroche",  foot: "Droit",  height: 191, index: 86, values: [88, 74, 82, 79, 71] },
      { name: "M. Lindqvist", age: 20, club: "US Vallonne",        foot: "Gauche", height: 188, index: 81, values: [80, 88, 72, 73, 78] },
      { name: "R. Cazenave",  age: 17, club: "FC Estuaire",        foot: "Droit",  height: 186, index: 77, values: [84, 66, 70, 76, 68] }
    ]
  },
  lat: {
    name: "Latéral",
    brief: "Un couloir à tenir sur 90 minutes : répétition des courses, qualité du dernier geste et sérieux dans le duel défensif.",
    criteria: ["Répétition des sprints", "Qualité de centre en course", "Duel en un contre un", "Timing de projection"],
    axes: ["Vitesse", "Endurance", "Centres", "Duels défensifs", "Projection"],
    ref: [82, 80, 74, 76, 78],
    talents: [
      { name: "K. Diarra",   age: 19, club: "AS Montclair",      foot: "Droit",  height: 178, index: 89, values: [94, 86, 72, 74, 90] },
      { name: "E. Fontaine", age: 18, club: "Olympique Ravel",   foot: "Gauche", height: 175, index: 83, values: [85, 81, 84, 70, 82] },
      { name: "L. Bonetti",  age: 21, club: "US Vallonne",       foot: "Droit",  height: 181, index: 76, values: [78, 88, 68, 82, 71] }
    ]
  },
  dc: {
    name: "Défenseur central",
    brief: "Le premier organisateur de la ligne : gagner le duel, mais aussi lire la profondeur et sortir proprement sous pression.",
    criteria: ["Duel aérien défensif", "Lecture de la profondeur", "Première passe vers l'avant", "Autorité sur la ligne"],
    axes: ["Duel aérien", "Anticipation", "Relance", "Vitesse", "Leadership"],
    ref: [84, 82, 76, 74, 78],
    talents: [
      { name: "A. Nkemba",   age: 18, club: "FC Estuaire",       foot: "Droit",  height: 190, index: 90, values: [92, 86, 78, 81, 79] },
      { name: "T. Vasseur",  age: 20, club: "Racing Belleroche", foot: "Gauche", height: 187, index: 84, values: [85, 88, 84, 68, 86] },
      { name: "D. Sørensen", age: 17, club: "Olympique Ravel",   foot: "Droit",  height: 185, index: 78, values: [80, 76, 72, 79, 70] }
    ]
  },
  mdc: {
    name: "Milieu défensif",
    brief: "L'assurance du bloc : couvrir les intervalles, récupérer proprement et relancer sans perdre le tempo.",
    criteria: ["Interceptions dans l'axe", "Orientation du corps", "Fiabilité sous pression", "Volume de course répété"],
    axes: ["Récupération", "Positionnement", "Passe courte", "Volume de course", "Impact duel"],
    ref: [82, 84, 80, 80, 78],
    talents: [
      { name: "H. Ouattara",  age: 19, club: "US Vallonne",   foot: "Droit",  height: 182, index: 87, values: [90, 85, 82, 88, 84] },
      { name: "P. Mariani",   age: 21, club: "AS Montclair",  foot: "Droit",  height: 179, index: 80, values: [84, 86, 86, 76, 72] },
      { name: "S. Vermeulen", age: 18, club: "FC Estuaire",   foot: "Gauche", height: 184, index: 75, values: [78, 74, 79, 82, 76] }
    ]
  },
  mc: {
    name: "Milieu relayeur",
    brief: "Le joueur qui fait avancer le ballon : conduite dans les intervalles, passe qui casse une ligne, coffre pour répéter.",
    criteria: ["Passe entre les lignes", "Conduite en zone dense", "Changement de rythme", "Endurance sur 90 minutes"],
    axes: ["Vision de jeu", "Passe longue", "Conduite de balle", "Endurance", "Finition"],
    ref: [82, 78, 80, 82, 70],
    talents: [
      { name: "N. Aït-Larbi", age: 18, club: "Olympique Ravel",   foot: "Gauche", height: 176, index: 91, values: [93, 84, 90, 80, 74] },
      { name: "J. Bellanger", age: 20, club: "FC Estuaire",       foot: "Droit",  height: 183, index: 82, values: [84, 86, 76, 88, 66] },
      { name: "C. Ferreira",  age: 17, club: "Racing Belleroche", foot: "Droit",  height: 174, index: 79, values: [86, 72, 85, 74, 72] }
    ]
  },
  ail: {
    name: "Ailier",
    brief: "Déséquilibrer seul : vitesse sur les premiers mètres, capacité à éliminer et acceptation du travail défensif.",
    criteria: ["Un contre un face au but", "Prise de profondeur", "Dernier geste (centre ou frappe)", "Repli et pressing"],
    axes: ["Vitesse", "Dribble", "Centres", "Prise de profondeur", "Repli défensif"],
    ref: [86, 84, 74, 82, 66],
    talents: [
      { name: "O. Sanogo",   age: 18, club: "AS Montclair",    foot: "Droit",  height: 177, index: 92, values: [96, 90, 70, 89, 62] },
      { name: "M. Kowalski", age: 19, club: "US Vallonne",     foot: "Gauche", height: 180, index: 84, values: [86, 82, 86, 80, 74] },
      { name: "I. Bamba",    age: 17, club: "Olympique Ravel", foot: "Droit",  height: 172, index: 78, values: [90, 86, 64, 76, 58] }
    ]
  },
  bu: {
    name: "Attaquant de pointe",
    brief: "Finir, mais aussi fixer : tenir le ballon dos au but, décrocher juste et déclencher le pressing de l'équipe.",
    criteria: ["Efficacité dans la surface", "Jeu dos au but", "Appel dans l'intervalle", "Premier défenseur"],
    axes: ["Finition", "Jeu dos au but", "Appel dans l'intervalle", "Duel aérien", "Pressing"],
    ref: [86, 78, 84, 76, 74],
    talents: [
      { name: "V. Okonkwo", age: 19, club: "Racing Belleroche", foot: "Droit",  height: 186, index: 90, values: [92, 84, 88, 84, 72] },
      { name: "G. Lemoine", age: 18, club: "FC Estuaire",       foot: "Gauche", height: 180, index: 83, values: [88, 72, 90, 66, 80] },
      { name: "B. Ndiaye",  age: 21, club: "AS Montclair",      foot: "Droit",  height: 189, index: 77, values: [82, 86, 74, 88, 64] }
    ]
  }
};

/* Les onze positions du 4-3-3, chacune rattachée à un profil de poste.
   x et y sont exprimés en pourcentage du terrain (but défendu en bas). */
const SPOTS = [
  { label: "GB",  x: 50, y: 94, role: "gb",  full: "Gardien de but" },
  { label: "DG",  x: 13, y: 78, role: "lat", full: "Latéral gauche" },
  { label: "DCG", x: 36, y: 82, role: "dc",  full: "Défenseur central gauche" },
  { label: "DCD", x: 64, y: 82, role: "dc",  full: "Défenseur central droit" },
  { label: "DD",  x: 87, y: 78, role: "lat", full: "Latéral droit" },
  { label: "MDC", x: 50, y: 62, role: "mdc", full: "Milieu défensif" },
  { label: "MG",  x: 31, y: 50, role: "mc",  full: "Milieu relayeur gauche" },
  { label: "MD",  x: 69, y: 50, role: "mc",  full: "Milieu relayeur droit" },
  { label: "AG",  x: 13, y: 27, role: "ail", full: "Ailier gauche" },
  { label: "BU",  x: 50, y: 15, role: "bu",  full: "Attaquant de pointe" },
  { label: "AD",  x: 87, y: 27, role: "ail", full: "Ailier droit" }
];

/* -------------------------------- OUTILS -------------------------------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Sépare les milliers par une espace fine insécable et utilise le vrai signe moins. */
function fmt(n) {
  const s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (n < 0 ? '−' : '') + s;
}

/** Crée un élément, y pose des attributs et du texte — jamais d'innerHTML. */
function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ------------------------------- THÈME ---------------------------------- */
(function theme() {
  const root = document.documentElement;
  const btn = $('#theme-toggle');
  const saved = localStorage.getItem('onze-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
  sync();

  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('onze-theme', root.dataset.theme);
    sync();
    drawSparks();  // la couleur d'anneau des sparklines suit la surface
  });
})();

/* ------------------------------ MENU MOBILE ----------------------------- */
(function burger() {
  const btn = $('#burger');
  const nav = $('#nav-principal');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* -------------------- BASCULE « AFFICHER LE TABLEAU » ------------------- */
(function tableToggles() {
  $$('.table-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = document.getElementById(btn.dataset.table);
      const open = view.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Masquer le tableau' : btn.dataset.table === 'table-talents'
        ? 'Afficher le tableau des notes'
        : 'Afficher le tableau';
    });
  });
})();

/* ------------------- INFOBULLE DU GRAPHIQUE DE CHARGE -------------------
   La cible de survol est toute la colonne, et le clavier déclenche le même
   affichage que la souris. Les valeurs restent lisibles dans le tableau. */
(function chargeTooltip() {
  const tip  = $('#charge-tip');
  const bars = $$('#charge-bars .barslot');

  bars.forEach((slot) => {
    slot.setAttribute('aria-label',
      `${slot.dataset.jour} : ${slot.dataset.valeur} unités arbitraires, ${slot.dataset.type}`);

    const show = () => {
      tip.textContent = '';
      tip.append(
        el('span', { class: 'tooltip__value' }, `${slot.dataset.valeur} u.a.`),
        el('span', { class: 'tooltip__meta' }, `${slot.dataset.jour} · ${slot.dataset.type}`)
      );
      tip.hidden = false;
      const area = slot.closest('.plot__area').getBoundingClientRect();
      const box  = slot.getBoundingClientRect();
      const barH = area.height * (parseFloat(slot.style.getPropertyValue('--h')) / 100);
      const half = tip.offsetWidth / 2;
      const x = box.left - area.left + box.width / 2;
      tip.style.left = `${Math.min(Math.max(x, half), area.width - half)}px`;
      tip.style.top  = `${Math.max(tip.offsetHeight, area.height - barH - 12)}px`;
    };
    const hide = () => { tip.hidden = true; };

    slot.addEventListener('pointerenter', show);
    slot.addEventListener('pointerleave', hide);
    slot.addEventListener('focus', show);
    slot.addEventListener('blur', hide);
  });
})();

/* ----------------------------- SPARKLINES ------------------------------- */
const SVG_NS = 'http://www.w3.org/2000/svg';

function drawSparks() {
  $$('.spark').forEach((svg) => {
    const pts = svg.dataset.spark.split(',').map(Number);
    if (pts.length < 2) return;
    const W = 113, H = 32, PAD = 3;
    const xy = pts.map((v, i) => [
      (i / (pts.length - 1)) * W,
      H - PAD - (v / 100) * (H - PAD * 2)
    ]);
    const path = (arr) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

    svg.textContent = '';
    const ctx = document.createElementNS(SVG_NS, 'polyline');
    ctx.setAttribute('class', 'spark__ctx');
    ctx.setAttribute('points', path(xy.slice(0, -1)));

    const now = document.createElementNS(SVG_NS, 'polyline');
    now.setAttribute('class', 'spark__now');
    now.setAttribute('points', path(xy.slice(-2)));

    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('class', 'spark__dot');
    dot.setAttribute('cx', xy[xy.length - 1][0].toFixed(1));
    dot.setAttribute('cy', xy[xy.length - 1][1].toFixed(1));
    dot.setAttribute('r', '4');

    svg.append(ctx, now, dot);
  });
}
drawSparks();

/* ------------------- COMPTEURS DES TUILES + APPARITIONS ----------------- */
(function observers() {
  const counted = new WeakSet();

  function count(node) {
    const target = Number(node.dataset.countTo);
    const suffix = node.dataset.suffix || '';
    if (REDUCED) { node.textContent = fmt(target) + suffix; return; }
    const dur = 900, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach((n) => n.classList.add('is-in'));
    $$('[data-count-to]').forEach(count);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      if (e.target.dataset.countTo && !counted.has(e.target)) {
        counted.add(e.target);
        count(e.target);
      }
      io.unobserve(e.target);
    });
  }, { threshold: .3, rootMargin: '0px 0px -8% 0px' });

  $$('.reveal, [data-count-to]').forEach((n) => io.observe(n));
})();

/* ================== SÉLECTEUR DE POSTE ET LISTE DE TALENTS ==============
   Le terrain joue le rôle de filtre de dimension ; la rangée de filtres
   au-dessus des résultats cadre exactement ce qui est affiché en dessous.
   ====================================================================== */
(function scouting() {
  const spotsHost = $('#pitch-spots');
  if (!spotsHost) return;

  const kicker   = $('#role-kicker');
  const roleName = $('#role-name');
  const roleBrief = $('#role-brief');
  const criteria = $('#role-criteria');
  const grid     = $('#talents-grid');
  const countOut = $('#scout-count');
  const tableOut = $('#table-talents');
  const fAge   = $('#filter-age');
  const fFoot  = $('#filter-foot');
  const fIndex = $('#filter-index');

  let current = 2; /* DCG par défaut */

  /* --- construction du terrain ----------------------------------------- */
  const buttons = SPOTS.map((spot, i) => {
    const b = el('button', {
      type: 'button',
      class: 'spot',
      'aria-pressed': 'false',
      'aria-label': `${spot.full} — voir le profil de poste`
    });
    b.style.setProperty('--x', spot.x + '%');
    b.style.setProperty('--y', spot.y + '%');
    b.append(el('span', { class: 'spot__dot', 'aria-hidden': 'true' }, spot.label));
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', (e) => {
      const dirs = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      const next = neighbour(i, d[0], d[1]);
      if (next > -1) { select(next); buttons[next].focus(); }
    });
    spotsHost.append(b);
    return b;
  });

  /** Position la plus proche dans la direction demandée. */
  function neighbour(from, dx, dy) {
    const cur = SPOTS[from];
    let best = -1, bestScore = Infinity;
    SPOTS.forEach((s, i) => {
      if (i === from) return;
      const vx = s.x - cur.x, vy = s.y - cur.y;
      const along = vx * dx + vy * dy;
      if (along <= 0) return;
      const across = Math.abs(vx * dy - vy * dx);
      const score = along + across * 2;
      if (score < bestScore) { bestScore = score; best = i; }
    });
    return best;
  }

  function select(i) {
    current = i;
    buttons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    render();
  }

  /* --- rendu ----------------------------------------------------------- */
  function filtered(role) {
    const maxAge = Number(fAge.value);
    const foot   = fFoot.value;
    const minIdx = Number(fIndex.value);
    return role.talents.filter((t) =>
      t.age <= maxAge && (!foot || t.foot === foot) && t.index >= minIdx);
  }

  function talentCard(t, role) {
    const card = el('article', { class: 'talent' });

    const head = el('div', { class: 'talent__head' });
    const id = el('div');
    id.append(
      el('h4', { class: 'talent__name' }, t.name),
      el('p', { class: 'talent__meta' },
        `${t.age} ans · ${t.club} · pied ${t.foot.toLowerCase()} · ${t.height} cm`)
    );
    const idx = el('div', { class: 'talent__index' });
    idx.append(el('b', {}, String(t.index)), el('span', {}, 'Indice'));
    head.append(id, idx);

    const bars = el('div', { class: 'talent__bars' });
    role.axes.forEach((axis, k) => {
      const mine = t.values[k], ref = role.ref[k];
      const readout = `${axis} — ${t.name} : ${mine} · profil type du poste : ${ref}`;

      const row = el('div', {
        class: 'gbar-row',
        tabindex: '0',
        'data-read': readout,
        'aria-label': readout
      });
      row.append(el('span', { class: 'gbar-row__label' }, axis));

      const plot  = el('div', { class: 'gbar-row__plot' });
      const scale = el('div', { class: 'gbar-row__scale' });

      const b1 = el('div', { class: 'gbar gbar--s1' });
      b1.style.setProperty('--f', (mine / 100).toFixed(3));
      const b2 = el('div', { class: 'gbar gbar--s2' });
      b2.style.setProperty('--f', (ref / 100).toFixed(3));
      scale.append(b1, b2);

      const tip = el('span', { class: 'gbar__tip', 'aria-hidden': 'true' }, String(mine));
      tip.style.setProperty('--f', (mine / 100).toFixed(3));

      plot.append(scale, tip);
      row.append(plot);
      bars.append(row);
    });

    card.append(head, bars);
    return card;
  }

  function buildTable(list, role) {
    tableOut.textContent = '';
    const table = el('table');
    table.append(el('caption', {},
      `Notes des joueurs affichés pour le poste « ${role.name} », sur 100`));

    const thead = el('thead');
    const hr = el('tr');
    ['Joueur', 'Âge', 'Club formateur', 'Pied', 'Taille', 'Indice']
      .forEach((h) => hr.append(el('th', { scope: 'col' }, h)));
    role.axes.forEach((a) => hr.append(el('th', { scope: 'col', class: 'num' }, a)));
    thead.append(hr);

    const tbody = el('tbody');
    list.forEach((t) => {
      const tr = el('tr');
      tr.append(el('th', { scope: 'row' }, t.name));
      tr.append(el('td', {}, `${t.age} ans`));
      tr.append(el('td', {}, t.club));
      tr.append(el('td', {}, t.foot));
      tr.append(el('td', { class: 'num' }, `${t.height} cm`));
      tr.append(el('td', { class: 'num' }, String(t.index)));
      t.values.forEach((v) => tr.append(el('td', { class: 'num' }, String(v))));
      tbody.append(tr);
    });

    const tfoot = el('tfoot');
    const fr = el('tr');
    fr.append(el('th', { scope: 'row' }, 'Profil type du poste'));
    for (let i = 0; i < 5; i++) fr.append(el('td', {}, '—'));
    role.ref.forEach((v) => fr.append(el('td', { class: 'num' }, String(v))));
    tfoot.append(fr);

    table.append(thead, tbody, tfoot);
    tableOut.append(table);
  }

  function render() {
    const spot = SPOTS[current];
    const role = ROLES[spot.role];
    const list = filtered(role);

    kicker.textContent = `Profil de poste · ${spot.full}`;
    roleName.textContent = role.name;
    roleBrief.textContent = role.brief;

    criteria.textContent = '';
    role.criteria.forEach((c) => criteria.append(el('li', {}, c)));

    countOut.textContent = list.length === 0
      ? 'Aucun joueur de la base ne correspond à ces filtres.'
      : `${list.length} joueur${list.length > 1 ? 's' : ''} sur ${role.talents.length} · barre bleue : le joueur, barre orange : le profil type du poste`;

    grid.textContent = '';
    if (list.length === 0) {
      grid.append(el('p', { class: 'talents__empty' },
        'Élargissez la catégorie d’âge ou baissez l’indice de potentiel minimum pour voir des profils.'));
    } else {
      const legend = el('div', { class: 'legend', role: 'list' });
      [['s1', 'Joueur'], ['s2', 'Profil type du poste']].forEach(([slot, label]) => {
        const item = el('span', { class: 'legend__item', role: 'listitem' });
        item.append(el('span', { class: `legend__swatch legend__swatch--${slot}`, 'aria-hidden': 'true' }), document.createTextNode(label));
        legend.append(item);
      });
      legend.style.gridColumn = '1 / -1';
      grid.append(legend);
      list.forEach((t) => grid.append(talentCard(t, role)));
    }

    buildTable(list, role);
  }

  [fAge, fFoot, fIndex].forEach((f) => f.addEventListener('change', render));
  $('#filter-reset').addEventListener('click', () => {
    fAge.value = '99'; fFoot.value = ''; fIndex.value = '0';
    render();
  });

  select(current);
})();

/* ---------------------------- FORMULAIRE -------------------------------- */
(function demoForm() {
  const form = $('#demo-form');
  const ok   = $('#form-ok');
  const rules = [
    { id: 'f-nom',   test: (v) => v.trim().length >= 2,            msg: 'Indiquez votre nom et prénom.' },
    { id: 'f-club',  test: (v) => v.trim().length >= 2,            msg: 'Indiquez le nom de votre club ou structure.' },
    { id: 'f-email', test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Cette adresse e-mail semble incomplète.' }
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;

    rules.forEach((r) => {
      const input = document.getElementById(r.id);
      const out = $(`[data-error-for="${r.id}"]`);
      const valid = r.test(input.value);
      out.textContent = valid ? '' : r.msg;
      input.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstBad) firstBad = input;
    });

    if (firstBad) { ok.hidden = true; firstBad.focus(); return; }

    const club = $('#f-club').value.trim();
    ok.textContent = `Merci, votre demande pour ${club} est bien prise en compte. Cette page étant une démonstration, rien n’a été envoyé.`;
    ok.hidden = false;
    form.reset();
    $$('[data-error-for]').forEach((n) => { n.textContent = ''; });
    $$('#demo-form [aria-invalid]').forEach((n) => n.setAttribute('aria-invalid', 'false'));
  });
})();
