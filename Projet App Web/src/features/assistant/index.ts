// Lot ASSIST-01 (Ashad). Seule porte d'entrée de la feature : le reste de
// l'application n'importe jamais un fichier interne d'une autre feature.

/* Parcours guidé : langue, besoin, ville en trois étapes. */
export { Assistant } from './Assistant'
export type { AssistantProps, AssistantStatus } from './Assistant'

/* Parcours conversationnel : l'usager écrit dans sa langue. */
export { Chat } from './Chat'
export type { ChatProps } from './Chat'
export type { AnswerStatus, ChatExchange } from './useChat'

// Lecture d'un message libre : langue, besoin, mots-clés. Exposé pour que
// l'intégration puisse construire une question sans passer par l'interface.
export { detectLang, interpretMessage, matchCategory } from './interpretMessage'
export type { Interpretation, LangDetection } from './interpretMessage'

// Jeu d'exemple : permet d'afficher et d'éprouver les écrans avant que les lots
// KB-01 et ANNU-01 ne fournissent de vraies données. À retirer une fois branché.
export {
  answerFromFixtures,
  DEMO_ITEMS,
  DEMO_ORGANISATIONS,
  DEMO_RESULT,
  EMPTY_RESULT,
} from './fixtures'

// Repli français d'un LocalizedText. Exposé parce que les trois lots ont la
// même règle : si elle doit être partagée, sa place est dans src/lib/ (intégration).
export { translate } from './labels'
