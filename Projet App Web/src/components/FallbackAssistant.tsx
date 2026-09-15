import { useId, useState } from 'react'
import type { AssistantProps, OrientationStatus } from '../app/types'
import { LANGS, NEED_CATEGORIES, type Lang, type NeedCategory } from '../types/orientation'
import styles from './FallbackAssistant.module.css'

const LANG_LABELS: Record<Lang, string> = { fr: 'Français', en: 'Anglais' }

const CATEGORY_LABELS: Record<NeedCategory, string> = {
  papiers: 'Papiers',
  sante: 'Santé',
  hebergement: 'Hébergement',
  alimentation: 'Alimentation',
  juridique: 'Juridique',
  travail: 'Travail',
}

const STATUS_MESSAGES: Record<OrientationStatus, string | null> = {
  idle: 'Choisissez une langue et un besoin, puis lancez la recherche.',
  loading: 'Recherche en cours…',
  empty: 'Aucun résultat pour ce besoin dans le jeu local.',
  error: 'La recherche a échoué. Réessayez dans un instant.',
  done: null,
}

/**
 * Formulaire de repli, utilisé seulement tant que le lot ASSIST-01 n'est pas branché.
 * Deux clics : la langue, puis le besoin. La ville reste facultative.
 */
export function FallbackAssistant({ onQuery, status = 'idle' }: AssistantProps) {
  const [lang, setLang] = useState<Lang>('fr')
  const [category, setCategory] = useState<NeedCategory | null>(null)
  const [city, setCity] = useState('')
  const cityId = useId()
  const message = STATUS_MESSAGES[status]

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (!category) return
        onQuery({ lang, category, city: city.trim() || undefined })
      }}
    >
      <fieldset className={styles.field}>
        <legend className={styles.legend}>1. Votre langue</legend>
        <div className={styles.choices}>
          {LANGS.map((value) => (
            <label className={lang === value ? styles.choiceOn : styles.choice} key={value}>
              <input
                checked={lang === value}
                name="lang"
                onChange={() => setLang(value)}
                type="radio"
                value={value}
              />
              {LANG_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.field}>
        <legend className={styles.legend}>2. Votre besoin</legend>
        <div className={styles.choices}>
          {NEED_CATEGORIES.map((value) => (
            <label className={category === value ? styles.choiceOn : styles.choice} key={value}>
              <input
                checked={category === value}
                name="category"
                onChange={() => setCategory(value)}
                type="radio"
                value={value}
              />
              {CATEGORY_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.legend} htmlFor={cityId}>Ville (facultatif)</label>
        <input
          className={styles.city}
          id={cityId}
          onChange={(event) => setCity(event.target.value)}
          type="text"
          value={city}
        />
      </div>

      <button className={styles.submit} disabled={!category || status === 'loading'} type="submit">
        Chercher
      </button>

      {message && <p className={styles.message} role="status">{message}</p>}
    </form>
  )
}
