# `components/` — bibliothèque d'interface partagée

**Propriétaire : rôle Front & UI.**

Composants réutilisables et sans métier : `Button`, `Card`, `Modal`, `Input`…
Un composant a sa place ici s'il est utilisé par au moins deux features,
ou s'il est purement présentationnel.

Règles :
- aucun appel réseau, aucun accès direct aux données — les données arrivent en props ;
- un dossier par composant : `Button/Button.tsx`, `Button/Button.module.css` ;
- les couleurs, espacements et polices viennent des tokens de `styles/`, jamais en dur.
