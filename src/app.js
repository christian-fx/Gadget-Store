import { renderDashboard } from './admin/pages/dashboard.js';
import { renderProducts } from './admin/pages/products.js';
import { renderOrders } from './admin/pages/orders.js';
import { renderCustomers } from './admin/pages/customers.js';
import { renderInventory } from './admin/pages/inventory.js';
import { renderSettings } from './admin/pages/settings.js';
import { renderCategories } from './admin/pages/categories.js';
import { updateGlobalUI } from './admin/utils/ui-helpers.js';

const routes = {
    'dashboard': renderDashboard,
    'products': renderProducts,
    'orders': renderOrders,
    'customers': renderCustomers,
    'inventory': renderInventory,
    'settings': renderSettings,
    'categories': renderCategories,
};

export function initRouter() {
    function handleRoute() {
        const hash = window.location.hash.slice(1) || 'dashboard'; // Default to dashboard
        const renderer = routes[hash] || routes['dashboard'];

        // Clear app container
        const app = document.getElementById('app');
        if (app) app.innerHTML = '';

        // Render page
        renderer();

        // Update global UI elements (Sidebar/Topbar)
        updateGlobalUI();
    }

    // Handle hash changes
    window.addEventListener('hashchange', handleRoute);

    // Initial load - run immediately when initialized
    handleRoute();
}

// Export only, let main.js initialize

