// Lot branché le 15/09/2026 (Romain, KB-01) — ce fichier t'appartient.
// 1. `src/features/base-connaissances/index.ts` exposait `searchKnowledge` et `KnowledgeList`.
// 2. Les 3 lignes marquées « À DÉCOMMENTER » ont été décommentées :
//    - l'import du lot,
//    - `searchKnowledge` et `KnowledgeList` dans l'objet exporté,
//    - `ready: true` (et `ready: false` supprimé).
// 3. `Page` a été remplacée par la version de démonstration.

// À DÉCOMMENTER (1/3) : fait.
import { KnowledgeList, searchKnowledge } from '../../features/base-connaissances'

import { useAsync } from '../../lib/useAsync'
import type { LearnerPage } from '../types'
import styles from './learner.module.css'

const PAGE = {
  name: 'Romain',
  ticket: 'KB-01 — Base de connaissances sourcée',
  issue: 2,
}

const romain: LearnerPage = {
  ...PAGE,
  // À DÉCOMMENTER (2/3) : fait.
  searchKnowledge,
  KnowledgeList,
  // À DÉCOMMENTER (3/3) : fait.
  ready: true,
  Page: () => {
    const state = useAsync(() => searchKnowledge({ lang: 'fr' }))

    return (
      <>
        <header className={styles.head}>
          <h1 className={styles.title}>Base de connaissances</h1>
          <p className={styles.intro}>
            Chaque fiche cite sa source et la date à laquelle elle a été consultée.
          </p>
        </header>

        {state.status === 'loading' && <p className={styles.message}>Chargement des fiches…</p>}
        {state.status === 'error' && (
          <p className={styles.error}>La base de connaissances n'a pas répondu.</p>
        )}
        {state.status === 'done' && (
          <>
            <p className={styles.count}>{state.data.length} fiches sourcées</p>
            <KnowledgeList items={state.data} lang="fr" />
          </>
        )}
      </>
    )
  },
}

export default romain
