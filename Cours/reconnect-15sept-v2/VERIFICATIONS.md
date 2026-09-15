# Vérifications de la livraison

Contrôles réalisés le 14 septembre 2026 sur les supports de formation. L’application Reconnect Assist constitue l’exercice à réaliser pendant la séance ; cette livraison ne signifie pas que son MVP est déjà développé.

## Cours HTML

- 36 écrans contrôlés sur ordinateur (1440 × 900) et mobile (390 × 844).
- 20 contrôles automatiques réussis : navigation clavier et boutons, sommaire et recherche, détail théorique, retour de copie, liens directs, absence d’erreur JavaScript et de débordement horizontal.
- Chaque écran de présentation tient dans la hauteur contrôlée sur ordinateur. Le mobile utilise le défilement vertical.
- Aucun appel réseau au chargement ni pendant les interactions testées. Les polices sont intégrées au fichier HTML ; les liens vers les documentations demandent une connexion.
- Revue visuelle des 36 écrans sur ordinateur et d’un échantillon sur mobile. Impression locale générée.

## PowerPoint et kit

- 36 diapositives éditables et 36 pages de notes. Les prompts longs abrégés à l’écran sont disponibles intégralement dans les notes et le HTML.
- Revue visuelle indépendante des 36 diapositives ; contrôle des zones de texte, du paquet PPTX et de la présence du contenu dans les notes.
- PDF exporté par PowerPoint. Polices embarquées ; Georgia est utilisée à la place de Fraunces pour les titres du PowerPoint.
- Cohérence statique vérifiée entre les cinq étapes, les trois skills, les quatre tickets et le contrat de données.
- Les commandes et connexions aux services externes restent à essayer sur les postes apprenants. Le test réel des skills dans Claude n’a pas été exécuté : le contrôle automatique d’autorisation a refusé l’envoi de leur contenu et des tickets à ce service externe. Aucun contournement n’a été tenté.

## Préservation

Les fichiers d’origine restent à leurs emplacements. Deux archives de sauvegarde ont été vérifiées par SHA-256. L’empaquetage final compare à nouveau les 49 fichiers source du workspace et les 16 anciens supports à leurs manifestes, puis relit chaque entrée des archives de livraison.

Les rapports détaillés restent dans le dossier de travail : build/qa-html/report.json, build/qa-contenu-kit.json, build/qa-pptx/ et build/delivery-verification.json. Les captures de contrôle ne sont pas incluses dans l’archive de diffusion.
