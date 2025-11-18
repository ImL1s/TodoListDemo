import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
      host: true,
    },
  };
});
