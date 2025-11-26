import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vite configuration for Qwik application
 *
 * Key features:
 * - qwikVite: Enables the $ optimizer for automatic code splitting
 * - qwikCity: Adds file-based routing and SSR capabilities
 * - tsconfigPaths: Enables path aliases from tsconfig.json
 */
export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite({
        client: {
          outDir: 'dist',
        },
      }),
      tsconfigPaths(),
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
  };
});
