import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import styles from './ChatInput.module.css'

type ChatInputProps = {
  onSend: (question: string) => void
  onStop: () => void
  isBusy: boolean
  autoFocus?: boolean
}

export function ChatInput({ onSend, onStop, isBusy, autoFocus = false }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = value.trim() === ''

  // Hauteur ajustée au contenu ; le plafond (~8 lignes) est fixé en CSS.
  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  function submit() {
    if (isEmpty || isBusy) return
    onSend(value.trim())
    setValue('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    submit()
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question sur la base de connaissances…"
          aria-label="Votre question"
          autoFocus={autoFocus}
        />
        {isBusy ? (
          <button
            type="button"
            className={`${styles.button} ${styles.stop}`}
            onClick={onStop}
            aria-label="Arrêter la réponse"
            title="Arrêter"
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className={styles.button}
            disabled={isEmpty}
            aria-label="Envoyer la question"
            title="Envoyer"
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 19V5M5.5 11.5 12 5l6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </form>
      <p className={styles.hint}>
        Réponses fondées sur les fiches sourcées. Vérifiez toujours auprès de la structure.
      </p>
    </div>
  )
}
