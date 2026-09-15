# Chat LLM de la base de connaissances

Une page de chat interroge les fiches sourcées de `src/features/base-connaissances/`
avec le modèle `moonshotai/kimi-k3` hébergé par NVIDIA. Les réponses citent leurs
fiches ; sans IA, la page répond quand même à partir des fiches.

## Fonctionnement

```
page chat
  → searchKnowledge : choisit les fiches pertinentes
  → prompt système sourcé (contenu des fiches + consigne de citer [kb-id])
  → POST /api/llm/chat : middleware Vite (server/llmProxyPlugin.ts), ajoute la clé
  → NVIDIA Kimi K3, réponse en streaming SSE relayée telle quelle
  → citations [kb-id] du texte résolues en sources affichées
```

Contrat du middleware :

| Cas | Réponse |
|---|---|
| `POST` avec `{ "messages": [{ "role", "content" }] }` valide | `200`, flux `text/event-stream` |
| Autre méthode | `405` JSON `{ "error" }` |
| Corps invalide (JSON, `messages` vide ou mal formé, > 50 messages, > 1 Mo) | `400` JSON |
| Requête venant d'une autre origine (en-tête `Origin` différent) | `403` JSON |
| `NVIDIA_API_KEY` absente | `503` JSON → mode sans IA |
| Erreur du service NVIDIA | même code HTTP, JSON `{ "error", "detail"? }` |
| NVIDIA injoignable | `502` JSON |

Si le navigateur ferme la connexion, l'appel à NVIDIA est interrompu.

## Lancer en local

```bash
cd "Projet App Web"
cp .env.example .env     # .env n'est jamais commité
# renseigner NVIDIA_API_KEY dans .env (clé créée sur build.nvidia.com)
npm run dev
```

Toute modification de `.env` demande de relancer `npm run dev`.

## Variables d'environnement

Sans préfixe `VITE_` : lues par `vite.config.ts` et passées au seul middleware,
jamais au bundle.

| Variable | Défaut | Rôle |
|---|---|---|
| `NVIDIA_API_KEY` | *(vide)* | clé d'API ; vide = mode sans IA |
| `LLM_BASE_URL` | `https://integrate.api.nvidia.com/v1` | URL de l'API compatible OpenAI |
| `LLM_MODEL` | `moonshotai/kimi-k3` | modèle appelé |
| `LLM_REASONING_EFFORT` | `medium` | effort de raisonnement ; vide = paramètre non envoyé |
| `LLM_MAX_TOKENS` | `4096` | longueur maximale de la réponse |
| `LLM_TEMPERATURE` | `1` | température d'échantillonnage |
| `LLM_TIMEOUT_MS` | `60000` | délai sans données du modèle (avant la réponse ou entre deux fragments) ; dépassé = erreur `504` affichée |

## Mode sans IA

La page bascule sans IA quand :

- la clé est absente (`503`) ;
- le réseau ou le service NVIDIA est indisponible ;
- l'app est servie en statique, sans middleware (`404`).

Elle affiche alors les fiches trouvées par `searchKnowledge`, avec leurs sources.

## Limites

- Le middleware n'existe qu'avec `npm run dev` et `npm run preview`.
- La version GitHub Pages est statique : elle est toujours en mode sans IA.
  Brancher le LLM en ligne demande une fonction serveur (ticket séparé).
- Pas d'embeddings pour l'instant : recherche par mots-clés sur 8 fiches.

## Sécurité

- La clé ne quitte jamais le serveur : pas de préfixe `VITE_`, jamais dans le bundle,
  jamais dans les logs ni dans les réponses du middleware.
- `.env` est ignoré par git ; ne jamais écrire la clé ailleurs (code, doc, ticket, capture).
- En cas de fuite : révoquer la clé sur build.nvidia.com puis en créer une nouvelle.
  La retirer d'un commit ne la retire pas de l'historique.
