import type { OrganisationListProps } from '../app/types'
import type { Organisation } from '../types/orientation'
import styles from './FallbackOrganisationList.module.css'
import { SourceLink } from './SourceLink'

/**
 * Rendu générique des structures, utilisé tant que le lot ANNU-01 n'est pas branché.
 * Aucun bouton n'est affiché sans valeur réelle ; le lien carte exige une adresse.
 */
function mapUrl(organisation: Organisation): string | null {
  if (!organisation.address) return null
  const full = [organisation.address, organisation.postalCode, organisation.city]
    .filter(Boolean)
    .join(' ')
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(full)}`
}

export function FallbackOrganisationList({ organisations }: OrganisationListProps) {
  if (organisations.length === 0) {
    return <p className={styles.empty}>Aucune structure trouvée pour cette recherche.</p>
  }

  return (
    <ul className={styles.list}>
      {organisations.map((organisation) => {
        const map = mapUrl(organisation)
        return (
          <li className={styles.card} key={organisation.id}>
            <h3 className={styles.name}>{organisation.name}</h3>
            <p className={styles.address}>
              {organisation.address ? `${organisation.address}, ` : ''}
              {organisation.postalCode ? `${organisation.postalCode} ` : ''}
              {organisation.city}
            </p>
            {organisation.openingHours && (
              <p className={styles.hours}>Horaires : {organisation.openingHours}</p>
            )}
            <div className={styles.actions}>
              {organisation.phone && (
                <a className={styles.action} href={`tel:${organisation.phone.replace(/\s/g, '')}`}>
                  Appeler · {organisation.phone}
                </a>
              )}
              {organisation.email && (
                <a className={styles.action} href={`mailto:${organisation.email}`}>Écrire</a>
              )}
              {map && (
                <a className={styles.action} href={map} rel="noreferrer noopener" target="_blank">
                  Voir sur la carte
                </a>
              )}
              {organisation.website && (
                <a
                  className={styles.action}
                  href={organisation.website}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Site web
                </a>
              )}
            </div>
            <p className={styles.source}>Source : <SourceLink source={organisation.source} /></p>
          </li>
        )
      })}
    </ul>
  )
}
