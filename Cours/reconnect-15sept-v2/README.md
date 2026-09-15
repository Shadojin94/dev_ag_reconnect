# Reconnect — Développer avec des agents

Support de formation du 15 septembre 2026 : 36 écrans, théorie de référence, exercices courts et kit de travail. Il prépare la matinée du MVP Reconnect Assist ; l’application reste à développer et à vérifier pendant la séance.

## Ouvrir

- Double-cliquez sur [index.html](index.html) pour le deck local.
- Ouvrez [le PowerPoint](output/Reconnect-cours-agents-15-09-2026.pptx) pour projeter et utiliser les notes du formateur.
- Retrouvez [le kit](kit/README.md), les [tickets proposés](kit/TICKETS-DEMAIN.md) et les [sources](kit/SOURCES.md).
- Consultez les [vérifications et limites](VERIFICATIONS.md).

## Parcourir et garder

Dans le deck : flèches ou PageUp/PageDown pour naviguer, Espace pour avancer, S pour le sommaire, D pour les explications « Théorie ». Le bouton Copier reprend un prompt ; Ctrl+P ou le menu d’impression du navigateur prépare le support à conserver. Les commandes et services externes ne s’exécutent pas à l’ouverture du deck.

Les cinq étapes restent identiques dans le support et les skills :
1 Cadrer · 2 Donner le contexte · 3 Améliorer le prompt · 4 Lancer · 5 Vérifier et garder.

## Installer le kit

Copiez les trois dossiers de kit/.claude/skills/ dans le .claude/skills/ de l’application. Copiez aussi TICKETS-DEMAIN.md, CONTRAT-DONNEES.md et le dossier wiki/ à la racine de l’application avant d’appeler un ticket par son identifiant. Ajoutez les fichiers sans remplacer votre configuration existante ; fusionnez les règles de CLAUDE-exemple.md et CLAUDE-wiki.md. Ouvrez Claude Code CLI dans le projet ou une session locale de l’onglet Code du Desktop, puis essayez /prompt-5.

L’installation des outils, la découverte des skills et les connexions sur les postes apprenants restent à vérifier. Les notices distinguent documentation consultée et exécution réelle. Le mode LLM du MVP suppose un endpoint serveur prêt et validé ; le repli sans IA doit être annoncé.

## Régénérer

Le HTML demande Node.js. Le PowerPoint demande Windows, PowerShell et Microsoft PowerPoint installé. Depuis ce dossier :

```powershell
node build/build-html.mjs
powershell.exe -NoProfile -ExecutionPolicy Bypass -File build/build-pptx.ps1
```

Le contenu commun se trouve dans build/contenu.json ; build/tickets.json porte les quatre tickets. Le style est décrit dans DESIGN.md. Avant de régénérer le PowerPoint, déplacez le PPTX existant vers un dossier de version précédent : le script refuse de l’écraser. Les fichiers générés doivent être vérifiés de nouveau après une modification du contenu.

## Revenir à l’état initial

Dans le dossier de travail, voir [la procédure de retour arrière](../../sauvegardes/RETOUR-ARRIERE.md). Cette livraison est isolée dans son dossier ; les anciens supports sont conservés. Les sauvegardes restent à côté du dossier Cours et ne sont pas incluses dans l’archive de diffusion du support.
