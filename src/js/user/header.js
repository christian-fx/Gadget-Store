/**
 * Go Gadgets — Shared Header Logic
 * Handles: auth-based UI, cart badge, mobile menu, account sidebar, account dropdown
 */
document.addEventListener('DOMContentLoaded', function () {
    // ─── Auth-based header UI ─────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('gadget_user'));
    const isLoggedIn = localStorage.getItem('gadget_is_logged_in') === 'true';

    // Handle account icon visibility + guest auth buttons + dropdown
    const authAccountLink = document.getElementById('authAccountLink');
    if (authAccountLink) {
        if (isLoggedIn && user) {
            // Show the account icon for logged-in users (HTML starts fully hidden)
            authAccountLink.classList.remove('hidden');
            authAccountLink.classList.add('md:flex');

            // ─── Desktop Account Dropdown ─────────────────────────────
            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.className = 'relative hidden md:flex';

            // Move account link into wrapper
            authAccountLink.classList.remove('md:flex');
            authAccountLink.classList.add('flex');
            authAccountLink.parentNode.insertBefore(dropdownWrapper, authAccountLink);
            dropdownWrapper.appendChild(authAccountLink);

            // Create dropdown panel
            const dropdown = document.createElement('div');
            dropdown.id = 'accountDropdown';
            dropdown.className = 'absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 opacity-0 invisible transform scale-95 transition-all duration-200 z-[100]';
            dropdown.innerHTML = `
                <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-sm font-bold text-slate-900">${user.firstName} ${user.lastName}</p>
                    <p class="text-xs text-slate-500 truncate">${user.email}</p>
                </div>
                <nav class="py-1">
                    <a href="/public/users/account.html#overview" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">dashboard</span> Overview
                    </a>
                    <a href="/public/users/account.html#orders" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">shopping_bag</span> Orders
                    </a>
                    <a href="/public/users/account.html#settings" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">settings</span> Settings
                    </a>
                    <a href="/public/users/account.html#wishlist" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">favorite</span> Wishlist
                    </a>
                </nav>
                <div class="border-t border-slate-100 py-1">
                    <button id="dropdownSignOut" class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                        <span class="material-symbols-outlined text-[18px]">logout</span> Sign Out
                    </button>
                </div>
            `;
            dropdownWrapper.appendChild(dropdown);

            // Toggle dropdown on click
            let isDropdownOpen = false;
            authAccountLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isDropdownOpen = !isDropdownOpen;
                if (isDropdownOpen) {
                    dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.add('opacity-100', 'visible', 'scale-100');
                } else {
                    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (isDropdownOpen && !dropdownWrapper.contains(e.target)) {
                    isDropdownOpen = false;
                    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                }
            });

            // Sign Out from dropdown
            dropdown.querySelector('#dropdownSignOut').addEventListener('click', () => {
                localStorage.removeItem('gadget_user');
                localStorage.setItem('gadget_is_logged_in', 'false');
                window.location.href = '/auth.html';
            });

        } else {
            // Keep account icon hidden, inject Sign In / Sign Up buttons instead
            const authBtns = document.createElement('div');
            authBtns.className = 'hidden md:flex items-center gap-2';
            authBtns.innerHTML = `
                <a href="/auth.html" class="px-4 py-1.5 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                    Sign In
                </a>
                <a href="/auth.html" class="px-4 py-1.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors">
                    Sign Up
                </a>
            `;
            authAccountLink.parentNode.insertBefore(authBtns, authAccountLink);
        }
    }

    // ─── Global Cart Badge Logic ──────────────────────────────────────
    function updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (!cartBadge) return;

        try {
            const cart = JSON.parse(localStorage.getItem('gadget_cart')) || [];
            const count = cart.reduce((s, i) => s + i.qty, 0);

            if (count > 0) {
                cartBadge.textContent = count;
                cartBadge.classList.remove('hidden');
                cartBadge.classList.add('flex');
            } else {
                cartBadge.classList.add('hidden');
                cartBadge.classList.remove('flex');
            }
        } catch (e) {
            console.error('Error updating cart badge:', e);
        }
    }

    window.updateCartBadge = updateCartBadge;
    updateCartBadge();

    // ─── Mobile Menu ──────────────────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        // Create overlay + drawer
        const overlay = document.createElement('div');
        overlay.id = 'mobileMenuOverlay';
        overlay.className = 'fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm hidden transition-opacity opacity-0';
        overlay.style.transition = 'opacity 0.2s ease';

        // Detect if we are on the account page
        const isAccountPage = window.location.pathname.includes('account');

        // Always show account sub-links for logged-in users (on ALL pages)
        const accountLinks = isLoggedIn && user ? `
            <div class="border-t border-slate-100 pt-4 mt-2">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Account</p>
                <a href="/public/users/account.html#overview" data-tab="overview" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors mobile-account-link">
                    <span class="material-symbols-outlined text-[20px]">dashboard</span> Overview
                </a>
                <a href="/public/users/account.html#orders" data-tab="orders" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors mobile-account-link">
                    <span class="material-symbols-outlined text-[20px]">shopping_bag</span> Orders
                </a>
                <a href="/public/users/account.html#settings" data-tab="settings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors mobile-account-link">
                    <span class="material-symbols-outlined text-[20px]">settings</span> Settings
                </a>
                <a href="/public/users/account.html#wishlist" data-tab="wishlist" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors mobile-account-link">
                    <span class="material-symbols-outlined text-[20px]">favorite</span> Wishlist
                </a>
                <div class="border-t border-slate-100 mt-2 pt-2">
                    <button id="mobileSignOut" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full">
                        <span class="material-symbols-outlined text-[20px]">logout</span> Sign Out
                    </button>
                </div>
            </div>
        ` : '';

        const authButton = isLoggedIn && user
            ? `<a href="/public/users/account.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">person</span> My Account
               </a>`
            : `<a href="/auth.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">login</span> Sign In
               </a>
               <a href="/auth.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">person_add</span> Sign Up
               </a>`;

        const drawer = document.createElement('div');
        drawer.id = 'mobileMenuDrawer';
        drawer.className = 'fixed top-0 right-0 z-[70] w-72 max-w-[80vw] h-full bg-white shadow-2xl transform translate-x-full transition-transform duration-300 ease-out';
        drawer.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-slate-100">
                <a href="/" class="flex items-center gap-2 text-primary font-bold">
                    <span class="material-symbols-outlined text-[24px]">bolt</span>
                    Go Gadgets
                </a>
                <button id="mobileMenuClose" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <span class="material-symbols-outlined text-[22px]">close</span>
                </button>
            </div>
            <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 60px);">
                <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">storefront</span> Store
                </a>
                <a href="/public/users/cart.html" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">shopping_bag</span> Cart
                    <span id="mobileCartCount" class="ml-auto text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
                </a>
                ${authButton}
                ${accountLinks}
            </nav>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        // Update mobile cart count
        function updateMobileCartCount() {
            const badge = document.getElementById('mobileCartCount');
            if (!badge) return;
            try {
                const cart = JSON.parse(localStorage.getItem('gadget_cart')) || [];
                const count = cart.reduce((s, i) => s + i.qty, 0);
                if (count > 0) {
                    badge.textContent = count;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            } catch (e) { }
        }
        updateMobileCartCount();

        // Toggle
        function openMobileMenu() {
            overlay.classList.remove('hidden');
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                overlay.classList.add('opacity-100');
                drawer.classList.remove('translate-x-full');
            });
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
            drawer.classList.add('translate-x-full');
            setTimeout(() => {
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, 200);
        }

        mobileMenuBtn.addEventListener('click', openMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);
        document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);

        // Handle account sub-page links in mobile menu
        const mobileAccountLinks = drawer.querySelectorAll('.mobile-account-link');
        mobileAccountLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If we're already on the account page, just switch the tab
                if (isAccountPage) {
                    e.preventDefault();
                    const tab = link.getAttribute('data-tab');
                    // Trigger the same tab switching as the desktop sidebar
                    const desktopLink = document.querySelector(`#accountNav a[data-tab="${tab}"]`);
                    if (desktopLink) desktopLink.click();
                    closeMobileMenu();
                    // Update URL hash
                    window.location.hash = tab;
                }
                // Otherwise, let the link navigate normally to account.html#tab
            });
        });

        // Mobile sign out button
        const mobileSignOutBtn = document.getElementById('mobileSignOut');
        if (mobileSignOutBtn) {
            mobileSignOutBtn.addEventListener('click', () => {
                localStorage.removeItem('gadget_user');
                localStorage.setItem('gadget_is_logged_in', 'false');
                window.location.href = '/auth.html';
            });
        }
    }
});
