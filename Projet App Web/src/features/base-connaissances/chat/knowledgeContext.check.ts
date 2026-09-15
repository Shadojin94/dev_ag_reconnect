// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/features/base-connaissances/chat/knowledgeContext.check.ts
// (type-stripping natif de Node >= 22.18 / 23.6). Assert local, comme searchKnowledge.check.ts.
import { KNOWLEDGE_ITEMS } from '../knowledgeItems.ts'
import { searchKnowledge } from '../searchKnowledge.ts'
import { buildFixtureAnswer, extractKeywords, findKnowledgeContext } from './knowledgeContext.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

assert(
  extractKeywords('Comment est-ce que je peux trouver un logement pour mon fils ?') === 'logement fils',
  'mots vides et mots courts retirés',
)
assert(extractKeywords('HÉBERGEMENT hébergement Hebergement') === 'hebergement', 'accents, casse et doublons')
assert(extractKeywords('Faut-il appeler le 115 ?') === 'appeler 115', 'nombre 115 conservé')
assert(extractKeywords('Comment est-ce que je peux ?') === '', 'question sans terme utile → chaîne vide')

const hebergementIds = KNOWLEDGE_ITEMS.filter((item) => item.category === 'hebergement').map((item) => item.id)

const hebergement = await findKnowledgeContext('Où trouver un hébergement ?', searchKnowledge, 'fr')
assert(hebergement.matched, 'question hébergement → matched')
assert(
  hebergementIds.every((id) => hebergement.items.some((item) => item.id === id)),
  'question hébergement → toutes les fiches hébergement',
)
assert(hebergement.items.length < KNOWLEDGE_ITEMS.length, 'question hébergement → pas toute la base')

const offTopic = await findKnowledgeContext('Quelle est la météo à Tokyo demain ?', searchKnowledge, 'fr')
assert(!offTopic.matched, 'question hors sujet → matched false')
assert(offTopic.items.length === KNOWLEDGE_ITEMS.length, 'question hors sujet → toute la base')

const empty = await findKnowledgeContext('Comment ?', searchKnowledge, 'fr')
assert(!empty.matched && empty.items.length === KNOWLEDGE_ITEMS.length, 'question vide de sens → toute la base')

const answer = buildFixtureAnswer(hebergement, 'fr')
assert(answer.startsWith('Voici les fiches'), 'réponse fixture : phrase d’introduction')
assert(
  hebergement.items.every((item) => answer.includes(`[${item.id}]`)),
  'réponse fixture : un marqueur [kb-id] par fiche',
)
assert(answer.includes('- **'), 'réponse fixture : liste à tirets avec titre en gras')

const noMatch = buildFixtureAnswer(offTopic, 'fr')
assert(noMatch.includes('Aucune fiche'), 'réponse fixture sans correspondance : message honnête')
assert(!noMatch.includes('[kb-'), 'réponse fixture sans correspondance : aucun marqueur')

console.log(`OK : ${hebergement.items.length} fiches pour la question hébergement, toutes les vérifications passent.`)
