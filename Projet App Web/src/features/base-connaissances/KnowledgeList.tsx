import type { KnowledgeItem, Lang } from '../../types/orientation.ts'
import { localize } from './localize.ts'
import styles from './KnowledgeList.module.css'

type KnowledgeListProps = {
  items: KnowledgeItem[]
  lang: Lang
}

// checkedAt attendu au format AAAA-MM-JJ.
function formatCheckedAt(checkedAt: string): string {
  const [year, month, day] = checkedAt.split('-')
  return `${day}/${month}/${year}`
}

export function KnowledgeList({ items, lang }: KnowledgeListProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>Aucune fiche pour cette catégorie.</p>
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <h3 className={styles.title}>{localize(item.title, lang)}</h3>
          <p className={styles.summary}>{localize(item.summary, lang)}</p>
          <p className={styles.meta}>
            Source :{' '}
            <a
              className={styles.link}
              href={item.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.source.label}
            </a>
            {item.source.checkedAt && (
              <> · Consultée le {formatCheckedAt(item.source.checkedAt)}</>
            )}
            {!item.source.verified && (
              <> · <span className={styles.unverified}>Source non vérifiée</span></>
            )}
          </p>
        </li>
      ))}
    </ul>
  )
}
