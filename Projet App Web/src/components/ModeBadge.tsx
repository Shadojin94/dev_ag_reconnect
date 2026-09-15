import type { Explanation } from '../types/orientation'
import styles from './ModeBadge.module.css'

interface ModeBadgeProps {
  mode: Explanation['mode']
}

/** Annonce le mode réellement utilisé, comme l'exige le contrat commun. */
export function ModeBadge({ mode }: ModeBadgeProps) {
  const isFixture = mode === 'fixture'
  return (
    <span className={isFixture ? styles.fixture : styles.llm}>
      {isFixture ? 'Mode sans IA' : 'IA connectée'}
    </span>
  )
}
