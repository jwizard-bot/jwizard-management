import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const { VITE_PROXY_API_URL } = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    build: {
      outDir: 'target/dist',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/jw-[hash].js',
          entryFileNames: 'assets/jw-[hash].js',
          assetFileNames: 'assets/jw-[hash][extname]',
        },
      },
    },
    server: {
      // add proxy only for development (separated vite dev server)
      proxy:
        mode === 'development'
          ? {
              '/api': VITE_PROXY_API_URL,
            }
          : {},
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
