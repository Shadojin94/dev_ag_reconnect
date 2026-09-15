import type {
  Explanation,
  KnowledgeItem,
  Organisation,
  OrientationQuery,
  OrientationService,
} from '../types/orientation.ts'
import { searchKnowledge } from '../features/base-connaissances/index.ts'

// Façade commune (INT-01, phase 2) : base de connaissances branchée (KB-01).
// À venir : findOrganisations sur features/annuaire via son index.ts, explain via le LLM.
// Cycle ESM possible avec index.ts (ses composants importent cette façade) : sans danger
// tant que searchKnowledge n'est lu qu'à l'appel, jamais au chargement du module.
export const orientationService: OrientationService = {
  searchKnowledge(query: OrientationQuery): Promise<KnowledgeItem[]> {
    return searchKnowledge(query)
  },
  async findOrganisations(_query: OrientationQuery): Promise<Organisation[]> {
    return []
  },
  async explain(_query: OrientationQuery, _items: KnowledgeItem[]): Promise<Explanation> {
    return {
      text: 'Réponse préparée dans le jeu local, en mode sans IA.',
      mode: 'fixture',
      sources: [],
    }
  },
}
