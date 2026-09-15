import { useEffect, type RefObject } from 'react'
import { createAsciiField } from './asciiField.ts'

const FRAME_INTERVAL_MS = 100

type AsciiGridSize = {
  cols: number
  rows: number
}

// Écrit directement dans le <pre> (textContent) : aucun rendu React par frame.
export function useAsciiAnimation(preRef: RefObject<HTMLPreElement | null>, { cols, rows }: AsciiGridSize) {
  useEffect(() => {
    const element = preRef.current
    if (!element || cols <= 0 || rows <= 0) return

    const renderFrame = createAsciiField(cols, rows)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const startedAt = performance.now()
    let frameId = 0
    let lastPaintAt = 0
    let inViewport = true

    const paint = (now: number) => {
      element.textContent = renderFrame((now - startedAt) / 1000)
      lastPaintAt = now
    }

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick)
      if (now - lastPaintAt >= FRAME_INTERVAL_MS) paint(now)
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = 0
    }

    const sync = () => {
      const shouldRun = inViewport && !document.hidden && !reducedMotion.matches
      if (!shouldRun) stop()
      else if (frameId === 0) frameId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry?.isIntersecting ?? true
      sync()
    })

    paint(startedAt)
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    reducedMotion.addEventListener('change', sync)
    sync()

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reducedMotion.removeEventListener('change', sync)
    }
  }, [preRef, cols, rows])
}
