// Lot branché le 15/09/2026 (Nils, ANNU-01) — ce fichier t'appartient.
// 1. `src/features/annuaire/index.ts` exposait `findOrganisations` et `OrganisationList`.
// 2. Les 3 lignes marquées « À DÉCOMMENTER » ont été décommentées :
//    - l'import du lot,
//    - `findOrganisations` et `OrganisationList` dans l'objet exporté,
//    - `ready: true` (et `ready: false` supprimé).
// 3. `Page` a été remplacée par la version de démonstration.

// À DÉCOMMENTER (1/3) : fait.
import { findOrganisations, OrganisationList } from '../../features/annuaire'

import { useAsync } from '../../lib/useAsync'
import type { LearnerPage } from '../types'
import styles from './learner.module.css'

const PAGE = {
  name: 'Nils',
  ticket: 'ANNU-01 — Annuaire des structures',
  issue: 3,
}

const nils: LearnerPage = {
  ...PAGE,
  // À DÉCOMMENTER (2/3) : fait.
  findOrganisations,
  OrganisationList,
  // À DÉCOMMENTER (3/3) : fait.
  ready: true,
  Page: () => {
    const state = useAsync(() => findOrganisations({ lang: 'fr' }))

    return (
      <>
        <header className={styles.head}>
          <h1 className={styles.title}>Annuaire des structures</h1>
          <p className={styles.intro}>
            Toutes les structures du jeu local, avec leurs coordonnées et leur source.
          </p>
        </header>

        {state.status === 'loading' && <p className={styles.message}>Chargement de l'annuaire…</p>}
        {state.status === 'error' && <p className={styles.error}>L'annuaire n'a pas répondu.</p>}
        {state.status === 'done' && (
          <>
            <p className={styles.count}>{state.data.length} structures</p>
            <OrganisationList lang="fr" organisations={state.data} />
          </>
        )}
      </>
    )
  },
}

export default nils
