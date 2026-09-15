// État local du parcours de l'assistant (lot ASSIST-01).
//
// Ce hook ne va jamais chercher de données : il assemble une OrientationQuery
// conforme au contrat commun et la remet au parent via `onQuery`. L'accès aux
// données passe par src/services/, jamais par la feature (CLAUDE.md).

import { useCallback, useMemo, useState } from 'react'
import type { Lang, NeedCategory, OrientationQuery } from '../../types/orientation'

interface UseAssistantOptions {
  onQuery: (query: OrientationQuery) => void
}

export function useAssistant({ onQuery }: UseAssistantOptions) {
  const [lang, setLang] = useState<Lang>('fr')
  const [category, setCategory] = useState<NeedCategory | null>(null)
  const [city, setCity] = useState('')

  const trimmedCity = city.trim()

  // Les champs facultatifs du contrat sont omis plutôt que mis à undefined :
  // la question transmise ne contient que ce que l'usager a réellement choisi.
  const query = useMemo<OrientationQuery>(
    () => ({
      lang,
      ...(category === null ? {} : { category }),
      ...(trimmedCity === '' ? {} : { city: trimmedCity }),
    }),
    [lang, category, trimmedCity],
  )

  // Le besoin est ce qui rend la question exploitable ; la ville la précise.
  const canSubmit = category !== null

  const submit = useCallback(() => {
    if (canSubmit) onQuery(query)
  }, [canSubmit, onQuery, query])

  const reset = useCallback(() => {
    setCategory(null)
    setCity('')
  }, [])

  return {
    lang,
    setLang,
    category,
    setCategory,
    city,
    setCity,
    query,
    canSubmit,
    submit,
    reset,
  }
}
