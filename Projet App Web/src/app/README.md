# `app/` — coquille de l'application

**Propriétaire : rôle Intégration & QA.**

Point d'assemblage : montage React, routing, providers globaux (thème, état, contexte).
C'est le seul endroit où les features se branchent les unes aux autres.

Règle : ne jamais écrire de logique métier ici. Si un fichier de `app/` grossit,
c'est que du code aurait dû partir dans `features/`.

Modifier ce dossier touche tout le monde → toute PR ici demande une relecture.
