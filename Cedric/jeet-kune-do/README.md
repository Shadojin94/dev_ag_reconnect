# Académie Jeet Kune Do — landing page

Page de présentation d'une salle de Jeet Kune Do : une seule page, dark only, sans
build ni dépendance installée. Trois fichiers statiques et c'est tout.

```
index.html
assets/css/styles.css
assets/js/app.js          comportements (révélations, rail, compteurs, formulaire)
assets/js/water-hero.js   hero WebGL, module ESM chargé dynamiquement
```

## Ouvrir la page

**Double-clic sur `index.html`** — tout fonctionne sauf le hero WebGL. En `file://`,
le navigateur bloque l'import d'un module local (politique d'origine) : `app.js`
n'essaie donc même pas, et le hero affiche son repli CSS animé. C'est le
comportement attendu, pas un bug.

**Contexte HTTP** — nécessaire pour voir le hero WebGL :

```bash
cd chemin/vers/jeet-kune-do
python -m http.server 8000
# puis http://localhost:8000
```

## Placeholders à remplacer avant toute mise en ligne

Tout ce qui suit est volontairement vide ou fictif.

| Quoi | Où |
|---|---|
| **Tarifs des 3 formules** (Découverte, Pratiquant, Intensif) | `index.html`, section `#programmes` : `.plan__amount` affiche `— €`, et `.plan__placeholder` affiche « Tarif à définir ». Supprimer `.plan__placeholder` une fois le montant posé. |
| **Horaires / créneaux** | `index.html`, `<select id="f-creneau">` : les trois options disent « horaire à définir ». Corriger aussi `.form__hint` (`#f-creneau-hint`) qui signale que ce sont des emplacements. |
| **Adresse de la salle** | Absente du HTML : à ajouter (pied de page, ou nouveau bloc dans `#essai`). Prévoir aussi un plan ou un lien d'itinéraire. |
| **Délai de réponse** | `index.html`, section `#essai` : « Réponse sous 48 h ouvrées *(délai à confirmer)* ». |
| **Liste de matériel** | `index.html`, FAQ, dernière phrase de « Qu'est-ce que je dois acheter » : *« Liste de matériel détaillée à compléter. »* |
| **Nom « Académie Jeet Kune Do »** | `index.html` : `<title>`, `<meta name="description">`, les balises `og:*`, `.brand__sub`, `.site-footer__name`. Le favicon est un SVG inline dans `<link rel="icon">` : à remplacer par le vrai logo. |
| **Formulaire** | `#trial-form` est une démonstration : `app.js` valide côté client puis affiche une confirmation qui dit explicitement que rien n'est envoyé. Pour le brancher, remplacer le bloc « 08 · formulaire d'essai » de `app.js` par un `fetch()` vers un vrai endpoint (ou un `action` classique) — et retirer la mention `.form__legal` ainsi que les phrases de démonstration. |
| **Mentions de démonstration** | Blocs `.note` dans `#programmes` et `#reperes`, `.site-footer__legal`, `.form__legal`, et tous les `<span class="placeholder-inline">`. |

Le CSS marque les emplacements en or (`.placeholder-inline`, `.plan__placeholder`) :
s'il reste du doré à l'écran, il reste du contenu à écrire.

## Stack et choix techniques

- **Zéro dépendance installée.** Pas de `package.json`, pas de bundler, pas de
  build. On édite, on recharge.
- **three.js 0.186.0 en ESM depuis cdnjs**, importé directement par
  `water-hero.js`. En 2026 three.js ne publie plus de build UMD : l'ESM est la
  seule option, d'où le module séparé chargé via `import()` dynamique depuis
  `app.js` (qui reste, lui, un script classique).
- **Le hero est facultatif par construction.** `initWaterHero()` ne lève jamais
  d'exception et retourne `{ ok: false }` en cas d'échec. `app.js` n'ajoute la
  classe `is-webgl` que si `ok === true` ; sinon le repli CSS (orbes floutés +
  emblème SVG) reste affiché. CDN injoignable, WebGL désactivé, GPU en panne :
  la page tient debout.
- **Animations pilotées par le scroll, en natif.** `animation-timeline: view()`
  et `scroll()` quand le moteur les supporte ; sinon `app.js` prend le relais
  avec des `IntersectionObserver` (classe `.is-in`) et, pour la barre de
  progression, une variable `--scroll-progress` mise à jour dans un
  `requestAnimationFrame`. Aucun listener `scroll` non throttlé.
- **Tokens `oklch()` avec repli hex.** Les hex sont déclarés d'abord sur `:root`,
  les `oklch()` les remplacent dans un `@supports`. Plus `@property` pour rendre
  interpolables des couleurs de dégradé qui ne le sont pas nativement.
- **Charts SVG écrits à la main**, coordonnées comprises — aucune librairie de
  dataviz. Chaque figure est doublée d'un `<table class="visually-hidden">` pour
  les lecteurs d'écran, et animée par CSS via la classe `.chart--anim` que
  `app.js` ajoute (sans JS, les graphiques sont simplement dessinés).
- **Accessibilité** : skip link, `prefers-reduced-motion` respecté partout
  (révélations posées d'emblée, compteurs sans animation, hero en image fixe),
  cibles tactiles à 44 px minimum, `aria-current` sur le rail, `role="status"`
  sur le retour du formulaire.

## Limites connues

- **Pas de backend.** Le formulaire ne part nulle part et ne stocke rien.
- **Contenus de démonstration.** Les textes décrivent fidèlement la méthode Jeet
  Kune Do, mais aucune salle réelle n'est derrière cette page.
- **Tarifs fictifs** — plus exactement : absents. Aucun montant n'est affiché.
- **Hero WebGL uniquement en HTTP**, voir plus haut.
- **Moteurs récents requis.** Le CSS utilise `:has()`, l'imbriquation native,
  `@property`, `color-mix()`, `@starting-style`. Sur un moteur plus ancien le
  rendu se dégrade sans casser, mais il n'est pas testé.

## Une note sur la preuve sociale

La section « La source » ne contient **aucun témoignage d'élève et aucune
statistique de club** — ni nombre d'adhérents, ni taux de satisfaction, ni
« 95 % de nos élèves ». C'est délibéré : inventer ces chiffres pour une
démonstration reviendrait à livrer une page qu'on ne peut pas mettre en ligne
telle quelle sans mentir.

À la place, quatre **citations réelles de Bruce Lee**, sourcées (*Longstreet*
1971, devise du Jeet Kune Do, *Tao of Jeet Kune Do*, et une citation signalée
comme « attribuée » parce que sa source exacte n'est pas établie). Les quatre
repères chiffrés de la section « Repères » (1967, 3, 4, 5) décrivent la structure
documentée de la méthode, pas l'activité d'une salle.

Si de vrais témoignages sont ajoutés plus tard, qu'ils soient vrais.
