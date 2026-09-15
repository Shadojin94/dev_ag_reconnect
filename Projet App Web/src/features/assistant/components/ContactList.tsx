// Orientation vers les structures à contacter (lot ASSIST-01).
//
// Règle de vérité appliquée (CONTRAT-DONNEES.md) : un téléphone, un courriel ou
// une adresse inconnu reste absent. Aucune ligne de contact n'est rendue si le
// champ n'existe pas — pas de tiret, pas de « non renseigné », rien. L'usager ne
// doit jamais composer un numéro que personne n'a vérifié.

import type { Lang, Organisation } from '../../../types/orientation'
import { translate, UI_LABELS } from '../labels'
import styles from './ContactList.module.css'

interface ContactListProps {
  organisations: readonly Organisation[]
  lang: Lang
}

/** Une ligne « intitulé : valeur », rendue seulement si la valeur existe. */
function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{children}</span>
    </div>
  )
}

export function ContactList({ organisations, lang }: ContactListProps) {
  if (organisations.length === 0) {
    return <p className={styles.none}>{translate(UI_LABELS.contactsNone, lang)}</p>
  }

  return (
    <div className={styles.block}>
      <p className={styles.intro}>{translate(UI_LABELS.contactsIntro, lang)}</p>
      <ul className={styles.list}>
        {organisations.map((organisation) => (
          <li className={styles.card} key={organisation.id}>
            <h4 className={styles.name}>{organisation.name}</h4>

            <p className={styles.place}>
              {[organisation.address, organisation.postalCode, organisation.city]
                .filter((part) => part !== undefined && part !== '')
                .join(' · ')}
            </p>

            {organisation.phone === undefined ? null : (
              <ContactRow label={translate(UI_LABELS.contactPhone, lang)}>
                <a href={`tel:${organisation.phone.replace(/\s/g, '')}`}>{organisation.phone}</a>
              </ContactRow>
            )}

            {organisation.email === undefined ? null : (
              <ContactRow label={translate(UI_LABELS.contactEmail, lang)}>
                <a href={`mailto:${organisation.email}`}>{organisation.email}</a>
              </ContactRow>
            )}

            {organisation.website === undefined ? null : (
              <ContactRow label={translate(UI_LABELS.contactWebsite, lang)}>
                <a href={organisation.website} rel="noreferrer" target="_blank">
                  {organisation.website}
                </a>
              </ContactRow>
            )}

            {organisation.openingHours === undefined ? null : (
              <ContactRow label={translate(UI_LABELS.contactHours, lang)}>
                {organisation.openingHours}
              </ContactRow>
            )}

            {organisation.languages === undefined || organisation.languages.length === 0 ? null : (
              <ContactRow label={translate(UI_LABELS.contactLanguages, lang)}>
                {organisation.languages.join(', ')}
              </ContactRow>
            )}

            <a
              className={styles.source}
              href={organisation.source.url}
              rel="noreferrer"
              target="_blank"
            >
              {organisation.source.label}
              {organisation.source.verified ? null : (
                <span className={styles.unverified}>
                  {' — '}
                  {translate(UI_LABELS.sourceUnverified, lang)}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
