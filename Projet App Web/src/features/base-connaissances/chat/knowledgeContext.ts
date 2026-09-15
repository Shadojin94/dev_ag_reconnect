import type { KnowledgeItem, Lang, OrientationQuery } from '../../../types/orientation.ts'
import { localize } from '../localize.ts'

export type KnowledgeSearch = (query: OrientationQuery) => Promise<KnowledgeItem[]>

export interface KnowledgeContext {
  items: KnowledgeItem[]
  matched: boolean
}

const MIN_TERM_LENGTH = 3

// Formes sans accents : la question est normalisée avant comparaison.
const STOP_WORDS = new Set([
  'les', 'des', 'une', 'aux', 'par', 'pour', 'sur', 'avec', 'sans', 'sous', 'chez', 'dans', 'vers',
  'cet', 'cette', 'ces', 'cela', 'ceci', 'qui', 'que', 'quoi', 'quel', 'quelle', 'quels', 'quelles',
  'comment', 'pourquoi', 'quand', 'combien', 'est', 'sont', 'suis', 'etes', 'etre', 'avoir',
  'avons', 'avez', 'ont', 'fait', 'faire', 'faut', 'peut', 'peux', 'pouvez', 'puis',
  'veux', 'voudrais', 'dois', 'doit', 'moi', 'toi', 'lui', 'nous', 'vous', 'ils', 'elle', 'elles',
  'leur', 'leurs', 'mon', 'mes', 'ton', 'tes', 'son', 'ses', 'notre', 'nos', 'votre', 'vos',
  'pas', 'plus', 'tres', 'bien', 'aussi', 'mais', 'donc', 'car', 'alors', 'tout', 'tous', 'toute',
  'toutes', 'autre', 'autres', 'meme', 'deja', 'encore', 'ici', 'besoin', 'aide', 'aider',
  'trouver', 'savoir', 'bonjour', 'merci', 'svp', 'quelqu', 'chose', 'comme',
  'the', 'and', 'for', 'with', 'how', 'what', 'where', 'when', 'who', 'why', 'can', 'you',
  'are', 'need', 'help', 'get', 'find', 'from', 'this', 'that', 'have', 'has', 'does', 'not',
  'please', 'hello', 'there', 'about', 'want', 'would', 'could', 'should', 'your', 'our',
])

// Même normalisation que searchKnowledge : sans accents, en minuscules.
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function extractKeywords(question: string): string {
  const terms = normalize(question)
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= MIN_TERM_LENGTH && !STOP_WORDS.has(term))
  return [...new Set(terms)].join(' ')
}

export async function findKnowledgeContext(
  question: string,
  search: KnowledgeSearch,
  lang: Lang,
): Promise<KnowledgeContext> {
  const keywords = extractKeywords(question)
  if (keywords !== '') {
    const items = await search({ lang, keywords })
    if (items.length > 0) return { items, matched: true }
  }
  return { items: await search({ lang }), matched: false }
}

export function buildFixtureAnswer(context: KnowledgeContext, lang: Lang): string {
  if (!context.matched || context.items.length === 0) {
    return [
      'Aucune fiche de la base de connaissances ne correspond à votre question.',
      'Essayez de la reformuler avec d’autres mots, par exemple : hébergement, santé, papiers, emploi ou violences conjugales.',
    ].join('\n\n')
  }

  const lines = context.items.map(
    (item) => `- **${localize(item.title, lang)}** : ${localize(item.summary, lang)} [${item.id}]`,
  )
  return ['Voici les fiches de la base qui correspondent à votre question :', lines.join('\n')].join('\n\n')
}
