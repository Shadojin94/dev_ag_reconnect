# Reconnect Assist

## Projet
- Assistant web d’orientation vers des structures sociales.
- Stack constatée : React, Vite, TypeScript ; identifiants en anglais, UI en français.
- Lire README.md, docs/CONVENTIONS.md et le ticket avant de modifier.

## Commandes
- npm run dev : serveur local.
- npm run lint : analyse du code.
- npm run build : vérification TypeScript puis build Vite.
- Ne pas installer de nouvelle dépendance sans accord.

## Conventions
- Composants PascalCase, hooks useCamelCase, dossiers kebab-case.
- Props typées ; pas de any ; CSS Modules à côté des composants.
- Styles depuis les tokens existants de src/styles/.
- Accès aux données dans src/services/, pas de fetch dans les composants.

## Périmètres proposés
- Romain : src/features/base-connaissances/.
- Ashad : src/features/assistant/.
- Nils : src/features/annuaire/.
- Intégration : src/types/, src/services/, src/app/ et assemblage.
- Aucun changement du contrat partagé sans coordination.

## Vérifier
- Source obligatoire pour toute coordonnée ; champ inconnu = absent.
- Ne jamais afficher une clé ni écrire un secret dans le dépôt.
- Préserver .env, les fichiers d’autres lots et les changements existants.
- Relire le diff, lint, build et parcours utilisateur avant de dire Done.
- Rapport : fichiers, commandes exécutées, résultats, limites.
- Aucun push ou déploiement sans autorisation explicite.

## Wiki
- Sources d’origine dans wiki/raw/ : conserver leur contenu et leur date de collecte.
- Synthèses dans wiki/pages/ : une idée utile par page, reliée à sa source.
- Avant d’ajouter, consulter wiki/index.md pour éviter les doublons.
- Ingest : proposer une synthèse sourcée ; ne pas effacer l’original.
- Query : répondre avec les liens des pages et distinguer fait, hypothèse et manque.
- Lint : signaler contradictions, liens cassés, dates absentes et pages isolées.
- Après une modification validée, actualiser wiki/index.md et wiki/log.md.
- Une source non consultée ne devient pas vérifiée ; aucun secret ni donnée personnelle d’usager.
- Demander l’accord avant d’inscrire une nouvelle décision durable issue d’une session.
