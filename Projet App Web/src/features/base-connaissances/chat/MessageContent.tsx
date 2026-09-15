import { Fragment, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { KnowledgeItem, Lang } from '../../../types/orientation.ts'
import { localize } from '../localize.ts'
import { resolveCitations } from './citations.ts'
import { parseBlocks, parseInline } from './formatText.ts'
import styles from './MessageContent.module.css'

type MessageContentProps = {
  content: string
  contextItems: KnowledgeItem[]
  messageId: string
  lang: Lang
  showCaret?: boolean
}

type InlinePart =
  | { type: 'text'; text: string; bold: boolean }
  | { type: 'citation'; index: number; item: KnowledgeItem }

type RenderBlock =
  | { type: 'paragraph'; parts: InlinePart[] }
  | { type: 'list'; items: InlinePart[][] }

// Numérotation globale : celle de resolveCitations sur le contenu complet.
function buildBlocks(content: string, items: KnowledgeItem[]): RenderBlock[] {
  const { cited } = resolveCitations(content, items)
  const indexById = new Map(cited.map((item, position) => [item.id, position + 1]))

  const toParts = (text: string): InlinePart[] =>
    parseInline(text).flatMap(({ text: fragment, bold }) =>
      resolveCitations(fragment, items).segments.map((segment): InlinePart =>
        segment.type === 'text'
          ? { type: 'text', text: segment.text, bold }
          : { ...segment, index: indexById.get(segment.item.id) ?? segment.index },
      ),
    )

  return parseBlocks(content)
    .map((block): RenderBlock =>
      block.type === 'paragraph'
        ? { type: 'paragraph', parts: toParts(block.text) }
        : { type: 'list', items: block.items.map(toParts) },
    )
    .filter((block) => block.type === 'list' || block.parts.length > 0)
}

function renderParts(parts: InlinePart[], messageId: string, lang: Lang): ReactNode[] {
  return parts.map((part, position) => {
    if (part.type === 'text') {
      return part.bold
        ? <strong key={position} className={styles.bold}>{part.text}</strong>
        : <Fragment key={position}>{part.text}</Fragment>
    }
    const title = localize(part.item.title, lang)
    return (
      <a
        key={position}
        className={styles.citation}
        href={`#source-${messageId}-${part.index}`}
        title={title}
        aria-label={`Source ${part.index} : ${title}`}
      >
        {part.index}
      </a>
    )
  })
}

export function MessageContent({
  content,
  contextItems,
  messageId,
  lang,
  showCaret = false,
}: MessageContentProps) {
  const blocks = useMemo(() => buildBlocks(content, contextItems), [content, contextItems])
  const caret = showCaret ? <span className={styles.caret} aria-hidden="true" /> : null
  const lastIndex = blocks.length - 1

  if (blocks.length === 0) {
    return caret && <p className={styles.paragraph}>{caret}</p>
  }

  return (
    <div className={styles.content}>
      {blocks.map((block, position) =>
        block.type === 'paragraph' ? (
          <p key={position} className={styles.paragraph}>
            {renderParts(block.parts, messageId, lang)}
            {position === lastIndex && caret}
          </p>
        ) : (
          <ul key={position} className={styles.list}>
            {block.items.map((parts, itemPosition) => (
              <li key={itemPosition} className={styles.listItem}>
                {renderParts(parts, messageId, lang)}
                {position === lastIndex && itemPosition === block.items.length - 1 && caret}
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
