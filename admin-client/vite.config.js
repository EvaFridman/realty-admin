import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    port: 5173,
    headers: {
      // Имитация заголовков helmet для localhost
      'Content-Security-Policy-Report-Only': "default-src 'self'; connect-src 'self' http://localhost:3000; img-src 'self' data: http://localhost:3000; script-src 'self'; style-src 'self' 'unsafe-inline'; report-uri http://localhost:3000/csp-report;"
    }
  }
})
