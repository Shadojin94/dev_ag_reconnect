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

**Statut : à trancher**

Une app de démo a plusieurs écrans. Rien n'est installé pour l'instant.

- **React Router** — la référence, URL partageables, bouton retour fonctionnel,
  une dépendance de plus ;
- **état local dans `app/`** — zéro dépendance, mais pas d'URL par écran,
  et tout le monde modifie le même fichier : conflits garantis.

À décider avant la première feature à deux écrans. Le rôle Intégration tranche
et écrit le résultat ici.

---

## ADR-003 — Origine des données

**Statut : à trancher**

Vrai backend, API publique, ou données de démo en dur ?

Conséquence directe sur le rôle Données & Services : sans backend, les services
renvoient des fixtures — mais gardent la même signature typée, pour que le
branchement d'une vraie API ne change rien au reste de l'app.

---

<!--
## ADR-00X — Titre

**AAAA-MM-JJ — adopté | rejeté | remplacé par ADR-00Y**

Décision en une phrase.

**Pourquoi :** ...

**Écarté :** ...
-->
