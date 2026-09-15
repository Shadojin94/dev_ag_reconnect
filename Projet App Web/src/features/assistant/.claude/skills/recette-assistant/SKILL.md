---
name: recette-assistant
description: Rejoue la recette d'acceptation du lot ASSIST-01 sur la feature assistant — les deux parcours, conversationnel et guidé. Vérifie la langue reconnue dans le message, l'orientation vers les contacts, les états d'affichage, le repli français, le parcours clavier, l'écran 400 px et le bandeau mode sans IA, puis lint et build. À utiliser après toute modification de src/features/assistant/, et avant d'ouvrir ou de mettre à jour la pull request.
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

### Parcours conversationnel

| Contrôle | Ce qui est vérifié |
|---|---|
| `message français reconnu` | Un message libre produit `lang` et `category` sans réglage préalable |
| `besoin annoncé à l'usager` | L'assistant dit ce qu'il a compris avant de répondre |
| `fiche de connaissance affichée` | La réponse s'appuie sur les fiches de l'application |
| `orientation vers les contacts` | La section « Qui contacter » liste les structures du besoin |
| `mode réel annoncé` | Le bandeau affiche le mode que porte la donnée |
| `bascule en anglais toute seule` | Le message suivant, écrit en anglais, fait basculer la réponse |
| `écriture non couverte annoncée` | Un message en arabe déclenche l'avis bilingue, pas une réponse au hasard |
| `aucun résultat` / `erreur` | Les deux échecs sont dits à l'usager |
| `Entrée envoie le message` | La conversation se mène au clavier seul |
| `aucun débordement à 400 px` | Rien ne dépasse sur petit écran |

### Parcours guidé

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
`http://localhost:5173/src/features/assistant/preview/index.html`. Elle ouvre sur
la conversation ; le bouton « Parcours guidé » bascule sur l'autre écran. Côté
conversation, `answerFromFixtures` tient lieu de `src/services/orientation.ts` et
un bouton force une erreur de recherche. Elle existe
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

## Ce que l'assistant conversationnel n'est pas

Il ne contient aucun modèle de langue. Le repérage de la langue, le rattachement
au besoin et l'extraction des mots-clés sont des règles lisibles, dans
`interpretMessage.ts`. La réponse affichée est celle que renvoie la façade
commune, et le bandeau annonce le mode qu'elle déclare. Le jour où un endpoint
serveur validé existe, `explain` renvoie `mode: 'llm'` et l'écran le dit — sans
qu'une ligne de la feature change.

Deux langues seulement, `fr` et `en`, parce que le contrat commun n'en définit
pas d'autres. Un message écrit dans une autre écriture reçoit un avis affiché
dans les deux langues à la fois : choisir l'une reviendrait à supposer que
l'usager la lit.

## Limites

La recette éprouve la feature avec son jeu d'exemple. Elle ne prouve rien du
comportement réel avec les données de KB-01 et ANNU-01, ni d'un mode `'llm'`
connecté : cela demande la phase 2 d'INT-01 et un endpoint validé.

Playwright n'est pas une dépendance du projet — `package.json` n'est pas modifié.
Le script le cherche dans le cache de `npx` ; s'il est absent,
`npx playwright@latest --version` suffit à le déposer.
