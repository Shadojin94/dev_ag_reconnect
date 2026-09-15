import type { KnowledgeListProps } from '../app/types'
import { translate } from '../lib/text'
import styles from './FallbackKnowledgeList.module.css'
import { SourceLink } from './SourceLink'

/** Rendu générique des fiches, utilisé tant que le lot KB-01 n'est pas branché. */
export function FallbackKnowledgeList({ items, lang }: KnowledgeListProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>Aucune fiche dans la base pour ce besoin.</p>
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li className={styles.card} key={item.id}>
          <h3 className={styles.title}>{translate(item.title, lang)}</h3>
          <p className={styles.summary}>{translate(item.summary, lang)}</p>
          {item.steps && item.steps.length > 0 && (
            <ol className={styles.steps}>
              {item.steps.map((step) => (
                <li key={step.fr}>{translate(step, lang)}</li>
              ))}
            </ol>
          )}
          <p className={styles.source}>Source : <SourceLink source={item.source} /></p>
        </li>
      ))}
    </ul>
  )
}
