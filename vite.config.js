import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  publicDir: [
    'public',
    'src/dist'
  ]
}) 