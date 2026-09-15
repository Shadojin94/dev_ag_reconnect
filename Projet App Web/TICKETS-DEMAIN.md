# Tickets de la matinée — 15 septembre 2026

Ces quatre tickets sont des propositions à valider avec le PO. Les identifiants sont pédagogiques, pas des numéros d’issues GitHub. Les quantités et heures sont des objectifs de séance ; aucun ticket n’est déclaré publié. Vérifiez le backlog existant avant de créer ou de recopier une issue.

Les chemins ci-dessous sont relatifs à la racine de l’application « Projet App Web ». Les trois features doivent être préparées par l’intégration avant le lancement.

## KB-01 — Base de connaissances sourcée

**Responsable proposé :** Romain  
**Branche proposée :** `feat/base-connaissances`  
**Objectif SMART :** À 10h45, proposer huit fiches issues des sources validées, searchKnowledge(query) et KnowledgeList, avec source et repli de langue ; lint et build réussissent.

### Ready

- [ ] Contrat src/types/orientation.ts partagé et lu.
- [ ] Catégories, langues et huit sources ou fiches cibles validées par le PO.
- [ ] Copies de pages disponibles ou collecte testée ; branche à jour et lot attribué.

### Done

- [ ] Huit KnowledgeItem typés : titre, résumé, catégorie, mots-clés, source et date réelle de consultation ; traductions validées ou explicitement signalées.
- [ ] Recherche par catégorie testée et résultat vide traité ; langue absente : repli en français.
- [ ] KnowledgeList montre le lien source ; aucune information absente n’est inventée ; lint et build réussissent, diff relu.

### Fichiers attribués

- `src/features/base-connaissances/**`

### Dépendances

- INT-01 phase 1 : contrat et façade stub prêts avant lancement.

### Repli sans réseau

Utiliser les copies de sources déjà enregistrées. Sans source exploitable, réduire le jeu avec accord du PO ou utiliser un cas d’école explicitement fictif ; ne pas rédiger de conseil à partir de la seule mémoire du modèle.

## ASSIST-01 — Assistant multilingue simple

**Responsable proposé :** Ashad  
**Branche proposée :** `feat/assistant`  
**Objectif SMART :** À 10h45, fournir un parcours langue → besoin → ville qui émet OrientationQuery et affiche une réponse sourcée dans la langue choisie : mode LLM si l’endpoint serveur est prêt et validé, sinon repli annoncé sans IA ; lint et build réussissent.

### Ready

- [ ] Contrat et façade stub disponibles pour travailler sans les autres lots.
- [ ] Langues de démonstration et libellés français validés par le PO.
- [ ] PO : choisir avant lancement le mode connecté si un endpoint serveur est prêt et validé (clé côté serveur, sources renvoyées), sinon le repli avec textes préparés. La construction d’un backend supplémentaire exige un périmètre séparé.

### Done

- [ ] Même jeu de libellés pour les langues retenues, avec repli français si une traduction manque.
- [ ] Choisir un besoin produit une OrientationQuery valide ; les états chargement, aucun résultat et erreur sont affichés. La recette indique le mode réellement testé : réponse LLM sourcée via endpoint validé, ou réponse préparée marquée sans IA.
- [ ] Parcours utilisable au clavier et sur écran étroit, boutons d’au moins 44 px ; lint et build réussissent, diff et capture relus.

### Fichiers attribués

- `src/features/assistant/**`

### Dépendances

- INT-01 phase 1 : contrat et façade stub.

### Repli sans réseau

Afficher les explications et traductions embarquées, identifiées « mode sans IA », lorsqu’aucun endpoint valide n’est accessible. En mode connecté, la clé reste côté serveur et la source de la réponse est visible. Un agent cloud ne continue pas automatiquement hors ligne.

## ANNU-01 — Annuaire et contacts vérifiables

**Responsable proposé :** Nils  
**Branche proposée :** `feat/annuaire`  
**Objectif SMART :** À 10h45, proposer six structures de la ville choisie, findOrganisations(query) et OrganisationList avec des coordonnées sourcées et un lien carte si l’adresse est disponible ; lint et build réussissent.

### Ready

- [ ] Contrat partagé et ville de démonstration fixés.
- [ ] Six structures cibles et sources disponibles validées avec le PO.
- [ ] Lien carte externe retenu pour la matinée ; branche à jour et lot attribué.

### Done

- [ ] Six Organisation typées, avec source et ville ; téléphone, e-mail, horaires ou adresse inconnus restent absents.
- [ ] Filtre par ville et catégorie vérifié ; ville inconnue : résultat vide ; aucun bouton de contact sans valeur sourcée.
- [ ] Carte liée seulement si l’adresse est disponible ; le fonctionnement du site externe est distingué de l’URL construite ; lint et build réussissent, diff relu.

### Fichiers attribués

- `src/features/annuaire/**`

### Dépendances

- INT-01 phase 1 : contrat partagé.

### Repli sans réseau

Utiliser les coordonnées des copies déjà vérifiées. Sans source, laisser les champs absents et ne pas inventer une structure réelle ; un cas d’école doit porter clairement la mention fictif. La carte externe nécessite le réseau.

## INT-01 — Contrat commun et intégration

**Responsable proposé :** Cédric  
**Branche proposée :** `integration/mvp`  
**Objectif SMART :** À 9h55, partager un contrat et une façade stub ; à 12h00, intégrer les trois lots avec lint et build réussis, puis présenter à 12h15 un parcours complet et ses limites.

### Ready

- [ ] PO : ville, catégories, langues, données et mode sans IA confirmés.
- [ ] Périmètres attribués et conventions relues ; l’état réel des tickets GitHub est contrôlé.
- [ ] Squelette ouvrable et ordre d’intégration annoncé à l’équipe.

### Done

- [ ] src/types/orientation.ts et src/services/orientation.ts donnent les mêmes signatures aux trois lots ; les modifications du contrat sont annoncées.
- [ ] Assemblage dans src/app/ ; les lots exposent leurs fonctions et composants via index.ts sans import interne entre features.
- [ ] Lint et build réussissent après intégration ; recette besoin → réponse → organisme → contact disponible, plus cas vide et mode sans IA ; limites consignées.

### Fichiers attribués

- `src/app/**`
- `src/types/**`
- `src/services/**`
- `src/styles/**`
- `src/App.tsx`
- `src/App.css`
- `src/main.tsx`
- `src/index.css`
- `index.html`
- `docs/**`

### Dépendances

- Phase 1 avant les lots ; phase 2 après leur relecture. Ordre proposé : KB-01 → ANNU-01 → ASSIST-01.

### Repli sans réseau

Assembler localement les fichiers et branches déjà disponibles après relecture. Partage GitHub, nouvelles dépendances, outils distants et cartes attendent le retour du réseau. Ne pas annoncer de validation sur téléphone si elle n’a pas eu lieu.

