
// AUTH GUARD FOR DASHBOARD PAGES
// =============================================

const AUTH_CONFIG = {
    STORAGE_KEYS: {
        USERS: 'gadget_users',
        CURRENT_USER: 'gadget_user',
        IS_LOGGED_IN: 'gadget_is_logged_in',
        REMEMBER_ME: 'gadget_remember_me'
    }
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

        // Check admin access for admin pages
        if (this.isAdminPage() && !this.isAdmin()) {
            this.redirectToLogin('admin=required');
            return;
        }

        // Update user info in UI if needed
        this.updateUIWithUserInfo();
    }

    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    }

    // Session timeout removed to prevent login loops

    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'super_admin' || user.userType === 'staff');
    }

    isAdminPage() {
        const adminPages = [
            'dashboard.html',
            'products.html',
            'categories.html',
            'inventory.html',
            'orders.html',
            'settings.html',
            'customer.html'
        ];

        const currentPage = window.location.pathname.split('/').pop();
        return adminPages.includes(currentPage);
    }

    // hasPageAccess removed - not needed without session management

    // updateLastActivity and updateUserInStorage removed - not needed without session timeout

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
                window.location.href = '/src/js/admin/dashboard.js';
            } else {
                window.location.href = '/auth.html';
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
            roleBadge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' || user.userType === 'staff'
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

    // Session timeout warnings removed
}
