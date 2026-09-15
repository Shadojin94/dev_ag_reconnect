import type { Lang, Organisation } from '../../types/orientation'
import styles from './OrganisationList.module.css'

interface OrganisationListProps {
  organisations: Organisation[]
  lang: Lang
}

const LABELS: Record<Lang, { empty: string; call: string; write: string; map: string; source: string }> = {
  fr: {
    empty: 'Aucune structure trouvée pour cette recherche.',
    call: 'Appeler',
    write: 'Écrire',
    map: 'Voir sur la carte',
    source: 'Source',
  },
  en: {
    empty: 'No organisation found for this search.',
    call: 'Call',
    write: 'Email',
    map: 'View on map',
    source: 'Source',
  },
}

// Le lien carte n'est construit que si l'adresse est connue ; son ouverture demande le réseau.
function mapUrl(organisation: Organisation) {
  const fullAddress = [organisation.address, organisation.postalCode, organisation.city].join(' ')
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(fullAddress)}`
}

export function OrganisationList({ organisations, lang }: OrganisationListProps) {
  const labels = LABELS[lang]

  if (organisations.length === 0) {
    return <p className={styles.empty}>{labels.empty}</p>
  }

  return (
    <ul className={styles.list}>
      {organisations.map((organisation) => (
        <li key={organisation.id} className={styles.card}>
          <h3 className={styles.name}>{organisation.name}</h3>
          <p className={styles.address}>
            {organisation.address && <>{organisation.address}, </>}
            {organisation.postalCode && <>{organisation.postalCode} </>}
            {organisation.city}
          </p>

          <div className={styles.actions}>
            {organisation.phone && (
              <a
                className={styles.action}
                href={`tel:${organisation.phone.replace(/\s/g, '')}`}
                aria-label={`${labels.call} ${organisation.name}`}
              >
                {labels.call} · {organisation.phone}
              </a>
            )}
            {organisation.email && (
              <a
                className={styles.action}
                href={`mailto:${organisation.email}`}
                aria-label={`${labels.write} ${organisation.name}`}
              >
                {labels.write}
              </a>
            )}
            {organisation.address && (
              <a
                className={styles.action}
                href={mapUrl(organisation)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${labels.map} : ${organisation.name}`}
              >
                {labels.map}
              </a>
            )}
          </div>

          <p className={styles.source}>
            {labels.source} :{' '}
            <a href={organisation.source.url} target="_blank" rel="noreferrer">
              {organisation.source.label}
            </a>
            {organisation.source.checkedAt && <> ({organisation.source.checkedAt})</>}
          </p>
        </li>
      ))}
    </ul>
  )
}
