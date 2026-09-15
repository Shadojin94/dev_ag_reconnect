import type { Organisation } from '../../../types/orientation'

// Six CHU d'Île-de-France validés par le PO le 2026-09-15.
// Relevé brut et points à vérifier : wiki/raw/chu-ile-de-france.md.
// Champ inconnu ou contradictoire = absent (aucun e-mail, pas de téléphone pour Crimée et René Coty).
const CHECKED_AT = '2026-09-15'

export const ORGANISATIONS: Organisation[] = [
  {
    id: 'chu-coeur-93',
    name: 'CHU Cœur 93 (Groupe SOS Solidarités)',
    categories: ['hebergement'],
    city: 'Saint-Ouen-sur-Seine',
    postalCode: '93400',
    address: '78 rue du Dr Bauer',
    phone: '07 70 15 82 76',
    source: {
      url: 'https://www.groupe-sos.org/structure/chu-du-pre/',
      label: 'Groupe SOS — CHU Cœur 93',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
  {
    id: 'chu-rene-coty',
    name: 'CHU René Coty (Aurore)',
    categories: ['hebergement'],
    city: 'Paris',
    postalCode: '75014',
    address: '8 avenue René Coty',
    source: {
      url: 'https://www.sante.fr/centre-dhebergement-et-de-reinsertion-sociale-chrs/paris/chrs-rene-coty',
      label: 'Santé.fr — René Coty',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
  {
    id: 'phi-chu-marais',
    name: 'PHI CHU Marais (Groupe SOS Solidarités)',
    categories: ['hebergement'],
    city: 'Paris',
    postalCode: '75003',
    address: '5 boulevard du Temple',
    phone: '01 42 77 60 45',
    source: {
      url: 'https://www.groupe-sos.org/structure/chu-marais/',
      label: 'Groupe SOS — PHI CHU Marais',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
  {
    id: 'chu-baudricourt',
    name: 'CHU Baudricourt (CASVP)',
    categories: ['hebergement'],
    city: 'Paris',
    postalCode: '75013',
    address: '15 rue Baudricourt',
    phone: '01 45 83 32 60',
    lat: 48.828012,
    lng: 2.364797,
    source: {
      url: 'https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/',
      label: 'Paris Data — Liste des centres d’hébergement (CASVP)',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
  {
    id: 'chu-crimee',
    name: 'CHU Crimée (CASVP)',
    categories: ['hebergement'],
    city: 'Paris',
    postalCode: '75019',
    address: '166 rue de Crimée',
    lat: 48.889674,
    lng: 2.378039,
    source: {
      url: 'https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/',
      label: 'Paris Data — Liste des centres d’hébergement (CASVP)',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
  {
    id: 'chu-les-baudemons',
    name: 'CHU Les Baudemons (CASVP)',
    categories: ['hebergement'],
    city: 'Thiais',
    postalCode: '94320',
    address: '30 rue des Baudemons',
    phone: '01 55 53 16 10',
    lat: 48.769465,
    lng: 2.394079,
    source: {
      url: 'https://opendata.paris.fr/explore/dataset/hebergements-casvp/table/',
      label: 'Paris Data — Liste des centres d’hébergement (CASVP)',
      verified: true,
      checkedAt: CHECKED_AT,
    },
  },
]
