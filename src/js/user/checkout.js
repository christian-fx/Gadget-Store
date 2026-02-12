/**
 * Go Gadgets — Checkout Page JS
 * Populates order summary, handles address/payment selection, saves new data, creates order.
 */
(() => {
    const CART_KEY = 'gadget_cart';
    const ORDERS_KEY = 'gadget_orders';
    const USER_KEY = 'gadget_user';
    const USERS_KEY = 'gadget_users';
    const TAX_RATE = 0.08;
    const EXPRESS_COST = 15;

    const $ = id => document.getElementById(id);

    // ─── Data Helpers ─────────────────────────────────────────────────
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }

    function getUser() {
        try { return JSON.parse(localStorage.getItem(USER_KEY)); }
        catch { return null; }
    }

    function saveUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        // Sync with users array
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...user };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    }

    const user = getUser();
    if (!user) {
        // Show sign-in prompt modal instead of redirecting
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 text-center">
                    <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <span class="material-symbols-outlined text-primary text-[40px]">lock</span>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Sign in to Checkout</h2>
                    <p class="text-slate-500 max-w-md mb-8">Create a free account or sign in to complete your purchase. Your cart items will be waiting for you.</p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <a href="/auth.html" class="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/25">
                            Sign In
                        </a>
                        <a href="/auth.html" class="px-8 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors">
                            Create Account
                        </a>
                    </div>
                    <a href="store.html" class="mt-6 text-sm text-slate-400 hover:text-primary transition-colors">
                        ← Continue Shopping
                    </a>
                </div>
            `;
        }
        return;
    }

    // Ensure arrays exist
    if (!user.addresses) user.addresses = [];
    if (!user.paymentMethods) user.paymentMethods = [];

    // ─── Render Saved Data ────────────────────────────────────────────
    function renderSavedAddresses() {
        const container = $('savedAddresses');
        container.innerHTML = '';

        if (user.addresses.length > 0) {
            user.addresses.forEach((addr, index) => {
                const isDefault = addr.isDefault || index === 0;
                const label = document.createElement('label');
                label.className = 'flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5';
                label.innerHTML = `
                    <input type="radio" name="selectedAddress" value="${addr.id}" ${isDefault ? 'checked' : ''} class="mt-1 text-primary focus:ring-primary/30">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                            <span class="font-semibold text-slate-900">${addr.label}</span>
                            ${addr.isDefault ? '<span class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">Default</span>' : ''}
                        </div>
                        <p class="text-sm text-slate-600">${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}</p>
                    </div>
                `;
                container.appendChild(label);
            });
            // Handle form visibility based on initial selection
            toggleAddressForm();
        } else {
            // No saved addresses, select 'new' by default and hide the container if you want, 
            // but the HTML has "Use a new address" radio. 
            // If no addresses, we should probably force "new" and maybe hide the toggle if we want to be strict,
            // but keeping it simple: just check the "new" radio.
            const newRadio = document.querySelector('input[name="selectedAddress"][value="new"]');
            if (newRadio) newRadio.checked = true;
            toggleAddressForm();
        }
    }

    function renderSavedCards() {
        const container = $('savedCards');
        container.innerHTML = '';

        if (user.paymentMethods.length > 0) {
            user.paymentMethods.forEach((card, index) => {
                const isDefault = card.isDefault || index === 0;
                const label = document.createElement('label');
                label.className = 'flex items-center gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5';
                label.innerHTML = `
                    <input type="radio" name="payment" value="${card.id}" ${isDefault ? 'checked' : ''} class="text-primary focus:ring-primary/30">
                    <div class="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-slate-500">credit_card</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-slate-900">${card.brand} ending in ${card.last4}</span>
                            ${card.isDefault ? '<span class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">Default</span>' : ''}
                        </div>
                        <p class="text-xs text-slate-500">Expires ${card.expiry}</p>
                    </div>
                `;
                container.appendChild(label);
            });
            togglePaymentForm();
        } else {
            const newRadio = document.querySelector('input[name="payment"][value="new_card"]');
            if (newRadio) newRadio.checked = true;
            togglePaymentForm();
        }
    }

    // ─── Toggles ──────────────────────────────────────────────────────
    function toggleAddressForm() {
        const isNew = document.querySelector('input[name="selectedAddress"][value="new"]')?.checked;
        const form = $('newAddressForm');
        if (form) {
            if (isNew) {
                form.classList.remove('hidden');
            } else {
                form.classList.add('hidden');
            }
        }
    }

    function togglePaymentForm() {
        const selected = document.querySelector('input[name="payment"]:checked')?.value;
        const isNewCard = selected === 'new_card';
        const isPayPal = selected === 'paypal'; // if we had paypal logic

        const form = $('cardForm');
        if (form) {
            // Show form only if "new_card" is selected. 
            // If existing card or paypal (mock), hide it.
            // (Logic for PayPal field might be separate, keeping simple)
            if (isNewCard) form.classList.remove('hidden');
            else form.classList.add('hidden');
        }
    }

    // ─── Render Summary & Totals ──────────────────────────────────────
    function renderSummary() {
        const cart = getCart();

        // Badge
        const count = cart.reduce((s, i) => s + i.qty, 0);
        const badge = $('cartBadge');
        if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); badge.classList.add('flex'); }
        else { badge.classList.add('hidden'); badge.classList.remove('flex'); }

        // Items
        $('summaryItems').innerHTML = cart.length
            ? cart.map(item => `
                <div class="flex gap-3">
                    <div class="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-900 truncate">${item.name}</p>
                        ${item.variant ? `<p class="text-xs text-slate-500">${item.variant}</p>` : ''}
                        <p class="text-sm font-bold text-slate-900 mt-0.5">$${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                </div>
            `).join('')
            : '<p class="text-sm text-slate-500 text-center py-4">Your cart is empty</p>';

        updateTotals();
    }

    function updateTotals() {
        const cart = getCart();
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const isExpress = document.querySelector('input[name="shipping"][value="express"]')?.checked;
        const shipping = isExpress ? EXPRESS_COST : 0;
        const tax = (subtotal + shipping) * TAX_RATE;
        const total = subtotal + shipping + tax;

        $('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        $('shippingCost').textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free';
        $('tax').textContent = `$${tax.toFixed(2)}`;
        $('total').textContent = `$${total.toFixed(2)}`;
        $('payBtn').textContent = `Pay $${total.toFixed(2)}`;
    }

    // ─── Init Event Listeners ─────────────────────────────────────────
    document.querySelectorAll('input[name="shipping"]').forEach(r => r.addEventListener('change', updateTotals));

    // Delegation for dynamic elements
    document.addEventListener('change', (e) => {
        if (e.target.name === 'selectedAddress') toggleAddressForm();
        if (e.target.name === 'payment') togglePaymentForm();
    });

    // Pay Button Logic
    $('payBtn').addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) return;

        // 1. Resolve Shipping Address
        let shippingAddress = {};
        const selectedAddrId = document.querySelector('input[name="selectedAddress"]:checked')?.value;

        if (selectedAddrId === 'new') {
            // Validate New Address Form
            const firstName = $('shippingFirst')?.value.trim();
            const lastName = $('shippingLast')?.value.trim();
            const address = $('shippingAddress')?.value.trim();
            const city = $('shippingCity')?.value.trim();
            const zip = $('shippingZip')?.value.trim();
            const phone = $('shippingPhone')?.value.trim();

            if (!firstName || !lastName || !address || !city || !zip) {
                alert('Please fill in all shipping fields.');
                return;
            }

            shippingAddress = { firstName, lastName, address, city, zip, phone };

            // Save if requested
            if ($('saveAddress')?.checked) {
                user.addresses.push({
                    id: Date.now().toString(),
                    label: 'Home', // Default label
                    street: address, city, state: '', // state missing in simplified form? Add if needed
                    zip,
                    isDefault: user.addresses.length === 0
                });
                saveUser(user);
            }
        } else {
            // Use Saved Address
            const addr = user.addresses.find(a => a.id === selectedAddrId);
            if (!addr) {
                alert('Selected address not found.');
                return;
            }
            shippingAddress = {
                firstName: user.firstName,
                lastName: user.lastName,
                address: addr.street,
                city: addr.city,
                zip: addr.zip,
                phone: user.phone || ''
            };
        }

        // 2. Resolve Payment
        let paymentMethod = 'Credit Card';
        const selectedPayId = document.querySelector('input[name="payment"]:checked')?.value;

        if (selectedPayId === 'new_card') {
            const num = $('cardNumber')?.value.trim();
            if (!num) {
                alert('Please enter card number.');
                return;
            }

            // Save if requested
            if ($('saveCard')?.checked) {
                user.paymentMethods.push({
                    id: Date.now().toString(),
                    last4: num.slice(-4),
                    brand: 'Visa', // mock
                    expiry: $('cardExpiry')?.value || '12/30',
                    name: $('cardName')?.value || '',
                    isDefault: user.paymentMethods.length === 0
                });
                saveUser(user);
            }
        } else if (selectedPayId === 'paypal') {
            paymentMethod = 'PayPal';
        } else {
            // Existing Card
            const card = user.paymentMethods.find(c => c.id === selectedPayId);
            if (!card) {
                // If not new card and not paypal, must be existing id.
                alert('Selected card not found.');
                return;
            }
        }

        // 3. Process Order
        const btn = $('payBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-flex items-center gap-2"><span class="animate-spin material-symbols-outlined text-[18px]">progress_activity</span> Processing…</span>';

        setTimeout(() => {
            const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
            const isExpress = document.querySelector('input[name="shipping"][value="express"]')?.checked;
            const shipping = isExpress ? EXPRESS_COST : 0;
            const tax = (subtotal + shipping) * TAX_RATE;
            const total = subtotal + shipping + tax;

            const orderId = 'ORD-' + Date.now().toString().slice(-8);
            const order = {
                orderId,
                userId: user.id,
                items: cart,
                subtotal, shipping, tax, total,
                shippingMethod: isExpress ? 'Express' : 'Standard',
                paymentMethod,
                shippingAddress,
                status: 'Confirmed',
                createdAt: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + (isExpress ? 3 : 6) * 86400000).toISOString(),
                trackingSteps: [
                    { status: 'Order Confirmed', date: new Date().toISOString(), completed: true },
                    { status: 'Processing', date: '', completed: false },
                    { status: 'Shipped', date: '', completed: false },
                    { status: 'In Transit', date: '', completed: false },
                    { status: 'Delivered', date: '', completed: false },
                ]
            };

            const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
            orders.push(order);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            localStorage.removeItem(CART_KEY);

            window.location.href = `receipt.html?orderId=${orderId}`;
        }, 2000);
    });

    // ─── Initialize ───────────────────────────────────────────────────
    if ($('contactEmail')) $('contactEmail').value = user.email || '';
    renderSavedAddresses();
    renderSavedCards();
    renderSummary();

})();
