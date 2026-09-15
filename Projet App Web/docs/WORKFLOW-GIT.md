# Workflow Git

Le dépôt est partagé par toute la formation. Ce projet vit dans `Projet App Web/`
et ne touche jamais aux dossiers personnels (`Cedric/`, `Nils/`, `Ashad/`, `romain/`).

Règle d'or : **on ne pousse jamais directement sur `main`.** Une branche, une PR, une relecture.

## Le cycle, à chaque fois

```bash
# 1. Partir de la dernière version de main
git checkout main
git pull

# 2. Créer sa branche
git checkout -b feat/nom-de-la-feature

# 3. Travailler, commiter par petits bouts
git add .
git commit -m "feat(profil): affiche l'avatar de l'utilisateur"

# 4. Publier la branche
git push -u origin feat/nom-de-la-feature

# 5. Ouvrir la pull request sur GitHub, demander une relecture

# 6. Une fois fusionnée, nettoyer
git checkout main
git pull
git branch -d feat/nom-de-la-feature
```

## Nommer sa branche

`type/description-courte-en-minuscules`

| Préfixe | Quand |
|---|---|
| `feat/` | nouvelle fonctionnalité |
| `fix/` | correction de bug |
| `style/` | présentation, design, CSS |
| `docs/` | documentation |
| `refactor/` | réorganisation sans changement de comportement |
| `chore/` | outillage, config, dépendances |

Exemples : `feat/ecran-accueil`, `fix/bouton-invisible-mobile`, `style/tokens-couleurs`.

## Écrire un message de commit

Format : `type(portée): ce que fait le commit, à l'infinitif ou au présent`

```
feat(accueil): ajoute la liste des projets récents
fix(api): corrige le crash quand la réponse est vide
style(tokens): passe la palette en OKLCH
```

Un commit = un changement cohérent. Si le message a besoin d'un « et », c'est
probablement deux commits.

## Pull requests

Une PR contient : ce que ça fait, comment le tester, et une capture si c'est visuel.
Le gabarit se remplit tout seul à l'ouverture.

- **Petite.** Une PR de 200 lignes est relue sérieusement ; une PR de 2000 lignes
  est approuvée sans être lue. Découper vaut mieux qu'expliquer.
- **Une relecture minimum** avant fusion, par le titulaire du périmètre touché.
- **Le build passe** (`npm run build` et `npm run lint`) — sinon la PR attend.
- Relire n'est pas chercher la faute : poser une question sur du code qu'on ne
  comprend pas est déjà une relecture utile.
- Un check automatique (CI) lint+build tourne sur chaque PR ; rouge = pas de merge.

## Conflits

Un conflit n'est pas une erreur, c'est deux personnes sur le même fichier.

```bash
git checkout main && git pull
git checkout ma-branche
git merge main
# résoudre les fichiers marqués, puis :
git add . && git commit
```

En cas de doute sur quelle version garder : demander à l'auteur de l'autre côté.
Ne jamais écraser le travail de quelqu'un « pour que ça compile ».

La meilleure protection reste le découpage : chacun dans son dossier de `src/features/`.

## À ne pas commiter

`node_modules/`, `dist/`, `.env`, les fichiers de l'éditeur. Le `.gitignore` s'en charge.
Si un secret part par erreur : prévenir tout de suite et révoquer la clé.
La retirer d'un commit ne la retire pas de l'historique.
