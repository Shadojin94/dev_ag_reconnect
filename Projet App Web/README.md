# Projet App Web — application de démonstration

Projet collectif de la **Formation IA : Développeur Augmenté** (septembre 2026).

Quatre apprenants, quatre rôles, une seule application web construite ensemble.
L'objectif n'est pas le produit : c'est d'apprendre à travailler à plusieurs sur
un même code sans se marcher dessus.

**Stack :** React 19 · Vite · TypeScript

---

## Démarrer

Il faut Node.js 20 ou plus (`node -v` pour vérifier).

```bash
cd "Projet App Web"
npm install
npm run dev
```

Le serveur affiche une URL locale — l'ouvrir dans le navigateur.
Les modifications sont rechargées à chaud, sans redémarrer.

| Commande | Effet |
|---|---|
| `npm run dev` | serveur de développement, rechargement à chaud |
| `npm run build` | build de production dans `dist/` |
| `npm run preview` | servir le build de production localement |
| `npm run lint` | vérifier le code |

## Structure

```
Projet App Web/
├── docs/                  les règles qu'on s'est données
│   ├── ROLES.md           qui est responsable de quoi
│   ├── WORKFLOW-GIT.md    branches, commits, pull requests
│   ├── CONVENTIONS.md     nommage, TypeScript, CSS
│   └── DECISIONS.md       les choix techniques et leurs raisons
├── public/                fichiers servis tels quels
└── src/
    ├── app/               coquille : routing, providers      → Intégration & QA
    ├── components/        UI réutilisable et sans métier     → Front & UI
    ├── features/          un dossier par fonctionnalité      → chacun le sien
    ├── services/          API, données, stockage             → Données & Services
    ├── styles/            tokens, thème, styles globaux      → Design & Contenu
    ├── lib/               fonctions utilitaires pures        → partagé
    └── types/             types partagés                     → Données & Services
```

Chaque dossier de `src/` contient un `README.md` qui dit ce qu'on y met,
ce qu'on n'y met pas, et qui en répond.

## Les rôles

| Rôle | Responsabilité |
|---|---|
| **Front & UI** | bibliothèque de composants, assemblage visuel des écrans |
| **Données & Services** | types partagés, appels API, données de démo |
| **Design & Contenu** | design system, textes de l'interface, accessibilité |
| **Intégration & QA** | routing, relecture des PR, build, démo finale |

Le détail de chaque rôle, ses livrables et la rotation de mi-parcours :
**[`docs/ROLES.md`](docs/ROLES.md)** — à compléter avec vos noms à la première séance.

Tout le monde développe des features, quel que soit son rôle.

## Travailler à plusieurs

Une branche par sujet, une pull request, une relecture. Jamais de push direct sur `main`.

```bash
git checkout main && git pull
git checkout -b feat/ma-feature
# ... travailler, commiter ...
git push -u origin feat/ma-feature
# puis ouvrir la PR sur GitHub
```

Le détail — nommage des branches, format des commits, résolution de conflits —
dans **[`docs/WORKFLOW-GIT.md`](docs/WORKFLOW-GIT.md)**.

Pour éviter les conflits, la règle qui compte : **chacun dans son dossier de
`src/features/`**. Deux personnes qui modifient le même fichier au même moment,
c'est un conflit ; deux dossiers séparés, c'est une fusion sans histoire.

## Où on en est

L'ossature est posée, l'application est le squelette Vite par défaut.
Trois choses à faire à la première séance :

1. **s'attribuer les rôles** dans `docs/ROLES.md` ;
2. **définir ce que fait l'app** — les écrans, une feature par personne ;
3. **trancher ADR-002 et ADR-003** dans `docs/DECISIONS.md` : la navigation
   entre écrans et l'origine des données.

## Ne pas commiter

`node_modules/`, `dist/`, `.env`. Le `.gitignore` s'en charge, mais si une clé
part par erreur : prévenir tout de suite et la révoquer — la retirer d'un commit
ne la retire pas de l'historique.
