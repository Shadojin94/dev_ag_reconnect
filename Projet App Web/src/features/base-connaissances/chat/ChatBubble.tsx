import { useMemo } from 'react'
import type { Lang } from '../../../types/orientation.ts'
import { localize } from '../localize.ts'
import { resolveCitations } from './citations.ts'
import { formatCheckedAt } from './formatCheckedAt.ts'
import { MessageContent } from './MessageContent.tsx'
import type { ChatMessage, ChatMode } from './types.ts'
import { useTypewriter } from './useTypewriter.ts'
import styles from './ChatBubble.module.css'

type ChatBubbleProps = {
  message: ChatMessage
  lang: Lang
}

const MODE_LABELS: Record<ChatMode, string> = {
  llm: 'Kimi K3',
  fixture: 'Mode sans IA',
}

export function ChatBubble({ message, lang }: ChatBubbleProps) {
  // Les erreurs s'affichent d'un bloc ; les réponses s'écrivent progressivement.
  const { text: displayedContent, isTyping } = useTypewriter(
    message.content,
    message.role === 'assistant' && message.status !== 'error',
  )

  const { cited } = useMemo(
    () => resolveCitations(displayedContent, message.contextItems),
    [displayedContent, message.contextItems],
  )

  if (message.role === 'user') {
    return (
      <div className={styles.userRow}>
        <p className={styles.userBubble}>{displayedContent}</p>
      </div>
    )
  }

  const content = (
    <MessageContent
      content={displayedContent}
      contextItems={message.contextItems}
      messageId={message.id}
      lang={lang}
      showCaret={isTyping || message.status === 'streaming'}
    />
  )
  const showSources = message.status !== 'pending' && !isTyping && cited.length > 0

  return (
    <article className={styles.assistant} aria-label="Réponse de Reconnect Assist">
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true" />
        <span className={styles.name}>Reconnect Assist</span>
        {message.mode && (
          <span className={message.mode === 'fixture' ? `${styles.badge} ${styles.badgeFixture}` : styles.badge}>
            {MODE_LABELS[message.mode]}
          </span>
        )}
      </header>

      {message.status === 'pending' && (
        <p className={styles.pending} role="status">
          Recherche dans la base
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
          </span>
        </p>
      )}
      {message.status === 'error' && (
        <div className={styles.error} role="alert">{content}</div>
      )}
      {(message.status === 'streaming' || message.status === 'done') && content}

      {showSources && (
        <section className={styles.sources} aria-label="Sources">
          <h3 className={styles.sourcesTitle}>Sources</h3>
          <ol className={styles.sourceList}>
            {cited.map((item, position) => (
              <li key={item.id} id={`source-${message.id}-${position + 1}`} className={styles.source}>
                <span className={styles.sourceIndex}>{position + 1}</span>
                <div className={styles.sourceBody}>
                  <a
                    className={styles.sourceLink}
                    href={item.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {localize(item.title, lang)}
                    <span className={styles.srOnly}> (nouvel onglet)</span>
                  </a>
                  <p className={styles.sourceMeta}>
                    {item.source.label}
                    {item.source.checkedAt && (
                      <> · Consultée le {formatCheckedAt(item.source.checkedAt)}</>
                    )}
                    {!item.source.verified && (
                      <> · <span className={styles.unverified}>Source non vérifiée</span></>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
