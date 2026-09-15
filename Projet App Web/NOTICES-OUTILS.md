# Les outils en gestes courts

Documentation consultée le 14 septembre 2026. Une commande présente dans la documentation n’est pas une installation déjà réalisée. Ces notices sont à utiliser sur le poste de l’apprenant ; aucun secret ne doit entrer dans le dépôt ou le support.

## Claude Code — CLI et Desktop

1. Ouvrir le dossier de l’application dans le terminal, puis Claude Code ; ou choisir une session locale dans l’onglet Code du Desktop.
2. Ajouter les skills du kit sous `.claude/skills/` ; fusionner les règles dans `CLAUDE.md`.
3. Vérifier la découverte avec `/prompt-5`, puis inspecter les serveurs avec `/mcp`.

```bash
claude --version
claude mcp list
```

Les sessions locales CLI et Desktop partagent la configuration Claude Code. L’onglet Chat a ses propres connexions. Une installation, un compte ou un mode distant peut changer ce qui est disponible : le Desktop n’a pas été essayé sur les postes apprenants.

Source : [Skills](https://code.claude.com/docs/en/skills), [Desktop](https://code.claude.com/docs/en/desktop), [MCP](https://code.claude.com/docs/en/mcp).

## Context7 — retrouver une API documentée

Commande d’assistant de configuration vue dans la documentation :

```bash
npx ctx7 setup --claude
```

1. Exécuter la configuration dans le projet concerné et relire les options proposées.
2. Demander : « use context7 pour la version de React installée dans package.json ; montre la documentation du formulaire contrôlé ».
3. Lire les sources renvoyées et comparer avec les types du paquet local.

MCP utilise `resolve-library-id`, puis `query-docs`. La CLI propose aussi `ctx7 library <name> <query>` et `ctx7 docs <libraryId> <query>`. Les chevrons sont des paramètres à remplacer, pas des commandes à coller tels quels. Le service reste distant ; sans réseau, consulter une copie datée.

Source : [configuration Claude Code](https://context7.com/docs/clients/claude-code), [README officiel](https://github.com/upstash/context7). Configuration apprenant non exécutée.

## Firecrawl — extraire une page choisie

Mode MCP hébergé sans clé, avec limites d’usage :

```bash
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp
```

1. Ajouter le serveur, puis vérifier dans `/mcp` et essayer une requête courte.
2. Donner une URL de structure sociale explicitement fournie et validée par le PO.
3. Demander texte, URL, date, puis comparer les coordonnées à la page avant de garder la fiche.

Le mode sans clé peut atteindre ses limites. Une connexion de compte ou une clé peut être utilisée selon la documentation ; la clé se transmet par configuration/en-tête ou variable d’environnement, jamais dans une URL partagée. Une recherche web ne vaut pas extraction complète. Sans réseau, utiliser les copies déjà présentes, sans changer leur date.

Source : [serveur MCP](https://docs.firecrawl.dev/mcp-server), [mode sans clé](https://docs.firecrawl.dev/mcp-server/keyless). Ajout du serveur et connexion sur les postes apprenants non vérifiés.

## Archify — rendre l’architecture visible

1. Suivre l’installation du [README officiel](https://github.com/tt-a1i/archify) et vérifier que le skill est découvrable.
2. Si installé, demander :

```text
/archify Schématise les trois lots Reconnect Assist,
leur contrat partagé et le point d’intégration.
Marque ce qui existe et ce qui est seulement prévu.
```

3. Ouvrir le HTML généré et expliquer chaque flèche à un collègue.

Le skill local v2.16 a été lu pendant la préparation ; sa présence sur un poste ne prouve pas celle des autres. Le résultat est autonome une fois généré. L’agent qui le produit peut encore nécessiter le réseau.

## OpenCode — transposer la méthode

Installation npm documentée, si ce mode convient au poste :

```bash
npm install -g opencode-ai
opencode
```

1. Ouvrir l’agent dans le projet ; utiliser `/connect` pour un fournisseur.
2. Consulter `/models`, vérifier l’accès et le coût puis choisir.
3. Utiliser `/init` et relire `AGENTS.md` avant de donner le ticket.

Ne déduire aucun accès d’un abonnement à une autre application. Rester dans les mêmes fichiers et vérifier le même Done. Le changement d’agent n’est pas nécessaire pour la démonstration.

Source : [documentation OpenCode](https://opencode.ai/docs/). Installation et exécution apprenant non vérifiées.

## Buzz — découverte après le MVP

1. Lire le [dépôt public block/buzz](https://github.com/block/buzz) et ses versions.
2. Préparer un canal de démonstration sans donnée sensible, puis vérifier le mode de connexion des agents dans la documentation actuelle.
3. Essayer une question limitée : « Résume les décisions disponibles dans ce canal et cite les messages utilisés ».

Aucune installation, identité, communauté ou connexion d’agent n’est fournie par ce kit. Le site buzz.xyz n’a pas pu être ouvert lors de la vérification de reprise ; le dépôt public a été consulté. Accès, prix et gestes précis dans l’application restent non vérifiés.

## Karpathy — LLM Wiki

1. Déposer une source datée dans `wiki/raw/`.
2. Demander une synthèse sourcée dans `wiki/pages/`.
3. Relire, puis mettre à jour `wiki/index.md` et `wiki/log.md`.

Ingest, query et lint nomment des opérations, pas trois commandes installées. Le kit fournit les fichiers et règles ; il n’installe pas de moteur de recherche ni de modèle.

Source : [gist LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Organisation du kit adaptée à cette méthode.

