# Process de livraison — de la fin du lot au lien public

Ce document décrit, en gestes, tout ce qui se passe entre « j'ai fini mon lot »
et « n'importe qui peut ouvrir le lien et voir mon travail ». Même format que
le ticket #1 : **Fais / Tape / Tu dois voir / Si ça ne marche pas**.

---

## A. Côté apprenant — livrer son lot

### A.1 Se remettre à jour sur `main`
**Fais :** dans ta branche (`feat/...`), récupère les derniers changements de `main`
(contrat, façade, corrections d'autres lots déjà fusionnés).
**Tape :**
```bash
git checkout main && git pull
git checkout ta-branche
git merge main
```
**Tu dois voir :** `Already up to date.` ou un merge sans conflit.
**Si ça ne marche pas :** conflit → `docs/WORKFLOW-GIT.md`, section « Conflits ». Ne jamais écraser le travail d'un autre.

### A.2 Brancher sa page dans l'intégration
**Fais :** ouvre `src/app/pages/<prenom>.tsx` (ton fichier, créé par l'intégration).
Décommente les 3 lignes indiquées pour brancher ton lot (import + rendu).
**Tu dois voir :** ta page affiche ton composant réel, plus l'état « lot en attente ».
**Si ça ne marche pas :** le fichier n'existe pas encore → préviens Cédric, ne crée pas ce fichier toi-même, ce n'est pas ton périmètre.

### A.3 Lint, build
**Tape :**
```bash
npm run lint
npm run build
```
**Tu dois voir :** rien en sortie pour le lint (silence = succès), `✓ built in ...` pour le build.
**Si ça ne marche pas :** corrige avant de pousser. Une PR qui ne build pas attend.

### A.4 Push et pull request
**Tape :**
```bash
git add .
git commit -m "feat(<lot>): ..."
git push -u origin ta-branche
```
**Fais :** ouvre la PR sur GitHub, le gabarit se remplit automatiquement
(`.github/PULL_REQUEST_TEMPLATE.md`). Coche les 6 points, colle les 2 dernières
lignes de lint et build, mets `Closes #N`.

### A.5 Attendre le check CI vert
**Fais :** onglet Checks de la PR, attends « Vérifier les pull requests ».
**Tu dois voir :** coche verte sur `lint-build`.
**Si ça ne marche pas :** rouge → ouvre le log, corrige sur la même branche, repousse. Ne demande pas de relecture tant que ce n'est pas vert.

---

## B. Côté Cédric — relire et fusionner

### B.1 Relire (checklist 6 points, ticket #1 phase 2.1)
1. Seuls `src/features/<lot>/`, `wiki/`, et `src/app/pages/<prenom>.tsx` sont touchés.
2. `Closes #N` présent.
3. Lint + build collés dans la PR.
4. Aucune coordonnée sans `source`.
5. Aucun `any`.
6. L'auteur explique chaque ligne (question au hasard).

### B.2 Tester en local
**Tape :**
```bash
gh pr checkout <numero>
npm run lint
npm run build
npm run dev
```
**Fais :** joue le parcours concerné dans le navigateur.
**Tu dois voir :** aucune erreur, parcours fonctionnel.
**Si ça ne marche pas :** commente l'erreur exacte sur la PR, ne fusionne pas, passe à la suivante dans l'ordre annoncé (KB-01, ANNU-01, ASSIST-01).

### B.3 Approve + Merge
**Fais :** « Approve », puis bouton **« Squash and merge »** (recommandé).
**Pourquoi Squash :** chaque apprenant fait des commits de travail ("wip", "fix typo") ;
squash regroupe tout en un seul commit propre sur `main`, avec le titre de la PR
comme message — l'historique de `main` reste lisible, un commit = une feature livrée.
**Fais ensuite :** supprimer la branche (bouton proposé après le merge).

---

## C. Publication automatique

Au merge sur `main`, `.github/workflows/pages.yml` se déclenche seul :
1. build du MVP avec `BASE_PATH=/dev_ag_reconnect/mvp/`,
2. assemblage de tous les sites dans `_site/`,
3. publication sur GitHub Pages.

Compte **~2 minutes**.

**Fais :** onglet **Actions** du dépôt, attends que « Publier les sites » passe au vert.
**Tu dois voir :** exécution verte, puis ouvre :
- MVP global : https://shadojin94.github.io/dev_ag_reconnect/mvp/
- Page de Romain : https://shadojin94.github.io/dev_ag_reconnect/mvp/#/romain
- Page de Nils : https://shadojin94.github.io/dev_ag_reconnect/mvp/#/nils
- Page d'Ashad : https://shadojin94.github.io/dev_ag_reconnect/mvp/#/ashad

**Si ça ne marche pas :** rouge → ouvre le log de l'étape en échec, corrige sur une
branche, PR, refusionne. La page affiche encore l'ancienne version → GitHub Pages
met en cache : fais un **hard refresh (Ctrl+F5)** avant de conclure à un problème.
Ne dis jamais « publié » sans avoir vu le vert **et** ouvert le lien.

---

## D. Ordre de merge et conflits sur `wiki/log.md`

**Ordre recommandé :** KB-01 (Romain) → ANNU-01 (Nils) → ASSIST-01 (Ashad), comme annoncé
en phase 1.2 du ticket #1. Après chaque fusion : `git checkout main && git pull`
avant d'ouvrir la PR suivante, pour repartir d'un `main` à jour.

`wiki/log.md` est un fichier partagé : plusieurs PR peuvent y ajouter une entrée
au même endroit → conflit quasi garanti au merge séquentiel.

**Fais en cas de conflit sur `wiki/log.md` :** ouvre le fichier marqué, **garde les
deux blocs** (le tien et celui déjà fusionné), l'un après l'autre par ordre chronologique.
Ne supprime jamais l'entrée d'un autre.
```bash
git checkout main && git pull
git checkout ta-branche
git merge main
# éditer wiki/log.md : garder les deux entrées
git add wiki/log.md && git commit
git push
```

---

## E. Si ça casse

**Fais :** jamais de correction en urgence directement sur `main`, jamais de
`git push --force`, jamais de désactivation de `.github/workflows/pages.yml`.

**Rollback propre :**
```bash
git checkout main && git pull
git revert -m 1 <sha-du-commit-de-merge>
git push
```
Ouvre une PR normale avec ce revert si la branche `main` est protégée (relecture
même pour un rollback). Le `-m 1` est nécessaire car un merge a deux parents :
il dit à `git revert` de revenir au parent côté `main`.
**Tu dois voir :** un nouveau commit qui annule le précédent, `main` qui build de nouveau,
l'exécution Actions repasse au vert.

---

## F. Tableau projet 4 — écriture ouverte aux apprenants

Depuis aujourd'hui, Romain, Nils et Ashad ont la permission `write` du dépôt :
ils peuvent modifier et enrichir **leurs propres tickets** et déplacer leurs
cartes sur https://github.com/users/Shadojin94/projects/4 (colonnes To do /
In Progress / Done).

**Règle :** toute modification d'un ticket (texte, checklist, statut) s'annonce
à voix haute **et** s'écrit en commentaire de l'issue. On ne réécrit jamais
l'historique d'un ticket (pas d'édition silencieuse d'un commentaire déjà lu
par quelqu'un d'autre) — on ajoute un commentaire qui explique le changement.

---

## G. Cheat sheet — commandes de Cédric, en un bloc

```bash
# Relire une PR
gh pr view <numero>
gh pr diff <numero>

# Tester en local
gh pr checkout <numero>
npm run lint
npm run build
npm run dev

# Fusionner (si tout est vert et la checklist passe)
gh pr merge <numero> --squash --delete-branch

# Revenir sur main à jour avant la PR suivante
git checkout main && git pull

# Vérifier la publication automatique
gh run watch
# puis ouvrir :
# https://shadojin94.github.io/dev_ag_reconnect/mvp/
```
