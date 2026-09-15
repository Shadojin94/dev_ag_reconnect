import { useEffect, useState } from 'react'
import type { LearnerSlot } from './types'

/** Routes connues : accueil (chaîne vide) ou page d'un apprenant. */
export type Route = '' | LearnerSlot

const ROUTES: readonly Route[] = ['', 'romain', 'nils', 'ashad']

function readRoute(): Route {
  // '#/nils' -> 'nils' ; toute route inconnue retombe sur l'accueil.
  const raw = window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase()
  return ROUTES.includes(raw as Route) ? (raw as Route) : ''
}

/** Routage par hash (ADR-002) : zéro dépendance, compatible avec un sous-chemin GitHub Pages. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}
