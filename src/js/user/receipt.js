/**
 * Go Gadgets — Receipt Page JS
 * Reads order from localStorage and renders confirmation details.
 */
(() => {
    const $ = id => document.getElementById(id);

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    const orders = JSON.parse(localStorage.getItem('gadget_orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        document.querySelector('main').innerHTML = `
            <div class="text-center py-20">
                <span class="material-symbols-outlined text-slate-300 text-[64px] mb-4">receipt_long</span>
                <h1 class="text-2xl font-bold text-slate-900">Order Not Found</h1>
                <p class="text-sm text-slate-500 mt-2">We couldn't find that order. It may have been removed.</p>
                <a href="store.html" class="inline-block mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">Go to Store</a>
            </div>`;
        return;
    }

    // Order number
    $('orderNumber').textContent = `Order ${order.orderId}`;

    // Date
    $('orderDate').textContent = new Date(order.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Items
    $('orderItems').innerHTML = order.items.map(item => `
        <div class="flex gap-4 items-center">
            <div class="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">${item.name}</p>
                ${item.variant ? `<p class="text-xs text-slate-500">${item.variant}</p>` : ''}
                <p class="text-xs text-slate-500">Qty: ${item.qty}</p>
            </div>
            <p class="text-sm font-bold text-slate-900">$${(item.price * item.qty).toFixed(2)}</p>
        </div>
    `).join('');

    // Totals
    $('rSubtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    $('rShipping').textContent = order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free';
    $('rTax').textContent = `$${order.tax.toFixed(2)}`;
    $('rTotal').textContent = `$${order.total.toFixed(2)}`;

    // Shipping address
    const addr = order.shippingAddress;
    $('shippingInfo').innerHTML = `
        <p class="font-medium text-slate-900">${addr.firstName} ${addr.lastName}</p>
        <p>${addr.address}</p>
        <p>${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.zip}</p>
        ${addr.phone ? `<p>${addr.phone}</p>` : ''}
        <p>${addr.email}</p>
    `;

    // Payment info
    const estDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });
    $('paymentInfo').innerHTML = `
        <p><span class="font-medium text-slate-900">Payment:</span> ${order.paymentMethod}</p>
        <p><span class="font-medium text-slate-900">Shipping:</span> ${order.shippingMethod}</p>
        <p><span class="font-medium text-slate-900">Est. Delivery:</span> ${estDate}</p>
        <p><span class="font-medium text-slate-900">Status:</span> <span class="text-emerald-600 font-semibold">${order.status}</span></p>
    `;

    // Track button
    $('trackBtn').href = `tracking.html?orderId=${order.orderId}`;
})();
