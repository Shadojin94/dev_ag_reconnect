---
name: landing-page
description: Crée une landing page statique (HTML/CSS/JS sans dépendance), moderne et colorée, dans le dossier personnel de l'utilisateur sur ce dépôt de formation, en s'inspirant de sites de référence ; vérifie le rendu desktop et mobile par captures headless avec Zen Browser, ouvre la page dans Zen, puis commit et pousse si c'est demandé. À utiliser pour « crée-moi une landing page / un site vitrine / une page d'accueil pour … », « inspire-toi de <sites> », « ouvre le site dans Zen ».
---

# Landing page statique : de la demande au push

Recette tirée de la page « Dés & Merveilles » (boutique de jeux de société, dossier `Nils/`).

## 1. Cadrer

- Sujet, sites d'inspiration et dossier cible viennent de la demande (ou de `$ARGUMENTS`).
- Dossier : `<Prénom>/` à la racine. Convention du dépôt : un dossier par participant (`Ashad/`, `Cedric/`, `romain/`, `Nils/`).
- Si ce dossier contient déjà une page, créer un sous-dossier nommé d'après le projet (`Nils/<projet>/`, comme `Cedric/jeet-kune-do/`) plutôt que d'écraser l'existant.
- `git fetch origin` puis `git ls-tree -r --name-only origin/main` pour voir ce qui existe déjà.

## 2. Analyser les sites de référence

Un `WebFetch` par URL, avec un prompt qui demande : en-tête (logo, recherche, menu, compte/panier), bannières, blocs promo, carrousels, contenu d'une carte produit, navigation par catégorie, réassurance, newsletter, footer, couleurs, typographie, éléments distinctifs, exemples de produits.

En tirer la liste des sections. Ne pas reprendre la marque, les logos, les textes ni les produits réels : inventer une marque et un catalogue fictifs.

## 3. Construire

```
<Dossier>/
├── index.html      # structure + sprite d'icônes SVG (<symbol>)
├── css/style.css   # tokens :root, composants, responsive
└── js/main.js      # tableau de données produits + interactions
```

**Écrire en plusieurs morceaux** : la limite de tokens de sortie a déjà été atteinte sur cette tâche. Un gros fichier par réponse ; le CSS en deux passes (`Write` pour base → hero → catégories, puis ajout avec `cat >> css/style.css <<'EOF'` pour produits → footer → responsive). Pas de longue réflexion avant d'écrire.

### Sections type (à adapter au sujet)

1. Bandeau d'annonces défilant
2. En-tête sticky : logo, recherche, compte / envies / panier avec pastilles de compteur, menu des catégories avec un lien promo mis en avant
3. Hero : grand encart coloré (titre, 2 CTA, chiffres clés, décor flottant) + 2 encarts latéraux (produit du mois, précommandes)
4. Réassurance : 4 engagements (livraison, retrait, paiement, conseils)
5. Tuiles de catégories
6. Carrousel produits à onglets (Nouveautés / Meilleures ventes / Précommandes)
7. Outil « Conseillez-moi » : filtres en chips → grille de résultats
8. Offre flash avec compte à rebours
9. Coups de cœur de l'équipe (avatars à initiales + citation)
10. Événements + newsletter
11. Footer multi-colonnes, réseaux sociaux, moyens de paiement

### Direction artistique « moderne et colorée » validée

- Tokens : `--ink #1f1b4d` (texte et contours), fond crème `#fff8ef`, orange `#ff6b35`, jaune `#ffc233`, rose `#ff4d8d`, violet `#7c5cff`, turquoise `#12b5a0`, bleu `#3a86ff`.
- Google Fonts **Fredoka** (titres) + **Nunito** (texte), toujours avec une pile de polices système en secours.
- Contours `2px solid var(--ink)`, grands rayons (24–32px), ombres pleines décalées `6px 6px 0 var(--ink)` qui grandissent au survol.
- Aucune image externe : visuel produit = dégradé `--c1`/`--c2` + motifs CSS + gros emoji ; icônes = sprite SVG inline.
- Micro-interactions : ressort `cubic-bezier(.34, 1.56, .64, 1)`, apparition au scroll, `prefers-reduced-motion` respecté.

### Interactions (JS vanilla)

Rendu des cartes depuis le tableau, onglets, flèches de carrousel (`scrollBy`), filtres, compteur panier avec animation « bump » + toast, favoris (`Set`), compte à rebours, validation de la newsletter, ombre de l'en-tête au scroll, menu burger, apparition via `IntersectionObserver`.

## 4. Pièges déjà rencontrés (à appliquer d'emblée)

| Problème | Solution |
|---|---|
| Carrousel `scroll-snap` décalé du padding de la piste | `scroll-padding-inline` égal au padding horizontal de la piste |
| L'animation d'apparition écrase les `transform`/`transition` de survol | `.reveal.is-visible { animation: rise .7s backwards; }` (fill `backwards`, pas de transition) et délai via `style.animationDelay` |
| Icône cœur dans `<use>` impossible à remplir en CSS | dans le `<symbol>` : `style="fill:var(--fill, none)"`, puis `--fill: #fff` sur l'état actif |
| Le bandeau défilant saute à chaque boucle | contenu dupliqué, `padding-right` sur les items (pas `gap`), `translateX(-50%)` |
| En-tête mobile : icônes compte/panier renvoyées sur une ligne seule | ≤600px : logo 40px, texte 1.2rem, `.action { padding: 6px }`, gaps réduits ; recherche en `order: 3; flex-basis: 100%` |
| Décor (meeple, dés) qui recouvre un titre sur mobile | texte en `position: relative; z-index: 1`, décor réduit ou masqué ≤600px |
| Éléments flottants du hero sur le texte | les garder dans la marge droite, `max-width` sur le titre, en masquer une partie ≤1100px |

## 5. Vérifier visuellement

```bash
node --check <Dossier>/js/main.js
bash Nils/.claude/skills/landing-page/scripts/capture.sh <Dossier>/index.html   # depuis la racine du dépôt
```

Le script produit des captures headless Zen en desktop (1440px) et mobile (400px), découpées en planches lisibles : `desktop-N.png` et `mobile-sheet.png`. Les lire avec `Read`, corriger, puis recapturer.

- Sections pâles sur les captures : apparition au scroll en cours, pas un bug.
- Page plus longue que la capture : `DESKTOP_H=8000 MOBILE_H=12000 bash …/capture.sh …`.
- À contrôler : alignements, débordements horizontaux, chevauchements texte/décor, en-tête mobile sur une ligne, cartes produits rendues (preuve que le JS tourne).
- Les captures ne testent pas les clics : le préciser dans le compte-rendu.

## 6. Ouvrir dans Zen

```bash
open -a "Zen Browser" <Dossier>/index.html
```

## 7. Commit & push (uniquement si l'utilisateur le demande)

Convention du dépôt : chaque participant pousse son dossier directement sur `main`.

```bash
git fetch origin
git checkout -B main origin/main   # seulement si le main local n'a aucun commit ; sinon : git pull --rebase origin main
git add <Dossier>/                 # uniquement ce dossier, jamais .idea/
git commit                         # message en français : « Ajoute la landing page <Nom> (<sujet>) » + court résumé
git push origin main
```

Push refusé parce que `main` a bougé : `git pull --rebase origin main` puis nouveau push. Ne jamais forcer.

## 8. Compte-rendu

Fichiers créés, sections, interactions, ce qui a été vérifié et ce qui ne l'a pas été, limites (contenu fictif, polices chargées en ligne).
