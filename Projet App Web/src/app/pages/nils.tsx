// Comment brancher ton lot (Nils, ANNU-01) — ce fichier t'appartient.
// 1. Ton index.ts expose déjà `findOrganisations` et `OrganisationList`.
// 2. Décommente les 3 lignes marquées « À DÉCOMMENTER » ci-dessous :
//    - l'import du lot,
//    - `findOrganisations` et `OrganisationList` dans l'objet exporté,
//    - `ready: true` (et supprime `ready: false`).
// 3. Remplace `Page` par la version de démonstration commentée plus bas.
// Tant que rien n'est branché, la page affiche proprement « lot en attente ».

// À DÉCOMMENTER (1/3) :
// import { findOrganisations, OrganisationList } from '../../features/annuaire'

import { PendingLot } from '../../components/PendingLot'
import type { LearnerPage } from '../types'

const PAGE = {
  name: 'Nils',
  ticket: 'ANNU-01 — Annuaire des structures',
  issue: 3,
}

const PROVIDES = [
  'findOrganisations(query: OrientationQuery): Promise<Organisation[]>',
  'OrganisationList({ organisations, lang })',
]

const LINES = [
  "import { findOrganisations, OrganisationList } from '../../features/annuaire'",
  'findOrganisations, OrganisationList,',
  'ready: true,',
]

// Version de démonstration à utiliser une fois le lot branché :
//
// function NilsPage() {
//   const state = useAsync(() => findOrganisations({ lang: 'fr' }))
//   if (state.status === 'loading') return <p>Chargement de l'annuaire…</p>
//   if (state.status === 'error') return <p>L'annuaire n'a pas répondu.</p>
//   return <OrganisationList lang="fr" organisations={state.data} />
// }
// (ajouter en haut : import { useAsync } from '../../lib/useAsync')

const nils: LearnerPage = {
  ...PAGE,
  ready: false,
  // À DÉCOMMENTER (2/3) : findOrganisations, OrganisationList,
  // À DÉCOMMENTER (3/3) : ready: true,
  Page: () => <PendingLot lines={LINES} page={PAGE} provides={PROVIDES} />,
}

export default nils
