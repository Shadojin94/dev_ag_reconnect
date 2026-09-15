---
name: recette-assistant
description: Rejoue la recette d'acceptation du lot ASSIST-01 sur la feature assistant — question construite, quatre états d'affichage, repli français, parcours clavier, écran 400 px, bandeau mode sans IA — puis lint et build. À utiliser après toute modification de src/features/assistant/, et avant d'ouvrir ou de mettre à jour la pull request.
---

# Recette du lot ASSIST-01

Le ticket #4 demande six contrôles à la main dans le navigateur (5.3.a à 5.3.f).
Les refaire à la souris après chaque retouche coûte cher et se bâcle. Ce skill
les rejoue à l'identique, en quelques secondes, et dit lequel a lâché.

## Marche à suivre

Depuis `Projet App Web` :

```bash
npm run dev &                                        # si le serveur ne tourne pas
npm run lint
npm run build
node src/features/assistant/.claude/skills/recette-assistant/recette.mjs
```

Les trois commandes doivent passer. `npm run lint` ne doit **rien** écrire : si
oxlint affiche un nom de fichier avec un numéro de ligne, c'est une erreur à
corriger, pas un avertissement à ignorer. `npm run build` finit par `✓ built in`.

La recette sort en code 1 dès qu'un contrôle échoue ou que la console du
navigateur a parlé. Elle écrit ses captures dans `/tmp/assist` (`--out` pour
changer).

## Ce que chaque contrôle prouve

| Contrôle | Ce qui est vérifié |
|---|---|
| 5.3.a | Le parcours produit une `OrientationQuery` conforme ; une ville vide est omise, pas envoyée vide |
| 5.3.b | Les cinq états `idle`, `loading`, `empty`, `error`, `done` affichent chacun leur message |
| 5.3.c | Interface en anglais, fiche traduite en anglais, fiche sans traduction repliée en français, aucun `undefined` |
| 5.3.d | Chaque bouton est atteint par `Tab`, le contour de focus est visible, `Entrée` sélectionne comme un clic |
| 5.3.e | Aucun débordement horizontal à 400 px ; boutons et champs d'au moins 44 px |
| 5.3.f | Le bandeau « mode sans IA » s'affiche quand `explanation.mode` vaut `'fixture'` |

## La page d'aperçu

La recette s'appuie sur `src/features/assistant/preview/`, servie par Vite à
`http://localhost:5173/src/features/assistant/preview/index.html`. Elle existe
parce que le composant n'est pas monté dans `src/App.tsx` : ce fichier appartient
à l'intégration (INT-01), la feature n'y touche pas. L'aperçu monte l'assistant
avec un jeu d'exemple et des boutons pour forcer chaque état.

Elle n'entre pas dans le bundle : `vite build` ne part que de l'`index.html`
racine. Quand l'intégration aura branché l'assistant dans l'application, l'aperçu
reste utile pour éprouver les états d'erreur, difficiles à provoquer autrement.

## Après une correction, relire les captures

Les assertions ne voient pas tout. Deux défauts de ce lot sont passés au travers
d'un lint et d'un build verts : un débordement de 33 px à 400 px, parce que le
projet ne pose `box-sizing: border-box` que sur `#root` ; et un formulaire
entièrement centré, parce que `#root` porte `text-align: center`. Les deux ont
été vus à l'image, pas dans une sortie de commande.

## Limites

La recette éprouve la feature avec son jeu d'exemple. Elle ne prouve rien du
comportement réel avec les données de KB-01 et ANNU-01, ni d'un mode `'llm'`
connecté : cela demande la phase 2 d'INT-01 et un endpoint validé.

Playwright n'est pas une dépendance du projet — `package.json` n'est pas modifié.
Le script le cherche dans le cache de `npx` ; s'il est absent,
`npx playwright@latest --version` suffit à le déposer.
