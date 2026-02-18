export function initSidebarLogic() {
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = (show) => {
        if (!sidebar) return;
        if (show) {
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
        }
    };

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing if we click outside logic exists
            toggleSidebar(true);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleSidebar(false));
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleSidebar(false));
    }
}

import { AdminSettingsStore } from '../store/admin-settings-store.js';

export async function updateGlobalUI() {
    // Ensure settings are loaded before updating UI
    await AdminSettingsStore.init();
    const settings = AdminSettingsStore.getSettings();
    if (!settings) return;

    // Update Sidebar Brand
    const brandEl = document.getElementById('sidebar-brand-name');
    if (brandEl) {
        brandEl.textContent = settings.storeName || 'Gadget Admin';
    }

    // Update Topbar User
    const userNameEl = document.getElementById('topbar-user-name');

    if (userNameEl) {
        userNameEl.textContent = `${settings.firstName} ${settings.lastName}`;
    }

    // Role is usually static for now
}

export function getCurrencyDetails() {
    const settings = AdminSettingsStore.getSettings();
    const currency = settings.currency || 'USD';

    // Hardcoded rates for now. In a real app, fetch these from an API.
    const rates = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'NGN': 1600
    };

    const rate = rates[currency] || 1;
    return { currency, rate };
}

export function formatCurrency(amount) {
    const { currency, rate } = getCurrencyDetails();
    const convertedValue = Number(amount) * rate;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(convertedValue);
}
