import type { Lang, LocalizedText } from '../../types/orientation.ts'

// Renvoie le texte dans la langue demandée, sinon le français.
export function localize(text: LocalizedText, lang: Lang): string {
  return (lang === 'fr' ? undefined : text[lang]) ?? text.fr
}
