import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const FRAME_MS = 1000 / 60
// Part du reste révélée par frame à 60 fps : 1000 caractères d'un coup ≈ 1,4 s.
const CATCH_UP_RATE = 0.05
const MIN_CHARS_PER_FRAME = 2
// Limite le saut après un onglet resté en arrière-plan.
const MAX_FRAMES_PER_TICK = 4

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches
const getServerReducedMotion = () => false

function commonPrefixLength(a: string, b: string): number {
  if (b.startsWith(a)) return a.length
  let length = 0
  while (length < a.length && a[length] === b[length]) length += 1
  return length
}

function nextText(current: string, target: string, elapsed: number): string {
  const base = commonPrefixLength(current, target)
  const remaining = target.length - base
  if (remaining === 0) return target
  const frames = Math.min(elapsed / FRAME_MS, MAX_FRAMES_PER_TICK)
  const step = Math.ceil(Math.max(MIN_CHARS_PER_FRAME, remaining * CATCH_UP_RATE) * frames)
  let end = Math.min(target.length, base + step)
  // Ne coupe pas un caractère encodé sur deux unités UTF-16 (emoji).
  if (end < target.length && /[\uD800-\uDBFF]/.test(target[end - 1])) end += 1
  return target.slice(0, end)
}

export function useTypewriter(target: string, enabled: boolean): { text: string; isTyping: boolean } {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  )
  const active = enabled && !reducedMotion
  const [shown, setShown] = useState('')
  const shownRef = useRef('')

  useEffect(() => {
    if (!active) {
      shownRef.current = target
      return
    }

    let frame = 0
    let last: number | undefined
    const tick = (now: number) => {
      const next = nextText(shownRef.current, target, now - (last ?? now - FRAME_MS))
      last = now
      shownRef.current = next
      setShown(next)
      if (next !== target) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active])

  if (!active) return { text: target, isTyping: false }
  return { text: shown, isTyping: shown !== target }
}
