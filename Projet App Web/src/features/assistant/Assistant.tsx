// Assistant d'orientation multilingue (lot ASSIST-01).
//
// Contrat d'assemblage (CONTRAT-DONNEES.md) : Assistant({ onQuery, result, status }).
// Le composant construit une OrientationQuery et la transmet ; il ne va jamais
// chercher les données lui-même. C'est src/services/orientation.ts, branché par
// l'intégration en phase 2, qui appelle les lots KB-01 et ANNU-01.

import { useId } from 'react'
import {
  LANGS,
  NEED_CATEGORIES,
  type Lang,
  type NeedCategory,
  type OrientationQuery,
  type OrientationResult,
} from '../../types/orientation'
import styles from './Assistant.module.css'
import { ChoiceGroup, type ChoiceOption } from './components/ChoiceGroup'
import { ResultPanel } from './components/ResultPanel'
import { CATEGORY_LABELS, LANG_LABELS, translate, UI_LABELS } from './labels'
import { useAssistant } from './useAssistant'

/** États que l'intégration fait traverser à l'assistant. */
export type AssistantStatus = 'idle' | 'loading' | 'empty' | 'error' | 'done'

export interface AssistantProps {
  /** Reçoit la question construite. L'accès aux données est côté services. */
  onQuery: (query: OrientationQuery) => void
  /** Résultat renvoyé par la façade commune ; affiché quand status vaut 'done'. */
  result?: OrientationResult | null
  /** Par défaut 'idle' : rien n'a encore été demandé. */
  status?: AssistantStatus
}

/** Message d'attente, de vide ou d'erreur — null quand il y a un résultat à montrer. */
function statusMessage(status: AssistantStatus, lang: Lang): string | null {
  switch (status) {
    case 'idle':
      return translate(UI_LABELS.statusIdle, lang)
    case 'loading':
      return translate(UI_LABELS.statusLoading, lang)
    case 'empty':
      return translate(UI_LABELS.statusEmpty, lang)
    case 'error':
      return translate(UI_LABELS.statusError, lang)
    case 'done':
      return null
  }
}

export function Assistant({ onQuery, result = null, status = 'idle' }: AssistantProps) {
  const { lang, setLang, category, setCategory, city, setCity, canSubmit, submit, reset } =
    useAssistant({ onQuery })
  const cityId = useId()
  const cityHintId = useId()

  const langOptions: ChoiceOption<Lang>[] = LANGS.map((value) => ({
    value,
    label: translate(LANG_LABELS[value], lang),
  }))
  const categoryOptions: ChoiceOption<NeedCategory>[] = NEED_CATEGORIES.map((value) => ({
    value,
    label: translate(CATEGORY_LABELS[value], lang),
  }))

  const message = statusMessage(status, lang)

  return (
    <section aria-labelledby={`${cityId}-title`} className={styles.assistant} lang={lang}>
      <h2 className={styles.title} id={`${cityId}-title`}>
        {translate(UI_LABELS.title, lang)}
      </h2>
      <p className={styles.intro}>{translate(UI_LABELS.intro, lang)}</p>

      <ChoiceGroup
        legend={translate(UI_LABELS.stepLang, lang)}
        onSelect={setLang}
        options={langOptions}
        selected={lang}
      />

      <ChoiceGroup
        legend={translate(UI_LABELS.stepNeed, lang)}
        onSelect={setCategory}
        options={categoryOptions}
        selected={category}
      />

      <div className={styles.field}>
        <label className={styles.label} htmlFor={cityId}>
          {translate(UI_LABELS.stepCity, lang)}
        </label>
        <input
          aria-describedby={cityHintId}
          className={styles.input}
          id={cityId}
          onChange={(event) => setCity(event.target.value)}
          type="text"
          value={city}
        />
        <p className={styles.hint} id={cityHintId}>
          {translate(UI_LABELS.cityHint, lang)}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.submit}
          disabled={!canSubmit}
          onClick={submit}
          type="button"
        >
          {translate(UI_LABELS.submit, lang)}
        </button>
        <button className={styles.secondary} onClick={reset} type="button">
          {translate(UI_LABELS.reset, lang)}
        </button>
      </div>

      {/* aria-live : le changement d'état est annoncé sans déplacer le focus. */}
      <div aria-live="polite" className={styles.status} role="status">
        {message === null ? null : <p className={styles.message}>{message}</p>}
      </div>

      {status === 'done' && result !== null ? (
        <ResultPanel lang={lang} result={result} />
      ) : null}
    </section>
  )
}
