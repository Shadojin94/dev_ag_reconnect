# `features/` — modules fonctionnels

**Propriétaire : partagé — un dossier par personne, pas de fichier à deux mains.**

Chaque écran ou fonctionnalité de la démo vit dans son propre dossier, autonome :

```
features/
  ma-feature/
    MaFeature.tsx       écran principal
    components/         composants internes, non réutilisés ailleurs
    useMaFeature.ts     logique et état local
    index.ts            ce que la feature expose au reste de l'app
```

C'est le découpage qui évite les conflits Git : deux personnes qui travaillent
dans deux features différentes ne touchent jamais les mêmes fichiers.

Une feature n'importe jamais l'intérieur d'une autre feature — seulement son `index.ts`.

## Brancher ton lot dans l'app

Exposer ton lot dans `index.ts` ne suffit pas : l'application ne le montrera que
lorsque tu l'auras déclaré dans **ton** fichier de page, `src/app/pages/<prenom>.tsx`
(`romain.tsx`, `nils.tsx`, `ashad.tsx`). Ce fichier t'appartient : personne d'autre n'y écrit.

Il commence par huit lignes de mode d'emploi et contient trois marqueurs
« À DÉCOMMENTER » : l'import de ton lot, les champs qu'il fournit à l'accueil,
et `ready: true`. Tant que tu ne les as pas décommentés, ta page et l'accueil
affichent proprement « lot en attente » — jamais une page cassée.

Le détail du mécanisme (registre, routage par hash, qui possède quoi) est dans
`src/app/README.md`.
