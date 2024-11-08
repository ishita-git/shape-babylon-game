import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    port: 3000,
    proxy: {
      // Proxy both HTTP and WebSocket connections to Colyseus server
      '/api': {
        target: 'http://localhost:2567',
        changeOrigin: true,
        secure: false,
        ws: true,  // Enable proxying for WebSocket connections
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
