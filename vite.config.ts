import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'
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
export default defineConfig(({ mode }) => {

  console.log(mode)
  return {
    plugins: [react(),
       VitePWA({

      registerType: 'autoUpdate',

      workbox: {

        clientsClaim: true,

        skipWaiting: true,

        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB

      },

    }),
    ],
    server: { port: 3000 },
    build: {
      sourcemap: mode === 'development' // generate just in dev mode 
    },
    resolve: {
      alias: {
        ...resolvedAliases,
      },
    },
    define: {
      global: 'window',
    },
  };
});