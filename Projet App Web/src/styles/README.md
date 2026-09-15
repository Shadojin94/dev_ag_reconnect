# `styles/` — design system

**Propriétaire : rôle Design & Contenu.**

Tokens (couleurs, typographie, espacements, rayons), thème clair/sombre, styles globaux.

Règles :
- toute valeur visuelle est définie ici une fois, sous forme de variable CSS ;
- un composant qui a besoin d'une nouvelle couleur demande un token, n'invente pas un `#hex` ;
- accessibilité : contraste texte/fond d'au moins 4.5:1, focus visible sur tout élément cliquable.
