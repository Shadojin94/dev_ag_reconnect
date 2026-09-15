import type { Lang, LocalizedText } from '../types/orientation'

/** Repli français quand la traduction demandée manque (règle du contrat commun). */
export function translate(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.fr
}
