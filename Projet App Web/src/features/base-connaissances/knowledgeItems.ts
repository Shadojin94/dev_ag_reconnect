import type { KnowledgeItem } from '../../types/orientation.ts'

// Fiches KB-01 validées par le PO. Résumés rédigés à partir des seuls extraits
// consultés le 2026-09-15 ; les sources non lues restent verified:false sans date.
export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'kb-hebergement-droit-hebergement',
    category: 'hebergement',
    title: { fr: "Droit à l'hébergement : comprendre, agir, protéger" },
    summary: {
      fr: "Guide juridique de la Fédération des acteurs de la solidarité référencé dans la base de ressources. Le lien d'origine ne répond plus (erreur 404) : contenu non vérifié.",
    },
    keywords: ['hébergement', 'droit', 'guide juridique'],
    source: {
      url: 'https://www.federationsolidarite.org/wp-content/uploads/2025/09/Guide-juridique-Droit-a-lhebergement.pdf',
      label: 'Fédération des acteurs de la solidarité',
      verified: false,
    },
  },
  {
    id: 'kb-hebergement-mal-logement-2023',
    category: 'hebergement',
    title: { fr: '28e rapport sur l’état du mal-logement en France 2023' },
    summary: {
      fr: 'Rapport annuel de la Fondation Abbé Pierre qui décrit la hausse de la facture logement et des dépenses énergétiques pour les ménages modestes, et le refus chaque soir de milliers de personnes par le 115 faute de places d’hébergement. Cette édition se concentre sur « le genre du mal-logement » : la situation des femmes et des minorités de genre face au logement. Le rapport intégral et un dossier de synthèse sont téléchargeables.',
    },
    keywords: ['mal-logement', 'logement', 'hébergement', '115', 'genre', 'femmes', 'rapport'],
    source: {
      url: 'https://www.fondation-abbe-pierre.fr/actualites/28e-rapport-sur-letat-du-mal-logement-en-france-2023',
      label: 'Fondation Abbé Pierre',
      verified: true,
      checkedAt: '2026-09-15',
    },
  },
  {
    id: 'kb-sante-guide-esms-precarite',
    category: 'sante',
    title: {
      fr: "Guide des établissements et services sanitaires et médico-sociaux pour l'accès aux soins des personnes en situation de précarité",
    },
    summary: {
      fr: 'Guide de référence publié le 19/12/2024 par la DGCS, la DGOS, la DGS et la DIHAL. Il recense les établissements et services sanitaires et médico-sociaux pouvant accueillir des personnes en situation de précarité nécessitant des soins, par catégorie : établissements généralistes, santé mentale et addictologie. Il s’adresse aux professionnels des secteurs médico-social, sanitaire et social.',
    },
    keywords: ['santé', 'soins', 'précarité', 'médico-social', 'santé mentale', 'addictologie', 'guide'],
    source: {
      url: 'https://solidarites.gouv.fr/guide-des-esms-acces-aux-soins-personnes-en-situation-de-precarite',
      label: 'solidarites.gouv.fr',
      verified: true,
      checkedAt: '2026-09-15',
    },
  },
  {
    id: 'kb-papiers-reloref',
    category: 'papiers',
    title: { fr: 'Centre Appui Ressources – intégration (RELOREF, France terre d’asile)' },
    summary: {
      fr: 'Centre ressources de France terre d’asile destiné aux travailleurs sociaux et professionnels de l’intégration des bénéficiaires d’une protection internationale (BPI). Il vise un meilleur accès aux droits, à l’emploi et au logement de ce public, en développant des outils, en accompagnant les professionnels et en structurant les partenariats. Il propose notamment une docuthèque et une veille juridique et sociale.',
    },
    keywords: ['bpi', 'protection internationale', 'intégration', 'asile', 'accès aux droits', 'veille juridique', 'professionnels'],
    source: {
      url: 'https://reloref.france-terre-asile.org/',
      label: 'RELOREF – France terre d’asile',
      verified: true,
      checkedAt: '2026-09-15',
    },
  },
  {
    id: 'kb-papiers-ecrivains-publics',
    category: 'papiers',
    title: { fr: 'Face aux galères administratives, des écrivains publics à la rescousse' },
    summary: {
      fr: 'Reportage de Basta! sur l’Atelier Graphite, association bordelaise d’écrivains publics qui tient des permanences pour aider des personnes dans leurs démarches administratives (retraite, RSA, courriers). L’article décrit la complexité de ces démarches, leur dématérialisation et le non-recours aux droits qui en découle.',
    },
    keywords: ['écrivain public', 'démarches administratives', 'retraite', 'rsa', 'non-recours', 'dématérialisation', 'numérique'],
    source: {
      url: 'https://basta.media/face-aux-galeres-administratives-ecrivains-publics-a-la-rescousse-Caf-retraite',
      label: 'Basta!',
      verified: true,
      checkedAt: '2026-09-15',
    },
  },
  {
    id: 'kb-juridique-aide-urgence-violences',
    category: 'juridique',
    title: { fr: "Violences conjugales : une aide d'urgence pour vous protéger" },
    summary: {
      fr: "D'après la fiche de la base de ressources, non vérifié sur la page : « Depuis le 1er décembre 2023, les personnes subissant des violences conjugales peuvent bénéficier de l'aide d'urgence pour les victimes de violences conjugales. Versée par la Caf, cette nouvelle aide est un soutien financier qui doit permettre à la victime de s'éloigner physiquement de l'auteur des violences et faire face aux dépenses immédiates en attendant de trouver des solutions durables. »",
    },
    keywords: ['violences conjugales', 'aide d’urgence', 'caf', 'victime', 'aide financière'],
    source: {
      url: 'https://www.caf.fr/allocataires/actualites/actualites-nationales/violences-conjugales-une-aide-d-urgence-pour-vous-proteger',
      label: 'Caf',
      verified: false,
    },
  },
  {
    id: 'kb-juridique-anef-defenseur-droits',
    category: 'juridique',
    title: { fr: 'Atteintes aux droits des étrangers : rapport du Défenseur des droits sur l’ANEF' },
    summary: {
      fr: 'Rapport publié le 11 décembre 2024 par le Défenseur des droits sur l’Administration numérique pour les étrangers en France (ANEF). Il constate que les dysfonctionnements de la plateforme peuvent laisser des personnes sans titre de séjour alors qu’elles en rempliraient les conditions, avec des conséquences sur l’emploi, les prestations sociales ou l’accès aux soins. L’institution formule 14 recommandations, dont le droit de réaliser toute démarche par un canal non dématérialisé.',
    },
    keywords: ['anef', 'étrangers', 'titre de séjour', 'préfecture', 'défenseur des droits', 'dématérialisation'],
    source: {
      url: 'https://www.defenseurdesdroits.fr/atteintes-aux-droits-des-etrangers-le-defenseur-des-droits-publie-un-rapport-sur-ladministration',
      label: 'Défenseur des droits',
      verified: true,
      checkedAt: '2026-09-15',
    },
  },
  {
    id: 'kb-travail-guide-action-emploi-refugies',
    category: 'travail',
    title: { fr: 'Guide Action Emploi Réfugiés 2023' },
    summary: {
      fr: "D'après la fiche de la base de ressources, non vérifié sur la page : « un guide d'information à destination des personnes BPI et de leurs accompagnateur.rices sur l'insertion professionnelle ». Le lien d'origine ne répond plus (erreur 404).",
    },
    keywords: ['emploi', 'réfugiés', 'bpi', 'insertion professionnelle', 'guide'],
    source: {
      url: 'https://actionemploirefugies.com/wp-content/uploads/2022/12/AERe-GUIDE_IER_Accompagnateurs_et_Refugies_2023.pdf',
      label: 'Action Emploi Réfugiés',
      verified: false,
    },
  },
]
