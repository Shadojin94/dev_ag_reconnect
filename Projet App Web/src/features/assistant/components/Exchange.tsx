// Un échange de la conversation : la question de l'usager, puis la réponse.

import type { ChatExchange } from '../useChat'
import { CATEGORY_LABELS, translate, UI_LABELS, UNSUPPORTED_SCRIPT_NOTICE } from '../labels'
import { ResultPanel } from './ResultPanel'
import styles from './Exchange.module.css'

/** Ce que l'assistant dit avoir compris, avant même d'avoir une réponse. */
function Notice({ exchange }: { exchange: ChatExchange }) {
  const { lang, notice, query } = exchange

  return (
    <>
      {notice === 'unsupported-script' ? (
        <p className={styles.notice}>
          {UNSUPPORTED_SCRIPT_NOTICE.map((ligne) => (
            <span className={styles.noticeLine} key={ligne}>
              {ligne}
            </span>
          ))}
        </p>
      ) : null}

      {notice === 'language-guess' ? (
        <p className={styles.notice}>{translate(UI_LABELS.noticeLanguageGuess, lang)}</p>
      ) : null}

      {query.category === undefined ? null : (
        <p className={styles.understood}>
          {translate(UI_LABELS.chatUnderstood, lang)}
          {' : '}
          <b>{translate(CATEGORY_LABELS[query.category], lang)}</b>
        </p>
      )}
    </>
  )
}

export function Exchange({ exchange }: { exchange: ChatExchange }) {
  const { answer, lang, userText } = exchange

  return (
    <li className={styles.exchange}>
      <p className={styles.user} lang={lang}>
        {userText}
      </p>

      <div className={styles.assistant} lang={lang}>
        <Notice exchange={exchange} />

        {answer.status === 'loading' ? (
          <p className={styles.pending}>{translate(UI_LABELS.chatPending, lang)}</p>
        ) : null}

        {answer.status === 'empty' ? (
          <p className={styles.plain}>{translate(UI_LABELS.statusEmpty, lang)}</p>
        ) : null}

        {answer.status === 'error' ? (
          <p className={styles.plain}>{translate(UI_LABELS.statusError, lang)}</p>
        ) : null}

        {answer.status === 'done' && answer.result !== null ? (
          <ResultPanel lang={lang} result={answer.result} />
        ) : null}
      </div>
    </li>
  )
}
