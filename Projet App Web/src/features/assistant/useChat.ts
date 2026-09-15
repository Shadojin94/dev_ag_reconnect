// Fil de conversation de l'assistant (lot ASSIST-01, extension chatbot).
//
// Le hook ne va chercher aucune donnée : chaque message devient une
// OrientationQuery remise au parent par `onQuery`, et la réponse revient par les
// props `result` et `status`, pilotées par l'intégration.
//
// La réponse de l'échange en cours n'est pas recopiée dans l'état : elle est
// dérivée des props au rendu. Les échanges précédents, eux, gardent la réponse
// figée au moment où la question suivante est partie. Rien n'est donc écrit
// depuis un effet, et aucun rendu en cascade n'est déclenché.

import { useCallback, useState } from 'react'
import type { Lang, OrientationQuery, OrientationResult } from '../../types/orientation'
import { interpretMessage } from './interpretMessage'

/** États que l'intégration fait traverser à une réponse. */
export type AnswerStatus = 'loading' | 'empty' | 'error' | 'done'

/** Ce que l'assistant a compris du message, et qu'il annonce à l'usager. */
export type TurnNotice = 'unsupported-script' | 'language-guess' | null

export interface Answer {
  status: AnswerStatus
  result: OrientationResult | null
}

interface Exchange {
  id: string
  userText: string
  lang: Lang
  query: OrientationQuery
  notice: TurnNotice
  /** Réponse figée quand une question suivante est partie. */
  frozen?: Answer
}

/** Un échange prêt à afficher : la question de l'usager et sa réponse. */
export interface ChatExchange extends Exchange {
  answer: Answer
}

interface UseChatOptions {
  onQuery: (query: OrientationQuery) => void
  result?: OrientationResult | null
  status?: AnswerStatus
}

export function useChat({ onQuery, result = null, status = 'loading' }: UseChatOptions) {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [draft, setDraft] = useState('')
  // Langue de la dernière question comprise : sert de repli quand le message
  // suivant ne porte aucun indice (« merci », « ok », un nom de ville seul).
  const [lang, setLang] = useState<Lang>('fr')
  const [compteur, setCompteur] = useState(0)

  const send = useCallback(
    (texte: string) => {
      const message = texte.trim()
      if (message === '') return

      const lu = interpretMessage(message, lang)
      const numero = compteur + 1

      const query: OrientationQuery = {
        lang: lu.lang,
        ...(lu.category === null ? {} : { category: lu.category }),
        ...(lu.keywords.length === 0 ? {} : { keywords: lu.keywords.join(' ') }),
      }

      const notice: TurnNotice = lu.unsupportedScript
        ? 'unsupported-script'
        : lu.confident
          ? null
          : 'language-guess'

      setExchanges((precedents) => [
        // l'échange qui se termine garde la réponse telle qu'elle est à l'écran
        ...precedents.map((echange, index) =>
          index === precedents.length - 1 && echange.frozen === undefined
            ? { ...echange, frozen: { status, result: status === 'done' ? result : null } }
            : echange,
        ),
        { id: `echange-${numero}`, userText: message, lang: lu.lang, query, notice },
      ])
      setCompteur(numero)
      setLang(lu.lang)
      setDraft('')
      onQuery(query)
    },
    [compteur, lang, onQuery, result, status],
  )

  const reset = useCallback(() => {
    setExchanges([])
    setDraft('')
    setLang('fr')
  }, [])

  // Seul le dernier échange suit les props ; les autres sont déjà figés.
  const conversation: ChatExchange[] = exchanges.map((echange, index) => ({
    ...echange,
    answer:
      echange.frozen ??
      (index === exchanges.length - 1
        ? { status, result: status === 'done' ? result : null }
        : { status: 'loading', result: null }),
  }))

  const pending = conversation.at(-1)?.answer.status === 'loading'

  return { conversation, draft, setDraft, send, reset, lang, pending }
}
