import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from "rollup-plugin-copy";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
      copy({
      targets: [
        {
          // The Nutrient Web SDK requires its assets to be in the `public` directory so it can load them.
          src: "node_modules/@nutrient-sdk/viewer/dist/nutrient-viewer-lib",
          dest: "public/",
        },
      ],
      hook: "buildStart",
    }),
    react()],
   server: {
    host: "::",
    port: 5175,
    proxy: {
      '/pdf-proxy': {
        target: 'https://www.nutrient.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdf-proxy/, '')
      }
    }
  },
})
