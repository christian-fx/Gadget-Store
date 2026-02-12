import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',  // Project root
  base: '/',  // Base path for assets (adjust if deploying to a subpath)
  build: {
    outDir: 'dist',  // Output directory for builds
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        categories: resolve(__dirname, 'public/admin/categories.html'),
        customer: resolve(__dirname, 'public/admin/customer.html'),
        dashboard: resolve(__dirname, 'public/admin/dashboard.html'),
        inventory: resolve(__dirname, 'public/admin/inventory.html'),
        orders: resolve(__dirname, 'public/admin/orders.html'),
        products: resolve(__dirname, 'public/admin/products.html'),
        settings: resolve(__dirname, 'public/admin/settings.html'),
        // User pages
        product: resolve(__dirname, 'public/users/product.html'),
        cart: resolve(__dirname, 'public/users/cart.html'),
        checkout: resolve(__dirname, 'public/users/checkout.html'),
        account: resolve(__dirname, 'public/users/account.html'),
        receipt: resolve(__dirname, 'public/users/receipt.html'),
        tracking: resolve(__dirname, 'public/users/tracking.html'),
        login: resolve(__dirname, 'public/users/login.html'),
        signup: resolve(__dirname, 'public/users/signup.html'),
      },
    },
  },
  server: {
    open: '/',  // Opens store (index.html) on dev server start
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),  // Optional alias for easier imports in JS (e.g., import from '@src/js/auth.js')
    },
  },
});