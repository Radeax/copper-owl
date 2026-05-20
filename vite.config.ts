import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { existsSync } from 'node:fs';
import path from 'node:path';

// When @copper-owl/rules isn't installed (CI, external clones), Rollup fails
// at bundle time trying to resolve the dynamic import in main.tsx — the
// try/catch only handles runtime absence, not build-time resolution failures.
// This stub resolves the import to an empty virtual module so the build
// succeeds; no registerRuleSet calls are made, so placeholder rules stay.
const rulesInstalled = existsSync('./node_modules/@copper-owl/rules');
const optionalRulesStub = rulesInstalled
  ? null
  : {
      name: 'stub-optional-rules',
      resolveId(id: string) {
        if (id === '@copper-owl/rules') return '\0copper-owl-rules-stub';
      },
      load(id: string) {
        if (id === '\0copper-owl-rules-stub') return 'export {};';
      },
    };

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    ...(optionalRulesStub ? [optionalRulesStub] : []),
    // TanStack Router file-based routing — generates routeTree.gen.ts from src/routes
    TanStackRouterVite({
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
      autoCodeSplitting: true,
      // tsc -b emits .d.ts files into src/routes/ as a composite build
      // side-effect. Without this, the plugin picks them up as route files.
      routeFileIgnorePattern: '\\.d\\.ts$',
    }),
    // React 19 with React Compiler enabled
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    // PWA for offline-capable web build
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Copper Owl',
        short_name: 'Copper Owl',
        description: 'Decision-support companion for Guild Wars 2',
        theme_color: '#131312',
        background_color: '#131312',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache API responses from GW2 API with stale-while-revalidate
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.guildwars2\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'gw2-api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@engine': path.resolve(__dirname, './src/engine'),
      '@state': path.resolve(__dirname, './src/state'),
      '@api': path.resolve(__dirname, './src/api'),
      '@illustrations': path.resolve(__dirname, './src/illustrations'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Tauri configuration:
  // 1. Tauri expects a fixed port; fail if the port is in use
  // 2. Allow connections from Tauri Android emulator
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // Tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },

  // Env variables prefixed with VITE_ are exposed to the client
  envPrefix: ['VITE_', 'TAURI_ENV_*'],

  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS/iOS
    target:
      process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
