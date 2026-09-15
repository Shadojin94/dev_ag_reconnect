import { registry } from '../app/registry'
import { translate } from '../lib/text'
import type {
  Explanation,
  KnowledgeItem,
  Organisation,
  OrientationQuery,
  OrientationService,
} from '../types/orientation'

// Façade commune (INT-01, phase 2) : elle délègue aux lots branchés dans le registre.
// Un lot absent ne casse rien — il renvoie une liste vide.
const EMPTY_TEXT = 'Aucune explication disponible pour ce besoin dans le jeu local.'

async function noKnowledge(): Promise<KnowledgeItem[]> {
  return []
}

async function noOrganisations(): Promise<Organisation[]> {
  return []
}

export const orientationService: OrientationService = {
  searchKnowledge: registry.romain.searchKnowledge ?? noKnowledge,

  findOrganisations: registry.nils.findOrganisations ?? noOrganisations,

  // Mode « sans IA » : le texte est construit à partir des fiches du jeu local,
  // et chaque source affichée vient d'une fiche réelle.
  async explain(query: OrientationQuery, items: KnowledgeItem[]): Promise<Explanation> {
    const [first] = items
    const text = first
      ? `${translate(first.title, query.lang)} — ${translate(first.summary, query.lang)}`
      : EMPTY_TEXT

    return {
      text,
      mode: 'fixture',
      sources: items.map((item) => item.source),
    }
  },
}
