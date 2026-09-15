// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/services/sse.check.ts
// (type-stripping natif de Node >= 22.18 / 23.6). Assert local, comme searchKnowledge.check.ts.
import { createSseParser, readSseData } from './sse.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

function assertList(actual: string[], expected: string[], message: string) {
  const same = actual.length === expected.length && actual.every((value, i) => value === expected[i])
  assert(same, `${message} — attendu ${JSON.stringify(expected)}, obtenu ${JSON.stringify(actual)}`)
}

const encoder = new TextEncoder()

function streamOf(chunks: (string | Uint8Array)[], onCancel?: () => void) {
  let index = 0
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks[index++]
      if (chunk === undefined) controller.close()
      else controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk)
    },
    cancel() {
      onCancel?.()
    },
  })
}

async function collect(stream: ReadableStream<Uint8Array>) {
  const payloads: string[] = []
  for await (const data of readSseData(stream)) payloads.push(data)
  return payloads
}

// Parseur pur : ligne coupée entre deux push, flush final.
const parser = createSseParser()
assertList(parser.push('da'), [], 'ligne incomplète en attente')
assertList(parser.push('ta: un\n'), [], 'événement non terminé')
assertList(parser.push('\ndata: deux'), ['un'], 'ligne vide = fin d’événement')
assertList(parser.flush(), ['deux'], 'flush émet le dernier événement')

// Coupure au milieu d'une ligne.
assertList(
  await collect(streamOf(['data: {"a":', '1}\n', '\nda', 'ta: b\n\n'])),
  ['{"a":1}', 'b'],
  'ligne coupée entre deux chunks',
)

// Coupure au milieu d'un caractère multi-octet (é : 2 octets, emoji : 4 octets), à chaque position.
const multiByte = 'data: {"t":"é🙂"}\n\n'
const bytes = encoder.encode(multiByte)
for (let cut = 1; cut < bytes.length; cut++) {
  assertList(
    await collect(streamOf([bytes.slice(0, cut), bytes.slice(cut)])),
    ['{"t":"é🙂"}'],
    `multi-octet coupé à l’octet ${cut}`,
  )
}
assertList(
  await collect(streamOf(Array.from(bytes, (byte) => Uint8Array.of(byte)))),
  ['{"t":"é🙂"}'],
  'un octet par chunk',
)

// Fins de ligne CRLF et CR, y compris \r\n coupé entre deux chunks.
assertList(await collect(streamOf(['data: a\r\n\r\ndata: b\r\n\r\n'])), ['a', 'b'], 'CRLF')
assertList(await collect(streamOf(['data: a\r\rdata: b\r\r'])), ['a', 'b'], 'CR seul')
assertList(
  await collect(streamOf(['data: a\r', '\ndata: b\r', '\n\r', '\ndata: c\r\n\r\n'])),
  ['a\nb', 'c'],
  'CRLF coupé entre deux chunks',
)

// Plusieurs lignes data: jointes par \n ; un seul espace retiré.
assertList(
  await collect(streamOf(['data: ligne 1\ndata:ligne 2\ndata:  indentée\ndata\n\n'])),
  ['ligne 1\nligne 2\n indentée\n'],
  'data multi-lignes',
)

// Commentaires et autres champs ignorés ; événement sans data non émis.
assertList(
  await collect(streamOf([': keep-alive\n\nevent: message\nid: 7\nretry: 1000\n: note\ndata: ok\n\n'])),
  ['ok'],
  'commentaires et champs ignorés',
)

// [DONE] stoppe la lecture, annule le flux et libère le verrou.
let cancelled = false
const doneStream = streamOf(['data: 1\n\n', 'data: [DONE]\n\n', 'data: 2\n\n'], () => {
  cancelled = true
})
assertList(await collect(doneStream), ['1'], '[DONE] arrête le flux')
assert(cancelled, '[DONE] annule le flux')
assert(!doneStream.locked, 'verrou libéré après [DONE]')

// Arrêt anticipé par l'appelant.
let brokeCancelled = false
const breakStream = streamOf(['data: 1\n\n', 'data: 2\n\n'], () => {
  brokeCancelled = true
})
for await (const data of readSseData(breakStream)) {
  assert(data === '1', 'premier événement reçu')
  break
}
assert(brokeCancelled && !breakStream.locked, 'break annule le flux et libère le verrou')

// Dernier événement sans ligne vide finale.
assertList(await collect(streamOf(['data: a\n\ndata: dernier'])), ['a', 'dernier'], 'dernier événement sans \\n')
assertList(await collect(streamOf(['data: a\n\ndata: dernier\n'])), ['a', 'dernier'], 'dernier événement sans ligne vide')

console.log('OK : parseur SSE, toutes les vérifications passent.')
