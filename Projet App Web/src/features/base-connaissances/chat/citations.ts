import type { KnowledgeItem } from '../../../types/orientation.ts'

export type ContentSegment =
  | { type: 'text'; text: string }
  | { type: 'citation'; index: number; item: KnowledgeItem }

export interface ResolvedCitations {
  segments: ContentSegment[]
  cited: KnowledgeItem[]
}

// [kb-a] ou [kb-a, kb-b] : un ou plusieurs identifiants séparés par virgule, point-virgule ou espace.
const MARKER = /\[\s*(kb-[a-z0-9-]+(?:[\s,;]+kb-[a-z0-9-]+)*)[\s,;]*\]/g

// Marqueur non refermé en fin de texte (streaming) : « [ », « [k », « [kb-heberg », « [kb-a, kb- ».
const INCOMPLETE_MARKER = /\[\s*(?:kb-[a-z0-9-]+[\s,;]+)*(?:k|kb|kb-[a-z0-9-]*)?$/

const TRAILING_SPACES = /[ \t]+$/

export function resolveCitations(content: string, items: KnowledgeItem[]): ResolvedCitations {
  const byId = new Map(items.map((item) => [item.id, item]))
  const indexes = new Map<string, number>()
  const cited: KnowledgeItem[] = []
  const segments: ContentSegment[] = []
  const visible = content.replace(INCOMPLETE_MARKER, '')

  let text = ''
  let cursor = 0

  const flushText = () => {
    if (text !== '') segments.push({ type: 'text', text })
    text = ''
  }

  for (const match of visible.matchAll(MARKER)) {
    text += visible.slice(cursor, match.index)
    cursor = match.index + match[0].length

    const ids = [...new Set(match[1].split(/[\s,;]+/))]
    const known = ids.flatMap((id) => {
      const item = byId.get(id)
      return item ? [item] : []
    })

    if (known.length === 0) {
      const next = visible.charAt(cursor)
      if (next === '' || /[\s.,;:!?)]/.test(next)) text = text.replace(TRAILING_SPACES, '')
      continue
    }

    flushText()
    for (const item of known) {
      let index = indexes.get(item.id)
      if (index === undefined) {
        cited.push(item)
        index = cited.length
        indexes.set(item.id, index)
      }
      segments.push({ type: 'citation', index, item })
    }
  }

  text += visible.slice(cursor)
  flushText()

  return { segments, cited }
}
