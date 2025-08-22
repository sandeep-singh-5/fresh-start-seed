import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { EDIT_MODE_STYLES, POPUP_STYLES } from './visual-editor-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default function inlineEditDevPlugin() {
  return {
    name: 'vite:inline-edit-dev',
    apply: 'serve',
    transformIndexHtml() {
      const scriptPath = resolve(__dirname, 'edit-mode-script.js');
      const scriptContent = readFileSync(scriptPath, 'utf-8');

      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: scriptContent,
          injectTo: 'body'
        },
        {
          tag: 'style',
          attrs: { id: 'inline-editor-styles' },
          children: `${EDIT_MODE_STYLES}\n${POPUP_STYLES}`,
          injectTo: 'head'
        }
      ];
    }
  };
}
