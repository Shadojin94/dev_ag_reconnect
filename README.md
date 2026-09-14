# dev_ag_reconnect

Dépôt de travail — **Formation IA : Développeur Augmenté** (septembre 2026).

## Structure

```
Cedric/
  jeet-kune-do/     Landing page Jeet Kune Do (statique, WebGL, deck scroll-snap)
```

## Projets

### `Cedric/jeet-kune-do`

Landing page de conversion sur le Jeet Kune Do, construite en deck plein écran.
100 % statique : aucun build, aucune dépendance à installer.

- Hero WebGL (three.js en ESM depuis cdnjs) — champ de particules « be water »
  formant l'emblème du JKD, réactif au curseur et au scroll.
- Design system en tokens CSS `oklch()`, animations pilotées par le scroll
  (`animation-timeline`) avec repli `IntersectionObserver`.
- Deux visualisations de données en SVG écrit à la main, sans librairie.
- Fallback complet sans JavaScript et sans WebGL.

Pour l'ouvrir, servir le dossier plutôt que d'ouvrir le fichier :

```
cd "Cedric/jeet-kune-do" && python -m http.server 8000
```

Le double-clic fonctionne, mais un module ESM ne se charge pas depuis `file://` :
le hero bascule alors sur son repli CSS et la scène WebGL reste inactive.

Détails et liste des contenus à personnaliser : `Cedric/jeet-kune-do/README.md`.
