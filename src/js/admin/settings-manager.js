/**
 * Gadget Admin - Settings Manager (Shared Module)
 * Persists and retrieves admin settings from localStorage.
 * Include this script BEFORE any page-specific JS on every admin page.
 */

const SettingsManager = (() => {
    const STORAGE_KEY = 'gadget_admin_settings';

    // Default settings — match the initial hardcoded values across the project
    const DEFAULTS = {
        // General
        storeName: 'Gadget Admin',
        storeEmail: 'admin@gadgetstore.com',
        storePhone: '(555) 123-4567',
        storeAddress: '123 Tech Street, Silicon Valley, CA 94000',
        timezone: 'America/New_York',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        darkMode: false,
        primaryColor: '#2b8cee',
        sidebarStyle: 'expanded',

        // Store
        lowStockThreshold: 10,
        showOutOfStock: true,
        enableReviews: true,
        approveReviews: false,
        trackInventory: true,
        allowBackorders: false,
        holdStock: 30,
        maintenanceMode: false,
        maintenanceMessage: "We're currently performing maintenance. We'll be back soon!",
        adminEmail: 'admin@gadgetstore.com',
    };

    /** Currency symbol map */
    const CURRENCY_SYMBOLS = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        CAD: 'C$',
        AUD: 'A$',
        JPY: '¥',
    };

    /**
     * Return all settings, merged with defaults so missing keys still resolve.
     */
    function getSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...DEFAULTS };
            return { ...DEFAULTS, ...JSON.parse(raw) };
        } catch {
            return { ...DEFAULTS };
        }
    }

    /**
     * Get a single setting value.
     */
    function getSetting(key) {
        return getSettings()[key];
    }

    /**
     * Persist settings (merges with existing).
     */
    function saveSettings(obj) {
        const current = getSettings();
        const merged = { ...current, ...obj };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
    }

    /**
     * Reset all settings to defaults.
     */
    function resetSettings() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Get the defaults object.
     */
    function getDefaults() {
        return { ...DEFAULTS };
    }

    /**
     * Format a number as currency using the stored currency setting.
     */
    function formatCurrency(amount, opts = {}) {
        const currency = opts.currency || getSetting('currency') || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: opts.minimumFractionDigits ?? 0,
            maximumFractionDigits: opts.maximumFractionDigits ?? 2,
        }).format(amount);
    }

    /**
     * Get the symbol for the current currency.
     */
    function getCurrencySymbol() {
        return CURRENCY_SYMBOLS[getSetting('currency')] || '$';
    }

    // ─── Auto-apply on every page load ───────────────────────────────────

    function applyGlobalSettings() {
        const settings = getSettings();

        // — Dark mode —
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }

        // — Store name in sidebar brand —
        const brandEl = document.querySelector('#sidebar h1');
        if (brandEl && settings.storeName) {
            brandEl.textContent = settings.storeName;
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyGlobalSettings);
    } else {
        applyGlobalSettings();
    }

    // Public API
    return {
        getSettings,
        getSetting,
        saveSettings,
        resetSettings,
        getDefaults,
        formatCurrency,
        getCurrencySymbol,
        applyGlobalSettings,
        DEFAULTS,
    };
})();
