// Compréhension d'un message libre (lot ASSIST-01, extension chatbot).
//
// Ce module ne contient AUCUN modèle de langue. Il applique des règles lisibles :
// repérage de la langue par mots outils, rapprochement du message avec les six
// besoins du contrat, extraction des mots-clés. Tout est explicable ligne à
// ligne, ce qui est la condition posée par docs/CONVENTIONS.md pour partir en PR.
//
// La recherche elle-même n'a pas lieu ici : `interpretMessage` produit une
// OrientationQuery, que le composant transmet par `onQuery`. C'est la façade
// src/services/orientation.ts qui interroge les lots KB-01 et ANNU-01.

import { LANGS, type Lang, type NeedCategory } from '../../types/orientation'

/* ------------------------------------------------------------------ langue */

/** Mots outils très fréquents, courts, et propres à chaque langue. */
const LANG_MARKERS: Record<Lang, readonly string[]> = {
  fr: [
    'je', 'jai', 'tu', 'il', 'elle', 'nous', 'vous', 'le', 'la', 'les', 'un',
    'une', 'des', 'du', 'de', 'mon', 'ma', 'mes', 'est', 'suis', 'sont', 'ou',
    'comment', 'pourquoi', 'besoin', 'aide', 'aider', 'cherche', 'chercher',
    'trouver', 'pour', 'avec', 'dans', 'quel', 'quelle', 'faire', 'peux',
    'pouvez', 'bonjour', 'merci', 'plus', 'pas', 'que', 'qui', 'sur',
  ],
  en: [
    'i', 'im', 'you', 'he', 'she', 'we', 'they', 'the', 'a', 'an', 'is', 'am',
    'are', 'my', 'your', 'where', 'how', 'why', 'need', 'help', 'looking',
    'find', 'for', 'with', 'in', 'what', 'which', 'can', 'could', 'hello',
    'thanks', 'please', 'do', 'does', 'want', 'get', 'to', 'and',
  ],
}

/** Lettres accentuées courantes en français et absentes de l'anglais courant. */
const FRENCH_DIACRITICS = /[àâäçéèêëîïôöùûüÿœ]/i

/** Une écriture non latine : le message n'est ni français ni anglais. */
const NON_LATIN = /[\p{Script=Arabic}\p{Script=Cyrillic}\p{Script=Han}\p{Script=Devanagari}\p{Script=Hebrew}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Armenian}\p{Script=Georgian}]/u

export interface LangDetection {
  /** Langue retenue pour répondre. Toujours une langue du contrat. */
  lang: Lang
  /** false quand le message ne portait aucun indice exploitable. */
  confident: boolean
  /** true quand le message est écrit dans une écriture que le contrat ne couvre pas. */
  unsupportedScript: boolean
}

/** Découpe en mots comparables : minuscules, sans accents ni ponctuation. */
export function words(text: string): string[] {
  return text
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 0)
}

/**
 * Repère la langue du message parmi celles du contrat.
 * `fallback` sert quand le message ne tranche pas : on garde la langue en cours
 * plutôt que d'en imposer une, et `confident` le signale à l'appelant.
 */
export function detectLang(text: string, fallback: Lang = 'fr'): LangDetection {
  if (NON_LATIN.test(text)) {
    return { lang: fallback, confident: false, unsupportedScript: true }
  }

  const found = words(text)
  const scores = new Map<Lang, number>(LANGS.map((lang) => [lang, 0]))
  for (const word of found) {
    for (const lang of LANGS) {
      if (LANG_MARKERS[lang].includes(word)) {
        scores.set(lang, (scores.get(lang) ?? 0) + 1)
      }
    }
  }
  // Un accent français est un indice fort : l'anglais courant n'en porte pas.
  if (FRENCH_DIACRITICS.test(text)) scores.set('fr', (scores.get('fr') ?? 0) + 2)

  const classement = [...scores.entries()].sort((a, b) => b[1] - a[1])
  const [meilleur, pointsMeilleur] = classement[0]
  const pointsSuivant = classement[1]?.[1] ?? 0

  if (pointsMeilleur === 0 || pointsMeilleur === pointsSuivant) {
    return { lang: fallback, confident: false, unsupportedScript: false }
  }
  return { lang: meilleur, confident: true, unsupportedScript: false }
}

/* ------------------------------------------------------------------ besoin */

/** Mots qui rattachent un message à l'un des six besoins du contrat. */
const CATEGORY_MARKERS: Record<NeedCategory, readonly string[]> = {
  papiers: [
    'papier', 'papiers', 'titre', 'sejour', 'carte', 'identite', 'prefecture',
    'recepisse', 'asile', 'naturalisation', 'visa', 'domiciliation',
    'attestation', 'document', 'documents', 'permit', 'residence', 'passport',
    'paperwork', 'administrative', 'registration',
  ],
  sante: [
    'sante', 'medecin', 'docteur', 'hopital', 'malade', 'maladie', 'soin',
    'soins', 'dentiste', 'psychologue', 'pharmacie', 'ameli', 'mutuelle',
    'vaccin', 'urgence', 'health', 'doctor', 'hospital', 'sick', 'care',
    'medical', 'dentist', 'pharmacy', 'insurance',
  ],
  hebergement: [
    'hebergement', 'loger', 'logement', 'dormir', 'nuit', 'hotel', 'foyer',
    'abri', 'rue', 'sdf', 'chambre', 'appartement', 'expulsion', 'housing',
    'shelter', 'sleep', 'homeless', 'accommodation', 'room', 'flat', 'rent',
  ],
  alimentation: [
    'manger', 'nourriture', 'alimentaire', 'alimentation', 'repas', 'faim',
    'colis', 'epicerie', 'restaurant', 'cantine', 'food', 'eat', 'meal',
    'hungry', 'grocery', 'kitchen', 'bank',
  ],
  juridique: [
    'juridique', 'avocat', 'droit', 'droits', 'justice', 'tribunal', 'recours',
    'plainte', 'ofpra', 'cnda', 'legal', 'lawyer', 'rights', 'court', 'appeal',
    'complaint', 'law',
  ],
  travail: [
    'travail', 'travailler', 'emploi', 'job', 'boulot', 'cdd', 'cdi', 'stage',
    'formation', 'chomage', 'salaire', 'contrat', 'embauche', 'work', 'employment',
    'hiring', 'training', 'unemployment', 'salary', 'internship', 'cv',
  ],
}

/** Mots trop courants pour aider la recherche. */
const STOPWORDS = new Set([...LANG_MARKERS.fr, ...LANG_MARKERS.en])

/**
 * Rattache un message à un besoin du contrat, ou null si rien ne ressort.
 * Aucune catégorie n'est devinée par défaut : sans indice, la question part
 * sans `category` et la recherche se fait sur les seuls mots-clés.
 */
export function matchCategory(text: string): NeedCategory | null {
  const found = words(text)
  let meilleur: NeedCategory | null = null
  let meilleurScore = 0

  for (const [category, markers] of Object.entries(CATEGORY_MARKERS)) {
    const score = found.filter((word) => markers.includes(word)).length
    if (score > meilleurScore) {
      meilleurScore = score
      meilleur = category as NeedCategory
    }
  }
  return meilleur
}

/** Mots porteurs de sens, débarrassés des mots outils. */
export function extractKeywords(text: string): string[] {
  return [...new Set(words(text).filter((w) => w.length > 2 && !STOPWORDS.has(w)))]
}

/* ----------------------------------------------------------------- lecture */

export interface Interpretation extends LangDetection {
  category: NeedCategory | null
  keywords: string[]
}

/** Lit un message libre : sa langue, le besoin visé, ses mots-clés. */
export function interpretMessage(text: string, fallback: Lang = 'fr'): Interpretation {
  const detection = detectLang(text, fallback)
  return {
    ...detection,
    category: matchCategory(text),
    keywords: extractKeywords(text),
  }
}
