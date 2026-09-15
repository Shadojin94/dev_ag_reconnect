---
name: lancer-workflow
description: Exécute un ticket de développement avec la méthode Reconnect en cinq étapes, une reformulation à valider et un rapport de preuves. À utiliser pour passer d’un ticket prêt à un lot vérifié.
argument-hint: "<identifiant, chemin ou texte du ticket>"
---

# Exécuter un ticket en cinq étapes

Le ticket demandé est $ARGUMENTS. L’objectif est une livraison bornée et vérifiable, suivie d’une proposition de note durable. Conserve strictement les intitulés des étapes ci-dessous.

## 1 Cadrer

Trouve le ticket dans TICKETS-DEMAIN.md ou le chemin fourni ; si inaccessible, demande son texte. Lis objectif, Ready, Done, responsable, fichiers et dépendances.
Vérifie Ready. Pour une information non bloquante, annonce une hypothèse réversible. Si le contrat ou une source indispensable manque, signale précisément le blocage avant toute implémentation.
Ne crée ni ne modifie un ticket GitHub dans ce workflow.

## 2 Donner le contexte

Lis CLAUDE.md, README.md, docs/CONVENTIONS.md, le contrat sous src/types/ et le dossier attribué. Adapte les chemins au dépôt constaté.
Rassemble seulement le contexte utile au lot. Note les fichiers autorisés ; les types, services et fichiers des autres lots restent en lecture seule sauf attribution explicite du ticket.
Ne lis pas de secrets pour expliquer le projet et ne copie jamais de clé dans un rapport ou un fichier partagé.

## 3 Améliorer le prompt

Utilise la structure de /prompt-5 (ou reproduis-la si le skill n’est pas découvrable) :
[RÔLE], [CONTEXTE], [TÂCHE], [CONTRAINTES], [EXEMPLES].
Inclue les Ready, Done et le format attendu : fichiers modifiés, validation exécutée, résultat, blocages.
AFFICHE le prompt reformulé. ATTENDS un « ok » explicite sur ce prompt avant de passer à l’implémentation. Il s’agit du point de contrôle pédagogique demandé pour ce workflow.
Une correction du ticket revient à cette étape avec une reformulation à relire.

## 4 Lancer

Après l’accord, utilise l’outil Agent avec un sous-agent general-purpose par lot indépendant si cet outil et cette capacité sont disponibles. Ne lance pas deux lots qui écrivent dans les mêmes fichiers.
Transmets à chaque exécutant le prompt validé, son périmètre, le contrat et le format de retour. Précise qu’il n’est pas seul dans le dépôt et qu’il doit préserver le travail des autres.
Si les sous-agents ne sont pas disponibles, annonce-le et propose d’exécuter le même lot séquentiellement ; ne prétends pas qu’une délégation a eu lieu.
Exige les fichiers modifiés, la commande de validation réellement exécutée, son résultat et les blocages.
Ne fais aucun git push, déploiement ou fusion externe. N’ajoute pas de dépendance et ne sors pas des fichiers attribués sans accord explicite sur l’extension du périmètre.

## 5 Vérifier et garder

Relis le diff. Consulte package.json : exécute npm run lint et npm run build si ces scripts existent, puis une vérification du parcours adaptée au Done.
Une vérification impossible est « non vérifiée », avec la cause ; une commande planifiée n’est pas une commande exécutée.
Corrige les défauts de ton lot et rejoue les validations touchées. Après deux essais sans progression sur le même blocage, rends les faits, l’échec exact et la prochaine action ; n’entre pas dans une boucle sans fin.
Rends un rapport de dix lignes maximum : ticket, objectif, fichiers, Ready, validations, résultats, recette, limites, statut Done ou non, prochaine action.
Propose une entrée pour wiki/log.md et, si utile, une page dans wiki/pages/. Attends l’accord avant d’écrire cette connaissance durable.

## Critères de vérité

Aucun contact inventé. Aucune source dite consultée sans lecture réelle. Aucune disponibilité de modèle ou d’outil déduite de la seule présence d’un fichier.
Un fichier local se lit sans réseau ; un agent cloud et les services distants exigent toujours un accès fonctionnel.

