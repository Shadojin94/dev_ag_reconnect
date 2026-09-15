import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { llmProxyPlugin } from './server/llmProxyPlugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Préfixe '' : lit aussi les variables sans VITE_, réservées au serveur.
  // Elles ne sont passées qu'au middleware, jamais au bundle.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      llmProxyPlugin({
        apiKey: env.NVIDIA_API_KEY,
        baseUrl: env.LLM_BASE_URL,
        model: env.LLM_MODEL,
        reasoningEffort: env.LLM_REASONING_EFFORT,
        maxTokens: env.LLM_MAX_TOKENS,
        temperature: env.LLM_TEMPERATURE,
        timeoutMs: env.LLM_TIMEOUT_MS,
      }),
    ],
    // Chemin de base du site publié (GitHub Pages : /dev_ag_reconnect/mvp/).
    // En local, BASE_PATH n'est pas défini : l'app reste servie à la racine.
    base: process.env.BASE_PATH ?? '/',
  }
})
