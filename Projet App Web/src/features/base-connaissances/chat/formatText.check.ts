// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/features/base-connaissances/chat/formatText.check.ts
import { parseBlocks, parseInline } from './formatText.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

function same(actual: unknown, expected: unknown): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected)
}

assert(same(parseBlocks(''), []), 'texte vide → aucun bloc')

assert(
  same(parseBlocks('Bonjour.\nSuite.\n\n- un\n- deux\n  suite deux\n\nFin.'), [
    { type: 'paragraph', text: 'Bonjour.\nSuite.' },
    { type: 'list', items: ['un', 'deux\nsuite deux'] },
    { type: 'paragraph', text: 'Fin.' },
  ]),
  'paragraphes, liste et continuation de puce',
)

assert(
  same(parseBlocks('Voici :\n- a\nAprès'), [
    { type: 'paragraph', text: 'Voici :' },
    { type: 'list', items: ['a'] },
    { type: 'paragraph', text: 'Après' },
  ]),
  'une ligne non indentée après une liste ouvre un paragraphe',
)

assert(
  same(parseBlocks('**Important** : lire'), [{ type: 'paragraph', text: '**Important** : lire' }]),
  '« ** » en début de ligne n’est pas une puce',
)

assert(
  same(parseInline('Le **115** répond [kb-a].'), [
    { text: 'Le ', bold: false },
    { text: '115', bold: true },
    { text: ' répond [kb-a].', bold: false },
  ]),
  'gras simple',
)

assert(
  same(parseInline('Voici **en cours'), [{ text: 'Voici en cours', bold: false }]),
  '« ** » non fermé en fin de flux → rendu normal',
)

assert(
  same(parseInline('**a** et **b**'), [
    { text: 'a', bold: true },
    { text: ' et ', bold: false },
    { text: 'b', bold: true },
  ]),
  'plusieurs passages en gras',
)

assert(same(parseInline('****x'), [{ text: 'x', bold: false }]), 'gras vide ignoré')
assert(same(parseInline('fin **'), [{ text: 'fin ', bold: false }]), '« ** » final seul retiré')

console.log('OK : formatText, toutes les vérifications passent.')
