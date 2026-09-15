# Reconnect — Encre & Signal

Support de formation autonome, dérivé du prototype d1 « Encre & Signal ». Direction retenue pour la reprise ; aucun jury de prototypes n'est présenté comme accompli.

## Fondations

| Rôle | Valeur |
| --- | --- |
| Fond | `#0E1630` |
| Fond des prompts | `#121C3A` |
| Texte principal | `#F4EDE0` |
| Texte secondaire | `#A8A297` |
| Accent unique | `#F9B02A` |
| Filets | Papier à 18 % |
| Titres | Fraunces, graisse 600, axe opsz 144 |
| Texte | Outfit, graisses 400 et 500 |
| Code et repères | JetBrains Mono, graisse 400 |

Les trois fontes WOFF2 du prototype sont embarquées dans `build/fonts.css`, puis incluses dans le fichier HTML. Leurs licences SIL OFL sont conservées dans `build/font-licenses/` et incluses dans un élément `template` non affiché du HTML pour accompagner sa redistribution autonome. Outfit et JetBrains Mono proviennent des licences déjà présentes dans l'ancien support ; Fraunces provient du fichier officiel `google/fonts/main/ofl/fraunces/OFL.txt`, récupéré le 14 septembre 2026. Aucune requête réseau à l'ouverture. Les liens de documentation sont des liens externes explicites.

## Composition

Un écran, une idée, un titre qui se suffit à lui-même. Cinq éléments au maximum dans une liste ; une commande ou un prompt au maximum. Titres serif, texte aligné à gauche, filets fins, aplats, angles presque droits. L'accent ambre sert aux étapes, aux repères et au bouton Copier. Pas de dégradé, d'illustration décorative, de logo ni d'ombre.

Grille de bureau : marges de 8 vw, rail de chapitres discret dans la marge gauche, titre de 38 à 66 px, couverture jusqu'à 106 px, énoncé de 20 à 25 px, texte de 17 à 23 px, code de 13 à 15 px. Les lignes de contenu occupent deux colonnes lorsque la comparaison ou un prompt l'exige. Les détails théoriques sont repliés pour la projection et disponibles sous chaque écran.

Compositions prises en charge : couverture à repères horaires, contenu à liste, étape à chiffre géant, notice outil à gestes, prompt avec cadrage, comparaison, planning, récapitulatif/ressources. Les types inconnus utilisent la composition de contenu. Les types `section`, `exercise` et `table` restent compatibles avec les mêmes champs.

À 1023 px : rail masqué et prompts empilés. À 640 px : une colonne, 24 px de marge, défilement libre, titres et code réduits ; aucun contenu ne doit être coupé. Un écran peut dépasser la hauteur du téléphone pour préserver la lecture. Sur bureau, une section occupe au moins une hauteur de fenêtre avec défilement aimanté de proximité.

## Usage et accessibilité

Flèches, PageUp/PageDown et Espace : écran précédent/suivant. Maj+Espace recule. S ouvre le sommaire, D ouvre ou ferme toute la théorie. Les champs, liens, boutons, éléments éditables et résumés natifs conservent leurs touches usuelles. Le sommaire est un dialogue modal natif, cherchable sans accents, refermable avec Échap. Les sources et liens du kit restent des liens normaux.

Les ancres `#e01`, etc., suivent l'écran courant. Focus visible, lien d'évitement, état courant des chapitres et du sommaire, libellés de boutons, compteur annoncé et préférence de mouvement réduit sont pris en charge. La copie tente le presse-papiers puis la commande de copie locale ; si le navigateur refuse les deux, le texte est sélectionné et une instruction manuelle apparaît.

Impression : fond blanc, un écran par page A4 paysage, théorie dépliée, commandes et liens de sources conservés ; navigation masquée. Les états des détails sont restaurés après l'impression.

## Régénération et limites

`node build/build-html.mjs` lit `build/contenu.json` et produit `index.html`. Le contenu n'est jamais rédigé dans le moteur. Les sources du moteur sont `build/deck.css`, `build/deck.js` et `build/fonts.css`. Le générateur accepte un `build/theme.json` facultatif pour les couleurs : `colors.ink`, `ink2`, `paper`, `muted`, `accent`. Deux arguments facultatifs permettent de choisir les chemins JSON d'entrée et HTML de sortie.

La QA visuelle, les interactions, l'impression et les débordements de l'ensemble des écrans sont vérifiés centralement. La présence des fonctions dans le moteur ne constitue pas une preuve de validation sur tous les navigateurs.
