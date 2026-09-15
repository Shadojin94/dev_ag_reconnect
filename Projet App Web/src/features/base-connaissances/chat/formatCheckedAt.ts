// checkedAt attendu au format AAAA-MM-JJ.
export function formatCheckedAt(checkedAt: string): string {
  const [year, month, day] = checkedAt.split('-')
  return `${day}/${month}/${year}`
}
