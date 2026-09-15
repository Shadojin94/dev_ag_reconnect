// Page d'aperçu de la feature assistant — outil de développement, pas un écran
// de l'application. Elle sert à rejouer la recette du ticket ASSIST-01 sans
// attendre que l'intégration branche le composant dans src/App.tsx.
//
// Ouvrir : npm run dev puis
// http://localhost:5173/src/features/assistant/preview/index.html
//
// Elle n'entre pas dans le bundle de production : `vite build` ne part que de
// l'index.html racine. Elle n'importe que l'API publique de la feature
// (./..), jamais un fichier interne — même règle que le reste de l'app.

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { OrientationQuery, OrientationResult } from '../../../types/orientation'
import '../../../index.css'
import { Assistant, DEMO_RESULT, EMPTY_RESULT, type AssistantStatus } from '..'

const STATUSES: AssistantStatus[] = ['idle', 'loading', 'empty', 'error', 'done']

/** Résultat associé à chaque état, pour voir l'écran tel qu'il sera branché. */
function resultFor(status: AssistantStatus): OrientationResult | null {
  if (status === 'done') return DEMO_RESULT
  if (status === 'empty') return EMPTY_RESULT
  return null
}

export function Preview() {
  const [status, setStatus] = useState<AssistantStatus>('idle')
  const [lastQuery, setLastQuery] = useState<OrientationQuery | null>(null)

  const handleQuery = (query: OrientationQuery) => {
    setLastQuery(query)
  }

  return (
    <main style={{ margin: '0 auto', maxWidth: '46rem', padding: '1rem' }}>
      <div data-testid="harness" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        {STATUSES.map((value) => (
          <button
            data-status={value}
            key={value}
            onClick={() => setStatus(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <pre data-testid="last-query" style={{ fontSize: '.8rem', overflowX: 'auto' }}>
        {lastQuery === null ? 'aucune question envoyée' : JSON.stringify(lastQuery)}
      </pre>

      <div data-testid="assistant-under-test">
        <Assistant onQuery={handleQuery} result={resultFor(status)} status={status} />
      </div>
    </main>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
