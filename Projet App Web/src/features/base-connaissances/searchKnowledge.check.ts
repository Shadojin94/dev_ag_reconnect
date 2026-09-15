// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/features/base-connaissances/searchKnowledge.check.ts
// (type-stripping natif de Node >= 22.18 / 23.6). Aucun import de node:assert,
// car tsconfig.app.json ne charge pas les types Node : assert local équivalent.
import { KNOWLEDGE_ITEMS } from './knowledgeItems.ts'
import { localize } from './localize.ts'
import { searchKnowledge } from './searchKnowledge.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

const sante = await searchKnowledge({ lang: 'en', category: 'sante' })
assert(sante.length > 0, 'sante renvoie au moins une fiche')
assert(sante.every((item) => item.category === 'sante'), 'sante ne renvoie que des fiches sante')

const alimentation = await searchKnowledge({ lang: 'fr', category: 'alimentation' })
assert(alimentation.length === 0, 'alimentation renvoie []')

const first = sante[0]
assert(first.title.en === undefined, 'pas de traduction anglaise')
assert(localize(first.title, 'en') === first.title.fr, "lang 'en' renvoie le texte fr")

assert(
  KNOWLEDGE_ITEMS.some((item) => !item.source.verified && item.source.checkedAt === undefined),
  'au moins une fiche verified:false sans checkedAt',
)
assert(
  KNOWLEDGE_ITEMS.filter((item) => item.source.verified).every((item) => Boolean(item.source.checkedAt)),
  'toute fiche verified:true a un checkedAt',
)

const accents = await searchKnowledge({ lang: 'fr', keywords: 'ECRIVAINS' })
assert(accents.some((item) => item.id === 'kb-papiers-ecrivains-publics'), 'recherche insensible casse/accents')
assert((await searchKnowledge({ lang: 'fr', keywords: 'zzzz' })).length === 0, 'aucun résultat → []')

console.log(`OK : ${KNOWLEDGE_ITEMS.length} fiches, toutes les vérifications passent.`)
