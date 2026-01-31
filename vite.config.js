import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',  // Project root
  base: '/',  // Base path for assets (adjust if deploying to a subpath)
  build: {
    outDir: 'dist',  // Output directory for builds
    rollupOptions: {
      input: {
        index: resolve(__dirname, '/index.html'),
        categories: resolve(__dirname, 'public/admin/categories.html'),
        customer: resolve(__dirname, 'public/admin/customer.html'),
        dashboard: resolve(__dirname, 'public/admin/dashboard.html'),
        inventory: resolve(__dirname, 'public/admin/inventory.html'),
        orders: resolve(__dirname, 'public/admin/orders.html'),
        products: resolve(__dirname, 'public/admin/products.html'),
        settings: resolve(__dirname, 'public/admin/settings.html'),
      },
    },
  },
  server: {
    open: '/index.html',  // Opens index.html on dev server start
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),  // Optional alias for easier imports in JS (e.g., import from '@src/js/auth.js')
    },
  },
});