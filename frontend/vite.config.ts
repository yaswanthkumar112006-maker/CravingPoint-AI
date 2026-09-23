import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8080';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        // Forward standard database API endpoints to Spring Boot Backend
        '/api/users': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/restaurants': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/menu-items': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/cart': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/orders': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/reviews': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/api/dashboard': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
