import styles from './ChatSuggestions.module.css'

type ChatSuggestionsProps = {
  suggestions: string[]
  onPick: (question: string) => void
}

export function ChatSuggestions({ suggestions, onPick }: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <ul className={styles.grid} aria-label="Exemples de questions">
      {suggestions.map((suggestion) => (
        <li key={suggestion} className={styles.item}>
          <button type="button" className={styles.card} onClick={() => onPick(suggestion)}>
            <span>{suggestion}</span>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}
