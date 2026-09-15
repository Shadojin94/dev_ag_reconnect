import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Chemin de base du site publié (GitHub Pages : /dev_ag_reconnect/mvp/).
  // En local, BASE_PATH n'est pas défini : l'app reste servie à la racine.
  base: process.env.BASE_PATH ?? '/',
})
