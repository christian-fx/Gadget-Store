import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic, formatCurrency } from '../utils/ui-helpers.js';
import { AdminOrderStore } from '../store/admin-order-store.js';
import { AdminProductStore } from '../store/admin-product-store.js';
import { AdminSettingsStore } from '../store/admin-settings-store.js';
import { Toast } from '../components/toast.js';
import { ConfirmationModal } from '../components/confirmation-modal.js';

let currentOrders = [];

export function renderOrders() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('orders')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Orders', "Track and manage customer orders")}
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
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Order ID</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Customer</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Items</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Total</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
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
                        <h3 class="text-xl font-semibold text-text-main">Order Details <span id="modalOrderId" class="text-text-muted text-base font-normal ml-2">#ORD-001</span></h3>
                        <p class="text-sm text-text-muted mt-0.5">Placed on <span id="modalDate" class="font-medium text-text-main">Oct 24, 2023</span> via <span id="modalPayment" class="font-medium text-text-main">Credit Card</span></p>
                    </div>
                     <button id="closeModal" class="text-text-muted hover:text-text-main p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Customer Info -->
                    <div>
                        <h4 class="text-sm font-semibold text-text-muted uppercase mb-3">Customer Information</h4>
                        <div class="bg-slate-50 p-4 rounded-xl border border-border-color">
                             <div class="flex items-center gap-3 mb-3">
                                <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
                                    <span class="material-symbols-outlined">person</span>
                                </div>
                                <div>
                                    <p class="font-semibold text-text-main" id="modalCustomerName">John Doe</p>
                                    <p class="text-text-muted text-xs">Customer</p>
                                </div>
                            </div>
                            <p class="text-text-muted text-sm mt-1" id="modalCustomerEmail">email@example.com</p>
                            <div class="mt-3 pt-3 border-t border-border-color">
                                <p class="text-xs font-semibold text-text-muted uppercase mb-1">Shipping Address</p>
                                <p class="text-sm text-text-main" id="modalShippingAddress">123 Main St, New York, NY 10001</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Stats -->
                    <div>
                        <h4 class="text-sm font-semibold text-text-muted uppercase mb-3">Order Summary</h4>
                        <div class="bg-slate-50 p-4 rounded-xl border border-border-color space-y-3">
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Order Date</span>
                                <span class="font-medium text-text-main" id="modalSummaryDate"></span>
                            </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Payment Method</span>
                                <span class="font-medium text-text-main" id="modalSummaryPayment"></span>
                            </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-text-muted">Subtotal</span>
                                <span class="font-medium text-text-main" id="modalSubtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between text-sm pt-2 border-t border-slate-200">
                                <span class="font-semibold text-text-main">Total</span>
                                <span class="font-semibold text-xl text-blue-600" id="modalTotal">$0.00</span>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                             <h4 class="text-sm font-semibold text-text-muted uppercase mb-2">Order Status</h4>
                            <select id="modalStatusSelect" class="block w-full rounded-lg border border-border-color bg-white p-2.5 text-sm text-text-main focus:border-primary focus:outline-none">
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button id="updateStatusBtn" class="mt-2 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="px-6 pb-6">
                     <h4 class="text-sm font-semibold text-text-muted uppercase mb-3">Items</h4>
                     <div class="space-y-3" id="modalItemsList">
                        <!-- Items injected here -->
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
        await Promise.all([
            AdminOrderStore.init(),
            AdminProductStore.init(),
            AdminSettingsStore.init()
        ]);
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
    const closeModalBtn = document.getElementById('closeModal'); // Changed from closeModalBtn to closeModal
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
                // Actual store update
                await AdminOrderStore.update(currentOrderId, { status: newStatus });

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

    // Safely Parse Date
    let dateObj = new Date();
    if (order.createdAt) {
        if (order.createdAt.seconds) {
            dateObj = new Date(order.createdAt.seconds * 1000);
        } else {
            dateObj = new Date(order.createdAt);
        }
    }

    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.getElementById('modalDate').textContent = formattedDate;
    if (document.getElementById('modalSummaryDate')) document.getElementById('modalSummaryDate').textContent = formattedDate;

    const paymentStr = order.paymentMethodId || order.paymentMethod || 'Credit Card';
    document.getElementById('modalPayment').textContent = paymentStr;
    if (document.getElementById('modalSummaryPayment')) document.getElementById('modalSummaryPayment').textContent = paymentStr;

    document.getElementById('modalCustomerName').textContent = order.customerName || 'Guest';
    document.getElementById('modalCustomerEmail').textContent = order.customerEmail || 'N/A';

    let shippingStr = 'N/A';
    if (order.shippingAddress) {
        if (typeof order.shippingAddress === 'object') {
            const addr = order.shippingAddress;
            shippingStr = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}, ${addr.country || ''}`.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        } else {
            shippingStr = order.shippingAddress;
        }
    }
    document.getElementById('modalShippingAddress').textContent = shippingStr;

    const orderTotal = order.totalAmount !== undefined ? order.totalAmount : (order.total || 0);
    document.getElementById('modalTotal').textContent = formatCurrency(orderTotal);
    // Subtotal logic (can be updated later if tax/shipping is added)
    document.getElementById('modalSubtotal').textContent = formatCurrency(orderTotal);

    // Set current status in select
    const statusSelect = document.getElementById('modalStatusSelect');
    if (statusSelect) statusSelect.value = order.status;

    const itemsList = document.getElementById('modalItemsList');
    if (itemsList) {
        itemsList.innerHTML = '';

        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                // Try finding product in store for latest image, fallback to item.imageUrl
                const product = AdminProductStore.getAll().find(p => p.id === (item.productId || item.id));
                const imgStr = (product && (product.imageUrl || product.image)) ? (product.imageUrl || product.image) : (item.imageUrl || item.image || '');
                const imgHtml = imgStr ? `<img src="${imgStr}" class="w-full h-full object-cover" />` : '<span class="material-symbols-outlined text-slate-400">image</span>';

                const itemQty = item.quantity || item.qty || 1;

                itemsList.innerHTML += `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                 ${imgHtml}
                            </div>
                            <div>
                                <p class="font-semibold text-text-main text-sm">${item.name || 'Unknown Item'}</p>
                                <p class="text-xs text-text-muted">Qty: ${itemQty}</p>
                            </div>
                        </div>
                        <p class="font-semibold text-text-main text-sm">${formatCurrency(item.price * itemQty)}</p>
                    </div>
                `;
            });
        } else {
            itemsList.innerHTML = '<p class="text-sm text-text-muted py-2">No items found.</p>';
        }
    }
}

function renderTable(orders) {
    const container = document.getElementById('orders-table-body');

    if (container) {
        if (!orders || orders.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">No orders found.</td></tr>';
            return;
        }

        container.innerHTML = orders.map(order => {
            const itemCount = order.items ? order.items.length : 0;
            return `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap font-mono text-xs text-primary font-semibold">#${order.id.substring(0, 8).toUpperCase()}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div class="font-semibold text-text-main text-sm">${order.customerName || 'Guest'}</div>
                    <div class="text-xs text-text-muted">${order.customerEmail}</div>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-text-muted">
                    <span class="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">${itemCount} Items</span>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-semibold text-text-main">${formatCurrency(order.totalAmount !== undefined ? order.totalAmount : (order.total || 0))}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="view-order-btn text-primary hover:text-primary-dark font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-200" data-id="${order.id}">
                        View Details
                    </button>
                </td>
            </tr>
        `;
        }).join('');
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
