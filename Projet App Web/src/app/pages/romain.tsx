// Comment brancher ton lot (Romain, KB-01) — ce fichier t'appartient.
// 1. Expose `searchKnowledge` et `KnowledgeList` dans src/features/base-connaissances/index.ts.
// 2. Décommente les 3 lignes marquées « À DÉCOMMENTER » ci-dessous :
//    - l'import du lot,
//    - `searchKnowledge` et `KnowledgeList` dans l'objet exporté,
//    - `ready: true` (et supprime `ready: false`).
// 3. Remplace `Page` par la version de démonstration commentée plus bas.
// Tant que rien n'est branché, la page affiche proprement « lot en attente ».

// À DÉCOMMENTER (1/3) :
// import { KnowledgeList, searchKnowledge } from '../../features/base-connaissances'

import { PendingLot } from '../../components/PendingLot'
import type { LearnerPage } from '../types'

const PAGE = {
  name: 'Romain',
  ticket: 'KB-01 — Base de connaissances sourcée',
  issue: 2,
}

const PROVIDES = [
  'searchKnowledge(query: OrientationQuery): Promise<KnowledgeItem[]>',
  'KnowledgeList({ items, lang })',
]

const LINES = [
  "import { KnowledgeList, searchKnowledge } from '../../features/base-connaissances'",
  'searchKnowledge, KnowledgeList,',
  'ready: true,',
]

// Version de démonstration à utiliser une fois le lot branché :
//
// function RomainPage() {
//   const state = useAsync(() => searchKnowledge({ lang: 'fr', category: 'papiers' }))
//   if (state.status === 'loading') return <p>Chargement des fiches…</p>
//   if (state.status === 'error') return <p>La base de connaissances n'a pas répondu.</p>
//   return <KnowledgeList items={state.data} lang="fr" />
// }
// (ajouter en haut : import { useAsync } from '../../lib/useAsync')

const romain: LearnerPage = {
  ...PAGE,
  ready: false,
  // À DÉCOMMENTER (2/3) : searchKnowledge, KnowledgeList,
  // À DÉCOMMENTER (3/3) : ready: true,
  Page: () => <PendingLot lines={LINES} page={PAGE} provides={PROVIDES} />,
}

export default romain
