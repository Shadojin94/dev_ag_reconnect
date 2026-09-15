// Parseur Server-Sent Events minimal : seules les charges utiles `data:` intéressent l'app.

export interface SseParser {
  // Ajoute du texte déjà décodé ; renvoie les données des événements complétés.
  push(text: string): string[]
  // Fin de flux : termine la dernière ligne et émet l'événement resté ouvert.
  flush(): string[]
}

const LINE_BREAK = /\r\n|\r|\n/g

export function createSseParser(): SseParser {
  let buffer = ''
  let skipLeadingLf = false
  let dataLines: string[] = []

  function dispatch(events: string[]) {
    if (dataLines.length > 0) events.push(dataLines.join('\n'))
    dataLines = []
  }

  function processLine(line: string, events: string[]) {
    if (line === '') {
      dispatch(events)
      return
    }
    if (line.startsWith(':')) return
    const colon = line.indexOf(':')
    const field = colon === -1 ? line : line.slice(0, colon)
    if (field !== 'data') return
    const value = colon === -1 ? '' : line.slice(colon + 1)
    dataLines.push(value.startsWith(' ') ? value.slice(1) : value)
  }

  return {
    push(text) {
      if (text === '') return []
      // Un \r en fin de morceau précédent peut former un \r\n avec ce morceau.
      buffer += skipLeadingLf && text.startsWith('\n') ? text.slice(1) : text
      skipLeadingLf = false
      const events: string[] = []
      let start = 0
      for (const match of buffer.matchAll(LINE_BREAK)) {
        processLine(buffer.slice(start, match.index), events)
        start = match.index + match[0].length
        if (match[0] === '\r' && start === buffer.length) skipLeadingLf = true
      }
      buffer = buffer.slice(start)
      return events
    },
    flush() {
      const events: string[] = []
      if (buffer !== '') processLine(buffer, events)
      buffer = ''
      skipLeadingLf = false
      dispatch(events)
      return events
    },
  }
}

// Découpe un flux SSE en charges utiles `data:` ; s'arrête sur [DONE].
export async function* readSseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  const parser = createSseParser()
  try {
    while (true) {
      const { done, value } = await reader.read()
      const payloads = done
        ? [...parser.push(decoder.decode()), ...parser.flush()]
        : parser.push(decoder.decode(value, { stream: true }))
      for (const data of payloads) {
        if (data === '[DONE]') return
        yield data
      }
      if (done) return
    }
  } finally {
    // Arrêt anticipé ([DONE], break de l'appelant, erreur) : on libère le flux.
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
