import type { SourceRef } from '../types/orientation'
import styles from './SourceLink.module.css'

interface SourceLinkProps {
  source: SourceRef
}

/**
 * Affiche une source : libellé, date de consultation si elle existe,
 * et mention explicite quand la source n'a pas été vérifiée.
 * Une date absente ne s'invente pas.
 */
export function SourceLink({ source }: SourceLinkProps) {
  return (
    <span className={styles.source}>
      <a href={source.url} rel="noreferrer noopener" target="_blank">
        {source.label}
      </a>
      {source.checkedAt && (
        <span className={styles.meta}> · consultée le {source.checkedAt}</span>
      )}
      {source.verified === false && <span className={styles.unverified}> · non vérifiée</span>}
    </span>
  )
}
