# dev_ag_reconnect

Dépôt de la formation « IA : Développeur Augmenté » (PLB, RECONNECT, 14–15 septembre 2026) : supports, travaux et projet commun.

## Accès en un clic

| Prénom | Site | Voir en ligne | Dossier source |
|---|---|---|---|
| Ashad | ONZE — Superviser, entraîner et recruter pour les clubs professionnels | https://shadojin94.github.io/dev_ag_reconnect/ashad/ | [`Ashad/`](Ashad) |
| Nils | Dés & Merveilles — Boutique de jeux de société | https://shadojin94.github.io/dev_ag_reconnect/nils/ | [`Nils/`](Nils) |
| Romain | Nova Hangar — Vaisseaux Star Citizen | https://shadojin94.github.io/dev_ag_reconnect/romain/ | [`romain/`](romain) |
| Cédric | Académie Jeet Kune Do — Sois comme l'eau | https://shadojin94.github.io/dev_ag_reconnect/cedric/jeet-kune-do/ | [`Cedric/`](Cedric) |
| — | **MVP Reconnect Assist** (application du projet commun) | https://shadojin94.github.io/dev_ag_reconnect/mvp/ | [`Projet%20App%20Web/`](Projet%20App%20Web) |
| — | **Le cours du 15 septembre** (deck + PDF) | https://shadojin94.github.io/dev_ag_reconnect/cours/ | [`Cours/reconnect-15sept-v2/`](Cours/reconnect-15sept-v2) |

## Le projet commun — Reconnect Assist (MVP)

Reconnect Assist est un assistant web d'orientation vers des structures sociales, pensé pour des personnes confrontées à la barrière de la langue : choisir un besoin, comprendre, trouver une structure, contacter. Il se construit en trois lots (base de connaissances, annuaire, assistant) plus un lot d'intégration qui les assemble. La stack est React 19, Vite et TypeScript.

- Documentation du projet : [`Projet App Web/README.md`](Projet%20App%20Web/README.md)
- Tableau de suivi : https://github.com/users/Shadojin94/projects/4
- Issues : [#1 INT-01](https://github.com/Shadojin94/dev_ag_reconnect/issues/1) (Cédric — intégration), [#2 KB-01](https://github.com/Shadojin94/dev_ag_reconnect/issues/2) (Romain — base de connaissances), [#3 ANNU-01](https://github.com/Shadojin94/dev_ag_reconnect/issues/3) (Nils — annuaire), [#4 ASSIST-01](https://github.com/Shadojin94/dev_ag_reconnect/issues/4) (Ashad — assistant)

## Les supports

[`Cours/reconnect-15sept-v2/`](Cours/reconnect-15sept-v2) : le deck de formation du 15 septembre (version HTML autonome, PowerPoint, PDF), et le kit remis aux apprenants — les trois skills Claude Code (`/prompt-5`, `/lancer-workflow`, `/ticket-ready`), le contrat de données, les tickets et la fiche des 5 étapes.

## Travailler dans ce dépôt

- Une branche par sujet, une pull request, une relecture avant fusion — jamais de push direct sur `main`.
- Chacun travaille dans son dossier (`Ashad/`, `Nils/`, `romain/`, `Cedric/`, ou son lot dans `Projet App Web/src/features/`).
- `npm run lint` et `npm run build` doivent passer avant de pousser.
- Pas de secret dans le dépôt (clés, mots de passe, `.env`).

Détails : [`Projet App Web/docs/WORKFLOW-GIT.md`](Projet%20App%20Web/docs/WORKFLOW-GIT.md) et [`docs/CONVENTIONS.md`](Projet%20App%20Web/docs/CONVENTIONS.md).

## Structure du dépôt

```
Ashad/                     site perso d'Ashad (14/09)
Nils/                       site perso de Nils (14/09)
romain/                      site perso de Romain (14/09)
Cedric/                       site perso de Cédric (14/09)
Projet App Web/               le MVP Reconnect Assist (React + Vite + TypeScript)
Cours/                          supports de formation (deck, PPTX, PDF, kit)
site/                             portail publié (page d'accueil de GitHub Pages)
.github/workflows/pages.yml         publication automatique sur GitHub Pages
```

## Publication

À chaque push sur `main`, l'action « Publier les sites » reconstruit le MVP et republie l'ensemble des sites sur GitHub Pages. L'avancement se vérifie dans l'onglet **Actions** du dépôt. Comptez environ 2 minutes entre le push et la mise en ligne.
