// Groupe de choix exclusifs, rendu en boutons (lot ASSIST-01).
//
// Des <button aria-pressed> plutôt qu'un role="radiogroup" : le parcours visé
// se fait à la touche Tab puis Entrée sur chaque option, alors qu'un groupe de
// boutons radio se parcourt aux flèches et n'expose qu'un seul arrêt de tabulation.

import { useId } from 'react'
import styles from './ChoiceGroup.module.css'

export interface ChoiceOption<T extends string> {
  value: T
  label: string
}

interface ChoiceGroupProps<T extends string> {
  legend: string
  options: readonly ChoiceOption<T>[]
  selected: T | null
  onSelect: (value: T) => void
}

export function ChoiceGroup<T extends string>({
  legend,
  options,
  selected,
  onSelect,
}: ChoiceGroupProps<T>) {
  const legendId = useId()

  return (
    <div className={styles.group} role="group" aria-labelledby={legendId}>
      <p className={styles.legend} id={legendId}>
        {legend}
      </p>
      <div className={styles.options}>
        {options.map((option) => (
          <button
            aria-pressed={option.value === selected}
            className={styles.option}
            key={option.value}
            onClick={() => onSelect(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
