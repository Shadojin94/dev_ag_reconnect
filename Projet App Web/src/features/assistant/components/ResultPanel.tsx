// Affichage d'une réponse d'orientation (lot ASSIST-01).
//
// Ne sait rien de l'origine des données : il reçoit un OrientationResult déjà
// assemblé par la façade commune et le met en forme dans la langue choisie.

import type { Lang, OrientationResult, SourceRef } from '../../../types/orientation'
import { translate, UI_LABELS } from '../labels'
import styles from './ResultPanel.module.css'

interface ResultPanelProps {
  result: OrientationResult
  lang: Lang
}

function SourceLink({ source, lang }: { source: SourceRef; lang: Lang }) {
  return (
    <a className={styles.source} href={source.url} rel="noreferrer" target="_blank">
      {source.label}
      {source.verified ? null : (
        <span className={styles.unverified}>
          {' — '}
          {translate(UI_LABELS.sourceUnverified, lang)}
        </span>
      )}
    </a>
  )
}

export function ResultPanel({ result, lang }: ResultPanelProps) {
  const { explanation, items, organisations } = result

  return (
    <div className={styles.panel}>
      {/* Le mode affiché est celui que porte la donnée, jamais une supposition. */}
      {explanation.mode === 'fixture' ? (
        <p className={styles.banner}>{translate(UI_LABELS.fixtureBanner, lang)}</p>
      ) : null}

      {explanation.text === '' ? null : (
        <section>
          <h3 className={styles.heading}>{translate(UI_LABELS.answerHeading, lang)}</h3>
          <p className={styles.answer}>{explanation.text}</p>
        </section>
      )}

      {items.length === 0 ? null : (
        <section>
          <h3 className={styles.heading}>{translate(UI_LABELS.itemsHeading, lang)}</h3>
          <ul className={styles.list}>
            {items.map((item) => (
              <li className={styles.item} key={item.id}>
                <h4 className={styles.itemTitle}>{translate(item.title, lang)}</h4>
                <p className={styles.itemSummary}>{translate(item.summary, lang)}</p>
                <SourceLink lang={lang} source={item.source} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {organisations.length === 0 ? null : (
        <section>
          <h3 className={styles.heading}>
            {translate(UI_LABELS.organisationsHeading, lang)}
          </h3>
          <ul className={styles.list}>
            {organisations.map((organisation) => (
              <li className={styles.item} key={organisation.id}>
                <h4 className={styles.itemTitle}>{organisation.name}</h4>
                <p className={styles.itemSummary}>{organisation.city}</p>
                <SourceLink lang={lang} source={organisation.source} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {explanation.sources.length === 0 ? null : (
        <section>
          <h3 className={styles.heading}>{translate(UI_LABELS.sourcesHeading, lang)}</h3>
          <ul className={styles.list}>
            {explanation.sources.map((source) => (
              <li key={source.url}>
                <SourceLink lang={lang} source={source} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
