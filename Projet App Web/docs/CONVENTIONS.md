# Conventions de code

Le but n'est pas d'avoir raison sur le style, c'est que quatre personnes
écrivent un code qui se lit comme s'il venait d'une seule.

## Nommage

| Quoi | Forme | Exemple |
|---|---|---|
| Composant React | PascalCase | `ProfilUtilisateur.tsx` |
| Hook | `use` + camelCase | `useDonneesProfil.ts` |
| Fonction, variable | camelCase | `formaterDate` |
| Type, interface | PascalCase | `type Utilisateur` |
| Constante globale | SCREAMING_SNAKE | `URL_API` |
| Dossier | kebab-case | `ecran-accueil/` |

Code en anglais ou en français : peu importe, mais **on ne mélange pas dans un
même fichier**. Décision par défaut du projet : identifiants en anglais,
textes affichés à l'utilisateur en français.

## TypeScript

- pas de `any`. Si le type est inconnu, c'est `unknown` et on le rétrécit ;
- les props de chaque composant sont typées explicitement ;
- on laisse TypeScript inférer les types de retour évidents, on ne les écrit pas pour rien.

## Composants

- un composant, un fichier ;
- au-delà de ~150 lignes, découper ;
- pas de logique de données dans le JSX : extraire dans un hook ;
- pas de `fetch` dans un composant : passer par `src/services/`.

## CSS

- CSS Modules (`Composant.module.css`) à côté du composant ;
- les valeurs viennent des tokens de `src/styles/` — pas de `#hex` ni de `16px` en dur ;
- mobile d'abord : on écrit le petit écran, puis on élargit.

## Avant de pousser

```bash
npm run lint
npm run build
```

Les deux passent, ou la branche n'est pas prête.

## Code écrit avec l'IA

C'est une formation de développeur augmenté : générer du code avec un assistant
est attendu, pas toléré.

La seule règle : **tu es responsable de ce que tu proposes en PR.**
Si tu ne peux pas expliquer une ligne en relecture, elle ne part pas —
soit tu la comprends, soit tu la réécris.
