import type {
  Explanation,
  KnowledgeItem,
  Organisation,
  OrientationQuery,
  OrientationService,
} from '../types/orientation'

// Façade commune (INT-01, phase 1) : stub tant que les lots ne sont pas branchés.
// Phase 2 : brancher searchKnowledge sur features/base-connaissances
// et findOrganisations sur features/annuaire, via leurs index.ts.
export const orientationService: OrientationService = {
  async searchKnowledge(_query: OrientationQuery): Promise<KnowledgeItem[]> {
    return []
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
