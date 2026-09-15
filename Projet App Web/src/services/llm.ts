import { readSseData } from './sse.ts'

// Client du middleware POST /api/llm/chat : il ajoute la clé et le modèle, le front n'en voit rien.

export type LlmRole = 'system' | 'user' | 'assistant'
export interface LlmMessage { role: LlmRole; content: string }

// LLM injoignable (route absente, clé manquante, réseau) : l'appelant passe en mode sans IA.
export class LlmUnavailableError extends Error {
  name = 'LlmUnavailableError'

  constructor(message = 'Assistant IA indisponible.', options?: ErrorOptions) {
    super(message, options)
  }
}

// 404/405 : hébergement statique sans middleware ; 503 : clé absente côté serveur.
const UNAVAILABLE_STATUSES = new Set([404, 405, 503])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

// Accepte `"message"` ou `{ message: "..." }` (format OpenAI).
function readErrorText(error: unknown): string | undefined {
  if (typeof error === 'string' && error !== '') return error
  if (isRecord(error) && typeof error.message === 'string' && error.message !== '') return error.message
  return undefined
}

async function readResponseError(response: Response): Promise<string | undefined> {
  try {
    const body = parseJson(await response.text())
    return isRecord(body) ? readErrorText(body.error) : undefined
  } catch {
    return undefined
  }
}

function errorMessageFor(status: number, serverMessage: string | undefined): string {
  if (status === 401 || status === 403) return 'Clé NVIDIA refusée.'
  if (status === 429) return 'Trop de requêtes, réessayez dans un instant.'
  return serverMessage ?? `Le service LLM a répondu ${status}.`
}

function readDeltaContent(chunk: Record<string, unknown>): string | undefined {
  const { choices } = chunk
  if (!Array.isArray(choices)) return undefined
  const first: unknown = choices[0]
  if (!isRecord(first) || !isRecord(first.delta)) return undefined
  const { content } = first.delta
  return typeof content === 'string' && content !== '' ? content : undefined
}

// Diffuse les fragments de texte de la réponse (delta.content uniquement).
export async function* streamChatCompletion(
  messages: LlmMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  let response: Response
  try {
    response = await fetch(`${import.meta.env.BASE_URL}api/llm/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages }),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new LlmUnavailableError('Assistant IA injoignable.', { cause: error })
  }

  if (UNAVAILABLE_STATUSES.has(response.status)) {
    throw new LlmUnavailableError(await readResponseError(response))
  }
  if (!response.ok) {
    throw new Error(errorMessageFor(response.status, await readResponseError(response)))
  }
  const mediaType = response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()
  if (mediaType !== 'text/event-stream' || response.body === null) {
    // Typiquement la page HTML d'un hébergement statique.
    await response.body?.cancel().catch(() => undefined)
    throw new LlmUnavailableError()
  }

  for await (const payload of readSseData(response.body)) {
    const chunk = parseJson(payload)
    if (!isRecord(chunk)) continue
    const errorText = readErrorText(chunk.error)
    if (errorText !== undefined) throw new Error(errorText)
    const content = readDeltaContent(chunk)
    if (content !== undefined) yield content
  }
}
