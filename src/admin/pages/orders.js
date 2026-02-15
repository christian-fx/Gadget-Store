import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic } from '../utils/ui-helpers.js';
import { AdminOrderStore } from '../store/admin-order-store.js';
import { Toast } from '../components/toast.js';

let currentOrders = [];

export function renderOrders() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('orders')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Orders', 'Track and manage customer orders')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-7xl mx-auto flex flex-col gap-6">
                        <!-- Filters -->
                         <div class="bg-surface rounded-xl border border-border-color shadow-sm p-4 flex flex-col md:flex-row gap-4">
                            <input type="text" id="orderSearch" placeholder="Search by Order ID or Customer Name..." class="flex-1 border-2 border-border-color rounded-lg px-3 py-2 text-sm bg-white text-text-main focus:border-primary focus:outline-none w-full" />
                            <select id="statusFilter" class="border-2 border-border-color rounded-lg px-3 py-2 text-sm bg-white text-text-main focus:border-primary focus:outline-none w-full md:w-48">
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <!-- Table -->
                        <div class="bg-surface border border-border-color rounded-xl shadow-sm overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-border-color">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Order ID</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Total</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                            <th class="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="orders-table-body" class="divide-y divide-border-color text-sm bg-white"></tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </main>
            </div>
        </div>

        <!-- View Order Modal -->
         <div id="viewOrderModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div class="bg-surface w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-all">
                <div class="flex justify-between items-center px-6 py-4 border-b border-border-color bg-slate-50">
                    <div>
                        <h3 class="text-xl font-bold text-text-main">Order Details</h3>
                        <p class="text-xs text-text-muted mt-0.5" id="modalOrderId">#ORD-0000</p>
                    </div>
                     <button id="closeOrderModal" class="text-text-muted hover:text-text-main p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <!-- Customer Info -->
                    <div>
                        <h4 class="text-sm font-bold text-text-muted uppercase mb-3">Customer Information</h4>
                        <div class="bg-slate-50 p-4 rounded-xl border border-border-color">
                            <p class="font-bold text-text-main text-lg" id="modalCustomerName">Customer Name</p>
                            <p class="text-text-muted text-sm mt-1" id="modalCustomerEmail">email@example.com</p>
                            <div class="mt-3 pt-3 border-t border-border-color">
                                <p class="text-xs font-bold text-text-muted uppercase mb-1">Shipping Address</p>
                                <p class="text-sm text-text-main">123 Main St, New York, NY 10001</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div>
                        <h4 class="text-sm font-bold text-text-muted uppercase mb-3">Order Summary</h4>
                        <div class="bg-slate-50 p-4 rounded-xl border border-border-color space-y-3">
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Subtotal</span>
                                <span class="font-medium text-text-main" id="modalSubtotal">$0.00</span>
                            </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Tax</span>
                                <span class="font-medium text-text-main">$0.00</span>
                            </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Shipping</span>
                                <span class="font-medium text-text-main">Free</span>
                            </div>
                            <div class="pt-3 border-t border-border-color flex justify-between items-center">
                                <span class="font-bold text-text-main">Total</span>
                                <span class="font-bold text-primary text-xl" id="modalTotal">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="px-6 pb-6">
                     <h4 class="text-sm font-bold text-text-muted uppercase mb-3">Items</h4>
                     <div class="border border-border-color rounded-xl overflow-hidden">
                        <table class="min-w-full divide-y divide-border-color">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-bold text-text-muted uppercase">ltem</th>
                                    <th class="px-4 py-2 text-right text-xs font-bold text-text-muted uppercase">Qty</th>
                                    <th class="px-4 py-2 text-right text-xs font-bold text-text-muted uppercase">Price</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-border-color" id="modalItemsBody">
                                <!-- Items injected here -->
                            </tbody>
                        </table>
                     </div>
                </div>

                <!-- Footer Actions -->
                <div class="bg-slate-50 px-6 py-4 border-t border-border-color flex justify-between items-center">
                    <div>
                        <span class="text-xs font-bold text-text-muted uppercase mr-2">Update Status:</span>
                        <select id="modalStatusSelect" class="border border-border-color rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:border-primary">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                             <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                     <button id="saveOrderStatusBtn" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    initOrdersLogic();
}

async function initOrdersLogic() {
    const tableBody = document.getElementById('orders-table-body');
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">Loading orders...</td></tr>';

    try {
        await AdminOrderStore.init();
        currentOrders = AdminOrderStore.getAll();
        renderTable(currentOrders);
    } catch (error) {
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-rose-500">Error loading orders.</td></tr>';
        console.error(error);
        Toast.show('Failed to load orders', 'error');
    }

    setupEventListeners();
    setupFilters();
    initSidebarLogic();
}

function setupFilters() {
    const searchInput = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');

    const filterOrders = () => {
        const query = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const allOrders = AdminOrderStore.getAll();

        currentOrders = allOrders.filter(o => {
            const matchesSearch = o.id.toLowerCase().includes(query) || (o.customerName && o.customerName.toLowerCase().includes(query));
            const matchesStatus = status === '' || o.status === status;
            return matchesSearch && matchesStatus;
        });
        renderTable(currentOrders);
    };

    if (searchInput) searchInput.addEventListener('input', filterOrders);
    if (statusFilter) statusFilter.addEventListener('change', filterOrders);
}

function setupEventListeners() {
    const viewModal = document.getElementById('viewOrderModal');
    const closeModalBtn = document.getElementById('closeOrderModal');
    const tableBody = document.getElementById('orders-table-body');
    const saveStatusBtn = document.getElementById('saveOrderStatusBtn');
    let currentOrderId = null;

    const hideModal = () => {
        if (viewModal) {
            viewModal.classList.add('hidden');
            viewModal.classList.remove('flex');
        }
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (viewModal) viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) hideModal();
    });

    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-order-btn');
            if (btn) {
                const id = btn.dataset.id;
                const order = AdminOrderStore.getAll().find(o => o.id === id);
                if (order) {
                    currentOrderId = id;
                    populateModal(order);
                    viewModal.classList.remove('hidden');
                    viewModal.classList.add('flex');
                }
            }
        });
    }

    // Save Status
    if (saveStatusBtn) {
        saveStatusBtn.addEventListener('click', async () => {
            const newStatus = document.getElementById('modalStatusSelect').value;
            const originalText = saveStatusBtn.textContent;
            saveStatusBtn.disabled = true;
            saveStatusBtn.textContent = 'Updating...';

            try {
                // Mock update - in real app would update store
                // await AdminOrderStore.update(currentOrderId, { status: newStatus });
                const order = AdminOrderStore.getAll().find(o => o.id === currentOrderId);
                if (order) order.status = newStatus; // Local update for demo

                Toast.show(`Order status updated to ${newStatus}`);
                hideModal();

                // Refresh
                currentOrders = AdminOrderStore.getAll();
                renderTable(currentOrders);
            } catch (error) {
                Toast.show('Failed to update status', 'error');
            } finally {
                saveStatusBtn.disabled = false;
                saveStatusBtn.textContent = originalText;
            }
        });
    }
}

function populateModal(order) {
    document.getElementById('modalOrderId').textContent = `#${order.id.substring(0, 8).toUpperCase()}`;
    document.getElementById('modalCustomerName').textContent = order.customerName || 'Guest';
    document.getElementById('modalCustomerEmail').textContent = order.customerEmail || 'N/A';
    document.getElementById('modalTotal').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('modalSubtotal').textContent = `$${order.total.toFixed(2)}`; // Assuming no tax for now

    // Set current status in select
    const statusSelect = document.getElementById('modalStatusSelect');
    if (statusSelect) statusSelect.value = order.status;

    const itemsBody = document.getElementById('modalItemsBody');
    if (itemsBody) {
        itemsBody.innerHTML = (order.items || []).map(item => `
            <tr>
                <td class="px-4 py-3 text-sm text-text-main font-medium">${item.name || 'Product'}</td>
                <td class="px-4 py-3 text-sm text-text-main text-right">${item.quantity}</td>
                <td class="px-4 py-3 text-sm text-text-main text-right">$${item.price.toFixed(2)}</td>
            </tr>
        `).join('');
    }
}

function renderTable(orders) {
    const container = document.getElementById('orders-table-body');

    if (container) {
        if (!orders || orders.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">No orders found.</td></tr>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-xs text-primary font-bold">#${order.id.substring(0, 8).toUpperCase()}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-bold text-text-main text-sm">${order.customerName || 'Guest'}</div>
                    <div class="text-xs text-text-muted">${order.customerEmail}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-muted text-sm">${new Date(order.createdAt?.seconds * 1000).toLocaleDateString() || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-main font-bold">$${order.total.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="view-order-btn text-primary hover:text-primary-dark font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-200" data-id="${order.id}">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function getStatusColor(status) {
    if (status === 'pending') return 'bg-amber-100 text-amber-800';
    if (status === 'processing') return 'bg-blue-100 text-blue-800';
    if (status === 'shipped') return 'bg-purple-100 text-purple-800';
    if (status === 'delivered') return 'bg-emerald-100 text-emerald-800';
    if (status === 'cancelled') return 'bg-rose-100 text-rose-800';
    return 'bg-slate-100 text-slate-800';
}
