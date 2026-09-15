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

import type { OrientationResult } from '../../types/orientation'

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
