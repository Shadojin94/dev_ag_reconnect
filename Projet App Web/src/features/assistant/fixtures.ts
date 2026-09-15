// Jeu d'exemple de la feature assistant — sert UNIQUEMENT à voir les quatre
// états à l'écran tant que src/services/orientation.ts renvoie des listes vides
// (phase 2 d'INT-01). Ce n'est pas une source de données : les fiches réelles
// viennent du lot KB-01 (Romain) et les structures du lot ANNU-01 (Nils).
//
// Règles de vérité appliquées (CONTRAT-DONNEES.md, CLAUDE.md) :
// - aucun téléphone, e-mail ni adresse n'est inventé : `organisations` est vide,
//   c'est le lot ANNU-01 qui porte des coordonnées sourcées ;
// - la source citée est réelle mais `verified: false` et sans `checkedAt` :
//   personne ne l'a consultée pour ce jeu d'exemple, et une date de consultation
//   ne s'invente pas ;
// - la deuxième fiche n'a pas de traduction anglaise, volontairement : elle
//   montre à l'écran le repli français prévu par le contrat.

import type {
  KnowledgeItem,
  Lang,
  Organisation,
  OrientationQuery,
  OrientationResult,
} from '../../types/orientation'

const DEMO_SOURCE = {
  url: 'https://www.service-public.fr/',
  label: 'service-public.fr',
  verified: false,
} as const

export const DEMO_RESULT: OrientationResult = {
  items: [
    {
      id: 'demo-papiers-1',
      category: 'papiers',
      title: {
        fr: 'Renouveler un titre de séjour',
        en: 'Renewing a residence permit',
      },
      summary: {
        fr: 'La demande se dépose avant l’expiration du titre. Les pièces demandées dépendent du motif de séjour.',
        en: 'The request is filed before the permit expires. Required documents depend on the residence purpose.',
      },
      keywords: ['titre de séjour', 'préfecture', 'renouvellement'],
      source: DEMO_SOURCE,
    },
    {
      // Pas de traduction anglaise : l'affichage doit retomber sur le français.
      id: 'demo-papiers-2',
      category: 'papiers',
      title: { fr: 'Demander une attestation de domicile' },
      summary: {
        fr: 'Une domiciliation administrative permet de recevoir son courrier et d’ouvrir des droits sans logement stable.',
      },
      keywords: ['domiciliation', 'attestation', 'courrier'],
      source: DEMO_SOURCE,
    },
  ],
  organisations: [],
  explanation: {
    text:
      'Deux fiches correspondent à votre besoin. Elles décrivent la démarche ; '
      + 'elles ne remplacent pas un accompagnement par une structure.',
    mode: 'fixture',
    sources: [DEMO_SOURCE],
  },
}

/** Résultat vide, pour voir l'état « aucun résultat ». */
export const EMPTY_RESULT: OrientationResult = {
  items: [],
  organisations: [],
  explanation: { text: '', mode: 'fixture', sources: [] },
}

/* ------------------------------------------------- fiches de démonstration */

/** Quelques fiches réparties sur les besoins, pour éprouver la conversation. */
export const DEMO_ITEMS: KnowledgeItem[] = [
  ...DEMO_RESULT.items,
  {
    id: 'demo-hebergement-1',
    category: 'hebergement',
    title: { fr: 'Demander un hébergement d’urgence', en: 'Requesting emergency shelter' },
    summary: {
      fr: 'Une demande d’hébergement d’urgence se fait auprès du service départemental compétent, qui oriente selon les places disponibles.',
      en: 'A request for emergency shelter is made to the competent departmental service, which directs people according to available places.',
    },
    keywords: ['hébergement', 'urgence', 'dormir', 'abri'],
    source: DEMO_SOURCE,
  },
  {
    id: 'demo-sante-1',
    category: 'sante',
    title: { fr: 'Accéder aux soins sans couverture', en: 'Accessing care without health cover' },
    summary: {
      fr: 'Des dispositifs permettent une prise en charge des soins pour les personnes sans couverture maladie, sous conditions de résidence et de ressources.',
      en: 'Schemes allow care to be covered for people without health insurance, subject to residence and income conditions.',
    },
    keywords: ['santé', 'soins', 'couverture', 'médecin'],
    source: DEMO_SOURCE,
  },
  {
    id: 'demo-alimentation-1',
    category: 'alimentation',
    // Pas de traduction anglaise : montre le repli français sur une autre fiche.
    title: { fr: 'Recevoir une aide alimentaire' },
    summary: {
      fr: 'L’aide alimentaire est distribuée par des associations habilitées ; l’accès passe le plus souvent par une évaluation sociale préalable.',
    },
    keywords: ['alimentation', 'repas', 'colis', 'manger'],
    source: DEMO_SOURCE,
  },
]

/* ---------------------------------------------- structures de démonstration
 * Aucune coordonnée n'est inventée : ni téléphone, ni courriel, ni adresse.
 * Les vraies structures, avec leurs contacts sourcés, viennent du lot ANNU-01.
 * Seul un site institutionnel réel est renseigné, pour éprouver l'affichage
 * d'un lien — et il reste marqué non vérifié, personne ne l'ayant consulté ici. */

export const DEMO_ORGANISATIONS: Organisation[] = [
  {
    id: 'demo-org-1',
    name: 'Structure d’exemple — permanence d’accès aux droits',
    categories: ['papiers', 'juridique'],
    city: 'Lyon',
    website: 'https://www.service-public.fr/',
    source: DEMO_SOURCE,
  },
  {
    id: 'demo-org-2',
    name: 'Structure d’exemple — accueil de jour',
    categories: ['hebergement', 'alimentation'],
    city: 'Lyon',
    source: DEMO_SOURCE,
  },
  {
    id: 'demo-org-3',
    name: 'Structure d’exemple — permanence santé',
    categories: ['sante'],
    city: 'Marseille',
    source: DEMO_SOURCE,
  },
]

/* ------------------------------------------------------ réponse simulée ---
 * Tient lieu de src/services/orientation.ts le temps que l'intégration branche
 * les lots (phase 2 d'INT-01). Sert à l'aperçu et aux vérifications ; ce n'est
 * ni un moteur de recherche, ni un modèle de langue : un filtre lisible. */

function correspond(item: KnowledgeItem, query: OrientationQuery): boolean {
  if (query.category !== undefined && item.category === query.category) return true
  if (query.keywords === undefined) return false
  const mots = query.keywords.toLocaleLowerCase('fr').split(/\s+/)
  return item.keywords.some((cle) =>
    mots.some((mot) => mot.length > 2 && cle.toLocaleLowerCase('fr').includes(mot)),
  )
}

/** Construit un OrientationResult à partir du jeu local, pour une question donnée. */
export function answerFromFixtures(query: OrientationQuery): OrientationResult {
  const items = DEMO_ITEMS.filter((item) => correspond(item, query))
  const organisations = DEMO_ORGANISATIONS.filter((organisation) => {
    const parBesoin =
      query.category === undefined || organisation.categories.includes(query.category)
    const parVille =
      query.city === undefined
      || organisation.city.toLocaleLowerCase('fr') === query.city.toLocaleLowerCase('fr')
    return parBesoin && parVille
  })

  return {
    items,
    organisations,
    explanation: {
      text: items.length === 0 ? '' : resume(items.length, organisations.length, query.lang),
      // Jamais 'llm' : aucun endpoint n'est interrogé ici.
      mode: 'fixture',
      sources: items.length === 0 ? [] : [DEMO_SOURCE],
    },
  }
}

/** Accorde le pluriel et écrit dans la langue de la question. */
function resume(fiches: number, structures: number, lang: Lang): string {
  const s = (n: number) => (n > 1 ? 's' : '')
  if (lang === 'en') {
    return `${fiches} guide${s(fiches)} and ${structures} organisation${s(structures)} match your request. `
      + 'These describe a procedure; they do not replace support from a person.'
  }
  return `${fiches} fiche${s(fiches)} et ${structures} structure${s(structures)} correspondent à votre demande. `
    + 'Ces éléments décrivent une démarche ; ils ne remplacent pas un accompagnement.'
}
