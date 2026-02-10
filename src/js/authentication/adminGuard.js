// Admin Guard for authentication and authorization
class AdminGuard {
  constructor() {
    this.storageKeys = {
      IS_LOGGED_IN: 'gadgetstore_is_logged_in',
      CURRENT_USER: 'gadgetstore_current_user',
      REMEMBER_ME: 'gadgetstore_remember_me',
      LAST_ACTIVITY: 'gadgetstore_last_activity'
    };

    this.adminPages = ['dashboard.html', 'product.html', 'categories.html', 'inventory.html', 'orders.html', 'settings.html', 'customer.html'];
    this.currentPage = window.location.pathname.split('/').pop();

    this.init();
  }

  init() {
    this.checkAuthentication();
    this.checkAdminAccess();
    this.setupActivityTracking();
    this.setupLogout();
  }

  // Check if user is authenticated
  checkAuthentication() {
    const isLoggedIn = localStorage.getItem(this.storageKeys.IS_LOGGED_IN) === 'true';
    const currentUser = JSON.parse(localStorage.getItem(this.storageKeys.CURRENT_USER) || 'null');

    if (!isLoggedIn || !currentUser) {
      // Redirect to login page with redirect parameter
      const redirect = encodeURIComponent(this.currentPage);
      window.location.href = `/index.html?index=required&redirect=${redirect}`;
      return;
    }

    // Update user info in UI
    this.updateUserUI(currentUser);
  }

  // Check if user has admin access for admin pages
  checkAdminAccess() {
    if (this.adminPages.includes(this.currentPage)) {
      const currentUser = JSON.parse(localStorage.getItem(this.storageKeys.CURRENT_USER) || 'null');
      const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.userType === 'staff');

      if (!isAdmin) {
        const redirect = encodeURIComponent(this.currentPage);
        window.location.href = `/index.html?admin=required&redirect=${redirect}`;
        return;
      }
    }
  }

  // Update user interface with user information
  updateUserUI(user) {
    if (!user) return;

    // Update user name in header
    const userElements = document.querySelectorAll('.user-name, .user-fullname');
    userElements.forEach(el => {
      if (el.classList.contains('user-fullname')) {
        el.textContent = `${user.firstName} ${user.lastName}`;
      } else {
        el.textContent = user.firstName;
      }
    });

    // Update user role
    const roleElements = document.querySelectorAll('.user-role');
    roleElements.forEach(el => {
      const role = user.role === 'admin' || user.userType === 'staff' ? 'Admin' : 'Customer';
      el.textContent = role;
    });

    // Update user email
    const emailElements = document.querySelectorAll('.user-email');
    emailElements.forEach(el => {
      el.textContent = user.email;
    });
  }

  // Setup session activity tracking
  setupActivityTracking() {
    // Update last activity timestamp
    const updateActivity = () => {
      localStorage.setItem(this.storageKeys.LAST_ACTIVITY, new Date().getTime().toString());
    };

    // Check session timeout
    const checkSessionTimeout = () => {
      const lastLogin = localStorage.getItem(this.storageKeys.LAST_ACTIVITY);
      if (lastLogin) {
        const now = new Date().getTime();
        const lastActivity = parseInt(lastLogin);
        const timeout = 30 * 60 * 1000; // 30 minutes

        if (now - lastActivity > timeout) {
          // Session expired
          this.logout();
          window.location.href = '/index.html?session=expired';
        }
      }
      updateActivity();
    };

    // Initial check
    checkSessionTimeout();

    // Update activity on user interaction
    document.addEventListener('click', checkSessionTimeout);
    document.addEventListener('keypress', checkSessionTimeout);

    // Periodic check every minute
    setInterval(checkSessionTimeout, 60000);
  }

  // Setup session timeout warnings
  setupSessionTimeoutWarning() {
    const warningTime = 5 * 60 * 1000; // 5 minutes warning
    const totalTimeout = 30 * 60 * 1000; // 30 minutes total

    setInterval(() => {
      const lastActivity = localStorage.getItem(this.storageKeys.LAST_ACTIVITY);
      if (lastActivity) {
        const now = new Date().getTime();
        const elapsed = now - parseInt(lastActivity);
        const remaining = totalTimeout - elapsed;

        if (remaining > 0 && remaining <= warningTime) {
          this.showSessionWarning(remaining);
        }
      }
    }, 60000); // Check every minute
  }

  // Show session timeout warning
  showSessionWarning(remainingTime) {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    // Check if warning already exists
    if (document.getElementById('sessionWarning')) return;

    const warning = document.createElement('div');
    warning.id = 'sessionWarning';
    warning.className = 'fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
    warning.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined">warning</span>
                <div>
                    <p class="font-medium">Session Expiring Soon</p>
                    <p class="text-sm opacity-90">Your session will expire in ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                </div>
                <button onclick="this.closest('#sessionWarning').remove()" class="ml-4 text-white hover:text-amber-100">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;

    document.body.appendChild(warning);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (warning.parentNode) {
        warning.remove();
      }
    }, 10000);
  }

  // Setup logout functionality
  setupLogout() {
    const logoutButtons = document.querySelectorAll('.logout-btn, [href="#logout"]');
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    });
  }

  // Logout user
  logout() {
    // Clear auth data
    localStorage.setItem(this.storageKeys.IS_LOGGED_IN, 'false');
    localStorage.removeItem(this.storageKeys.CURRENT_USER);
    localStorage.setItem(this.storageKeys.REMEMBER_ME, 'false');

    // Redirect to login page
    window.location.href = '/index.html?logout=true';
  }

  // Check if user is logged in (static method)
  static isLoggedIn() {
    return localStorage.getItem('gadgetstore_is_logged_in') === 'true';
  }

  // Get current user (static method)
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('gadgetstore_current_user') || 'null');
  }

  // Check if current user is admin (static method)
  static isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'super_admin' || user.userType === 'staff');
  }
}

// Initialize admin guard when page loads
document.addEventListener('DOMContentLoaded', function () {
  const adminGuard = new AdminGuard();

  // Optional: Setup session timeout warnings
  adminGuard.setupSessionTimeoutWarning();

  // Make AdminGuard available globally
  window.AdminGuard = AdminGuard;
});