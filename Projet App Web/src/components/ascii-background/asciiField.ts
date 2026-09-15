// Champ ASCII animé façon openclaw.ai : ondes concentriques en éventail,
// tramées par une matrice de Bayer 4×4. Module pur, sans DOM.

export const ASCII_CHARSET = ' .:-=+xX#8@'
export const MAX_COLS = 220
export const MIN_COLS = 24

const REFERENCE_ROWS = 26
const ORIGIN_OFFSET_ROWS = 5
const CELL_ASPECT = 1.9
const MAX_LEVEL = ASCII_CHARSET.length - 1
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function toPositiveInteger(value: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1
}

// À 26 lignes les formules sont celles d'openclaw ; au-delà ou en deçà,
// l'origine et les distances sont mises à l'échelle pour garder la forme.
export function createAsciiField(cols: number, rows: number) {
  const width = toPositiveInteger(cols)
  const height = toPositiveInteger(rows)
  const scale = height / REFERENCE_ROWS
  const originRow = height + ORIGIN_OFFSET_ROWS * scale
  const size = width * height
  const distances = new Float32Array(size)
  const envelopes = new Float32Array(size)
  const thresholds = new Float32Array(size)

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const index = row * width + col
      const dx = col - width / 2
      const dy = (originRow - row) * CELL_ASPECT
      const distance = Math.hypot(dx, dy) / scale
      const angular = Math.sin(Math.atan2(dy, dx)) ** 2
      const falloff = clamp01(1.15 - distance / 110)
      const innerFade = clamp01((distance - 24) / 18)
      distances[index] = distance
      envelopes[index] = angular * falloff * innerFade * 1.4
      thresholds[index] = (BAYER_4X4[row % 4][col % 4] + 0.5) / 16
    }
  }

  return function renderFrame(time: number) {
    const lines: string[] = []
    for (let row = 0; row < height; row++) {
      let line = ''
      for (let col = 0; col < width; col++) {
        const index = row * width + col
        const wave = (0.5 + 0.5 * Math.sin(distances[index] * 0.3 - time * 0.35)) ** 3.5
        const value = wave * envelopes[index]
        let level = 0
        if (value >= 0.05) {
          const scaled = clamp01(value) * MAX_LEVEL
          const dither = scaled % 1 > thresholds[index] ? 1 : 0
          level = Math.min(MAX_LEVEL, Math.floor(scaled) + dither)
        }
        line += ASCII_CHARSET[level]
      }
      lines.push(line)
    }
    return lines.join('\n')
  }
}

// Colonnes nécessaires pour couvrir une largeur, bornées à [MIN_COLS, MAX_COLS].
export function fitColumns(availableWidth: number, charWidth: number) {
  if (!(charWidth > 0) || !Number.isFinite(availableWidth)) return MAX_COLS
  const needed = Math.ceil(availableWidth / charWidth)
  return Math.min(MAX_COLS, Math.max(MIN_COLS, needed))
}
