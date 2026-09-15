import { useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'done'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

const LOADING = { status: 'loading', data: null, error: null } as const

/**
 * Exécute une fonction asynchrone une seule fois, au montage, et expose trois états.
 * Sert aux pages de démonstration : un appel, trois états, aucun fetch dans le JSX.
 * L'appel n'est pas rejoué si `run` change : c'est volontaire, on peut donc
 * passer une fonction fléchée écrite sur place.
 */
export function useAsync<T>(run: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>(LOADING)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    run().then(
      (data) => setState({ status: 'done', data, error: null }),
      (cause: unknown) => {
        const error = cause instanceof Error ? cause : new Error(String(cause))
        setState({ status: 'error', data: null, error })
      },
    )
  }, [run])

  return state
}
