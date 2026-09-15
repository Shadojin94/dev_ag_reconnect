# Sources et niveau de vérification

Support préparé pour le 15 septembre 2026. Documentation consultée le 14 septembre 2026 ; les recherches antérieures de la même journée ont été récupérées, puis les sources principales ci-dessous ont été reconsultées lors de la reprise.

« Documenté » signifie qu’une instruction a été trouvée dans une source. Cela ne signifie ni qu’elle a été exécutée, ni qu’un compte est connecté, ni qu’elle fonctionne sur le poste d’un apprenant.

| Sujet | Source principale | Ce qu’elle étaye |
|---|---|---|
| Skills Claude Code | [Documentation skills](https://code.claude.com/docs/en/skills) | SKILL.md, emplacements, frontmatter et invocation |
| Sous-agents | [Documentation sub-agents](https://code.claude.com/docs/en/sub-agents) | Exécutants spécialisés et contexte distinct |
| MCP | [Documentation MCP](https://code.claude.com/docs/en/mcp) | Connexion, portées et configuration projet |
| Commandes | [Documentation commands](https://code.claude.com/docs/en/commands) | /context, /compact, /resume, /usage ; /cost alias |
| Desktop | [Documentation Desktop](https://code.claude.com/docs/en/desktop) | Sessions locales Code et configuration partagée avec CLI |
| Context7 | [README officiel](https://github.com/upstash/context7) | MCP, resolve-library-id, query-docs et CLI ctx7 |
| Context7 dans Claude Code | [Configuration](https://context7.com/docs/clients/claude-code) | npx ctx7 setup --claude ; commande documentaire, non exécutée pour les apprenants |
| Firecrawl | [Serveur MCP](https://docs.firecrawl.dev/mcp-server) | Serveur hébergé, accès sans clé, compte ou clé |
| Firecrawl sans clé | [Mode keyless](https://docs.firecrawl.dev/mcp-server/keyless) | Endpoint et limites d’usage ; quotas non promis |
| Archify | [Dépôt tt-a1i/archify](https://github.com/tt-a1i/archify) | Installation et description du skill ; SKILL.md local v2.16 également lu |
| OpenCode | [Documentation](https://opencode.ai/docs/) | Installation, connexion de fournisseurs, commandes et règles |
| Buzz | [Dépôt block/buzz](https://github.com/block/buzz) | Projet public ; application et connexion des agents non essayées |
| LLM Wiki | [Gist de Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Sources brutes, wiki Markdown, index, journal, ingest/query/lint |
| Projet Reconnect | [Dépôt de formation](https://github.com/Shadojin94/dev_ag_reconnect) | Contexte du projet ; stack et conventions contrôlées dans les fichiers locaux |

## Sources locales pédagogiques

- Demande du formateur et transcriptions de la formation du 14 septembre : public, difficultés réseau, attentes de théorie et fil rouge Reconnect Assist.
- Plan-contenu de la reprise Claude : architecture du support, cinq étapes et kit.
- Skill personnel claude-5-prompt : structure [RÔLE], [CONTEXTE], [TÂCHE], [CONTRAINTES], [EXEMPLES]. Les références de modèles et exemples API anciens de ce skill ne sont pas repris.
- Projet App Web/package.json et docs/CONVENTIONS.md : scripts dev/lint/build, React/Vite/TypeScript, CSS Modules et périmètres.

Les enregistrements bruts et fichiers personnels ne sont pas distribués avec ce kit.

## Ce qui reste à vérifier en séance

- Installation et découverte des trois skills sur chaque poste.
- Compte, accès et exécution réelle des requêtes Context7 et Firecrawl.
- Disponibilité d’Archify, d’OpenCode ou de Buzz là où ils seront montrés.
- Mode Desktop et compte utilisés par chaque apprenant.
- Ville, catégories, langues, sources métier, rôle d’intégration et statut des tickets.
- Endpoint serveur LLM prêt et validé, ou choix explicite du mode sans IA.

Le site buzz.xyz n’a pas pu être ouvert pendant la vérification de reprise. Le dépôt public a été consulté ; les gestes exacts dans l’application, l’accès et le coût ne sont pas présentés comme vérifiés.

Aucune structure sociale, adresse ou coordonnée n’est validée par ce document : les sources métier seront fournies et relues dans les tickets. Les huit fiches et six structures visées sont des cibles pédagogiques proposées, pas un jeu de données déjà produit.

