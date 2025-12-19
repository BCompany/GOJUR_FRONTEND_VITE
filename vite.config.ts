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
      filename: 'gojur-worker.js',
      manifestFilename: 'manifest-01.webmanifest',
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globIgnores: ['**/gojur-worker.js', '**/sw.js'],
      },

       injectManifest: {
        additionalManifestEntries: [
          {
            url: '/',
            revision: Date.now().toString(),
          },
        ],
      },
      // 📄 MANIFEST
      manifest: {
        name: 'Gojur',
        short_name: 'Gojur',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d47a1',
        
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
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