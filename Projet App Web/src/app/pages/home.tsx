// Accueil : fusion des trois lots. Ce fichier appartient à l'intégration.
import { FallbackAssistant } from '../../components/FallbackAssistant'
import { FallbackKnowledgeList } from '../../components/FallbackKnowledgeList'
import { FallbackOrganisationList } from '../../components/FallbackOrganisationList'
import { ModeBadge } from '../../components/ModeBadge'
import { SourceLink } from '../../components/SourceLink'
import { pendingSlots, registry } from '../registry'
import { useOrientation } from '../useOrientation'
import styles from './home.module.css'

export function HomePage() {
  const { status, result, query, run } = useOrientation()
  const lang = query?.lang ?? 'fr'

  const Assistant = registry.ashad.Assistant ?? FallbackAssistant
  const KnowledgeList = registry.romain.KnowledgeList ?? FallbackKnowledgeList
  const OrganisationList = registry.nils.OrganisationList ?? FallbackOrganisationList

  const pending = pendingSlots()

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroHead}>
          <h1 className={styles.heroTitle}>Trouver de l'aide, près de chez vous</h1>
          <ModeBadge mode={result?.explanation.mode ?? 'fixture'} />
        </div>
        <p className={styles.heroText}>
          Reconnect Assist part d'un besoin simple — papiers, santé, hébergement, alimentation,
          juridique, travail — et renvoie une explication sourcée puis les structures qui peuvent
          vous recevoir. Toutes les informations affichées citent leur source ; rien n'est inventé.
        </p>
      </section>

      {pending.length > 0 && (
        <p className={styles.pending}>
          Lots en attente : {pending.map((page) => page.name).join(', ')}
        </p>
      )}

      <Assistant onQuery={run} result={result} status={status} />

      {status === 'loading' && <p className={styles.message}>Recherche en cours…</p>}
      {status === 'empty' && (
        <p className={styles.message}>
          Aucun résultat pour ce besoin dans le jeu local. Essayez une autre catégorie ou retirez la
          ville.
        </p>
      )}
      {status === 'error' && (
        <p className={styles.error}>La recherche a échoué. Réessayez dans un instant.</p>
      )}

      {status === 'done' && result && (
        <>
          <section className={styles.block}>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>Explication</h2>
              <ModeBadge mode={result.explanation.mode} />
            </div>
            <div className={styles.explanation}>
              <p>{result.explanation.text}</p>
              {result.explanation.sources.length > 0 && (
                <>
                  <p className={styles.sourcesTitle}>Sources</p>
                  <ul className={styles.sources}>
                    {result.explanation.sources.map((source) => (
                      <li key={`${source.url}-${source.label}`}>
                        <SourceLink source={source} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Ce que dit la base</h2>
            <KnowledgeList items={result.items} lang={lang} />
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Structures</h2>
            <OrganisationList lang={lang} organisations={result.organisations} />
          </section>
        </>
      )}
    </>
  )
}
