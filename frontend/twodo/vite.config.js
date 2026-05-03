import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const fromFiles = loadEnv(mode, process.cwd(), '')
  const apiUrl = (
    fromFiles.VITE_BASE_API_URL ||
    process.env.VITE_BASE_API_URL ||
    ''
  ).trim()

  return {
    plugins: [react()],
    // Cloudflare (and other CI) often only set process.env; ensure it gets inlined.
    define: {
      'import.meta.env.VITE_BASE_API_URL': JSON.stringify(apiUrl),
    },
  }
})
