// Lot branché le 15/09/2026 (Ashad, ASSIST-01) — ce fichier t'appartient.
// 1. `src/features/assistant/index.ts` exposait `Assistant({ onQuery, result, status })`.
// 2. Les 3 lignes marquées « À DÉCOMMENTER » ont été décommentées :
//    - l'import du lot,
//    - `Assistant` dans l'objet exporté,
//    - `ready: true` (et `ready: false` supprimé).
// 3. `Page` a été remplacée par la version de démonstration.

// À DÉCOMMENTER (1/3) : fait.
import { Assistant } from '../../features/assistant'

import type { LearnerPage } from '../types'
import { useOrientation } from '../useOrientation'
import styles from './learner.module.css'

const PAGE = {
  name: 'Ashad',
  ticket: 'ASSIST-01 — Assistant d\u2019orientation multilingue',
  issue: 4,
}

const ashad: LearnerPage = {
  ...PAGE,
  // À DÉCOMMENTER (2/3) : fait.
  Assistant,
  // À DÉCOMMENTER (3/3) : fait.
  ready: true,
  Page: () => {
    const { status, result, run } = useOrientation()

    return (
      <>
        <header className={styles.head}>
          <h1 className={styles.title}>Assistant d{'\u2019'}orientation</h1>
          <p className={styles.intro}>
            Langue, besoin, ville : trois étapes pour obtenir une explication sourcée et les
            structures qui peuvent vous recevoir.
          </p>
        </header>

        <Assistant onQuery={run} result={result} status={status} />
      </>
    )
  },
}

export default ashad
