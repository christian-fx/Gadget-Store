
// AUTHENTICATION CONFIGURATION
// =============================================
const AUTH_CONFIG = {
    // Admin Credentials (HARDCODED - For demo only)
    ADMIN_EMAIL: "akabuezechris432@gmail.com",
    ADMIN_PASSWORD: "Naomie@18",
    ADMIN_KEY: "GADGET@ADMIN#2024!SECURE!KEY",

    // Default Admin User (will be created in localStorage)
    DEFAULT_ADMIN: {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "akabuezechris432@gmail.com",
        password: "Naomie@18",
        phone: "",
        userType: "admin",
        role: "super_admin",
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true
    },

    // Storage Keys
    STORAGE_KEYS: {
        USERS: 'gadgetstore_users',
        CURRENT_USER: 'gadgetstore_current_user',
        IS_LOGGED_IN: 'gadgetstore_is_logged_in',
        REMEMBER_ME: 'gadgetstore_remember_me'
    },

    // Session Timeout (in minutes)
    SESSION_TIMEOUT: 60, // 60 minutes
    REMEMBER_ME_TIMEOUT: 30 * 24 * 60 // 30 days in minutes
};

// =============================================
// AUTHENTICATION SERVICE
// =============================================
class AuthService {
    constructor() {
        this.initStorage();
    }

    // Initialize localStorage with default admin user
    initStorage() {
        // Initialize users storage if empty
        if (!localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USERS)) {
            const defaultUsers = [AUTH_CONFIG.DEFAULT_ADMIN];
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
        }

        // Initialize other auth storage
        if (!localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN)) {
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'false');
        }

        if (!localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME)) {
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, 'false');
        }

        // Check if user is already logged in (via session/remember me)
        this.checkExistingSession();
    }

    // Check for existing valid session
    checkExistingSession() {
        const isLoggedIn = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
        const rememberMe = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME) === 'true';
        const currentUser = this.getCurrentUser();

        if (isLoggedIn && currentUser && rememberMe) {
            // Check if session is still valid
            const lastLogin = new Date(currentUser.lastLogin);
            const now = new Date();
            const minutesDiff = (now - lastLogin) / (1000 * 60);

            if (minutesDiff < AUTH_CONFIG.REMEMBER_ME_TIMEOUT) {
                // Session is valid, redirect to dashboard
                this.redirectToDashboard(currentUser);
            } else {
                // Session expired, log out
                this.logout();
            }
        } else if (isLoggedIn && currentUser) {
            // Normal session (no remember me)
            const lastLogin = new Date(currentUser.lastLogin);
            const now = new Date();
            const minutesDiff = (now - lastLogin) / (1000 * 60);

            if (minutesDiff < AUTH_CONFIG.SESSION_TIMEOUT) {
                // Session is valid, redirect to dashboard
                this.redirectToDashboard(currentUser);
            } else {
                // Session expired, log out
                this.logout();
            }
        }
    }

    // Get all users
    getUsers() {
        return JSON.parse(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USERS)) || [];
    }

    // Save users
    saveUsers(users) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    // Login function
    login(email, password, adminKey = null, rememberMe = false) {
        // Simulate API delay for demo purposes
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getUsers();

                // Find user by email
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (!user) {
                    resolve({
                        success: false,
                        message: "User not found. Please check your email."
                    });
                    return;
                }

                // Check if account is active
                if (user.isActive === false) {
                    resolve({
                        success: false,
                        message: "Your account has been deactivated. Please contact support."
                    });
                    return;
                }

                // Verify password
                if (user.password !== password) {
                    resolve({
                        success: false,
                        message: "Invalid password. Please try again."
                    });
                    return;
                }

                // Check for admin access
                const isAdminLogin = email.toLowerCase() === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase();

                if (isAdminLogin) {
                    // Verify admin credentials
                    if (email !== AUTH_CONFIG.ADMIN_EMAIL || password !== AUTH_CONFIG.ADMIN_PASSWORD) {
                        resolve({
                            success: false,
                            message: "Invalid admin credentials."
                        });
                        return;
                    }

                    // Verify admin key if provided
                    if (adminKey && adminKey !== AUTH_CONFIG.ADMIN_KEY) {
                        resolve({
                            success: false,
                            message: "Invalid admin key. Access denied."
                        });
                        return;
                    }

                    // Admin login successful
                    user.lastLogin = new Date().toISOString();
                    user.role = "admin"; // Ensure role is set
                    this.updateUser(user);

                    // Store login state
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'true');
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
                    this.setCurrentUser(user);

                    resolve({
                        success: true,
                        message: "Admin login successful!",
                        user: user,
                        isAdmin: true,
                        redirectTo: "/public/admin/dashboard.html"
                    });
                } else {
                    // Regular user login
                    user.lastLogin = new Date().toISOString();
                    this.updateUser(user);

                    // Store login state
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'true');
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
                    this.setCurrentUser(user);

                    resolve({
                        success: true,
                        message: "Login successful!",
                        user: user,
                        isAdmin: user.userType === 'staff' || user.role === 'admin',
                        redirectTo: user.userType === 'staff' ? "/public/admin/dashboard.html" : "/index.html"
                    });
                }
            }, 1000); // Simulate 1 second delay
        });
    }

    // Register new user
    register(userData) {
        // Simulate API delay for demo purposes
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getUsers();

                // Check if email already exists
                const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
                if (existingUser) {
                    resolve({
                        success: false,
                        message: "Email already registered. Please use a different email or sign in."
                    });
                    return;
                }

                // Create new user (all new users are customers by default)
                const newUser = {
                    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone || "",
                    userType: "customer", // All new sign-ups are customers
                    role: "customer", // All new sign-ups are customers
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    isActive: true
                };

                // Add to users array
                users.push(newUser);
                this.saveUsers(users);

                resolve({
                    success: true,
                    message: "Account created successfully!",
                    user: newUser
                });
            }, 1000); // Simulate 1 second delay
        });
    }

    // Update user data
    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);

        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            this.saveUsers(users);

            // Update current user if it's the same user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                this.setCurrentUser(users[index]);
            }
        }
    }

    // Logout function
    logout() {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, 'false');
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.CURRENT_USER);
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, 'false');

        // Redirect to login page
        window.location.href = "index.html";
    }

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    }

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'super_admin' || user.userType === 'staff');
    }

    // Redirect to dashboard based on user role
    redirectToDashboard(user) {
        if (user.role === 'admin' || user.role === 'super_admin' || user.userType === 'staff') {
            window.location.href = "/public/admin/dashboard.html";
        } else {
            window.location.href = "/public/index.html";
        }
    }

    // Password validation
    validatePassword(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength,
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            suggestions: this.getPasswordSuggestions(password)
        };
    }

    getPasswordSuggestions(password) {
        const suggestions = [];

        if (password.length < 6) {
            suggestions.push("Use at least 6 characters");
        }
        if (!/[A-Z]/.test(password)) {
            suggestions.push("Add an uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
            suggestions.push("Add a lowercase letter");
        }
        if (!/\d/.test(password)) {
            suggestions.push("Add a number");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            suggestions.push("Add a special character");
        }

        return suggestions;
    }
}

// =============================================
// NOTIFICATION SERVICE
// =============================================
class NotificationService {
    constructor() {
        this.toastContainer = document.getElementById('toastContainer');
    }

    showToast(message, type = 'success', duration = 3000) {
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `mb-2 px-4 py-3 rounded-lg shadow-lg animate-slide-down relative overflow-hidden ${type === 'success' ? 'bg-emerald-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
            }`;

        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined">
                        ${type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span class="text-sm">${message}</span>
                </div>
                <button type="button" class="toast-close-btn ml-2 text-white hover:text-gray-200 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
            <div class="toast-progress-bar" style="animation-duration: ${duration}ms"></div>
        `;

        this.toastContainer.appendChild(toast);

        // Add close button functionality
        const closeBtn = toast.querySelector('.toast-close-btn');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toastId);
        });

        // Remove toast after duration
        const timer = setTimeout(() => {
            this.removeToast(toastId);
        }, duration);

        // Store timer reference for manual dismissal
        toast._timer = timer;

        return toast;
    }

    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            if (toast._timer) {
                clearTimeout(toast._timer);
            }
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    shakeElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('animate-shake');
            setTimeout(() => {
                element.classList.remove('animate-shake');
            }, 500);
        }
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            this.shakeElement(fieldId);
        }
    }

    clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('[id$="-error"]');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.add('hidden');
        });
    }
}

// =============================================
// FORM SUBMISSION HELPERS
// =============================================
class FormHelper {
    static showLoading(button, textElement, iconElement, spinnerElement) {
        button.disabled = true;
        button.classList.add('btn-disabled');

        if (textElement) {
            textElement.style.opacity = '0.7';
        }

        if (iconElement) {
            iconElement.classList.add('hidden');
        }

        if (spinnerElement) {
            spinnerElement.classList.remove('hidden');
        }
    }

    static hideLoading(button, textElement, iconElement, spinnerElement) {
        button.disabled = false;
        button.classList.remove('btn-disabled');

        if (textElement) {
            textElement.style.opacity = '1';
        }

        if (iconElement) {
            iconElement.classList.remove('hidden');
        }

        if (spinnerElement) {
            spinnerElement.classList.add('hidden');
        }
    }
}

// =============================================
// MAIN APPLICATION INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize services
    const authService = new AuthService();
    const notificationService = new NotificationService();

    // DOM Elements
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const switchToSignupButtons = document.querySelectorAll('.switch-to-signup');
    const switchToSigninButtons = document.querySelectorAll('.switch-to-signin');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const adminKeyContainer = document.getElementById('admin-key-container');

    // Button elements for loading states
    const signInButton = document.getElementById('signInButton');
    const signInText = document.getElementById('signInText');
    const signInIcon = document.getElementById('signInIcon');
    const signInSpinner = document.getElementById('signInSpinner');

    const signUpButton = document.getElementById('signUpButton');
    const signUpText = document.getElementById('signUpText');
    const signUpSpinner = document.getElementById('signUpSpinner');

    // Auto-fill admin credentials for testing (REMOVE IN PRODUCTION)
    function autoFillAdminCredentials() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('demo') === 'admin') {
            document.getElementById('signin-email').value = AUTH_CONFIG.ADMIN_EMAIL;
            document.getElementById('signin-password').value = AUTH_CONFIG.ADMIN_PASSWORD;

            notificationService.showToast('Admin credentials loaded for demo', 'success');
        }
    }

    // Show/hide admin key field based on email
    function checkAdminLogin() {
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;

        const isAdminEmail = email.toLowerCase() === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase();
        const isAdminPassword = password === AUTH_CONFIG.ADMIN_PASSWORD;

        if (isAdminEmail && isAdminPassword) {
            // Show admin key field
            adminKeyContainer.classList.remove('hidden');
            notificationService.clearFieldError('admin-key');
        } else {
            // Hide admin key field
            adminKeyContainer.classList.add('hidden');
            document.getElementById('admin-key').value = '';
        }
    }

    // Switch to Sign Up
    function showSignUp() {
        signInTab.classList.remove('border-primary', 'text-[#111618]', 'dark:text-white');
        signInTab.classList.add('border-transparent', 'text-[#617f89]', 'dark:text-gray-400');

        signUpTab.classList.remove('border-transparent', 'text-[#617f89]', 'dark:text-gray-400');
        signUpTab.classList.add('border-primary', 'text-[#111618]', 'dark:text-white');

        signInForm.classList.add('hidden');
        signUpForm.classList.remove('hidden');

        // Clear sign in form and errors
        signInForm.reset();
        notificationService.clearAllErrors();
        adminKeyContainer.classList.add('hidden');

        // Reset sign in button loading state
        FormHelper.hideLoading(signInButton, signInText, signInIcon, signInSpinner);
    }

    // Switch to Sign In
    function showSignIn() {
        signUpTab.classList.remove('border-primary', 'text-[#111618]', 'dark:text-white');
        signUpTab.classList.add('border-transparent', 'text-[#617f89]', 'dark:text-gray-400');

        signInTab.classList.remove('border-transparent', 'text-[#617f89]', 'dark:text-gray-400');
        signInTab.classList.add('border-primary', 'text-[#111618]', 'dark:text-white');

        signUpForm.classList.add('hidden');
        signInForm.classList.remove('hidden');

        // Clear sign up form and errors
        signUpForm.reset();
        notificationService.clearAllErrors();

        // Reset sign up button loading state
        FormHelper.hideLoading(signUpButton, signUpText, null, signUpSpinner);
    }

    // Toggle password visibility
    function setupPasswordToggles() {
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function () {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('span');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = 'visibility_off';
                } else {
                    input.type = 'password';
                    icon.textContent = 'visibility';
                }
            });
        });
    }

    // Form validation helpers
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true; // Phone is optional
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Sign In Form Handler
    function setupSignInForm() {
        // Real-time admin check on email/password change
        document.getElementById('signin-email').addEventListener('input', checkAdminLogin);
        document.getElementById('signin-password').addEventListener('input', checkAdminLogin);

        signInForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear previous errors
            notificationService.clearAllErrors();

            const email = document.getElementById('signin-email').value.trim();
            const password = document.getElementById('signin-password').value;
            const adminKey = document.getElementById('admin-key').value;
            const rememberMe = document.getElementById('remember-me').checked;
            let isValid = true;

            // Validation
            if (!email) {
                notificationService.showFieldError('signin-email', 'Email is required.');
                isValid = false;
            } else if (!validateEmail(email)) {
                notificationService.showFieldError('signin-email', 'Please enter a valid email address.');
                isValid = false;
            }

            if (!password) {
                notificationService.showFieldError('signin-password', 'Password is required.');
                isValid = false;
            }

            // Check if admin key is required and provided
            const isAdminEmail = email.toLowerCase() === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase();
            const isAdminPassword = password === AUTH_CONFIG.ADMIN_PASSWORD;

            if (isAdminEmail && isAdminPassword && !adminKey) {
                notificationService.showFieldError('admin-key', 'Admin key is required for admin access.');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            FormHelper.showLoading(signInButton, signInText, signInIcon, signInSpinner);

            try {
                // Attempt login
                const result = await authService.login(email, password, adminKey, rememberMe);

                if (result.success) {
                    // Show success toast
                    if (result.isAdmin) {
                        notificationService.showToast('Welcome back admin.', 'success');
                    } else {
                        notificationService.showToast('Welcome back, sign in successful.', 'success');
                    }

                    // Redirect after short delay
                    setTimeout(() => {
                        authService.redirectToDashboard(result.user);
                    }, 3000);
                } else {
                    // Hide loading state
                    FormHelper.hideLoading(signInButton, signInText, signInIcon, signInSpinner);

                    // Show field-specific errors
                    if (result.message.includes('email') || result.message.includes('User not found')) {
                        notificationService.showFieldError('signin-email', result.message);
                    } else if (result.message.includes('password') || result.message.includes('Invalid password')) {
                        notificationService.showFieldError('signin-password', result.message);
                    } else if (result.message.includes('admin key') || result.message.includes('Access denied')) {
                        notificationService.showFieldError('admin-key', result.message);
                    } else {
                        // Generic error for other cases
                        notificationService.showFieldError('signin-password', result.message);
                    }

                    // Shake the form for visual feedback
                    signInForm.classList.add('animate-shake');
                    setTimeout(() => {
                        signInForm.classList.remove('animate-shake');
                    }, 500);
                }
            } catch (error) {
                // Hide loading state
                FormHelper.hideLoading(signInButton, signInText, signInIcon, signInSpinner);

                notificationService.showToast('An error occurred during login. Please try again.', 'error');
                console.error('Login error:', error);
            }
        });
    }

    // Sign Up Form Handler
    function setupSignUpForm() {
        signUpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear previous errors
            notificationService.clearAllErrors();

            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            let isValid = true;

            // Validation
            if (!firstName) {
                notificationService.showFieldError('first-name', 'First name is required.');
                isValid = false;
            }

            if (!lastName) {
                notificationService.showFieldError('last-name', 'Last name is required.');
                isValid = false;
            }

            if (!email) {
                notificationService.showFieldError('signup-email', 'Email is required.');
                isValid = false;
            } else if (!validateEmail(email)) {
                notificationService.showFieldError('signup-email', 'Please enter a valid email address.');
                isValid = false;
            }

            if (phone && !validatePhone(phone)) {
                notificationService.showFieldError('phone', 'Please enter a valid phone number.');
                isValid = false;
            }

            if (!password) {
                notificationService.showFieldError('signup-password', 'Password is required.');
                isValid = false;
            } else {
                const passwordValidation = authService.validatePassword(password);
                if (!passwordValidation.isValid) {
                    notificationService.showFieldError('signup-password', `Password must be at least ${passwordValidation.minLength} characters long.`);
                    isValid = false;
                }
            }

            if (!confirmPassword) {
                notificationService.showFieldError('confirm-password', 'Please confirm your password.');
                isValid = false;
            } else if (password !== confirmPassword) {
                notificationService.showFieldError('confirm-password', 'Passwords do not match.');
                isValid = false;
            }

            if (!terms) {
                notificationService.showFieldError('terms', 'You must agree to the Terms of Service and Privacy Policy.');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            FormHelper.showLoading(signUpButton, signUpText, null, signUpSpinner);

            // Create user data (all new users are customers)
            const userData = {
                firstName,
                lastName,
                email,
                phone,
                password
            };

            try {
                // Attempt registration
                const result = await authService.register(userData);

                if (result.success) {
                    // Show success toast
                    notificationService.showToast('Account created successfully!', 'success');

                    // Hide loading state
                    FormHelper.hideLoading(signUpButton, signUpText, null, signUpSpinner);

                    // Auto-login after registration
                    setTimeout(async () => {
                        // Show loading state for auto-login
                        FormHelper.showLoading(signInButton, signInText, signInIcon, signInSpinner);

                        const loginResult = await authService.login(email, password);
                        if (loginResult.success) {
                            notificationService.showToast('Welcome back, sign in successful.', 'success');
                            authService.redirectToDashboard(loginResult.user);
                        } else {
                            FormHelper.hideLoading(signInButton, signInText, signInIcon, signInSpinner);
                            showSignIn();
                            notificationService.showToast('Please sign in with your new account', 'success');
                        }
                    }, 3000);

                    // Clear form
                    signUpForm.reset();
                } else {
                    // Hide loading state
                    FormHelper.hideLoading(signUpButton, signUpText, null, signUpSpinner);

                    // Show email error if email already exists
                    if (result.message.includes('Email already')) {
                        notificationService.showFieldError('signup-email', result.message);
                    } else {
                        // Generic error
                        notificationService.showToast(result.message, 'error');
                    }
                }
            } catch (error) {
                // Hide loading state
                FormHelper.hideLoading(signUpButton, signUpText, null, signUpSpinner);

                notificationService.showToast('An error occurred during registration. Please try again.', 'error');
                console.error('Registration error:', error);
            }
        });
    }

    // Forgot Password Handler
    function setupForgotPassword() {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value.trim();

            if (!email || !validateEmail(email)) {
                notificationService.showFieldError('signin-email', 'Please enter a valid email address to reset your password.');
                return;
            }

            // Simulate API call
            FormHelper.showLoading(signInButton, signInText, signInIcon, signInSpinner);

            setTimeout(() => {
                FormHelper.hideLoading(signInButton, signInText, signInIcon, signInSpinner);

                // In a real app, you would send a password reset email
                notificationService.showToast(`A password reset link has been sent to ${email}. Please check your inbox.`, 'success');
            }, 3000);
        });
    }

    // Initialize all event listeners
    function initEventListeners() {
        // Tab switching
        signInTab.addEventListener('click', showSignIn);
        signUpTab.addEventListener('click', showSignUp);

        // Switch buttons
        switchToSignupButtons.forEach(button => {
            button.addEventListener('click', showSignUp);
        });

        switchToSigninButtons.forEach(button => {
            button.addEventListener('click', showSignIn);
        });

        // Password toggles
        setupPasswordToggles();

        // Form submissions
        setupSignInForm();
        setupSignUpForm();

        // Forgot password
        setupForgotPassword();

        // Auto-fill admin credentials for demo
        autoFillAdminCredentials();
    }

    // Initialize the application
    initEventListeners();

    // Show sign in form by default
    showSignIn();

    // Check URL parameters for actions
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for logout parameter
        if (urlParams.get('logout') === 'true') {
            authService.logout();
        }

        // Check for expired session
        if (urlParams.get('session') === 'expired') {
            notificationService.showToast('Your session has expired. Please sign in again.', 'error');
        }

        // Check for unauthorized access
        if (urlParams.get('auth') === 'required') {
            notificationService.showToast('Please sign in to access this page.', 'error');
        }

        // Check for admin access required
        if (urlParams.get('admin') === 'required') {
            notificationService.showToast('This page requires admin privileges.', 'error');
        }
    }

    checkUrlParams();
});
