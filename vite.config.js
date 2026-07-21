import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base keeps the built app portable (opens from file://, any subpath,
  // and Vercel all work) since this is a single-page app with no routing.
  base: './',
  plugins: [react()],
})
