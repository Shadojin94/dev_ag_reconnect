import type { JSX } from 'react'
import type {
  KnowledgeItem,
  Lang,
  Organisation,
  OrientationQuery,
  OrientationResult,
  OrientationService,
} from '../types/orientation'

/** États traversés par l'accueil et par l'assistant d'Ashad. */
export type OrientationStatus = 'idle' | 'loading' | 'empty' | 'error' | 'done'

export interface KnowledgeListProps {
  items: KnowledgeItem[]
  lang: Lang
}

export interface OrganisationListProps {
  organisations: Organisation[]
  lang: Lang
}

export interface AssistantProps {
  onQuery: (query: OrientationQuery) => void
  result?: OrientationResult | null
  status?: OrientationStatus
}

/**
 * Ce qu'un fichier `src/app/pages/<prenom>.tsx` exporte.
 * Les champs optionnels sont ce que le lot apporte à l'accueil ;
 * `undefined` signifie « pas encore branché », et l'accueil bascule sur un repli.
 */
export interface LearnerPage {
  /** Prénom affiché dans la navigation, ex. 'Romain'. */
  name: string
  /** Ticket du lot, ex. 'KB-01 — Base de connaissances sourcée'. */
  ticket: string
  /** Numéro de l'issue GitHub du lot. */
  issue: number
  /** Passe à true quand le lot est branché. */
  ready: boolean
  /** Page personnelle de l'apprenant. */
  Page: () => JSX.Element

  /** Lot KB-01 (Romain). */
  searchKnowledge?: OrientationService['searchKnowledge']
  KnowledgeList?: (props: KnowledgeListProps) => JSX.Element
  /** Lot ANNU-01 (Nils). */
  findOrganisations?: OrientationService['findOrganisations']
  OrganisationList?: (props: OrganisationListProps) => JSX.Element
  /** Lot ASSIST-01 (Ashad). */
  Assistant?: (props: AssistantProps) => JSX.Element
}

/** Identifiant d'un lot, qui est aussi la route hash de sa page. */
export type LearnerSlot = 'romain' | 'nils' | 'ashad'
