import { once } from 'node:events'
import type { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'node:http'
import type { Connect, Logger, Plugin } from 'vite'

// Proxy du chat LLM : le navigateur appelle /api/llm/chat, ce middleware
// (npm run dev / npm run preview) ajoute la clé NVIDIA et relaie le flux SSE.
// La clé reste côté serveur : jamais dans le bundle, jamais dans les logs.

export type LlmProxyOptions = {
  apiKey?: string
  baseUrl?: string
  model?: string
  reasoningEffort?: string
  maxTokens?: string | number
  temperature?: string | number
  timeoutMs?: string | number
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

type LlmConfig = {
  apiKey: string
  baseUrl: string
  model: string
  reasoningEffort: string
  maxTokens: number
  temperature: number
  timeoutMs: number
}

const ROUTE = '/api/llm/chat'
const MAX_BODY_BYTES = 1024 * 1024
const MAX_MESSAGES = 50
const MAX_DETAIL_LENGTH = 200

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEFAULT_MODEL = 'moonshotai/kimi-k3'
const DEFAULT_REASONING_EFFORT = 'medium'
const DEFAULT_MAX_TOKENS = 4096
const DEFAULT_TEMPERATURE = 1
const DEFAULT_TIMEOUT_MS = 60_000

export function llmProxyPlugin(options: LlmProxyOptions = {}): Plugin {
  const config = resolveConfig(options)
  return {
    name: 'llm-proxy',
    configureServer(server) {
      server.middlewares.use(routeFor(server.config.base), createHandler(config, server.config.logger))
    },
    configurePreviewServer(server) {
      server.middlewares.use(routeFor(server.config.base), createHandler(config, server.config.logger))
    },
  }
}

// Le front appelle `${BASE_URL}api/llm/chat` : on suit le base de Vite (BASE_PATH)
function routeFor(base: string) {
  return new URL(ROUTE.slice(1), new URL(base, 'http://localhost')).pathname
}

function resolveConfig(options: LlmProxyOptions): LlmConfig {
  return {
    apiKey: options.apiKey?.trim() ?? '',
    baseUrl: (options.baseUrl?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, ''),
    model: options.model?.trim() || DEFAULT_MODEL,
    // Chaîne vide explicite = paramètre omis dans l'appel amont
    reasoningEffort: (options.reasoningEffort ?? DEFAULT_REASONING_EFFORT).trim(),
    maxTokens: Math.floor(parseNumber(options.maxTokens, DEFAULT_MAX_TOKENS, 1)),
    temperature: parseNumber(options.temperature, DEFAULT_TEMPERATURE, 0),
    timeoutMs: Math.floor(parseNumber(options.timeoutMs, DEFAULT_TIMEOUT_MS, 1000)),
  }
}

function parseNumber(value: string | number | undefined, fallback: number, min: number) {
  const parsed = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  return typeof parsed === 'number' && Number.isFinite(parsed) && parsed >= min ? parsed : fallback
}

function createHandler(config: LlmConfig, logger: Logger): Connect.NextHandleFunction {
  return (req, res, next) => {
    // Connect retire le préfixe ROUTE : seul le chemin exact est servi
    const pathname = (req.url ?? '/').split('?')[0]
    if (pathname !== '/') return next()
    handleChat(req, res, config, logger).catch((error: unknown) => {
      logger.error(`[llm-proxy] erreur inattendue : ${errorMessage(error)}`)
      if (res.headersSent) res.destroy()
      else sendJson(res, 500, { error: 'Erreur interne du proxy LLM.' })
    })
  }
}

async function handleChat(req: IncomingMessage, res: ServerResponse, config: LlmConfig, logger: Logger) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Méthode non autorisée : utiliser POST.' }, { Allow: 'POST' })
  }
  // Un autre site ne doit pas pouvoir consommer la clé depuis le navigateur d'un visiteur
  if (!isSameOrigin(req)) {
    return sendJson(res, 403, { error: 'Origine non autorisée.' })
  }
  const raw = await readBody(req)
  if (raw === null) {
    return sendJson(res, 400, { error: 'Requête trop volumineuse (1 Mo maximum).' })
  }
  const parsed = parseMessages(raw)
  if (typeof parsed === 'string') {
    return sendJson(res, 400, { error: parsed })
  }
  if (!config.apiKey) {
    return sendJson(res, 503, { error: 'NVIDIA_API_KEY absente : mode sans IA.' })
  }

  const controller = new AbortController()
  res.on('close', () => {
    // Client parti avant la fin : on coupe l'appel amont
    if (!res.writableFinished) controller.abort()
  })

  // Modèle muet (file d'attente NVIDIA saturée) : délai avant la réponse puis entre deux fragments
  const timeoutMessage = `Le modèle ${config.model} ne répond pas (aucune donnée depuis ${Math.round(config.timeoutMs / 1000)} s). Réessayez plus tard ou changez LLM_MODEL.`
  let timedOut = false
  let timer: NodeJS.Timeout | undefined
  const restartTimer = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timedOut = true
      logger.warn(`[llm-proxy] ${timeoutMessage}`)
      controller.abort()
    }, config.timeoutMs)
  }
  restartTimer()
  res.on('close', () => clearTimeout(timer))

  const payload = {
    model: config.model,
    messages: parsed,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
    stream: true,
    ...(config.reasoningEffort ? { reasoning_effort: config.reasoningEffort } : {}),
  }

  let upstream: Response
  try {
    upstream = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (error) {
    if (timedOut) return sendJson(res, 504, { error: timeoutMessage })
    if (controller.signal.aborted) return
    logger.warn(`[llm-proxy] service LLM injoignable : ${errorMessage(error)}`)
    return sendJson(res, 502, { error: 'Le service LLM est injoignable.' })
  }

  if (!upstream.ok || !upstream.body) {
    const status = upstream.status >= 400 && upstream.status <= 599 ? upstream.status : 502
    const detail = await readErrorDetail(upstream, config.apiKey)
    clearTimeout(timer)
    logger.warn(`[llm-proxy] le service LLM a répondu ${upstream.status}${detail ? ` : ${detail}` : ''}`)
    return sendJson(res, status, {
      error: `Le service LLM a répondu ${upstream.status}.`,
      ...(detail ? { detail } : {}),
    })
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  res.flushHeaders()

  const reader = upstream.body.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      restartTimer()
      // Contre-pression : on attend que le client absorbe avant de relire
      if (!res.write(value)) await once(res, 'drain', { signal: controller.signal })
    }
    clearTimeout(timer)
    res.end()
  } catch (error) {
    clearTimeout(timer)
    if (timedOut) {
      // Événement d'erreur au format OpenAI : le front l'affiche au lieu d'attendre
      res.end(`\n\ndata: ${JSON.stringify({ error: { message: timeoutMessage } })}\n\n`)
      return
    }
    if (!controller.signal.aborted) {
      logger.warn(`[llm-proxy] flux LLM interrompu : ${errorMessage(error)}`)
    }
    // Coupure franche : le client ne doit pas prendre un flux tronqué pour une réponse complète
    res.destroy()
    controller.abort()
  }
}

function isSameOrigin(req: IncomingMessage) {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

// Lecture du corps sans dépendance ; null si la limite est dépassée
function readBody(req: IncomingMessage) {
  return new Promise<string | null>((resolve, reject) => {
    if (Number(req.headers['content-length']) > MAX_BODY_BYTES) {
      req.resume()
      return resolve(null)
    }
    const chunks: Buffer[] = []
    let size = 0
    const onData = (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        req.off('data', onData)
        req.resume()
        resolve(null)
        return
      }
      chunks.push(chunk)
    }
    req.on('data', onData)
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    // Client parti en cours d'envoi : corps inexploitable (sans effet si déjà résolu)
    req.on('close', () => resolve(null))
    req.on('error', reject)
  })
}

// Renvoie les messages validés, ou un message d'erreur
function parseMessages(raw: string): ChatMessage[] | string {
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return 'Corps JSON invalide.'
  }
  const messages = isRecord(body) ? body.messages : undefined
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Le champ messages doit être un tableau non vide.'
  }
  if (messages.length > MAX_MESSAGES) {
    return `Trop de messages (${MAX_MESSAGES} maximum).`
  }
  const valid: ChatMessage[] = []
  for (const message of messages) {
    if (!isRecord(message) || !isRole(message.role) || typeof message.content !== 'string') {
      return 'Message mal formé : { role: system | user | assistant, content: string } attendu.'
    }
    valid.push({ role: message.role, content: message.content })
  }
  return valid
}

// Extrait court et sans secret du message d'erreur amont (JSON error.message ou detail)
async function readErrorDetail(response: Response, apiKey: string) {
  try {
    const body: unknown = await response.json()
    if (!isRecord(body)) return ''
    const error = body.error
    const candidate = isRecord(error) ? error.message : typeof error === 'string' ? error : body.detail
    if (typeof candidate !== 'string') return ''
    return candidate.split(apiKey).join('***').slice(0, MAX_DETAIL_LENGTH)
  } catch {
    return ''
  }
}

function sendJson(res: ServerResponse, status: number, body: Record<string, string>, headers: OutgoingHttpHeaders = {}) {
  if (res.headersSent) return
  res.writeHead(status, {
    ...headers,
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

function isRole(value: unknown): value is ChatMessage['role'] {
  return value === 'system' || value === 'user' || value === 'assistant'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
