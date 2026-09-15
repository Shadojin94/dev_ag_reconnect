# Centres d'hébergement d'urgence (CHU) en Île-de-France — relevé brut

- Collecte : 2026-09-15, par Nils (recherche web assistée par Claude Code)
- Usage : lot ANNU-01 (`src/features/annuaire/`)
- Statut : **validé par Cédric (PO) le 2026-09-15**, y compris la répartition sur plusieurs villes ; le public accueilli n'est pas repris dans l'app (absent du contrat)
- Règle : champ inconnu ou contradictoire = laissé vide, jamais inventé

## Les six structures

| # | Structure (gestionnaire) | Adresse | Téléphone | Public accueilli | Source consultée le 2026-09-15 |
|---|---|---|---|---|---|
| 1 | CHU Cœur 93 (Groupe SOS Solidarités) | 78 rue du Dr Bauer, 93400 Saint-Ouen-sur-Seine | 07 70 15 82 76 | Ménages en situation d'urgence sociale : couples avec ou sans enfants, familles monoparentales, femmes isolées, orientés par le SIAO 93 | https://www.groupe-sos.org/structure/chu-du-pre/ |
| 2 | CHU René Coty (Aurore) | 8 avenue René Coty, 75014 Paris | | Familles (CHU Familles : 25 familles) | https://www.sante.fr/centre-dhebergement-et-de-reinsertion-sociale-chrs/paris/chrs-rene-coty ; https://www.jeveuxaider.gouv.fr/organisations/16237-centre-dhebergement-durgence-rene-coty-aurore |
| 3 | PHI CHU Marais (Groupe SOS Solidarités) | 5 boulevard du Temple, 75003 Paris | 01 42 77 60 45 | Personnes isolées ou en couple, en grande marginalité, avec une situation psychique ou addictive complexe | https://www.groupe-sos.org/structure/chu-marais/ |
| 4 | CHU Baudricourt (CASVP) | 15 rue Baudricourt, 75013 Paris | 01 45 83 32 60 | Hommes et femmes isolés de 25 à 65 ans | https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/ |
| 5 | CHU Crimée (CASVP) | 166 rue de Crimée, 75019 Paris | | Familles (familles monoparentales selon paris.fr) | https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/ ; https://www.paris.fr/pages/le-centre-crimee-heberge-les-mamans-solo-et-leur-redonne-espoir-5069 |
| 6 | CHU Les Baudemons (CASVP) | 30 rue des Baudemons, 94320 Thiais | 01 55 53 16 10 | Hommes et femmes isolés de plus de 50 ans | https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/ |

Coordonnées GPS publiées par l'open data de la Ville de Paris (utiles pour `lat` / `lng`) :
Baudricourt 48.828012, 2.364797 · Crimée 48.889674, 2.378039 · Les Baudemons 48.769465, 2.394079.

## Points à vérifier

- **Téléphones retirés** : CHU Crimée (deux numéros contradictoires : 01 53 26 53 26 en open data, 01 40 36 17 60 sur paris.fr en 2019) et CHU René Coty (le mobile publié relève de l'animation bénévole, le fixe 01 85 09 38 80 du HUDA voisin). À confirmer auprès du gestionnaire avant de les réintroduire.
- **Fraîcheur CASVP** (n° 4 à 6) : le jeu open data `hebergements-casvp` n'a pas été mis à jour depuis le 2019-05-02. Vérifier que les centres sont toujours ouverts.
- **René Coty** : sante.fr indique le 8 avenue René Coty, la page Aurore du HUDA sur le même site le 8 bis. Numéro exact du CHU à confirmer.
- **Cœur 93** : 119 places réparties sur quatre sites ; l'adresse relevée est celle publiée par Groupe SOS, pas forcément celle de chaque site.
- **E-mails** : volontairement non retenus. Le seul e-mail trouvé pour un CHU d'accueil (Cœur 93) est nominatif.
- **Accès** : l'admission en CHU passe par le 115 ou le SIAO, pas par un contact direct avec le centre.

## Structures de réserve (non retenues)

- Centre d'hébergement d'urgence de Seine-et-Marne (Croix-Rouge), 406 avenue Saint-Just, 77000 Vaux-le-Pénil, 01 60 68 87 65 — https://www.croix-rouge.fr/centre-d-hebergement-d-urgence-de-seine-et-marne
- CHRS-CHU Stendhal (CASVP), 5 quater rue Stendhal, 75020 Paris, 01 46 62 57 57, jeunes de 18 à 27 ans et couples — https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/
