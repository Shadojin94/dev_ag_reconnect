// Page d'aperçu de la feature assistant — outil de développement, pas un écran
// de l'application. Elle sert à éprouver les deux parcours sans attendre que
// l'intégration branche les composants dans src/App.tsx.
//
// Ouvrir : npm run dev puis
// http://localhost:5173/src/features/assistant/preview/index.html
//
// Elle n'entre pas dans le bundle de production : `vite build` ne part que de
// l'index.html racine. Elle n'importe que l'API publique de la feature (..),
// jamais un fichier interne — même règle que le reste de l'app.

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { OrientationQuery, OrientationResult } from '../../../types/orientation'
import '../../../index.css'
import {
  answerFromFixtures,
  Assistant,
  Chat,
  DEMO_RESULT,
  EMPTY_RESULT,
  type AnswerStatus,
  type AssistantStatus,
} from '..'

const STATUSES: AssistantStatus[] = ['idle', 'loading', 'empty', 'error', 'done']

/** Résultat associé à chaque état du parcours guidé. */
function resultFor(status: AssistantStatus): OrientationResult | null {
  if (status === 'done') return DEMO_RESULT
  if (status === 'empty') return EMPTY_RESULT
  return null
}

/* ------------------------------------------------------- parcours guidé -- */

export function GuidedPreview() {
  const [status, setStatus] = useState<AssistantStatus>('idle')
  const [lastQuery, setLastQuery] = useState<OrientationQuery | null>(null)

  return (
    <>
      <div data-testid="harness" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        {STATUSES.map((value) => (
          <button data-status={value} key={value} onClick={() => setStatus(value)} type="button">
            {value}
          </button>
        ))}
      </div>
      <pre data-testid="last-query" style={{ fontSize: '.8rem', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
        {lastQuery === null ? 'aucune question envoyée' : JSON.stringify(lastQuery)}
      </pre>
      <div data-testid="assistant-under-test">
        <Assistant onQuery={setLastQuery} result={resultFor(status)} status={status} />
      </div>
    </>
  )
}

/* ----------------------------------------------------- parcours chatbot -- */

/**
 * Tient lieu de src/services/orientation.ts : répond à partir du jeu local,
 * avec un court délai pour rendre l'état « je cherche » visible à l'écran.
 */
export function ChatPreview() {
  const [status, setStatus] = useState<AnswerStatus>('loading')
  const [result, setResult] = useState<OrientationResult | null>(null)
  const [forceError, setForceError] = useState(false)
  const [lastQuery, setLastQuery] = useState<OrientationQuery | null>(null)

  const handleQuery = (query: OrientationQuery) => {
    setLastQuery(query)
    setResult(null)
    setStatus('loading')
    window.setTimeout(() => {
      if (forceError) {
        setStatus('error')
        return
      }
      const reponse = answerFromFixtures(query)
      setResult(reponse)
      setStatus(reponse.items.length === 0 ? 'empty' : 'done')
    }, 250)
  }

  return (
    <>
      <div data-testid="chat-harness" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        <button
          data-force-error={String(forceError)}
          onClick={() => setForceError((v) => !v)}
          type="button"
        >
          {forceError ? 'erreur simulée : oui' : 'erreur simulée : non'}
        </button>
      </div>
      <pre data-testid="chat-last-query" style={{ fontSize: '.8rem', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
        {lastQuery === null ? 'aucune question envoyée' : JSON.stringify(lastQuery)}
      </pre>
      <div data-testid="chat-under-test">
        <Chat onQuery={handleQuery} result={result} status={status} />
      </div>
    </>
  )
}

/* ------------------------------------------------------------- aperçu ---- */

export function Preview() {
  const [vue, setVue] = useState<'chat' | 'guide'>('chat')

  return (
    <main style={{ margin: '0 auto', maxWidth: '46rem', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        <button data-view="chat" onClick={() => setVue('chat')} type="button">
          Conversation
        </button>
        <button data-view="guide" onClick={() => setVue('guide')} type="button">
          Parcours guidé
        </button>
      </div>
      {vue === 'chat' ? <ChatPreview /> : <GuidedPreview />}
    </main>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
