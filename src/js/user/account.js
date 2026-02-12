/**
 * Go Gadgets — Account Page JS
 * Manages user profile, orders, and settings.
 */
(() => {
    const $ = id => document.getElementById(id);
    const USER_KEY = 'gadget_user';
    const USERS_KEY = 'gadget_users';
    const ORDERS_KEY = 'gadget_orders';

    // ─── Auth Guard ───────────────────────────────────────────────────
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    if (!user) {
        window.location.href = '/auth.html';
        return;
    }

    // Ensure arrays exist
    if (!user.addresses) user.addresses = [];
    if (!user.paymentMethods) user.paymentMethods = [];

    // State
    let isEditingProfile = false;
    let pendingDelete = null; // { type: 'address'|'payment', id: string }

    // ─── Persistence Helper ───────────────────────────────────────────
    function saveUser() {
        // Save to current session
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Sync with users array
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...user };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    }

    // ─── Render Profile ───────────────────────────────────────────────
    function renderProfile() {
        $('displayName').textContent = `${user.firstName} ${user.lastName}`;
        $('displayEmail').textContent = user.email;

        $('firstName').value = user.firstName || '';
        $('lastName').value = user.lastName || '';
        $('emailField').value = user.email || '';
        $('phoneField').value = user.phone || '';

        // Reset edit state UI
        toggleEditUI(false);
    }

    function toggleEditUI(isEditing) {
        isEditingProfile = isEditing;
        const inputs = ['firstName', 'lastName', 'emailField', 'phoneField'];
        const saveBtn = $('saveBtn');
        const editBtn = $('editProfileBtn');

        inputs.forEach(id => {
            const el = $(id);
            if (isEditing) el.removeAttribute('disabled');
            else el.setAttribute('disabled', 'true');
        });

        if (isEditing) {
            saveBtn.classList.remove('hidden');
            editBtn.textContent = 'Cancel';
            editBtn.classList.replace('text-primary', 'text-red-500');
        } else {
            saveBtn.classList.add('hidden');
            editBtn.textContent = 'Edit Profile';
            editBtn.classList.replace('text-red-500', 'text-primary'); // Handle both cases safely
            if (editBtn.classList.contains('text-red-500')) editBtn.classList.remove('text-red-500'); // duplicate safety
            editBtn.classList.add('text-primary');
        }
    }

    // ─── Address Logic ────────────────────────────────────────────────
    function renderAddresses() {
        const container = $('addressList');
        container.innerHTML = '';

        if (user.addresses.length === 0) {
            container.innerHTML = '<p class="text-sm text-slate-500 italic">No addresses saved.</p>';
            return;
        }

        user.addresses.forEach(addr => {
            const isDefault = addr.isDefault;
            const item = document.createElement('div');
            item.className = 'flex items-start gap-3 p-4 border border-slate-200 rounded-xl';
            item.innerHTML = `
                <div class="mt-0.5 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-slate-500 text-[20px]">location_on</span>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-0.5">
                        <span class="text-sm font-semibold text-slate-900">${addr.label}</span>
                        ${isDefault ? '<span class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">Default</span>' : ''}
                    </div>
                    <p class="text-sm text-slate-600">${addr.street}</p>
                    <p class="text-sm text-slate-600">${addr.city}, ${addr.state} ${addr.zip}</p>
                </div>
                <div class="flex flex-col gap-1">
                    <button class="text-xs text-primary hover:underline font-medium edit-addr-btn" data-id="${addr.id}">Edit</button>
                    ${!isDefault ? `<button class="text-xs text-red-500 hover:underline font-medium delete-addr-btn" data-id="${addr.id}">Remove</button>` : ''}
                </div>
            `;
            container.appendChild(item);
        });

        // Bind events
        container.querySelectorAll('.edit-addr-btn').forEach(btn => {
            btn.addEventListener('click', () => openAddressModal(btn.dataset.id));
        });
        container.querySelectorAll('.delete-addr-btn').forEach(btn => {
            btn.addEventListener('click', () => confirmDelete('address', btn.dataset.id));
        });
    }

    function openAddressModal(id = null) {
        const modal = $('addressModal');
        const form = $('addressForm');
        form.reset();

        if (id) {
            const addr = user.addresses.find(a => a.id === id);
            if (addr) {
                $('addressId').value = addr.id;
                $('addrLabel').value = addr.label;
                $('addrStreet').value = addr.street;
                $('addrCity').value = addr.city;
                $('addrState').value = addr.state;
                $('addrZip').value = addr.zip;
                $('addrDefault').checked = addr.isDefault;
                $('addressModalTitle').textContent = 'Edit Address';
            }
        } else {
            $('addressId').value = '';
            $('addressModalTitle').textContent = 'Add New Address';
        }

        modal.classList.remove('hidden');
    }

    // ─── Payment Logic ────────────────────────────────────────────────
    function renderPayments() {
        const container = $('paymentList');
        container.innerHTML = '';

        if (user.paymentMethods.length === 0) {
            container.innerHTML = '<p class="text-sm text-slate-500 italic">No payment methods saved.</p>';
            return;
        }

        user.paymentMethods.forEach(card => {
            const isDefault = card.isDefault;
            const item = document.createElement('div');
            item.className = 'flex items-center gap-3 p-4 border border-slate-200 rounded-xl';
            item.innerHTML = `
                <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-blue-600 text-[20px]">credit_card</span>
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-0.5">
                        <span class="text-sm font-semibold text-slate-900">${card.brand} ending in ${card.last4}</span>
                        ${isDefault ? '<span class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">Default</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500">Expires ${card.expiry}</p>
                </div>
                <div class="flex flex-col gap-1">
                    <button class="text-xs text-primary hover:underline font-medium edit-pay-btn" data-id="${card.id}">Edit</button>
                    ${!isDefault ? `<button class="text-xs text-red-500 hover:underline font-medium delete-pay-btn" data-id="${card.id}">Remove</button>` : ''}
                </div>
            `;
            container.appendChild(item);
        });

        // Bind events
        container.querySelectorAll('.edit-pay-btn').forEach(btn => {
            btn.addEventListener('click', () => openPaymentModal(btn.dataset.id));
        });
        container.querySelectorAll('.delete-pay-btn').forEach(btn => {
            btn.addEventListener('click', () => confirmDelete('payment', btn.dataset.id));
        });
    }

    function openPaymentModal(id = null) {
        const modal = $('paymentModal');
        const form = $('paymentForm');
        form.reset();

        if (id) {
            const card = user.paymentMethods.find(c => c.id === id);
            if (card) {
                $('paymentId').value = card.id;
                $('payNumber').value = '**** **** **** ' + card.last4; // Placeholder behavior
                $('payExpiry').value = card.expiry;
                $('payCvv').value = '***';
                $('payName').value = card.name;
                $('payDefault').checked = card.isDefault;
                $('paymentModalTitle').textContent = 'Edit Card';
            }
        } else {
            $('paymentId').value = '';
            $('paymentModalTitle').textContent = 'Add New Card';
        }

        modal.classList.remove('hidden');
    }

    // ─── Delete Confirmation ──────────────────────────────────────────
    function confirmDelete(type, id) {
        pendingDelete = { type, id };
        $('deleteModal').classList.remove('hidden');
    }

    // ─── Event Listeners & Initialize ─────────────────────────────────

    // Profile Edit Toggle
    $('editProfileBtn').addEventListener('click', () => {
        if (isEditingProfile) {
            // Cancel Action
            renderProfile(); // Revert changes
        } else {
            // Enter Edit Mode
            toggleEditUI(true);
        }
    });

    // Save Profile
    $('saveBtn').addEventListener('click', () => {
        const firstName = $('firstName').value.trim();
        const lastName = $('lastName').value.trim();
        const email = $('emailField').value.trim();
        const phone = $('phoneField').value.trim();

        if (!firstName || !lastName || !email) {
            alert('Name and Email are required.');
            return;
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;

        saveUser();
        renderProfile();

        // Visual feedback
        const btn = $('editProfileBtn');
        const original = btn.textContent;
        btn.textContent = 'Saved!';
        setTimeout(() => btn.textContent = 'Edit Profile', 1500);
    });

    // Address Modal Handlers
    $('addAddressBtn').addEventListener('click', () => openAddressModal());

    $('addressForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('addressId').value;
        const isDefault = $('addrDefault').checked;

        if (isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        } else if (user.addresses.length === 0) {
            // First address is always default
            // Actually, let's force it true if it's the first one? NO, keep logic simple.
        }

        const newAddr = {
            id: id || Date.now().toString(),
            label: $('addrLabel').value,
            street: $('addrStreet').value,
            city: $('addrCity').value,
            state: $('addrState').value,
            zip: $('addrZip').value,
            isDefault: isDefault || (user.addresses.length === 0 && !id) // default if first
        };

        if (id) {
            const idx = user.addresses.findIndex(a => a.id === id);
            if (idx !== -1) user.addresses[idx] = newAddr;
        } else {
            user.addresses.push(newAddr);
        }

        saveUser();
        renderAddresses();
        $('addressModal').classList.add('hidden');
    });

    // Payment Modal Handlers
    $('addPaymentBtn').addEventListener('click', () => openPaymentModal());

    $('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('paymentId').value;
        const number = $('payNumber').value.replace(/\s/g, '');
        const isDefault = $('payDefault').checked;

        if (isDefault) {
            user.paymentMethods.forEach(p => p.isDefault = false);
        }

        const newCard = {
            id: id || Date.now().toString(),
            last4: number.slice(-4) || '0000', // simplified logic
            brand: 'Visa', // mock brand detection
            expiry: $('payExpiry').value,
            name: $('payName').value,
            isDefault: isDefault || (user.paymentMethods.length === 0 && !id)
        };

        if (id) {
            // Check if user entered full number or just kept masked one
            // In real app, we wouldn't update number if it wasn't changed.
            const idx = user.paymentMethods.findIndex(p => p.id === id);
            if (idx !== -1) {
                // Keep old last4 if not changed, or update logic needed.
                // Assuming simple update for now.
                // If number length < 12, assume it's the masked one and don't change last4
                if (number.includes('*')) {
                    newCard.last4 = user.paymentMethods[idx].last4;
                }
                user.paymentMethods[idx] = newCard;
            }
        } else {
            user.paymentMethods.push(newCard);
        }

        saveUser();
        renderPayments();
        $('paymentModal').classList.add('hidden');
    });

    // Modal Close Buttons
    document.querySelectorAll('.closeModal').forEach(btn => {
        btn.addEventListener('click', () => {
            $('addressModal').classList.add('hidden');
            $('paymentModal').classList.add('hidden');
            $('deleteModal').classList.add('hidden');
            pendingDelete = null;
        });
    });

    // Delete Modal Action
    $('confirmDeleteBtn').addEventListener('click', () => {
        if (!pendingDelete) return;

        if (pendingDelete.type === 'address') {
            user.addresses = user.addresses.filter(a => a.id !== pendingDelete.id);
            renderAddresses();
        } else if (pendingDelete.type === 'payment') {
            user.paymentMethods = user.paymentMethods.filter(p => p.id !== pendingDelete.id);
            renderPayments();
        }

        saveUser();
        $('deleteModal').classList.add('hidden');
        pendingDelete = null;
    });

    // Orders Rendering (Keep as is)
    function renderOrders() {
        // ... (Keep existing implementation logic)
        const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        const userOrders = allOrders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const container = document.querySelector('#ordersPanel .space-y-4');

        if (!container) return; // Should not happen

        if (userOrders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 bg-white border border-slate-200 rounded-2xl">
                    <span class="material-symbols-outlined text-slate-300 text-[48px] mb-3">shopping_bag</span>
                    <p class="text-slate-900 font-semibold">No orders yet</p>
                    <a href="store.html" class="text-primary hover:underline text-sm mt-1 inline-block">Start Shopping</a>
                </div>`;
        } else {
            container.innerHTML = userOrders.map(order => {
                const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const firstItem = order.items[0];
                const otherItemsCount = order.items.length - 1;
                const statusColor = order.status === 'Delivered' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100';

                return `
                <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/30 transition-colors">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-sm font-bold text-slate-900">Order #${order.orderId}</span>
                            <span class="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${statusColor}">${order.status}</span>
                        </div>
                        <span class="text-xs text-slate-400">${date}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="${firstItem.image}" alt="" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-slate-900 truncate">${firstItem.name}</p>
                            <p class="text-xs text-slate-500">${otherItemsCount > 0 ? `+ ${otherItemsCount} more items` : `Qty: ${firstItem.qty}`}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold text-slate-900">$${order.total.toFixed(2)}</p>
                            <a href="receipt.html?orderId=${order.orderId}" class="text-xs text-primary hover:underline font-medium">View Receipt</a>
                            <span class="text-slate-300 mx-1">|</span>
                            <a href="tracking.html?orderId=${order.orderId}" class="text-xs text-primary hover:underline font-medium">Track</a>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        // Update Overview Stats
        const statsEl = document.querySelector('#overviewPanel p.text-2xl');
        if (statsEl) statsEl.textContent = userOrders.length;
    }

    // Tabs Logic (Keep as is)
    const tabs = document.querySelectorAll('[data-tab]');
    const panels = ['overviewPanel', 'ordersPanel', 'settingsPanel', 'wishlistPanel'];

    function switchTab(tabId) {
        tabs.forEach(t => {
            if (t.dataset.tab === tabId) {
                t.classList.remove('text-slate-600', 'hover:bg-slate-100');
                t.classList.add('bg-primary/10', 'text-primary');
            } else {
                t.classList.add('text-slate-600', 'hover:bg-slate-100');
                t.classList.remove('bg-primary/10', 'text-primary');
            }
        });

        panels.forEach(id => {
            const panel = $(id);
            if (panel) {
                if (id === `${tabId}Panel`) panel.classList.remove('hidden');
                else panel.classList.add('hidden');
            }
        });
    }

    tabs.forEach(t => t.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = t.dataset.tab;
        switchTab(tabId);
        window.location.hash = tabId;
    }));

    // Handle Sign Out
    $('signOutBtn').addEventListener('click', () => {
        localStorage.removeItem(USER_KEY);
        localStorage.setItem('gadget_is_logged_in', 'false');
        window.location.href = '/auth.html';
    });

    // ─── Render Reviews ───────────────────────────────────────────────
    function renderReviews() {
        // Placeholder for now, as review submission isn't fully implemented yet
        // In a real app, we'd fetch gadget_reviews and filter by userId
        const reviews = JSON.parse(localStorage.getItem('gadget_reviews') || '[]');
        const myReviews = reviews.filter(r => r.userId === user.id);
        // Logic to render myReviews would go here
    }

    // ─── Render Wishlist ──────────────────────────────────────────────
    function renderWishlist() {
        const wishlistPanel = document.getElementById('wishlistPanel');
        const wishlist = JSON.parse(localStorage.getItem('gadget_wishlist') || '[]');
        const myWishlist = wishlist
            .filter(item => item.userId === user.id)
            .map(item => PRODUCTS[item.productId])
            .filter(Boolean); // Filter out any undefined products if IDs changed

        if (myWishlist.length === 0) {
            wishlistPanel.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-slate-400 text-[24px]">favorite</span>
                    </div>
                    <h3 class="text-slate-900 font-bold mb-1">Your wishlist is empty</h3>
                    <p class="text-slate-500 text-sm mb-4">Save items you want to see later.</p>
                    <a href="store.html" class="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-600">Browse Store</a>
                </div>
            `;
            return;
        }

        wishlistPanel.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${myWishlist.map(p => `
                <div class="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
                    <div class="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <h3 class="text-sm font-semibold text-slate-900 line-clamp-1">${p.name}</h3>
                        <p class="text-sm font-bold text-slate-900 mt-1">$${p.price.toLocaleString()}</p>
                        <a href="product.html?id=${p.id}" class="mt-2 text-xs text-primary hover:underline font-medium inline-block">View Details</a>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    // ─── Render Recent Activity ───────────────────────────────────────
    function renderRecentActivity() {
        const activityList = document.getElementById('recentActivityList');
        // Combine Orders and Reviews (and maybe wishlist adds?)
        const orders = JSON.parse(localStorage.getItem('gadget_orders') || '[]').filter(o => o.userId === user.id);
        const reviews = JSON.parse(localStorage.getItem('gadget_reviews') || '[]').filter(r => r.userId === user.id);
        // Maybe creation date?
        // Let's create a combined list
        // Activity Types: 'order', 'review'

        const activities = [
            ...orders.map(o => ({ type: 'order', date: new Date(o.createdAt), data: o })),
            ...reviews.map(r => ({ type: 'review', date: new Date(r.date), data: r }))
        ].sort((a, b) => b.date - a.date).slice(0, 5); // Last 5

        if (activities.length === 0) {
            activityList.innerHTML = `<div class="text-center py-8 text-slate-500 text-sm">No recent activity</div>`;
            return;
        }

        activityList.innerHTML = activities.map(act => {
            const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                Math.ceil((act.date - new Date()) / (1000 * 60 * 60 * 24)), 'day'
            );

            if (act.type === 'order') {
                return `
                    <div class="flex gap-4">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                                <span class="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
                            </div>
                            <div class="absolute top-10 left-5 w-px h-full bg-slate-200 -z-0"></div>
                        </div>
                        <div class="pb-8">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-sm font-bold text-slate-900">Placed an Order</span>
                                <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">#${act.data.orderId}</span>
                            </div>
                            <p class="text-sm text-slate-600 mb-2">Total: $${Math.round(act.data.total).toLocaleString()}</p>
                            <span class="text-slate-400 text-xs">${timeAgo}</span>
                        </div>
                    </div>
                `;
            } else if (act.type === 'review') {
                const product = PRODUCTS[act.data.productId] || { name: 'Unknown Product' };
                return `
                    <div class="flex gap-4">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center relative z-10">
                                <span class="material-symbols-outlined text-amber-600 text-[20px]">star</span>
                            </div>
                            <div class="absolute top-10 left-5 w-px h-full bg-slate-200 -z-0"></div>
                        </div>
                        <div class="pb-8">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-sm font-bold text-slate-900">Wrote a Review</span>
                            </div>
                            <p class="text-sm text-slate-600 mb-2">For <span class="font-medium">${product.name}</span></p>
                            <span class="text-slate-400 text-xs">${timeAgo}</span>
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    // ─── Render Overview Stats ────────────────────────────────────────
    function renderOverview() {
        const orders = JSON.parse(localStorage.getItem('gadget_orders') || '[]').filter(o => o.userId === user.id);
        const wishlist = JSON.parse(localStorage.getItem('gadget_wishlist') || '[]').filter(w => w.userId === user.id);
        const reviews = JSON.parse(localStorage.getItem('gadget_reviews') || '[]').filter(r => r.userId === user.id);

        const orderCount = $('overviewOrderCount');
        const wishlistCount = $('overviewWishlistCount');
        const reviewCount = $('overviewReviewCount');

        if (orderCount) orderCount.textContent = orders.length;
        if (wishlistCount) wishlistCount.textContent = wishlist.length;
        if (reviewCount) reviewCount.textContent = reviews.length;

        // Populate activity from real data
        const activityEl = $('overviewActivity');
        if (activityEl) {
            const activities = [
                ...orders.map(o => ({ type: 'order', date: new Date(o.createdAt), data: o })),
                ...reviews.map(r => ({ type: 'review', date: new Date(r.date), data: r }))
            ].sort((a, b) => b.date - a.date).slice(0, 3);

            if (activities.length === 0) {
                activityEl.innerHTML = '<p class="text-sm text-slate-400">No recent activity</p>';
            } else {
                activityEl.innerHTML = activities.map(act => {
                    const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                        Math.ceil((act.date - new Date()) / (1000 * 60 * 60 * 24)), 'day'
                    );
                    if (act.type === 'order') {
                        return `<div class="flex items-center gap-3 text-sm">
                            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary text-[16px]">shopping_bag</span>
                            </div>
                            <div class="flex-1"><span class="font-medium">Order #${act.data.id || ''}</span> placed</div>
                            <span class="text-slate-400 text-xs">${timeAgo}</span>
                        </div>`;
                    } else {
                        return `<div class="flex items-center gap-3 text-sm">
                            <div class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                <span class="material-symbols-outlined text-amber-600 text-[16px]">star</span>
                            </div>
                            <div class="flex-1">You reviewed a product</div>
                            <span class="text-slate-400 text-xs">${timeAgo}</span>
                        </div>`;
                    }
                }).join('');
            }
        }
    }

    // Initializes
    renderProfile();
    renderAddresses();
    renderPayments();
    renderOrders();
    renderWishlist();
    renderRecentActivity();
    renderOverview();

    // Make global for onclick handlers if needed (but currently we don't use inline onclicks that call these)
    // window.renderWishlist = renderWishlist; 

    // Initial Tab
    const hash = window.location.hash.replace('#', '') || 'settings';
    switchTab(hash);

})();
