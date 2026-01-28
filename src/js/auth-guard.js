
// AUTH GUARD FOR DASHBOARD PAGES
// =============================================

const AUTH_CONFIG = {
    STORAGE_KEYS: {
        USERS: 'gadgetstore_users',
        CURRENT_USER: 'gadgetstore_current_user',
        IS_LOGGED_IN: 'gadgetstore_is_logged_in',
        REMEMBER_ME: 'gadgetstore_remember_me'
    },
    SESSION_TIMEOUT: 60, // 60 minutes
    REMEMBER_ME_TIMEOUT: 30 * 24 * 60 // 30 days in minutes
};

class AuthGuard {
    constructor() {
        this.checkAuth();
    }
    
    checkAuth() {
        const isLoggedIn = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
        const currentUser = this.getCurrentUser();
        
        if (!isLoggedIn || !currentUser) {
            // Not logged in, redirect to login
            this.redirectToLogin('auth=required');
            return;
        }
        
        // Check session timeout
        if (!this.isSessionValid()) {
            this.logout('Session expired');
            return;
        }
        
        // Update last activity timestamp
        this.updateLastActivity();
        
        // Check admin access for admin pages
        if (this.isAdminPage() && !this.isAdmin()) {
            this.redirectToLogin('admin=required');
            return;
        }
        
        // Check user permissions based on page
        if (!this.hasPageAccess()) {
            this.redirectToDashboard();
            return;
        }
        
        // Update user info in UI if needed
        this.updateUIWithUserInfo();
    }
    
    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    }
    
    isSessionValid() {
        const currentUser = this.getCurrentUser();
        if (!currentUser || !currentUser.lastLogin) return false;
        
        const rememberMe = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME) === 'true';
        const lastLogin = new Date(currentUser.lastLogin);
        const now = new Date();
        const minutesDiff = (now - lastLogin) / (1000 * 60);
        
        if (rememberMe) {
            return minutesDiff < AUTH_CONFIG.REMEMBER_ME_TIMEOUT;
        } else {
            return minutesDiff < AUTH_CONFIG.SESSION_TIMEOUT;
        }
    }
    
    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'super_admin' || user.userType === 'staff');
    }
    
    isAdminPage() {
        // List of admin-only pages
        const adminPages = [
            'index.html',
            'product.html',
            'categories.html',
            'inventory.html',
            'orders.html',
            'settings.html'
            'customer.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        return adminPages.includes(currentPage);
    }
    
    hasPageAccess() {
        const user = this.getCurrentUser();
        const currentPage = window.location.pathname.split('/').pop();
        
        if (!user) return false;
        
        // Admin can access all pages
        if (this.isAdmin()) return true;
        
        // Customer can only access customer pages
        const customerPages = ['index.html', '/public/user/store.html', '/public/user/profile.html', '/public/user/product-detail.html', '/public/user/orders.html', '/public/user/order-summary.html', '/public/user/checkout.html'];
        if (user.userType === 'customer') {
            return customerPages.includes(currentPage);
        }
        
        return false;
    }
    
    updateLastActivity() {
        const user = this.getCurrentUser();
        if (user) {
            user.lastLogin = new Date().toISOString();
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            
            // Also update in users array
            this.updateUserInStorage(user);
        }
    }
    
    updateUserInStorage(updatedUser) {
        const users = JSON.parse(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USERS)) || [];
        const index = users.findIndex(u => u.id === updatedUser.id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        }
    }
    
    logout(reason = '') {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'false');
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
        
        const redirectParam = reason ? `?logout=true&reason=${encodeURIComponent(reason)}` : '?logout=true';
        window.location.href = `auth.html${redirectParam}`;
    }
    
    redirectToLogin(params = '') {
        const redirectUrl = window.location.pathname.split('/').pop();
        const fullParams = params ? `${params}&redirect=${encodeURIComponent(redirectUrl)}` : `redirect=${encodeURIComponent(redirectUrl)}`;
        window.location.href = `auth.html?${fullParams}`;
    }
    
    redirectToDashboard() {
        const user = this.getCurrentUser();
        if (user) {
            if (this.isAdmin()) {
                window.location.href = '/public/admin/dashboard.html';
            } else {
                window.location.href = '/public/index.html';
            }
        } else {
            this.redirectToLogin();
        }
    }
    
    updateUIWithUserInfo() {
        const user = this.getCurrentUser();
        if (!user) return;
        
        // Update user name in UI if elements exist
        const userNameElements = document.querySelectorAll('.user-name, .user-fullname');
        userNameElements.forEach(el => {
            if (el.classList.contains('user-fullname')) {
                el.textContent = `${user.firstName} ${user.lastName}`;
            } else if (el.classList.contains('user-name')) {
                el.textContent = user.firstName;
            }
        });
        
        // Update user email in UI if elements exist
        const userEmailElements = document.querySelectorAll('.user-email');
        userEmailElements.forEach(el => {
            el.textContent = user.email;
        });
        
        // Update user role badge if element exists
        const roleBadge = document.querySelector('.user-role-badge');
        if (roleBadge) {
            roleBadge.textContent = user.role === 'admin' || user.userType === 'staff' ? 'Admin' : 'Customer';
            roleBadge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'admin' || user.userType === 'staff' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`;
        }
        
        // Update logout button if exists
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
        
        // Update last login time if element exists
        const lastLoginElement = document.querySelector('.last-login-time');
        if (lastLoginElement && user.lastLogin) {
            const lastLogin = new Date(user.lastLogin);
            const now = new Date();
            const diffMs = now - lastLogin;
            const diffMins = Math.floor(diffMs / 60000);
            
            let timeText;
            if (diffMins < 1) {
                timeText = 'Just now';
            } else if (diffMins < 60) {
                timeText = `${diffMins} minutes ago`;
            } else if (diffMins < 1440) {
                const hours = Math.floor(diffMins / 60);
                timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diffMins / 1440);
                timeText = `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
            lastLoginElement.textContent = timeText;
        }
    }
    
    // Session timeout warning
    setupSessionTimeoutWarning() {
        if (!this.isAdmin()) return; // Only for admin sessions
        
        const warningTime = 5; // Show warning 5 minutes before timeout
        const checkInterval = 60000; // Check every minute
        
        const checkSession = () => {
            if (!this.isSessionValid()) {
                this.logout('Session expired due to inactivity');
                return;
            }
            
            const currentUser = this.getCurrentUser();
            if (!currentUser || !currentUser.lastLogin) return;
            
            const rememberMe = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME) === 'true';
            const lastLogin = new Date(currentUser.lastLogin);
            const now = new Date();
            const minutesDiff = (now - lastLogin) / (1000 * 60);
            const timeout = rememberMe ? AUTH_CONFIG.REMEMBER_ME_TIMEOUT : AUTH_CONFIG.SESSION_TIMEOUT;
            const minutesLeft = timeout - minutesDiff;
            
            if (minutesLeft <= warningTime && minutesLeft > 0) {
                this.showTimeoutWarning(Math.ceil(minutesLeft));
            }
        };
        
        // Check session periodically
        setInterval(checkSession, checkInterval);
    }
    
    showTimeoutWarning(minutesLeft) {
        // Check if warning already shown
        if (document.getElementById('session-timeout-warning')) return;
        
        const warning = document.createElement('div');
        warning.id = 'session-timeout-warning';
        warning.className = 'fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm';
        warning.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined">warning</span>
                <div>
                    <p class="font-medium">Session expiring soon</p>
                    <p class="text-sm opacity-90">Your session will expire in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. Click to extend.</p>
                </div>
                <button class="ml-auto text-white hover:text-amber-100" onclick="this.closest('#session-timeout-warning').remove()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;
        
        warning.addEventListener('click', () => {
            this.updateLastActivity();
            warning.remove();
        });
        
        document.body.appendChild(warning);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 30000);
    }
}
