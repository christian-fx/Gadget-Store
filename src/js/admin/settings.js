/**
 * Gadget Admin - Settings Management
 * Handles settings page: read-only by default, edit toggle, confirmation modal, and persistence.
 */

class SettingsManager2 {
    constructor() {
        this.isEditing = false;

        // Page data for each tab
        this.pageData = {
            'general': { title: 'General Settings', description: 'Configure your store preferences' },
            'store': { title: 'Store Settings', description: 'Manage product and inventory settings' },
            'shipping': { title: 'Shipping Settings', description: 'Configure shipping zones and options' },
            'payment': { title: 'Payment Settings', description: 'Manage payment methods and settings' },
            'notifications': { title: 'Notification Settings', description: 'Configure email and notification preferences' },
            'security': { title: 'Security Settings', description: 'Manage security and password settings' },
            'advanced': { title: 'Advanced Settings', description: 'Configure API and advanced options' }
        };

        // Map of setting IDs → keys in SettingsManager store
        this.fieldMap = {
            // General – text inputs
            storeName: 'storeName',
            storeEmail: 'storeEmail',
            storePhone: 'storePhone',
            storeAddress: 'storeAddress',
            adminEmail: 'adminEmail',
            maintenanceMessage: 'maintenanceMessage',
            // General – selects
            timezone: 'timezone',
            currency: 'currency',
            dateFormat: 'dateFormat',
            timeFormat: 'timeFormat',
            sidebarStyle: 'sidebarStyle',
            // Store – numbers
            lowStockThreshold: 'lowStockThreshold',
            holdStock: 'holdStock',
        };

        this.toggleMap = {
            darkModeToggle: 'darkMode',
            showOutOfStock: 'showOutOfStock',
            enableReviews: 'enableReviews',
            approveReviews: 'approveReviews',
            trackInventory: 'trackInventory',
            allowBackorders: 'allowBackorders',
            maintenanceMode: 'maintenanceMode',
        };

        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializePage();
    }

    initializeElements() {
        // Sidebar
        this.sidebar = document.getElementById('sidebar');
        this.openSidebarBtn = document.getElementById('openSidebar');
        this.closeSidebarBtn = document.getElementById('closeSidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');

        // Edit / Save button
        this.editStoreBtn = document.getElementById('editStoreBtn');

        // Confirmation modal
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmModalOverlay = document.getElementById('confirmModalOverlay');
        this.confirmSaveBtn = document.getElementById('confirmSave');
        this.confirmCancelBtn = document.getElementById('confirmCancel');

        // Tab navigation
        this.settingsSubmenuItems = document.querySelectorAll('.settings-submenu-item');
        this.settingsContents = document.querySelectorAll('.settings-content');
        this.settingsMainItem = document.querySelector('.settings-main-item');
        this.settingsSubmenu = document.querySelector('.settings-submenu');
        this.settingsChevron = document.querySelector('.settings-chevron');
        this.pageTitle = document.getElementById('pageTitle');
        this.pageDescription = document.getElementById('pageDescription');

        // All editable fields
        this.settingsFields = document.querySelectorAll('.settings-field');
        this.settingsToggles = document.querySelectorAll('.settings-toggle');
    }

    bindEvents() {
        // Sidebar
        this.openSidebarBtn?.addEventListener('click', () => this.openSidebar());
        this.closeSidebarBtn?.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay?.addEventListener('click', () => this.closeSidebar());

        // Edit / Save toggle
        this.editStoreBtn?.addEventListener('click', () => {
            if (this.isEditing) {
                this.showConfirmModal();
            } else {
                this.enableEditing();
            }
        });

        // Confirmation modal
        this.confirmSaveBtn?.addEventListener('click', () => this.confirmSave());
        this.confirmCancelBtn?.addEventListener('click', () => this.hideConfirmModal());
        this.confirmModalOverlay?.addEventListener('click', () => this.hideConfirmModal());

        // Settings menu submenu toggle
        this.settingsMainItem?.addEventListener('click', () => this.toggleSettingsSubmenu());

        // Tab switching
        this.settingsSubmenuItems?.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.getAttribute('data-tab');
                this.switchTab(tabName);
                if (!this.settingsSubmenu?.classList.contains('open')) {
                    this.toggleSettingsSubmenu();
                }
            });
        });

        // Data management buttons
        document.getElementById('exportData')?.addEventListener('click', () => this.handleExportData());
        document.getElementById('backupData')?.addEventListener('click', () => this.handleBackupData());
        document.getElementById('clearCache')?.addEventListener('click', () => this.handleClearCache());
        document.getElementById('sendTestEmail')?.addEventListener('click', () => this.handleSendTestEmail());
        document.getElementById('changePassword')?.addEventListener('click', () => this.handleChangePassword());
        document.getElementById('copyApiKey')?.addEventListener('click', () => this.handleCopyApiKey());
        document.getElementById('regenerateApiKey')?.addEventListener('click', () => this.handleRegenerateApiKey());
        document.getElementById('resetSettings')?.addEventListener('click', () => this.handleResetSettings());
        document.getElementById('deleteAllData')?.addEventListener('click', () => this.handleDeleteAllData());

        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (event) => {
            const isClickInsideSidebar = this.sidebar?.contains(event.target);
            const isClickOnOpenBtn = this.openSidebarBtn?.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnOpenBtn && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                this.closeSidebar();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.sidebar?.classList.remove('-translate-x-full');
                this.sidebarOverlay?.classList.add('hidden');
            } else if (!this.sidebar?.classList.contains('-translate-x-full')) {
                this.closeSidebar();
            }
        });

        // Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (!this.confirmModal?.classList.contains('hidden')) {
                    this.hideConfirmModal();
                } else if (!this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                    this.closeSidebar();
                }
            }
        });
    }

    // ─── Load / Save Settings ────────────────────────────────────────────

    loadSettings() {
        const settings = SettingsManager.getSettings();

        // Populate text/number inputs and selects
        Object.entries(this.fieldMap).forEach(([elementId, settingKey]) => {
            const el = document.getElementById(elementId);
            if (!el) return;
            if (el.tagName === 'SELECT') {
                el.value = settings[settingKey] ?? el.value;
            } else if (el.tagName === 'TEXTAREA') {
                el.value = settings[settingKey] ?? el.value;
            } else {
                el.value = settings[settingKey] ?? el.value;
            }
        });

        // Populate toggles
        Object.entries(this.toggleMap).forEach(([elementId, settingKey]) => {
            const el = document.getElementById(elementId);
            if (el) el.checked = !!settings[settingKey];
        });
    }

    collectSettings() {
        const collected = {};

        Object.entries(this.fieldMap).forEach(([elementId, settingKey]) => {
            const el = document.getElementById(elementId);
            if (!el) return;
            if (el.type === 'number') {
                collected[settingKey] = parseInt(el.value, 10) || 0;
            } else {
                collected[settingKey] = el.value;
            }
        });

        Object.entries(this.toggleMap).forEach(([elementId, settingKey]) => {
            const el = document.getElementById(elementId);
            if (el) collected[settingKey] = el.checked;
        });

        return collected;
    }

    // ─── Edit Mode ─────────────────────────────────────────────────────

    enableEditing() {
        this.isEditing = true;

        // Enable text/number/textarea inputs
        this.settingsFields.forEach(field => {
            field.removeAttribute('readonly');
            field.removeAttribute('disabled');
            field.classList.remove('bg-slate-100', 'cursor-not-allowed', 'pointer-events-none');
            field.classList.add('bg-slate-50', 'focus:bg-white', 'focus:border-primary', 'focus:ring-primary');
        });

        // Enable toggles
        this.settingsToggles.forEach(toggle => {
            toggle.removeAttribute('disabled');
            const slider = toggle.nextElementSibling;
            if (slider) {
                slider.style.opacity = '';
                slider.style.cursor = '';
            }
        });

        // Update button
        if (this.editStoreBtn) {
            this.editStoreBtn.innerHTML = `
                <span class="material-symbols-outlined text-[20px]">save</span>
                <span>Save Changes</span>
            `;
        }
    }

    disableEditing() {
        this.isEditing = false;

        // Disable text/number/textarea inputs
        this.settingsFields.forEach(field => {
            if (field.tagName === 'SELECT') {
                field.setAttribute('disabled', '');
                field.classList.add('pointer-events-none');
            } else {
                field.setAttribute('readonly', '');
            }
            field.classList.remove('bg-slate-50', 'focus:bg-white', 'focus:border-primary', 'focus:ring-primary');
            field.classList.add('bg-slate-100', 'cursor-not-allowed');
        });

        // Disable toggles
        this.settingsToggles.forEach(toggle => {
            toggle.setAttribute('disabled', '');
            const slider = toggle.nextElementSibling;
            if (slider) {
                slider.style.opacity = '0.6';
                slider.style.cursor = 'not-allowed';
            }
        });

        // Reset button
        if (this.editStoreBtn) {
            this.editStoreBtn.innerHTML = `
                <span class="material-symbols-outlined text-[20px]">edit</span>
                <span>Edit Store Info</span>
            `;
        }
    }

    // ─── Confirmation Modal ──────────────────────────────────────────────

    showConfirmModal() {
        this.confirmModal?.classList.remove('hidden');
    }

    hideConfirmModal() {
        this.confirmModal?.classList.add('hidden');
    }

    confirmSave() {
        this.hideConfirmModal();

        // Show saving state
        if (this.editStoreBtn) {
            this.editStoreBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Saving...</span>';
            this.editStoreBtn.disabled = true;
        }

        setTimeout(() => {
            // Persist to localStorage
            const settings = this.collectSettings();
            SettingsManager.saveSettings(settings);

            // Re-apply global settings immediately
            SettingsManager.applyGlobalSettings();

            // Switch back to read-only
            this.disableEditing();
            if (this.editStoreBtn) this.editStoreBtn.disabled = false;

            this.showNotification('Settings saved successfully!');
        }, 800);
    }

    // ─── Page Init ────────────────────────────────────────────────────────

    initializePage() {
        // Open submenu and show general tab
        if (this.settingsSubmenu) this.settingsSubmenu.classList.add('open');
        if (this.settingsChevron) this.settingsChevron.style.transform = 'rotate(90deg)';
        this.switchTab('general');
    }

    // ─── Sidebar ──────────────────────────────────────────────────────────

    openSidebar() {
        this.sidebar?.classList.remove('-translate-x-full');
        this.sidebarOverlay?.classList.remove('hidden', 'opacity-0');
        this.sidebarOverlay?.classList.add('block', 'opacity-100');
        document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
        this.sidebar?.classList.add('-translate-x-full');
        this.sidebarOverlay?.classList.remove('block', 'opacity-100');
        this.sidebarOverlay?.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
    }

    // ─── Tab Switching ────────────────────────────────────────────────────

    toggleSettingsSubmenu() {
        if (!this.settingsSubmenu || !this.settingsChevron) return;
        this.settingsSubmenu.classList.toggle('open');
        this.settingsChevron.style.transform = this.settingsSubmenu.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
    }

    switchTab(tabName) {
        this.settingsSubmenuItems?.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active', 'text-white');
                item.classList.remove('text-slate-400');
            } else {
                item.classList.remove('active', 'text-white');
                item.classList.add('text-slate-400');
            }
        });

        this.settingsContents?.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.classList.remove('hidden');
                content.classList.add('active-tab-content');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active-tab-content');
            }
        });

        if (this.pageData[tabName]) {
            if (this.pageTitle) this.pageTitle.textContent = this.pageData[tabName].title;
            if (this.pageDescription) this.pageDescription.textContent = this.pageData[tabName].description;
        }

        if (window.innerWidth < 1024) this.closeSidebar();
    }

    // ─── Notifications ────────────────────────────────────────────────────

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // ─── Action Handlers ─────────────────────────────────────────────────

    handleExportData() {
        const button = document.getElementById('exportData');
        if (!button) return;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Exporting...';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showNotification('Data exported successfully!');
        }, 2000);
    }

    handleBackupData() {
        const button = document.getElementById('backupData');
        if (!button) return;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Creating...';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showNotification('Backup created successfully!');
        }, 2000);
    }

    handleClearCache() {
        this.handleDangerousAction('clearCache', 'Are you sure you want to clear the cache?');
    }

    handleSendTestEmail() {
        const testEmail = document.getElementById('testEmail')?.value;
        if (!testEmail || !testEmail.includes('@')) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        const button = document.getElementById('sendTestEmail');
        if (!button) return;
        const originalText = button.innerHTML;
        button.innerHTML = 'Sending...';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showNotification(`Test email sent to ${testEmail}`);
        }, 1500);
    }

    handleChangePassword() {
        const currentPass = document.getElementById('currentPassword')?.value;
        const newPass = document.getElementById('newPassword')?.value;
        const confirmPass = document.getElementById('confirmPassword')?.value;
        if (!currentPass || !newPass || !confirmPass) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }
        if (newPass !== confirmPass) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        if (newPass.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        const button = document.getElementById('changePassword');
        if (!button) return;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Updating...';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showNotification('Password updated successfully!');
            ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        }, 1500);
    }

    handleCopyApiKey() {
        const apiKey = document.getElementById('apiKey');
        if (!apiKey) return;
        apiKey.select();
        document.execCommand('copy');
        this.showNotification('API key copied to clipboard!');
    }

    handleRegenerateApiKey() {
        this.handleDangerousAction('regenerateApiKey', 'Are you sure you want to regenerate the API key? Existing integrations will stop working.');
    }

    handleResetSettings() {
        if (!confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) return;
        SettingsManager.resetSettings();
        this.showNotification('Settings reset to defaults!');
        setTimeout(() => location.reload(), 800);
    }

    handleDeleteAllData() {
        if (confirm('WARNING: This will delete ALL data including products, orders, customers, and settings. This action cannot be undone. Type "DELETE" to confirm.')) {
            const userInput = prompt('Type "DELETE" to confirm permanent deletion of all data:');
            if (userInput === 'DELETE') {
                this.handleDangerousAction('deleteAllData', '');
            } else {
                this.showNotification('Deletion cancelled', 'error');
            }
        }
    }

    handleDangerousAction(actionId, confirmationMessage) {
        if (confirmationMessage && !confirm(confirmationMessage)) return;
        const button = document.getElementById(actionId);
        if (!button) return;
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span>';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showNotification('Action completed successfully!', 'success');
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new SettingsManager2();
});