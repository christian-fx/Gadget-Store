// Admin Guard for authentication and authorization
class AdminGuard {
  constructor() {
    this.storageKeys = {
      IS_LOGGED_IN: 'gadget_is_logged_in',
      CURRENT_USER: 'gadget_user',
      REMEMBER_ME: 'gadget_remember_me'
    };

    this.adminPages = ['dashboard.html', 'products.html', 'categories.html', 'inventory.html', 'orders.html', 'settings.html', 'customer.html'];
    this.currentPage = window.location.pathname.split('/').pop();

    this.init();
  }

  init() {
    this.checkAuthentication();
    this.checkAdminAccess();
    this.setupLogout();
  }

  // Check if user is authenticated
  checkAuthentication() {
    const isLoggedIn = localStorage.getItem(this.storageKeys.IS_LOGGED_IN) === 'true';
    const currentUser = JSON.parse(localStorage.getItem(this.storageKeys.CURRENT_USER) || 'null');

    if (!isLoggedIn || !currentUser) {
      // Redirect to login page with redirect parameter
      const redirect = encodeURIComponent(this.currentPage);
      window.location.href = `/auth.html?index=required&redirect=${redirect}`;
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
        window.location.href = `/auth.html?admin=required&redirect=${redirect}`;
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

  // Session activity tracking removed to prevent login loops

  // Session timeout warnings removed

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
    window.location.href = '/auth.html?logout=true';
  }

  // Check if user is logged in (static method)
  static isLoggedIn() {
    return localStorage.getItem('gadget_is_logged_in') === 'true';
  }

  // Get current user (static method)
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('gadget_user') || 'null');
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

  // Make AdminGuard available globally
  window.AdminGuard = AdminGuard;
});