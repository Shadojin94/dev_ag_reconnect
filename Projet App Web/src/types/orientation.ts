// Contrat commun Reconnect Assist (INT-01, phase 1).
// Source : CONTRAT-DONNEES.md. Toute modification est annoncée aux trois lots.

export const NEED_CATEGORIES = [
  'papiers', 'sante', 'hebergement',
  'alimentation', 'juridique', 'travail',
] as const
export type NeedCategory = (typeof NEED_CATEGORIES)[number]

export const LANGS = ['fr', 'en'] as const
export type Lang = (typeof LANGS)[number]
export type LocalizedText =
  { fr: string } & Partial<Record<Exclude<Lang, 'fr'>, string>>

export interface SourceRef {
  url: string
  label: string
  verified: boolean
  checkedAt?: string
}

export interface KnowledgeItem {
  id: string
  category: NeedCategory
  title: LocalizedText
  summary: LocalizedText
  steps?: LocalizedText[]
  keywords: string[]
  source: SourceRef
}

export interface Organisation {
  id: string
  name: string
  categories: NeedCategory[]
  city: string
  postalCode?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  openingHours?: string
  languages?: string[]
  lat?: number
  lng?: number
  source: SourceRef
}

export interface OrientationQuery {
  lang: Lang
  category?: NeedCategory
  keywords?: string
  city?: string
}

export interface Explanation {
  text: string
  mode: 'fixture' | 'llm'
  sources: SourceRef[]
}

export interface OrientationResult {
  items: KnowledgeItem[]
  organisations: Organisation[]
  explanation: Explanation
}

export interface OrientationService {
  searchKnowledge(query: OrientationQuery): Promise<KnowledgeItem[]>
  findOrganisations(query: OrientationQuery): Promise<Organisation[]>
  explain(
    query: OrientationQuery,
    items: KnowledgeItem[],
  ): Promise<Explanation>
}
