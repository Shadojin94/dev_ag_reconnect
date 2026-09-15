// Lot ASSIST-01 (Ashad). Seule porte d'entrée de la feature : le reste de
// l'application n'importe jamais un fichier interne d'une autre feature.

export { Assistant } from './Assistant'
export type { AssistantProps, AssistantStatus } from './Assistant'

// Jeu d'exemple : permet à l'intégration d'afficher l'écran avant que les lots
// KB-01 et ANNU-01 ne fournissent de vraies données. À retirer une fois branché.
export { DEMO_RESULT, EMPTY_RESULT } from './fixtures'

// Repli français d'un LocalizedText. Exposé parce que les trois lots ont la
// même règle : si elle doit être partagée, sa place est dans src/lib/ (intégration).
export { translate } from './labels'
