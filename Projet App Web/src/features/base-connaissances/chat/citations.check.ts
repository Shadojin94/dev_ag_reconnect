// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/features/base-connaissances/chat/citations.check.ts
// (type-stripping natif de Node >= 22.18 / 23.6). Assert local, comme searchKnowledge.check.ts.
import { KNOWLEDGE_ITEMS } from '../knowledgeItems.ts'
import { resolveCitations } from './citations.ts'
import type { ContentSegment } from './citations.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

function render(segments: ContentSegment[]): string {
  return segments
    .map((segment) => (segment.type === 'text' ? segment.text : `{${segment.index}}`))
    .join('')
}

const [a, b] = KNOWLEDGE_ITEMS

const nominal = resolveCitations(`Premier point [${a.id}]. Second point [${b.id}].`, KNOWLEDGE_ITEMS)
assert(render(nominal.segments) === 'Premier point {1}. Second point {2}.', 'cas nominal : segments')
assert(nominal.cited.length === 2 && nominal.cited[0] === a && nominal.cited[1] === b, 'cas nominal : cited')
const firstCitation = nominal.segments[1]
assert(firstCitation.type === 'citation' && firstCitation.item === a, 'cas nominal : fiche rattachée')

const repeated = resolveCitations(`Un [${b.id}], deux [${a.id}], trois [${b.id}].`, KNOWLEDGE_ITEMS)
assert(render(repeated.segments) === 'Un {1}, deux {2}, trois {1}.', 'id répété : même index')
assert(repeated.cited.length === 2 && repeated.cited[0] === b, 'id répété : cited sans doublon, ordre d’apparition')

const unknown = resolveCitations(`Texte [kb-inconnu]. Suite [${a.id}] fin [kb-absent]`, KNOWLEDGE_ITEMS)
assert(render(unknown.segments) === 'Texte. Suite {1} fin', 'id inconnu : marqueur et espace orphelin retirés')
assert(unknown.cited.length === 1, 'id inconnu : absent de cited')

const multiple = resolveCitations(`Voir [${a.id}, kb-inconnu ${b.id}, ${a.id}].`, KNOWLEDGE_ITEMS)
assert(render(multiple.segments) === 'Voir {1}{2}.', 'crochet multiple : une citation par id connu, sans doublon')
assert(multiple.cited.length === 2, 'crochet multiple : cited')

assert(render(resolveCitations('Réponse [kb-heberg', KNOWLEDGE_ITEMS).segments) === 'Réponse ', 'fragment [kb-… masqué')
assert(render(resolveCitations('Réponse [', KNOWLEDGE_ITEMS).segments) === 'Réponse ', 'fragment [ masqué')
assert(
  render(resolveCitations(`Réponse [${a.id}, kb-`, KNOWLEDGE_ITEMS).segments) === 'Réponse ',
  'fragment multiple incomplet masqué',
)
assert(
  render(resolveCitations('Note [à relire] et [kb-x plus loin', KNOWLEDGE_ITEMS).segments) ===
    'Note [à relire] et [kb-x plus loin',
  'crochets ordinaires conservés',
)

const plain = resolveCitations('Texte sans citation.', KNOWLEDGE_ITEMS)
assert(plain.segments.length === 1 && render(plain.segments) === 'Texte sans citation.', 'sans citation : un seul segment texte')
assert(plain.cited.length === 0, 'sans citation : cited vide')
assert(resolveCitations('', KNOWLEDGE_ITEMS).segments.length === 0, 'texte vide : aucun segment')

console.log('OK : citations, toutes les vérifications passent.')
