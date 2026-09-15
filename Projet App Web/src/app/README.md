# `app/` — coquille et assemblage

**Propriétaire : rôle Intégration & QA**, sauf `pages/<prenom>.tsx` qui appartient à l'apprenant.

## Ce que possède qui

| Fichier | Propriétaire |
|---|---|
| `router.ts`, `registry.ts`, `types.ts`, `useOrientation.ts`, `pages/home.tsx` | Intégration |
| `pages/romain.tsx` | Romain (KB-01) |
| `pages/nils.tsx` | Nils (ANNU-01) |
| `pages/ashad.tsx` | Ashad (ASSIST-01) |
| `src/features/<lot>/` | l'apprenant du lot |

Un apprenant ne touche que deux choses : son dossier de feature et son fichier de page.

## Navigation

`router.ts` expose `useHashRoute()` : routage par hash (ADR-002), zéro dépendance.
Routes : `#/` (accueil), `#/romain`, `#/nils`, `#/ashad`. Toute route inconnue retombe
sur l'accueil. Le hash fonctionne tel quel sous le sous-chemin `/mvp/` de GitHub Pages.

## Registre

`registry.ts` importe les trois pages et les expose sous `{ romain, nils, ashad }`.
Chaque page exporte par défaut un `LearnerPage` (voir `types.ts`) :

- `name`, `ticket`, `issue` : identité du lot, affichés dans la navigation et l'écran d'attente ;
- `ready` : `false` tant que le lot n'est pas branché ;
- `Page` : la page personnelle de l'apprenant ;
- les champs optionnels (`searchKnowledge`, `KnowledgeList`, `findOrganisations`,
  `OrganisationList`, `Assistant`) sont ce que le lot fournit à l'accueil.
  `undefined` = pas encore branché, et l'accueil bascule sur un repli de `src/components/`.

`src/services/orientation.ts` lit ce registre : `searchKnowledge` vient de Romain,
`findOrganisations` de Nils, `explain` reste en mode `fixture` (« Mode sans IA »).

## Les 3 lignes à décommenter

Chaque fichier `pages/<prenom>.tsx` commence par huit lignes de mode d'emploi et porte
trois marqueurs « À DÉCOMMENTER ». Une fois le lot exposé par son `index.ts` :

| Apprenant | 1. import | 2. champs | 3. état |
|---|---|---|---|
| Romain | `import { KnowledgeList, searchKnowledge } from '../../features/base-connaissances'` | `searchKnowledge, KnowledgeList,` | `ready: true,` |
| Nils | `import { findOrganisations, OrganisationList } from '../../features/annuaire'` | `findOrganisations, OrganisationList,` | `ready: true,` |
| Ashad | `import { Assistant } from '../../features/assistant'` | `Assistant,` | `ready: true,` |

Supprimer la ligne `ready: false` en même temps, puis remplacer `Page` par la version de
démonstration commentée dans le fichier (elle utilise `src/lib/useAsync.ts`).

## Accueil

`pages/home.tsx` est la fusion : assistant (Ashad ou repli), puis explication sourcée,
puis fiches (Romain ou repli), puis structures (Nils ou repli). Un bandeau discret liste
les lots encore en attente. Sans aucun lot branché, la page reste propre et complète.
