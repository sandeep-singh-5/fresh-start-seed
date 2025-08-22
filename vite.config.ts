import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// @ts-ignore - local JS plugin, no types
import inlineEditDevPlugin from "./plugins/visual-editor/vite-plugin-edit-mode.js";
// @ts-ignore - local JS plugin, no types
import inlineReactInlineEditor from "./plugins/visual-editor/vite-plugin-react-inline-editor.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'development' && inlineReactInlineEditor(),
    mode === 'development' && inlineEditDevPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
}));
