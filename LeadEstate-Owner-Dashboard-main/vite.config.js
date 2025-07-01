import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const timestamp = Date.now()

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Force completely new hash - different from be4373dd
        entryFileNames: `assets/index-FORCE-${timestamp}.js`,
        chunkFileNames: `assets/chunk-FORCE-${timestamp}.js`,
        assetFileNames: `assets/[name]-FORCE-${timestamp}.[ext]`
      }
    }
  }
})
