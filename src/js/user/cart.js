/**
 * Go Gadgets — Cart Page JS
 * Reads cart from localStorage, renders items, handles quantity and removal.
 */
(() => {
    const CART_KEY = 'gadget_cart';
    const TAX_RATE = 0.08;

    const $ = id => document.getElementById(id);

    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }
    function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    // ─── Render ───────────────────────────────────────────────────────
    function render() {
        const cart = getCart();

        // Badge
        const count = cart.reduce((s, i) => s + i.qty, 0);
        const badge = $('cartBadge');
        if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); badge.classList.add('flex'); }
        else { badge.classList.add('hidden'); badge.classList.remove('flex'); }

        // Title
        $('cartTitle').textContent = `Shopping Cart (${count})`;

        if (cart.length === 0) {
            $('emptyCart').classList.remove('hidden');
            $('cartContent').classList.add('hidden');
            return;
        }
        $('emptyCart').classList.add('hidden');
        $('cartContent').classList.remove('hidden');

        // Items
        $('cartItems').innerHTML = cart.map((item, i) => `
            <div class="flex gap-4 py-6 ${i === 0 ? '' : 'border-t border-slate-100'}">
                <div class="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h3 class="text-sm font-semibold text-slate-900">${item.name}</h3>
                            ${item.variant ? `<p class="text-xs text-primary mt-0.5">${item.variant}</p>` : ''}
                            ${item.category ? `<p class="text-xs text-primary mt-0.5">${item.category}</p>` : ''}
                        </div>
                        <p class="text-sm font-bold text-slate-900 flex-shrink-0">$${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button onclick="changeQty(${i}, -1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                                <span class="material-symbols-outlined text-[16px]">remove</span>
                            </button>
                            <span class="w-8 h-8 flex items-center justify-center text-sm font-medium text-slate-900 bg-slate-50">${item.qty}</span>
                            <button onclick="changeQty(${i}, 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                                <span class="material-symbols-outlined text-[16px]">add</span>
                            </button>
                        </div>
                        <button onclick="removeItem(${i})" class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Summary
        const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        $('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        $('tax').textContent = `$${tax.toFixed(2)}`;
        $('total').textContent = `$${total.toFixed(2)}`;
    }

    // ─── Actions ──────────────────────────────────────────────────────
    window.changeQty = function (index, delta) {
        const cart = getCart();
        cart[index].qty = Math.max(1, cart[index].qty + delta);
        saveCart(cart);
        render();
    };

    window.removeItem = function (index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        render();
    };

    // ─── Init ─────────────────────────────────────────────────────────
    render();
})();
