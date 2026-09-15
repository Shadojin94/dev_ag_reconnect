# Journal

Pour chaque ajout validé, noter la date réelle, la page modifiée, la raison, la source et la preuve de relecture. Une proposition attend l’accord du responsable.


## 15/09/2026 — ASSIST-01, assistant multilingue

**Décidé.** La feature `src/features/assistant/` construit une `OrientationQuery`
et la transmet par `onQuery` ; elle ne lit aucune donnée. Les libellés sont des
`LocalizedText` et `translate()` retombe sur le français quand une traduction
manque. Le bandeau de mode lit `explanation.mode` : il annonce le mode que porte
la donnée, jamais un mode supposé.

**Source.** `CONTRAT-DONNEES.md` (section Assemblage et Règles de vérité),
`src/types/orientation.ts` d'INT-01 phase 1, ticket GitHub #4.

**Preuve.** `npm run lint` : aucune sortie. `npm run build` : `✓ built in 124ms`.
Recette d'acceptation 5.3.a à 5.3.f rejouée dans Chrome par
`node src/features/assistant/.claude/skills/recette-assistant/recette.mjs` :
17 contrôles OK, aucune erreur de console.

**Limites.** Aucune coordonnée n'est écrite dans le jeu d'exemple : les
structures viennent d'ANNU-01. La source citée est réelle mais `verified: false`
et sans `checkedAt`, personne ne l'a consultée pour ce jeu. Le mode `'llm'` n'est
pas testé, aucun endpoint validé n'existe. Le comportement avec les données
réelles de KB-01 et ANNU-01 reste à prouver après la phase 2 d'INT-01.

**À trancher avec le PO.** `Explanation.text` est un `string` et non un
`LocalizedText` : en anglais, l'interface est traduite mais le texte de réponse
reste dans la langue où il a été produit. Faire évoluer le contrat sur ce point
concerne les trois lots.

## 15/09/2026 — ASSIST-01, assistant conversationnel

**Décidé.** Un second parcours s'ajoute au parcours guidé : l'usager écrit une
phrase, l'assistant repère la langue, rattache le message à l'un des six besoins
du contrat, construit une `OrientationQuery` et la transmet par `onQuery`. La
réponse affiche les fiches et une section « Qui contacter » qui oriente vers les
structures. La langue de réponse suit celle du message, sans réglage.

**Décidé.** La compréhension est faite de règles lisibles dans
`interpretMessage.ts` : listes de mots outils par langue, listes de mots par
besoin, retrait des mots outils pour les mots-clés. Aucun modèle de langue n'est
appelé, aucune dépendance n'est ajoutée à `package.json`.

**Source.** `CONTRAT-DONNEES.md` (Assemblage, Règles de vérité, Mode de réponse),
`src/types/orientation.ts`, ticket GitHub #4.

**Preuve.** `npm run lint` : aucune sortie. `npm run build` : `✓ built in`.
Recette rejouée dans Chrome par
`node src/features/assistant/.claude/skills/recette-assistant/recette.mjs` :
30 contrôles OK, aucune erreur de console. Dont la bascule automatique
français → anglais entre deux messages, et l'orientation vers les contacts.

**Limites.** Deux langues seulement, `fr` et `en` : le contrat n'en définit pas
d'autres. Un message écrit dans une autre écriture reçoit un avis affiché dans
les deux langues, pas une réponse. La détection de langue est une heuristique de
mots outils : un message très court ou sans mot reconnu garde la langue
précédente, et l'assistant le dit à l'écran.

**Limites.** Les structures du jeu d'exemple ne portent aucune coordonnée
inventée : ni téléphone, ni courriel, ni adresse. Seul un site institutionnel
réel est renseigné, et il reste `verified: false`. Les vraies structures viennent
d'ANNU-01. `answerFromFixtures` tient lieu de façade le temps de la phase 2
d'INT-01 ; ce n'est ni un moteur de recherche, ni une preuve d'intégration.

**Limites.** Le mode `'llm'` n'est pas testé : aucun endpoint serveur validé
n'existe. L'écran est prêt à l'annoncer si `explain` le renvoie un jour.

**À trancher avec le PO.** Ce parcours dépasse le Done du ticket #4, qui décrit
un choix en trois étapes. Soit il devient un ticket à part, soit le Done de #4
est étendu. À décider avant la relecture.
