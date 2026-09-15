import type { KnowledgeItem } from '../../../types/orientation.ts'

export type ChatRole = 'user' | 'assistant'

// 'llm' : réponse de Kimi K3 via /api/llm ; 'fixture' : repli sans IA à partir des fiches.
export type ChatMode = 'llm' | 'fixture'

// 'pending' : question envoyée, aucun mot reçu ; 'streaming' : réponse en cours.
export type ChatStatus = 'pending' | 'streaming' | 'done' | 'error'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  status: ChatStatus
  // Assistant uniquement.
  mode?: ChatMode
  // Fiches transmises pour construire la réponse ; [] pour un message utilisateur.
  contextItems: KnowledgeItem[]
}
