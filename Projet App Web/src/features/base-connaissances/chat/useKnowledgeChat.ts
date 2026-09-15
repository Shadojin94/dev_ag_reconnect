import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lang } from '../../../types/orientation.ts'
import { orientationService } from '../../../services/orientation.ts'
import { LlmUnavailableError, streamChatCompletion } from '../../../services/llm.ts'
import type { LlmMessage } from '../../../services/llm.ts'
import { buildFixtureAnswer, findKnowledgeContext } from './knowledgeContext.ts'
import type { KnowledgeContext } from './knowledgeContext.ts'
import { buildSystemPrompt } from './systemPrompt.ts'
import type { ChatMessage } from './types.ts'

export interface KnowledgeChat {
  messages: ChatMessage[]
  isBusy: boolean
  send: (question: string) => void
  stop: () => void
}

type UpdateMessage = (id: string, patch: Partial<ChatMessage>) => void

const HISTORY_LIMIT = 10
const EMPTY_ANSWER = 'Je n’ai pas reçu de réponse du modèle.'
const INTERRUPTED_ANSWER = 'Réponse interrompue.'
const UNKNOWN_ERROR = 'Une erreur inattendue est survenue.'

function toHistory(messages: ChatMessage[]): LlmMessage[] {
  return messages
    .filter((message) => message.status === 'done')
    .slice(-HISTORY_LIMIT)
    .map((message) => ({ role: message.role, content: message.content }))
}

function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
}

async function answer(
  question: string,
  history: LlmMessage[],
  lang: Lang,
  assistantId: string,
  signal: AbortSignal,
  update: UpdateMessage,
): Promise<void> {
  let context: KnowledgeContext = { items: [], matched: false }
  let content = ''
  let frame = 0

  const cancelFlush = () => {
    if (frame !== 0) cancelAnimationFrame(frame)
    frame = 0
  }
  const flush = () => {
    frame = 0
    update(assistantId, { content, status: 'streaming', mode: 'llm' })
  }

  try {
    context = await findKnowledgeContext(
      question,
      (query) => orientationService.searchKnowledge(query),
      lang,
    )
    update(assistantId, { contextItems: context.items })
    signal.throwIfAborted()

    const messages: LlmMessage[] = [
      { role: 'system', content: buildSystemPrompt(context.items, lang) },
      ...history,
      { role: 'user', content: question },
    ]
    for await (const fragment of streamChatCompletion(messages, signal)) {
      content += fragment
      if (frame === 0) frame = requestAnimationFrame(flush)
    }

    cancelFlush()
    update(
      assistantId,
      content.trim() === ''
        ? { content: EMPTY_ANSWER, status: 'error', mode: 'llm' }
        : { content, status: 'done', mode: 'llm' },
    )
  } catch (error) {
    cancelFlush()
    if (signal.aborted || isAbortError(error)) {
      update(
        assistantId,
        content === ''
          ? { content: INTERRUPTED_ANSWER, status: 'done' }
          : { content, status: 'done', mode: 'llm' },
      )
    } else if (error instanceof LlmUnavailableError && content === '') {
      update(assistantId, { content: buildFixtureAnswer(context, lang), status: 'done', mode: 'fixture' })
    } else {
      const message = error instanceof Error && error.message !== '' ? error.message : UNKNOWN_ERROR
      update(assistantId, {
        content: content === '' ? message : `${content}\n\n${message}`,
        status: 'error',
      })
    }
  }
}

export function useKnowledgeChat(lang: Lang = 'fr'): KnowledgeChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesRef = useRef<ChatMessage[]>(messages)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const updateMessage = useCallback<UpdateMessage>((id, patch) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, ...patch } : message)))
  }, [])

  const send = useCallback(
    (question: string) => {
      const text = question.trim()
      if (text === '' || controllerRef.current !== null) return

      const controller = new AbortController()
      controllerRef.current = controller
      const history = toHistory(messagesRef.current)
      const assistantId = crypto.randomUUID()
      const turn: ChatMessage[] = [
        { id: crypto.randomUUID(), role: 'user', content: text, status: 'done', contextItems: [] },
        { id: assistantId, role: 'assistant', content: '', status: 'pending', contextItems: [] },
      ]
      setMessages((prev) => [...prev, ...turn])

      void answer(text, history, lang, assistantId, controller.signal, updateMessage).finally(() => {
        if (controllerRef.current === controller) controllerRef.current = null
      })
    },
    [lang, updateMessage],
  )

  const stop = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  const lastAssistant = messages.findLast((message) => message.role === 'assistant')
  const isBusy = lastAssistant?.status === 'pending' || lastAssistant?.status === 'streaming'

  return { messages, isBusy, send, stop }
}
