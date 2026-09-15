// Vérification sans dépendance, lancée depuis « Projet App Web/ » :
//   node src/components/ascii-background/asciiField.check.ts
// (type-stripping natif de Node >= 22.18 / 23.6). Assert local, comme searchKnowledge.check.ts.
import { ASCII_CHARSET, MAX_COLS, MIN_COLS, createAsciiField, fitColumns } from './asciiField.ts'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Échec : ${message}`)
}

const sizes: [number, number][] = [[220, 26], [64, 26], [120, 40], [48, 12]]

for (const [cols, rows] of sizes) {
  const label = `${cols}×${rows}`
  const renderFrame = createAsciiField(cols, rows)
  const frame = renderFrame(0)
  const lines = frame.split('\n')

  assert(lines.length === rows, `${label} : ${rows} lignes`)
  assert(lines.every((line) => line.length === cols), `${label} : ${cols} caractères par ligne`)
  assert([...frame].every((char) => char === '\n' || ASCII_CHARSET.includes(char)), `${label} : charset uniquement`)
  assert(/[^ \n]/.test(frame), `${label} : frame non vide`)
  assert(renderFrame(0) === frame, `${label} : même temps → même frame`)
  assert(createAsciiField(cols, rows)(0) === frame, `${label} : deux champs identiques → même frame`)
  assert(renderFrame(3.7) !== frame, `${label} : deux temps différents → frames différentes`)
}

assert(fitColumns(1600, 6) === MAX_COLS, 'fitColumns plafonne à MAX_COLS')
assert(fitColumns(60, 6) === MIN_COLS, 'fitColumns plancher à MIN_COLS')
assert(fitColumns(400, 6) === 67, 'fitColumns couvre la largeur (arrondi supérieur)')
assert(fitColumns(400, 0) === MAX_COLS, 'fitColumns tolère une largeur de caractère nulle')

console.log(createAsciiField(220, 26)(12))
console.log(`OK : ${sizes.length} tailles de grille, toutes les vérifications passent.`)
