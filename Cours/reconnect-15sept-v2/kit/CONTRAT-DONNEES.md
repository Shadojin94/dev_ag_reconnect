# Contrat proposé — Reconnect Assist

Document à relire avec le PO avant de créer `src/types/orientation.ts`. Le kit ne modifie pas l’application.

L’intégration partage une première version avant le lancement des lots. Toute évolution du contrat s’annonce aux trois responsables. Les catégories et les langues ci-dessous sont des exemples à confirmer ; le choix fr/en réduit la démo, une autre langue peut être retenue selon le public réel.

```ts
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
```

## Assemblage

- Romain expose `searchKnowledge` et `KnowledgeList({ items, lang })` via son `index.ts`.
- Nils expose `findOrganisations` et `OrganisationList({ organisations, lang })`.
- Ashad expose `Assistant({ onQuery, result, status })` et la logique de présentation de la réponse.
- L’intégration possède `src/services/orientation.ts`, les types et l’état commun sous `src/app/`.
- Une feature ne lit pas les fichiers internes d’une autre ; elle passe par la façade commune.
- Les jeux locaux sont proposés en `.ts` typé ; une API ultérieure pourra conserver les signatures asynchrones.

## Mode de réponse à décider avant lancement

Le PO choisit le mode connecté seulement si un endpoint serveur prêt et validé est disponible : authentification adaptée, clé côté serveur, réponse sourcée et erreurs gérées. L’interface doit annoncer le mode réellement utilisé. La construction d’un backend supplémentaire n’est pas incluse implicitement dans le lot d’Ashad.

Sans endpoint validé ou sans réseau, `explain` renvoie une explication préparée à partir du jeu local, avec `mode: 'fixture'` affiché « mode sans IA ». Ce repli ne prouve pas une intégration LLM.

## Règles de vérité

`verified: true` signifie que la source indiquée a réellement été consultée à la date donnée ; cela ne garantit pas que toute son information soit exacte ou toujours à jour. Conserver les citations ou extraits utiles dans le lot pour la relecture. Une date de consultation absente ne doit pas être inventée.

Un téléphone, un e-mail ou une adresse inconnu reste absent. N’afficher un lien de contact que si sa valeur existe et provient d’une source. Le lien carte externe exige une adresse exploitable et du réseau pour être ouvert.

Le français sert de repli quand une traduction manque. Les traductions automatiques demandent une relecture adaptée avant un usage réel auprès du public.

