import { useEffect, useRef, useState, type RefObject } from 'react'
import { fitColumns } from './asciiField.ts'
import { useAsciiAnimation } from './useAsciiAnimation.ts'
import styles from './AsciiBackground.module.css'

const ROWS = 26
const PROBE_TEXT = 'MMMMMMMMMM'

// Mesure la largeur d'un caractère (sonde invisible, même typo que le <pre>)
// et recalcule le nombre de colonnes à chaque redimensionnement du fond.
function useFittedColumns(containerRef: RefObject<HTMLDivElement | null>, probeRef: RefObject<HTMLSpanElement | null>) {
  const [cols, setCols] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const probe = probeRef.current
    if (!container || !probe) return

    const observer = new ResizeObserver(() => {
      const charWidth = probe.getBoundingClientRect().width / PROBE_TEXT.length
      setCols(fitColumns(container.clientWidth, charWidth))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, probeRef])

  return cols
}

export function AsciiBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const cols = useFittedColumns(containerRef, probeRef)

  useAsciiAnimation(preRef, { cols, rows: ROWS })

  return (
    <div ref={containerRef} className={styles.background} aria-hidden="true">
      <span ref={probeRef} className={styles.probe}>{PROBE_TEXT}</span>
      <pre ref={preRef} className={styles.field} />
    </div>
  )
}
