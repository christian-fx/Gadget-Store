/**
 * Go Gadgets — Order Tracking Page JS
 * Renders tracking timeline and order details from localStorage.
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
                <span class="material-symbols-outlined text-slate-300 text-[64px] mb-4">local_shipping</span>
                <h1 class="text-2xl font-bold text-slate-900">Order Not Found</h1>
                <p class="text-sm text-slate-500 mt-2">We couldn't locate this order.</p>
                <a href="account.html#orders" class="inline-block mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">View Orders</a>
            </div>`;
        return;
    }

    // Order header
    $('trackOrderId').textContent = order.orderId;
    document.title = `Go Gadgets - Tracking ${order.orderId}`;

    const estDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    $('trackSubtitle').textContent = `Estimated delivery: ${estDate}`;

    // Timeline
    const STEP_ICONS = ['check_circle', 'inventory', 'local_shipping', 'flight_takeoff', 'home'];
    const steps = order.trackingSteps;

    let timelineHtml = '<div class="space-y-0">';
    steps.forEach((step, i) => {
        const isCompleted = step.completed;
        const isLast = i === steps.length - 1;
        const stepDate = step.date ? new Date(step.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : '';

        timelineHtml += `
        <div class="flex gap-4 ${!isLast ? 'pb-8' : ''}">
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full ${isCompleted ? 'bg-emerald-100' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined ${isCompleted ? 'text-emerald-600' : 'text-slate-400'} text-[22px]">${STEP_ICONS[i]}</span>
                </div>
                ${!isLast ? `<div class="w-0.5 flex-1 ${isCompleted ? 'bg-emerald-200' : 'bg-slate-200'} mt-2"></div>` : ''}
            </div>
            <div class="pt-2">
                <p class="text-sm font-semibold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}">${step.status}</p>
                ${stepDate ? `<p class="text-xs text-slate-400 mt-0.5">${stepDate}</p>` : '<p class="text-xs text-slate-400 mt-0.5">Pending</p>'}
            </div>
        </div>`;
    });
    timelineHtml += '</div>';
    $('timeline').innerHTML = timelineHtml;

    // Items
    $('trackItems').innerHTML = order.items.map(item => `
        <div class="flex gap-4 items-center">
            <div class="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
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

    // Delivery info
    $('deliveryInfo').innerHTML = `
        <p><span class="font-medium text-slate-900">Order ID:</span> ${order.orderId}</p>
        <p><span class="font-medium text-slate-900">Placed:</span> ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p><span class="font-medium text-slate-900">Shipping:</span> ${order.shippingMethod}</p>
        <p><span class="font-medium text-slate-900">Total:</span> <span class="font-bold text-primary">$${order.total.toFixed(2)}</span></p>
        <p><span class="font-medium text-slate-900">Status:</span> <span class="font-semibold text-emerald-600">${order.status}</span></p>
    `;

    // Address
    const addr = order.shippingAddress;
    $('trackAddress').innerHTML = `
        <p class="font-medium text-slate-900">${addr.firstName} ${addr.lastName}</p>
        <p>${addr.address}</p>
        <p>${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.zip}</p>
        ${addr.phone ? `<p>${addr.phone}</p>` : ''}
    `;
})();
