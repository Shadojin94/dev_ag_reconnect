import type { Organisation, OrientationQuery } from '../../types/orientation'
import { ORGANISATIONS } from './data/organisations'

// Compare les villes sans tenir compte de la casse, des accents ni des espaces autour.
function normalizeCity(city: string) {
  return city.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

// Filtre le jeu local par ville et par catégorie ; un critère absent ne filtre pas.
// Une ville inconnue renvoie une liste vide. Asynchrone pour garder la signature de la façade.
export async function findOrganisations(query: OrientationQuery): Promise<Organisation[]> {
  const city = query.city?.trim() ? normalizeCity(query.city) : undefined

  return ORGANISATIONS.filter(
    (organisation) =>
      (city === undefined || normalizeCity(organisation.city) === city) &&
      (query.category === undefined || organisation.categories.includes(query.category)),
  )
}
