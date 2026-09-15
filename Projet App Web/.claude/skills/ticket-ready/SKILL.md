---
name: ticket-ready
description: Transforme un besoin de développement en ticket SMART, Ready et Done avec un périmètre de fichiers. À utiliser pour préparer une tâche du backlog.
argument-hint: "<besoin et échéance si connue>"
---

# Rendre un ticket prêt à travailler

Lis $ARGUMENTS et les conventions locales utiles. Cette tâche produit un ticket, pas une implémentation ni une publication dans GitHub.

Retourne :
1. Titre : changement concret, court.
2. Objectif SMART : utilisateur concerné, résultat mesurable et échéance. Si quantité ou heure manque, indique « à confirmer » ou formule une proposition explicitement nommée.
3. Ready : trois conditions vérifiables avant de démarrer.
4. Done : trois critères observables après la livraison, dont la validation adaptée au changement.
5. Fichiers : liste des chemins autorisés et points communs en lecture seule.
6. Dépendances : décision, données ou contrat attendus.
7. Plan sans réseau : uniquement ce qui est déjà disponible localement.
8. Responsable et statut : nom fourni, sinon « à attribuer » ; statut « proposé » jusqu’à validation.

Pour Reconnect Assist, chaque lot écrit uniquement dans son src/features/<lot>/ ; l’intégration possède les types et l’assemblage. Réutilise les noms réels du dépôt plutôt que créer une architecture parallèle.
Ne crée aucun numéro GitHub imaginaire. Si un identifiant pédagogique existe, conserve-le tel quel.
Une information sociale, une adresse ou un numéro de téléphone doit venir d’une source : inconnu = absent.
Termine par l’unique information bloquante à préciser, s’il en existe une. Ne fais aucun appel GitHub de création ou de mise à jour.

