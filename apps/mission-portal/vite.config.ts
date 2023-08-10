/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default (e: { mode: any }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(e.mode, process.cwd() + '.env') };

  return defineConfig({
    cacheDir: '../../node_modules/.vite/mission-portal',

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  });
}

// export default defineConfig({
//   cacheDir: '../../node_modules/.vite/mission-portal',

//   server: {
//     port: 4200,
//     host: 'localhost',
//   },

//   preview: {
//     port: 4300,
//     host: 'localhost',
//   },

//   plugins: [react(), nxViteTsPaths()],

//   // Uncomment this if you are using workers.
//   // worker: {
//   //  plugins: [ nxViteTsPaths() ],
//   // },

//   test: {
//     globals: true,
//     cache: {
//       dir: '../../node_modules/.vitest',
//     },
//     environment: 'jsdom',
//     include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
//   },
// });
