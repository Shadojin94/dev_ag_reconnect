import type { KnowledgeItem, OrientationQuery } from '../../types/orientation.ts'
import { KNOWLEDGE_ITEMS } from './knowledgeItems.ts'

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function matchesKeywords(item: KnowledgeItem, keywords: string): boolean {
  const terms = normalize(keywords).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack = normalize(
    [item.title.fr, item.summary.fr, ...item.keywords].join(' '),
  )
  return terms.some((term) => haystack.includes(term))
}

export function searchKnowledge(query: OrientationQuery): Promise<KnowledgeItem[]> {
  const { category, keywords } = query
  const items = KNOWLEDGE_ITEMS.filter(
    (item) =>
      (category === undefined || item.category === category) &&
      (keywords === undefined || matchesKeywords(item, keywords)),
  )
  return Promise.resolve(items)
}
