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
