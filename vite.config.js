import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // the lazy three.js + drei scene chunk is ~1 MB raw / ~280 kB gzip and loads after first paint
  build: { chunkSizeWarningLimit: 1100 },
})
