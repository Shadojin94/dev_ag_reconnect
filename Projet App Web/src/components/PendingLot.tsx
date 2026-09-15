import type { LearnerPage } from '../app/types'
import styles from './PendingLot.module.css'

interface PendingLotProps {
  page: Pick<LearnerPage, 'name' | 'ticket' | 'issue'>
  /** Ce que le lot doit exposer via son index.ts. */
  provides: string[]
  /** Les lignes à décommenter dans src/app/pages/<prenom>.tsx. */
  lines: string[]
}

const REPO_ISSUES = 'https://github.com/Shadojin94/dev_ag_reconnect/issues'

/** Écran affiché tant qu'un lot n'est pas branché : jamais une page cassée. */
export function PendingLot({ page, provides, lines }: PendingLotProps) {
  return (
    <section className={styles.pending}>
      <p className={styles.badge}>Lot en attente</p>
      <h2>{page.name} — {page.ticket}</h2>
      <p>
        Cette page affichera le lot de {page.name} dès qu'il sera branché. En attendant, voici ce
        qui manque.
      </p>

      <h3>Ce que le lot doit exposer</h3>
      <ul className={styles.list}>
        {provides.map((item) => (
          <li key={item}><code>{item}</code></li>
        ))}
      </ul>

      <h3>Les lignes à décommenter</h3>
      <ol className={styles.steps}>
        {lines.map((line) => (
          <li key={line}><code>{line}</code></li>
        ))}
      </ol>

      <p>
        Ticket suivi sur{' '}
        <a href={`${REPO_ISSUES}/${page.issue}`} rel="noreferrer noopener" target="_blank">
          l'issue #{page.issue}
        </a>
        .
      </p>
    </section>
  )
}
