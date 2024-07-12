import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { resolve } from 'path';

const aliases = {
  assets: 'src/assets',
  components: 'src/components',
  context: 'src/context',
  pages: 'src/pages',
  routes: 'src/routes',
  services: 'src/services',
  Shared: 'src/Shared',
  translate: 'src/translate',
};

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [
    key,
    resolve(__dirname, value),
  ]),
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: {
      ...resolvedAliases,
    },
  },
  define: {
    global: 'window',
  },
});
