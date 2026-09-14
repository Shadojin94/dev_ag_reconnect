---
name: rendu-onze
description: Rendre la landing page ONZE (Ashad/) dans Chrome et vérifier le résultat — captures desktop clair et sombre, mobile, survol du graphique de charge, sélecteur de poste, tableaux dépliés, menu mobile, plus les erreurs de console. À utiliser après toute retouche du HTML, du CSS ou du JS de Ashad/, et quand on demande à voir la page, la tester visuellement ou contrôler qu'une correction tient.
---

# Rendu et vérification de la page ONZE

La page est statique et sans build : `Ashad/index.html`, `Ashad/assets/styles.css`,
`Ashad/assets/app.js`. Rien à compiler, rien à servir — Chrome l'ouvre depuis
`file://`. La seule façon de savoir si une retouche tient, c'est de la regarder.

## Marche à suivre

Les deux scripts déduisent le projet de leur propre emplacement : ils se
lancent depuis n'importe quel dossier. Dans cet ordre :

```bash
bash Ashad/.claude/skills/rendu-onze/verifs.sh
node Ashad/.claude/skills/rendu-onze/rendu.mjs
```

`verifs.sh` d'abord : il coûte une seconde et évite de lancer un rendu sur un
fichier cassé. Il analyse le JS avec `node --check`, vérifie que les balises
HTML sont équilibrées et que les accolades CSS le sont aussi.

`rendu.mjs` écrit ensuite ses captures dans `/tmp/onze-rendu/` et sort en code 1
si la console du navigateur a dit quoi que ce soit.

**Puis ouvre les captures et regarde-les.** C'est l'étape qui compte, et c'est
celle qu'on saute. Les deux derniers défauts trouvés sur cette page — un bouton
d'en-tête qui passait sur deux lignes en 390 px, un lien de menu resté gris
parce que `.site-nav a` l'emportait sur `.site-nav__cta` — ne produisaient
aucune erreur de console. Seule la lecture de l'image les a montrés.

## Les vues

| Vue | Ce qu'elle sert à contrôler |
|---|---|
| `desktop-sombre`, `desktop-clair` | La page entière dans les deux thèmes |
| `mobile-sombre` | La page entière en 390 px |
| `hover-charge` | L'infobulle du graphique de charge, qui doit rester dans les bords du tracé |
| `scout` | Le sélecteur de poste, les fiches joueur et les barres groupées |
| `scout-mobile` | L'empilement de la fiche joueur sous 680 px |
| `tables` | Les équivalents tabulaires, qui défilent au lieu de se comprimer |
| `menu-mobile` | L'en-tête en 390 px, menu burger ouvert |

Une retouche ciblée n'exige pas tout le jeu :

```bash
node Ashad/.claude/skills/rendu-onze/rendu.mjs scout scout-mobile
```

Les vues pleine hauteur parcourent la page avant la capture, sinon les sections
animées par `IntersectionObserver` restent figées à `opacity: 0`.

## Ce qu'il faut regarder dans les captures

- **Les deux thèmes.** Un contraste juste en sombre peut être illisible en clair.
- **Les étiquettes de valeur des barres groupées.** Elles s'alignent sur la barre
  bleue (le joueur) et ne doivent jamais recouvrir la barre orange du profil type.
- **Les libellés qui se coupent en deux lignes.** Signe d'une colonne trop
  étroite — c'est déjà arrivé aux axes du scouting et aux en-têtes de tableau.
- **Les débordements.** Un tableau se fait défiler, il ne se comprime pas.
- **La barre d'en-tête en 390 px.** Elle tient sur une ligne, 68 px de haut.

## Réglages du script

`--page CHEMIN` pour viser un autre fichier, `--out DOSSIER` pour changer la
destination des captures.

Ce skill est rangé dans `Ashad/.claude/` et non à la racine : le dépôt est
partagé entre plusieurs participants, et les vues `hover-charge`, `scout` et
`tables` dépendent des sélecteurs propres à ONZE. Il n'a donc de sens que pour
ce dossier.

Playwright n'est pas une dépendance du dépôt : le script le cherche dans le
cache de `npx`, dont le nom de dossier change d'une machine à l'autre. S'il est
absent, `npx playwright@latest --version` suffit à le déposer. Le script se
lance sur le Chrome du système quand il en trouve un, parce que le Chromium
livré avec Playwright n'est pas toujours téléchargé.
