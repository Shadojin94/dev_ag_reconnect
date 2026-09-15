# `services/` — données et accès extérieur

**Propriétaire : rôle Données & Services.**

Tout ce qui sort de l'application : appels API, `fetch`, stockage local, données de démo.

Règles :
- un service expose des fonctions typées, jamais du JSON brut ;
- les composants n'appellent jamais `fetch` directement, ils passent par ici ;
- aucune clé d'API en dur dans le code — voir `.env.example` à la racine ;
  tout ce qui est préfixé `VITE_` finit dans le bundle, donc visible par l'utilisateur.

Tant que le vrai backend n'existe pas, les services renvoient des données de démo.
Le reste de l'app ne doit pas voir la différence le jour du branchement.
