import type { ManifestOptions, Options } from 'vite-plugin-pwa';

// Constants
import { CACHE_NAMES } from '../constants';

export const MANIFEST_OPTIONS: Partial<ManifestOptions> = {
  name: 'Price Gold PWA App',
  short_name: 'PriceGold',
  description: 'A Progressive Web App built with React and Vite',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait-primary',
  theme_color: '#ffffff',
  background_color: '#ffffff',
  lang: 'en',
  dir: 'ltr',
  categories: ['finance', 'business'],
  icons: [
    {
      src: '/pwa-64x64.png',
      sizes: '64x64',
      type: 'image/png',
    },
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/apple-touch-icon-180x180.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'any',
    },
  ],
  screenshots: [
    {
      src: '/screenshots/desktop-home.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Home page on desktop',
    },

    {
      src: '/screenshots/mobile-home.png',
      sizes: '390x844',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Home page on mobile',
    },
  ],

  shortcuts: [
    {
      name: 'Home',
      short_name: 'Home',
      description: 'Go to the home page',
      url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
  ],

  related_applications: [],
  prefer_related_applications: false,
};

export const GENERATE_SW_OPTIONS = (): Options['workbox'] => ({
  clientsClaim: true, // new service worker will take control of all clients as soon as it's activated
  skipWaiting: true, // new service worker will skip the waiting phase and activate immediately
  cleanupOutdatedCaches: true, // clean up outdated caches
  importScripts: ['firebase-messaging-sw.js'],
  runtimeCaching: [
    {
      // Cache static assets with a Cache First strategy
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
      handler: 'CacheFirst', // Prioritize cache for static assets
      options: {
        cacheName: CACHE_NAMES.STATIC_ASSETS,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses
        },
      },
    },
    {
      // Cache app shell files using Network First to always get the latest version
      urlPattern: /\/(index\.html)?$/,
      handler: 'NetworkFirst', // Always fetch the latest version of the app shell
      options: {
        cacheName: CACHE_NAMES.APP_SHELL,
        expiration: {
          maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
        },
        networkTimeoutSeconds: 3, // Fallback to cache if fetch is slow
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses
        },
      },
    },

    {
      // Cache CSS/JS using Stale-While-Revalidate to serve cached files while fetching updates
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate', // Serve cached CSS/JS while revalidating in the background
      options: {
        cacheName: CACHE_NAMES.STATIC_RESOURCES,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
        },
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses
        },
      },
    },
    {
      // Cache the manifest with Network First to always fetch the latest version
      urlPattern: /manifest\.webmanifest$/,
      handler: 'NetworkFirst', // Always try to fetch the latest manifest first
      options: {
        cacheName: CACHE_NAMES.MANIFEST,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
        },
        networkTimeoutSeconds: 3, // Fallback to cache if fetch is slow
      },
    },
    {
      // Cache latest gold price API response
      urlPattern: /^https:\/\/api\.metalpriceapi\.com\/v1\/latest/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: CACHE_NAMES.API_PRICE_GOLD,
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60, // Cache valid for 1 hour
        },
        networkTimeoutSeconds: 3, // fallback to cache if slow
        cacheableResponse: {
          statuses: [0, 200],
        },
        backgroundSync: {
          name: 'api-queue-price-gold',
          options: {
            maxRetentionTime: 24 * 60, // retry failed requests for 24h
          },
        },
      },
    },
    {
      // Cache historical gold price API responses
      urlPattern: /^https:\/\/api\.metalpriceapi\.com\/v1\/change/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: CACHE_NAMES.API_HISTORICAL_GOLD,
        expiration: {
          maxEntries: 5, // keep last 5 requests
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200],
        },
        backgroundSync: {
          name: 'api-queue-historical-gold',
          options: {
            maxRetentionTime: 24 * 60, // retry failed requests for 24h
          },
        },
      },
    },
  ],
});
