# Journal

Aucune décision de projet n’a été enregistrée dans ce squelette.

Pour chaque ajout validé, noter la date réelle, la page modifiée, la raison, la source et la preuve de relecture. Une proposition attend l’accord du responsable.

## 2026-09-15 — ANNU-01 (Nils)

- Ajout : `raw/chu-ile-de-france.md`, six centres d’hébergement d’urgence d’Île-de-France validés par Cédric (PO).
- Décisions : démo répartie sur plusieurs villes (Paris, Saint-Ouen-sur-Seine, Thiais) ; public accueilli non repris dans l’app, faute de champ dans le contrat ; téléphones de CHU Crimée et CHU René Coty retirés (numéros contradictoires ou non spécifiques au CHU) ; aucun e-mail retenu.
- Sources : groupe-sos.org, sante.fr, opendata.paris.fr (jeu `hebergements-casvp`, non mis à jour depuis 2019-05-02), consultées le 2026-09-15.
- Preuve : `npm run lint` sans erreur ; `npm run build` réussi ; 12 vérifications de la recette 5.3 (a) à (e) exécutées sur le jeu local et le rendu HTML de `OrganisationList`. Affichage dans l’app non vérifié (intégration INT-01 phase 2 à venir) ; ouverture réelle d’OpenStreetMap non vérifiée.

