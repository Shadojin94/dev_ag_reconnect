# Rôles de l'équipe

Quatre rôles, un par personne. Le rôle dit **ce dont tu es responsable**, pas
ce que tu as le droit de toucher : tout le monde peut lire et proposer partout,
mais une modification dans un périmètre passe par une relecture de son titulaire.

> **À remplir en séance.** Les noms ci-dessous sont des emplacements vides.
> Chacun inscrit son nom en face du rôle qu'il prend, puis on commite le fichier.

| Rôle | Qui ? | Périmètre principal |
|---|---|---|
| **Front & UI** | _à définir_ | `src/components/`, `src/app/` (rendu) |
| **Données & Services** | _à définir_ | `src/services/`, `src/types/` |
| **Design & Contenu** | _à définir_ | `src/styles/`, textes, accessibilité |
| **Intégration & QA** | _à définir_ | `src/app/`, build, revue des PR, `docs/` |

Tout le monde développe des features dans `src/features/`, chacun dans son dossier.

---

## Front & UI

Construit la bibliothèque de composants réutilisables et l'assemblage visuel des écrans.

- crée et maintient `src/components/` : composants sans métier, typés, réutilisables ;
- veille à ce qu'un même bouton ne soit pas réécrit trois fois dans trois features ;
- consomme les tokens du design system, ne redéfinit pas de couleurs à la main ;
- arbitre : « ce composant est-il assez générique pour monter dans `components/` ? »

**Livrable de fin de projet :** une bibliothèque de composants documentée, utilisée
par au moins deux features différentes.

## Données & Services

Possède la frontière entre l'application et le monde extérieur.

- définit les types de données partagés (`src/types/`) — c'est le contrat que tout le monde suit ;
- écrit les services d'accès (`src/services/`) : appels API réels ou données de démo ;
- gère les variables d'environnement et la question des secrets ;
- prévient toute l'équipe quand un type change, parce que ça casse le code des autres.

**Livrable :** des services typés que l'on peut rebrancher sur un vrai backend
sans toucher aux composants.

## Design & Contenu

Responsable de ce que l'utilisateur voit et lit.

- définit les tokens : palette, typographie, espacements, rayons, thème clair/sombre ;
- écrit les textes de l'interface (titres, libellés, messages d'erreur, états vides) ;
- tient la barre sur l'accessibilité : contrastes, focus clavier, textes alternatifs,
  structure de titres ;
- vérifie le rendu sur mobile — la démo sera regardée sur un téléphone.

**Livrable :** un design system cohérent et une app lisible au clavier comme à la souris.

## Intégration & QA

Garde l'application en état de marche pendant que trois autres personnes la modifient.

- possède `src/app/` : routing, providers, assemblage des features ;
- relit et fusionne les pull requests, tranche les conflits ;
- fait tourner `npm run build` et `npm run lint` avant chaque fusion —
  ce qui ne build pas ne part pas sur `main` ;
- tient `docs/DECISIONS.md` à jour ;
- prépare la démo finale et vérifie qu'elle tourne sur une machine vierge.

**Livrable :** une branche `main` qui build à tout moment, et une démo qui ne plante pas.

---

## Ce que chacun fait, quel que soit son rôle

- développer au moins une feature complète dans `src/features/` ;
- relire les PR des autres, même hors de son périmètre — c'est là qu'on apprend le plus ;
- signaler tôt ce qui bloque, plutôt que la veille de la démo.

## Faire tourner les rôles

À mi-parcours, chacun change de rôle une séance. Personne ne doit finir la formation
en n'ayant vu qu'un seul bout de la chaîne — et un rôle ne se comprend vraiment
qu'en récupérant le travail de quelqu'un d'autre.
