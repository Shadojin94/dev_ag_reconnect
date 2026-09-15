// Comment brancher ton lot (Ashad, ASSIST-01) — ce fichier t'appartient.
// 1. Ton index.ts expose déjà `Assistant({ onQuery, result, status })`.
// 2. Décommente les 3 lignes marquées « À DÉCOMMENTER » ci-dessous :
//    - l'import du lot,
//    - `Assistant` dans l'objet exporté,
//    - `ready: true` (et supprime `ready: false`).
// 3. Remplace `Page` par la version de démonstration commentée plus bas.
// Tant que rien n'est branché, la page affiche proprement « lot en attente ».

// À DÉCOMMENTER (1/3) :
// import { Assistant } from '../../features/assistant'

import { PendingLot } from '../../components/PendingLot'
import type { LearnerPage } from '../types'

const PAGE = {
  name: 'Ashad',
  ticket: 'ASSIST-01 — Assistant d\u2019orientation multilingue',
  issue: 4,
}

const PROVIDES = ['Assistant({ onQuery, result, status })']

const LINES = [
  "import { Assistant } from '../../features/assistant'",
  'Assistant,',
  'ready: true,',
]

// Version de démonstration à utiliser une fois le lot branché :
//
// function AshadPage() {
//   const { status, result, run } = useOrientation()
//   return <Assistant onQuery={run} result={result} status={status} />
// }
// (ajouter en haut : import { useOrientation } from '../useOrientation')

const ashad: LearnerPage = {
  ...PAGE,
  ready: false,
  // À DÉCOMMENTER (2/3) : Assistant,
  // À DÉCOMMENTER (3/3) : ready: true,
  Page: () => <PendingLot lines={LINES} page={PAGE} provides={PROVIDES} />,
}

export default ashad
