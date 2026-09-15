# Décisions techniques

Une ligne par décision qui engage l'équipe. On écrit **pourquoi**, pas seulement quoi :
dans trois semaines, personne ne se souviendra du contexte, et la décision sera
rediscutée pour rien.

Format : date, décision, raison, alternatives écartées.

---

## ADR-001 — React + Vite + TypeScript

**2026-09-14 — adopté**

Stack de l'application.

**Pourquoi :** Vite démarre en une seconde et recharge à chaud, ce qui compte quand
on développe en séance. TypeScript rend les contrats explicites entre quatre personnes
qui ne lisent pas le code des autres en temps réel — le compilateur signale les ruptures
que personne n'aurait vues avant la démo.

**Écarté :** HTML/CSS/JS statique (atteint ses limites sur une app multi-écrans),
Next.js (front + backend d'un coup, trop de concepts nouveaux en parallèle).

---

## ADR-002 — Navigation entre écrans

**2026-09-15 — adopté**

État local et routage par hash (`#/`, `#/romain`, `#/nils`, `#/ashad`) implémenté
dans `src/app/`, zéro dépendance.

**Pourquoi :** l'app de démo a un nombre fixe et connu d'écrans (accueil + une page
par apprenant) pour une seule séance. Le hash routing donne une URL par écran
(partageable, bouton retour fonctionnel) sans rien installer, et fonctionne tel
quel sous `/mvp/` sur GitHub Pages sans configuration de serveur.

**Écarté :** React Router — la référence pour une vraie navigation, mais c'est une
dépendance de plus à installer, apprendre et maintenir pour un seul jour de séance ;
aucun des bénéfices supplémentaires (routes imbriquées, chargement différé, garde
de navigation) n'est utile ici.

---

## ADR-003 — Origine des données

**2026-09-15 — adopté**

Fixtures `.ts` typées derrière la façade `src/services/orientation.ts`, signatures
async conservées (`Promise<...>` même sans appel réseau réel).

**Pourquoi :** aucun backend n'est prêt ni validé pour la séance ; les fixtures
permettent de démontrer le parcours complet (besoin → explication → structure →
contact) en mode annoncé « sans IA ». Garder les signatures async — au lieu de
fonctions synchrones — signifie que brancher une vraie API plus tard ne change
aucun appelant : seul le corps des fonctions dans `src/services/orientation.ts`
change.

**Écarté :** backend réel ou API publique pour la démo — aucun endpoint serveur
n'était prêt et validé au moment de trancher (règle du ticket #1 : LLM connecté
seulement si un endpoint serveur est prêt et validé, sinon mode sans IA) ;
fonctions synchrones — auraient forcé une réécriture des appelants au moment de
brancher une vraie source de données.

---

<!--
## ADR-00X — Titre

**AAAA-MM-JJ — adopté | rejeté | remplacé par ADR-00Y**

Décision en une phrase.

**Pourquoi :** ...

**Écarté :** ...
-->
