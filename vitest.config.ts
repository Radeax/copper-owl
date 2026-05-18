import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/engine/**', 'src/api/**', 'src/utils/**'],
        exclude: [
          'src/**/*.test.ts',
          'src/**/*.test.tsx',
          'src/routeTree.gen.ts',
          'src/test/**',
        ],
      },
    },
  })
);
