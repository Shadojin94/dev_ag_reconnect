import ashad from './pages/ashad'
import nils from './pages/nils'
import romain from './pages/romain'
import type { LearnerPage, LearnerSlot } from './types'

/**
 * Registre des lots. Chaque apprenant ne modifie QUE son fichier de page ;
 * ce fichier-ci n'a plus à bouger.
 */
export const registry: Record<LearnerSlot, LearnerPage> = { romain, nils, ashad }

/** Ordre d'affichage dans la navigation. */
export const SLOTS: readonly LearnerSlot[] = ['romain', 'nils', 'ashad']

/** Lots pas encore branchés, pour le bandeau d'attente de l'accueil. */
export function pendingSlots(): LearnerPage[] {
  return SLOTS.map((slot) => registry[slot]).filter((page) => !page.ready)
}
