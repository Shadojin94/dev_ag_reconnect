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

  /* --- Conversation ---------------------------------------------------- */
  chatTitle: { fr: 'Poser votre question', en: 'Ask your question' },
  chatIntro: {
    fr: 'Écrivez dans votre langue. Les réponses viennent des fiches de l’application, pas d’une intelligence artificielle.',
    en: 'Write in your own language. Answers come from the application’s guides, not from an artificial intelligence.',
  },
  chatPlaceholder: {
    fr: 'Par exemple : je cherche un endroit où dormir ce soir',
    en: 'For example: I am looking for a place to sleep tonight',
  },
  chatSend: { fr: 'Envoyer', en: 'Send' },
  chatReset: { fr: 'Effacer la conversation', en: 'Clear the conversation' },
  chatLogLabel: { fr: 'Conversation', en: 'Conversation' },
  chatSuggestions: { fr: 'Ou choisissez un sujet :', en: 'Or pick a topic:' },
  chatPending: { fr: 'Je cherche…', en: 'Searching…' },
  chatUnderstood: { fr: 'Compris comme', en: 'Understood as' },

  /* --- Ce que l'assistant annonce sur sa propre compréhension ----------- */
  noticeLanguageGuess: {
    fr: 'Je n’ai pas reconnu la langue de ce message ; je continue dans la langue précédente.',
    en: 'I did not recognise the language of this message; I am continuing in the previous language.',
  },

  /* --- Orientation vers les contacts ----------------------------------- */
  contactsHeading: { fr: 'Qui contacter', en: 'Who to contact' },
  contactsIntro: {
    fr: 'Ces structures correspondent à votre besoin. Vérifiez les horaires avant de vous déplacer.',
    en: 'These organisations match your need. Check opening hours before travelling.',
  },
  contactsNone: {
    fr: 'Aucune structure n’est encore rattachée à ce besoin dans l’application.',
    en: 'No organisation is linked to this need in the application yet.',
  },
  contactPhone: { fr: 'Téléphone', en: 'Phone' },
  contactEmail: { fr: 'Courriel', en: 'Email' },
  contactWebsite: { fr: 'Site', en: 'Website' },
  contactHours: { fr: 'Horaires', en: 'Opening hours' },
  contactLanguages: { fr: 'Langues parlées', en: 'Languages spoken' },
} as const satisfies Record<string, LocalizedText>

export type UiKey = keyof typeof UI_LABELS


/**
 * Écriture non couverte par le contrat : le message s'affiche dans les deux
 * langues disponibles en même temps. Choisir l'une des deux reviendrait à
 * supposer que l'usager la lit, ce que rien n'indique.
 */
export const UNSUPPORTED_SCRIPT_NOTICE = [
  'Je ne réponds pour l’instant qu’en français et en anglais.',
  'I currently answer in French and English only.',
] as const
