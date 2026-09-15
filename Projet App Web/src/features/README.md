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
