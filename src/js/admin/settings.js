/**
 * Gadget Admin - Settings Management
 * Handles settings page functionality including tab switching, form management, and dangerous actions
 */

// Settings Manager Class
class SettingsManager {
    constructor() {
        // Page titles and descriptions for each tab
        this.pageData = {
            'general': {
                title: 'General Settings',
                description: 'Configure your store preferences'
            },
            'store': {
                title: 'Store Settings',
                description: 'Manage product and inventory settings'
            },
            'shipping': {
                title: 'Shipping Settings',
                description: 'Configure shipping zones and options'
            },
            'payment': {
                title: 'Payment Settings',
                description: 'Manage payment methods and settings'
            },
            'notifications': {
                title: 'Notification Settings',
                description: 'Configure email and notification preferences'
            },
            'security': {
                title: 'Security Settings',
                description: 'Manage security and password settings'
            },
            'advanced': {
                title: 'Advanced Settings',
                description: 'Configure API and advanced options'
            }
        };
        
        this.initializeElements();
        this.bindEvents();
        this.initializePage();
    }
    
    initializeElements() {
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.openSidebarBtn = document.getElementById('openSidebar');
        this.closeSidebarBtn = document.getElementById('closeSidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        
        // Settings elements
        this.settingsSubmenuItems = document.querySelectorAll('.settings-submenu-item');
        this.settingsContents = document.querySelectorAll('.settings-content');
        this.settingsMainItem = document.querySelector('.settings-main-item');
        this.settingsSubmenu = document.querySelector('.settings-submenu');
        this.settingsChevron = document.querySelector('.settings-chevron');
        this.pageTitle = document.getElementById('pageTitle');
        this.pageDescription = document.getElementById('pageDescription');
    }
    
    bindEvents() {
        // Sidebar events
        this.openSidebarBtn?.addEventListener('click', () => this.openSidebar());
        this.closeSidebarBtn?.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay?.addEventListener('click', () => this.closeSidebar());
        
        // Settings menu events
        this.settingsMainItem?.addEventListener('click', () => this.toggleSettingsSubmenu());
        
        this.settingsSubmenuItems?.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.getAttribute('data-tab');
                this.switchTab(tabName);
                // Ensure submenu is open when clicking items
                if (!this.settingsSubmenu?.classList.contains('open')) {
                    this.toggleSettingsSubmenu();
                }
            });
        });
        
        // Save settings
        this.saveSettingsBtn?.addEventListener('click', () => this.saveSettings());
        
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
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const isClickInsideSidebar = this.sidebar?.contains(event.target);
            const isClickOnOpenBtn = this.openSidebarBtn?.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnOpenBtn && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                this.closeSidebar();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.sidebar?.classList.remove('-translate-x-full');
                this.sidebarOverlay?.classList.add('hidden');
            } else {
                if (!this.sidebar?.classList.contains('-translate-x-full')) {
                    this.closeSidebar();
                }
            }
        });
        
        // Handle escape key for closing sidebar
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                this.closeSidebar();
            }
        });
    }
    
    initializePage() {
        // Open settings submenu and show general settings by default
        if (this.settingsSubmenu) {
            this.settingsSubmenu.classList.add('open');
        }
        if (this.settingsChevron) {
            this.settingsChevron.style.transform = 'rotate(90deg)';
        }
        this.switchTab('general');
    }
    
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
    
    toggleSettingsSubmenu() {
        if (!this.settingsSubmenu || !this.settingsChevron) return;
        
        this.settingsSubmenu.classList.toggle('open');
        this.settingsChevron.style.transform = this.settingsSubmenu.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
    }
    
    switchTab(tabName) {
        // Update active submenu item
        this.settingsSubmenuItems?.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active');
                item.classList.remove('text-slate-400');
                item.classList.add('text-white');
            } else {
                item.classList.remove('active');
                item.classList.remove('text-white');
                item.classList.add('text-slate-400');
            }
        });
        
        // Show active content
        this.settingsContents?.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.classList.remove('hidden');
                content.classList.add('active-tab-content');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active-tab-content');
            }
        });
        
        // Update page title and description
        if (this.pageData[tabName]) {
            if (this.pageTitle) this.pageTitle.textContent = this.pageData[tabName].title;
            if (this.pageDescription) this.pageDescription.textContent = this.pageData[tabName].description;
        }
        
        // Close sidebar on mobile after selecting a tab
        if (window.innerWidth < 1024) {
            this.closeSidebar();
        }
    }
    
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    saveSettings() {
        if (!this.saveSettingsBtn) return;
        
        const originalText = this.saveSettingsBtn.innerHTML;
        this.saveSettingsBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Saving...</span>';
        this.saveSettingsBtn.disabled = true;
        
        // Simulate saving settings
        setTimeout(() => {
            this.saveSettingsBtn.innerHTML = originalText;
            this.saveSettingsBtn.disabled = false;
            this.showNotification('Settings saved successfully!');
        }, 1500);
    }
    
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
            
            // Clear password fields
            const currentPasswordField = document.getElementById('currentPassword');
            const newPasswordField = document.getElementById('newPassword');
            const confirmPasswordField = document.getElementById('confirmPassword');
            
            if (currentPasswordField) currentPasswordField.value = '';
            if (newPasswordField) newPasswordField.value = '';
            if (confirmPasswordField) confirmPasswordField.value = '';
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
        this.handleDangerousAction('resetSettings', 'Are you sure you want to reset all settings to default? This cannot be undone.');
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
        if (confirmationMessage && !confirm(confirmationMessage)) {
            return;
        }
        
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

// Initialize Settings Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const settingsManager = new SettingsManager();
});