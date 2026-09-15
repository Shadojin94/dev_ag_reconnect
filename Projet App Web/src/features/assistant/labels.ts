// Libellés de l'assistant (lot ASSIST-01).
// Les textes affichés sont en français, les identifiants en anglais :
// convention du projet, docs/CONVENTIONS.md.
//
// Chaque libellé est un LocalizedText du contrat commun : le français est
// obligatoire, les autres langues sont facultatives. Quand une traduction
// manque, `translate` retombe sur le français — règle de vérité de
// CONTRAT-DONNEES.md, « Le français sert de repli quand une traduction manque ».

import type { Lang, LocalizedText, NeedCategory } from '../../types/orientation'

/** Texte d'un LocalizedText dans la langue demandée, français en repli. */
export function translate(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.fr
}

/** Nom de chaque langue, écrit dans cette langue. */
export const LANG_LABELS: Record<Lang, LocalizedText> = {
  fr: { fr: 'Français', en: 'Français' },
  en: { fr: 'English', en: 'English' },
}

/** Les six besoins du contrat commun (NEED_CATEGORIES). */
export const CATEGORY_LABELS: Record<NeedCategory, LocalizedText> = {
  papiers: { fr: 'Papiers et démarches', en: 'Paperwork' },
  sante: { fr: 'Santé', en: 'Health' },
  hebergement: { fr: 'Hébergement', en: 'Housing' },
  alimentation: { fr: 'Alimentation', en: 'Food' },
  juridique: { fr: 'Aide juridique', en: 'Legal aid' },
  travail: { fr: 'Travail et emploi', en: 'Work and employment' },
}

/** Textes de l'interface. Ajouter une clé ici, jamais une chaîne dans le JSX. */
export const UI_LABELS = {
  title: { fr: 'Trouver une aide', en: 'Find support' },
  intro: {
    fr: 'Choisissez votre langue, votre besoin, puis votre ville.',
    en: 'Choose your language, your need, then your city.',
  },

  stepLang: { fr: '1. Votre langue', en: '1. Your language' },
  stepNeed: { fr: '2. Votre besoin', en: '2. Your need' },
  stepCity: { fr: '3. Votre ville', en: '3. Your city' },

  cityHint: {
    fr: 'Facultatif. Laissez vide pour chercher partout.',
    en: 'Optional. Leave empty to search everywhere.',
  },
  submit: { fr: 'Chercher', en: 'Search' },
  reset: { fr: 'Recommencer', en: 'Start over' },

  statusIdle: {
    fr: 'Choisissez un besoin pour lancer la recherche.',
    en: 'Choose a need to start the search.',
  },
  statusLoading: { fr: 'Recherche en cours…', en: 'Searching…' },
  statusEmpty: {
    fr: 'Aucun résultat pour cette recherche. Essayez un autre besoin ou une autre ville.',
    en: 'No result for this search. Try another need or another city.',
  },
  statusError: {
    fr: 'La recherche a échoué. Réessayez dans un moment.',
    en: 'The search failed. Please try again in a moment.',
  },

  answerHeading: { fr: 'Réponse', en: 'Answer' },
  itemsHeading: { fr: 'Fiches utiles', en: 'Useful guides' },
  organisationsHeading: { fr: 'Structures', en: 'Organisations' },
  sourcesHeading: { fr: 'Sources', en: 'Sources' },

  // Le bandeau annonce le mode réellement utilisé, jamais un mode supposé :
  // CONTRAT-DONNEES.md, « L'interface doit annoncer le mode réellement utilisé ».
  fixtureBanner: {
    fr: 'Mode sans IA : réponse préparée à partir du jeu local.',
    en: 'No-AI mode: answer prepared from the local data set.',
  },
  sourceUnverified: { fr: 'source non vérifiée', en: 'unverified source' },
} as const satisfies Record<string, LocalizedText>

export type UiKey = keyof typeof UI_LABELS

