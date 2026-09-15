import { useCallback, useEffect, useRef } from 'react'
import type { Lang } from '../../../types/orientation.ts'
import { KNOWLEDGE_ITEMS } from '../knowledgeItems.ts'
import { ChatBubble } from './ChatBubble.tsx'
import { ChatInput } from './ChatInput.tsx'
import { ChatSuggestions } from './ChatSuggestions.tsx'
import { CHAT_SUGGESTIONS } from './suggestions.ts'
import { useKnowledgeChat } from './useKnowledgeChat.ts'
import styles from './ChatWindow.module.css'

type ChatWindowProps = {
  lang?: Lang
}

// Distance au bas (≈ 80 px) sous laquelle le fil reste collé en bas.
const STICK_THRESHOLD_REM = 5

function useStickToBottom(enabled: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)

  useEffect(() => {
    const scroller = scrollRef.current
    if (!enabled || !scroller) return

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const handleScroll = () => {
      const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
      stickRef.current = distance <= STICK_THRESHOLD_REM * rootFontSize
    }
    // Le fil et la zone de saisie grandissent pendant l'écriture : on suit si l'on était en bas.
    const observer = new ResizeObserver(() => {
      if (stickRef.current) scroller.scrollTop = scroller.scrollHeight
    })

    observer.observe(scroller)
    for (const child of scroller.children) observer.observe(child)
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      observer.disconnect()
      scroller.removeEventListener('scroll', handleScroll)
    }
  }, [enabled])

  const scrollToBottom = useCallback(() => {
    stickRef.current = true
    const scroller = scrollRef.current
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [])

  return { scrollRef, scrollToBottom }
}

export function ChatWindow({ lang = 'fr' }: ChatWindowProps) {
  const { messages, isBusy, send, stop } = useKnowledgeChat(lang)
  const isEmpty = messages.length === 0
  const { scrollRef, scrollToBottom } = useStickToBottom(!isEmpty)

  const handleSend = useCallback(
    (question: string) => {
      send(question)
      scrollToBottom()
    },
    [send, scrollToBottom],
  )

  return (
    <div ref={scrollRef} className={isEmpty ? `${styles.window} ${styles.empty}` : styles.window}>
      {isEmpty ? (
        <header className={styles.intro}>
          <h1 className={styles.title}>
            Votre base de connaissances, <em className={styles.accent}>vraiment</em> consultable.
          </h1>
          <p className={styles.subtitle}>
            {KNOWLEDGE_ITEMS.length} fiches sourcées sur l’hébergement, la santé, les papiers, les
            droits et l’emploi. Posez une question, l’assistant cite ses sources.
          </p>
        </header>
      ) : (
        <div
          className={styles.log}
          role="log"
          aria-live="polite"
          aria-busy={isBusy}
          aria-label="Conversation avec Reconnect Assist"
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} lang={lang} />
          ))}
        </div>
      )}

      <div className={styles.composer}>
        <ChatInput onSend={handleSend} onStop={stop} isBusy={isBusy} autoFocus />
        {isEmpty && <ChatSuggestions suggestions={CHAT_SUGGESTIONS} onPick={handleSend} />}
      </div>
    </div>
  )
}
