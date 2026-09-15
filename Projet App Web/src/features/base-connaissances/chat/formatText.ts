// Mise en forme légère des réponses : paragraphes, listes « - » et **gras**.

export interface InlineFragment {
  text: string
  bold: boolean
}

export type TextBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

const LIST_ITEM = /^\s*[-*•]\s+(.*)$/

// Découpe le texte brut en blocs ; les lignes simples restent dans leur bloc (« \n »).
export function parseBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = []
  let current: TextBlock | undefined

  for (const line of text.split(/\r?\n/)) {
    const listMatch = LIST_ITEM.exec(line)
    if (line.trim() === '') {
      current = undefined
    } else if (listMatch) {
      if (current?.type !== 'list') {
        current = { type: 'list', items: [] }
        blocks.push(current)
      }
      current.items.push(listMatch[1])
    } else if (current?.type === 'list' && /^\s/.test(line)) {
      current.items[current.items.length - 1] += `\n${line.trim()}`
    } else if (current?.type === 'paragraph') {
      current.text += `\n${line}`
    } else {
      current = { type: 'paragraph', text: line }
      blocks.push(current)
    }
  }
  return blocks
}

// Un « ** » resté ouvert (flux en cours) est retiré et la suite rendue normalement.
export function parseInline(text: string): InlineFragment[] {
  const parts = text.split('**')
  const unclosed = parts.length % 2 === 0
  const fragments: InlineFragment[] = []

  parts.forEach((part, index) => {
    const bold = index % 2 === 1 && !(unclosed && index === parts.length - 1)
    if (part === '') return
    const previous = fragments[fragments.length - 1]
    if (previous?.bold === bold) previous.text += part
    else fragments.push({ text: part, bold })
  })
  return fragments
}
