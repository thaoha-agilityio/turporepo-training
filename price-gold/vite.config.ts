import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// config
import { GENERATE_SW_OPTIONS, MANIFEST_OPTIONS } from './src/config';

const envVariables = loadEnv('mock', process.cwd(), '');
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'firebase-messaging-sw': path.resolve(
          __dirname,
          'src/sw/firebase-messaging-sw.js',
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'firebase-messaging-sw'
            ? '[name].js'
            : 'assets/[name]-[hash].js';
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: MANIFEST_OPTIONS,
      workbox: GENERATE_SW_OPTIONS(),
      devOptions: {
        enabled: false, // enable only for debugging in dev
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.VITE_PUBLIC_API_URL': JSON.stringify(
      envVariables.VITE_PUBLIC_API_URL,
    ),
    'process.env.VITE_API_KEY': JSON.stringify(envVariables.VITE_API_KEY),
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(
      envVariables.VITE_FIREBASE_API_KEY,
    ),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
      envVariables.VITE_FIREBASE_AUTH_DOMAIN,
    ),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(
      envVariables.VITE_FIREBASE_PROJECT_ID,
    ),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
      envVariables.VITE_FIREBASE_STORAGE_BUCKET,
    ),
    'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
      envVariables.VITE_FIREBASE_MESSAGING_SENDER_ID,
    ),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(
      envVariables.VITE_FIREBASE_APP_ID,
    ),
    'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(
      envVariables.VITE_FIREBASE_MEASUREMENT_ID,
    ),
    'process.env.VITE_FIREBASE_VAPID_KEY': JSON.stringify(
      envVariables.VITE_FIREBASE_VAPID_KEY,
    ),
  },
  server: {
    host: true, // listen on all IPs
    allowedHosts: true,
  },
});
