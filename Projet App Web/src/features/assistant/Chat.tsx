// Assistant conversationnel (lot ASSIST-01, extension chatbot).
//
// L'usager écrit dans sa langue ; l'assistant repère la langue, rattache le
// message à l'un des six besoins du contrat, construit une OrientationQuery et
// la transmet par `onQuery`. Il n'interroge aucune source lui-même : les fiches
// viennent de KB-01 et les structures d'ANNU-01, par la façade commune.
//
// Ce n'est pas un modèle de langue. La réponse affichée est celle que renvoie
// la façade, et le bandeau annonce le mode qu'elle déclare : 'fixture' pour une
// réponse préparée, 'llm' seulement si un endpoint validé existe.

import { useId } from 'react'
import { NEED_CATEGORIES, type OrientationQuery, type OrientationResult } from '../../types/orientation'
import styles from './Chat.module.css'
import { Exchange } from './components/Exchange'
import { CATEGORY_LABELS, translate, UI_LABELS } from './labels'
import { useChat, type AnswerStatus } from './useChat'

export interface ChatProps {
  /** Reçoit la question construite à partir du message. */
  onQuery: (query: OrientationQuery) => void
  /** Résultat renvoyé par la façade commune pour la dernière question. */
  result?: OrientationResult | null
  /** État de la dernière question. Par défaut 'loading' : la réponse est attendue. */
  status?: AnswerStatus
}

export function Chat({ onQuery, result = null, status }: ChatProps) {
  const { conversation, draft, setDraft, send, reset, lang, pending } = useChat({
    onQuery,
    result,
    ...(status === undefined ? {} : { status }),
  })
  const champId = useId()
  const titreId = useId()

  return (
    <section aria-labelledby={titreId} className={styles.chat} lang={lang}>
      <h2 className={styles.title} id={titreId}>
        {translate(UI_LABELS.chatTitle, lang)}
      </h2>
      <p className={styles.intro}>{translate(UI_LABELS.chatIntro, lang)}</p>

      {conversation.length === 0 ? (
        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>
            {translate(UI_LABELS.chatSuggestions, lang)}
          </p>
          <div className={styles.chips}>
            {NEED_CATEGORIES.map((category) => (
              <button
                className={styles.chip}
                key={category}
                onClick={() => send(translate(CATEGORY_LABELS[category], lang))}
                type="button"
              >
                {translate(CATEGORY_LABELS[category], lang)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ul
          aria-label={translate(UI_LABELS.chatLogLabel, lang)}
          aria-live="polite"
          className={styles.log}
          role="log"
        >
          {conversation.map((exchange) => (
            <Exchange exchange={exchange} key={exchange.id} />
          ))}
        </ul>
      )}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
          send(draft)
        }}
      >
        <label className={styles.label} htmlFor={champId}>
          {translate(UI_LABELS.chatTitle, lang)}
        </label>
        <div className={styles.entry}>
          <input
            autoComplete="off"
            className={styles.input}
            id={champId}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={translate(UI_LABELS.chatPlaceholder, lang)}
            type="text"
            value={draft}
          />
          <button className={styles.send} disabled={draft.trim() === ''} type="submit">
            {translate(UI_LABELS.chatSend, lang)}
          </button>
        </div>
      </form>

      {conversation.length === 0 ? null : (
        <button className={styles.reset} onClick={reset} type="button">
          {translate(UI_LABELS.chatReset, lang)}
        </button>
      )}

      {/* État de la recherche, annoncé sans déplacer le focus. */}
      <p aria-live="polite" className={styles.srOnly} role="status">
        {pending ? translate(UI_LABELS.chatPending, lang) : ''}
      </p>
    </section>
  )
}
