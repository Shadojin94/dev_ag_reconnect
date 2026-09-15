import { useCallback, useState } from 'react'
import { orientationService } from '../services/orientation'
import type { OrientationQuery, OrientationResult } from '../types/orientation'
import type { OrientationStatus } from './types'

interface OrientationState {
  status: OrientationStatus
  result: OrientationResult | null
  query: OrientationQuery | null
}

const INITIAL: OrientationState = { status: 'idle', result: null, query: null }

/** État commun du parcours : besoin → explication sourcée → structures. */
export function useOrientation() {
  const [state, setState] = useState<OrientationState>(INITIAL)

  const run = useCallback(async (query: OrientationQuery) => {
    setState({ status: 'loading', result: null, query })
    try {
      const [items, organisations] = await Promise.all([
        orientationService.searchKnowledge(query),
        orientationService.findOrganisations(query),
      ])
      const explanation = await orientationService.explain(query, items)
      const result: OrientationResult = { items, organisations, explanation }
      const empty = items.length === 0 && organisations.length === 0
      setState({ status: empty ? 'empty' : 'done', result, query })
    } catch {
      setState({ status: 'error', result: null, query })
    }
  }, [])

  return { status: state.status, result: state.result, query: state.query, run }
}
