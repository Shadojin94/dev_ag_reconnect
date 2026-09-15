# La fiche à garder

| Étape | Ce que vous décidez | Preuve attendue |
|---|---|---|
| 1 Cadrer | Le besoin, le périmètre et l’échéance | Ticket Ready et Done |
| 2 Donner le contexte | Les règles, fichiers et limites | Plan fondé sur le dépôt |
| 3 Améliorer le prompt | Les cinq blocs à relire | Prompt compris et validé |
| 4 Lancer | Le lot attribué et son exécutant | Rapport de fichiers et validations |
| 5 Vérifier et garder | Le Done et le savoir réutilisable | Recette puis proposition wiki |

## 1 Cadrer

```text
/ticket-ready Mon besoin : afficher les organismes du jeu validé.
Échéance proposée : 10h45. Lot : src/features/annuaire/.
```

## 2 Donner le contexte

```text
Lis CLAUDE.md, README.md, docs/CONVENTIONS.md et le contrat.
Mon périmètre est src/features/annuaire/.
Signale les fichiers manquants et propose un plan, sans coder.
```

## 3 Améliorer le prompt

```text
/prompt-5 ANNU-01 dans TICKETS-DEMAIN.md.
Retourne [RÔLE] [CONTEXTE] [TÂCHE] [CONTRAINTES] [EXEMPLES],
puis Ready et Done. N’implémente rien.
```

## 4 Lancer

```text
/lancer-workflow ANNU-01 dans TICKETS-DEMAIN.md.
Affiche le prompt reformulé et attends mon « ok ».
```

## 5 Vérifier et garder

```text
Relis le diff et vérifie le Done du ticket.
Exécute les validations disponibles et note leurs résultats.
Teste le cas vide et le contact absent.
Propose une note wiki avec source, décision et preuve.
```

Le kit fournit ces skills ; leur copie et leur découverte sont à vérifier sur chaque poste. Une commande prévue ne compte jamais comme une validation effectuée.

