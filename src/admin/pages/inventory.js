import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic } from '../utils/ui-helpers.js';
import { AdminProductStore } from '../store/admin-product-store.js';
import { Toast } from '../components/toast.js';

let currentInventory = [];

export function renderInventory() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('inventory')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Inventory', 'Manage product stock levels')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-7xl mx-auto flex flex-col gap-6">
                        <!-- Stats Row -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="bg-surface rounded-xl border border-border-color p-6 shadow-sm">
                                <p class="text-sm font-bold text-text-muted uppercase tracking-wide">Total Stock Value</p>
                                <p class="text-3xl font-bold text-text-main mt-2" id="totalStockValue">$0</p>
                            </div>
                            <div class="bg-surface rounded-xl border border-border-color p-6 shadow-sm">
                                <p class="text-sm font-bold text-text-muted uppercase tracking-wide">Low Stock Items</p>
                                <p class="text-3xl font-bold text-amber-600 mt-2" id="lowStockCount">0</p>
                            </div>
                            <div class="bg-surface rounded-xl border border-border-color p-6 shadow-sm">
                                <p class="text-sm font-bold text-text-muted uppercase tracking-wide">Out of Stock</p>
                                <p class="text-3xl font-bold text-rose-600 mt-2" id="outOfStockCount">0</p>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="bg-surface border border-border-color rounded-xl shadow-sm overflow-hidden">
                             <div class="px-6 py-4 border-b border-border-color flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
                                <h3 class="font-bold text-text-main text-lg shrink-0">Inventory Items</h3>
                                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                    <input type="text" id="inventorySearch" placeholder="Search by name or SKU..." class="border border-border-color rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:border-primary" />
                                    <select id="stockFilter" class="border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary w-full md:w-auto">
                                        <option value="all">All Status</option>
                                        <option value="instock">In Stock</option>
                                        <option value="lowstock">Low Stock</option>
                                        <option value="outstock">Out of Stock</option>
                                    </select>
                                    <button class="text-sm text-primary hover:text-primary-dark font-bold bg-white border border-border-color px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shrink-0 w-full md:w-auto">Export Report</button>
                                </div>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-border-color">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Product</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">SKU</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Stock Level</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                            <th class="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Value</th>
                                            <th class="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="inventory-table-body" class="divide-y divide-border-color text-sm bg-white"></tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </main>
            </div>
        </div>

        <!-- Adjust Stock Modal -->
        <div id="stockModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div class="bg-surface w-full max-w-md rounded-2xl shadow-2xl p-6 transform scale-100 transition-all">
                <h3 class="text-xl font-bold text-text-main mb-6">Adjust Stock Level</h3>
                <p class="text-text-muted mb-4 text-sm">Update inventory for <span id="stockProductName" class="font-bold text-text-main">Product Name</span></p>
                
                <form id="adjustStockForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">New Stock Quantity</label>
                        <input type="number" id="newStockQty" class="block w-full rounded-lg border-2 border-border-color bg-white p-3 text-text-main focus:border-primary focus:outline-none text-lg font-mono" min="0" required />
                    </div>
                     <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">Reason for Adjustment</label>
                        <select class="block w-full rounded-lg border-2 border-border-color bg-white p-3 text-text-main focus:border-primary focus:outline-none">
                            <option value="restock">Restock</option>
                            <option value="correction">Inventory Correction</option>
                            <option value="damage">Damaged/Lost</option>
                            <option value="return">Customer Return</option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-3 pt-4">
                        <button type="button" id="closeStockModal" class="px-4 py-2 rounded-lg border border-border-color text-text-muted hover:bg-slate-50 font-medium text-sm transition-colors">Cancel</button>
                        <button type="submit" id="updateStockBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">Update Stock</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    initInventoryLogic();
}

async function initInventoryLogic() {
    const tableBody = document.getElementById('inventory-table-body');
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">Loading inventory...</td></tr>';

    try {
        await AdminProductStore.init();
        currentInventory = AdminProductStore.getAll();
        renderInventoryTable(currentInventory);
        updateInventoryStats(currentInventory);
    } catch (error) {
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-rose-500">Error loading inventory.</td></tr>';
        console.error(error);
        Toast.show('Failed to load inventory', 'error');
    }

    setupEventListeners();
    setupFilters();
    initSidebarLogic();
}

function setupFilters() {
    const searchInput = document.getElementById('inventorySearch');
    const stockFilter = document.getElementById('stockFilter');

    const filterInventory = () => {
        const query = searchInput.value.toLowerCase();
        const status = stockFilter.value;
        const allProducts = AdminProductStore.getAll();

        currentInventory = allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query));
            let matchesStatus = true;

            if (status === 'instock') matchesStatus = p.stock >= 10;
            if (status === 'lowstock') matchesStatus = p.stock < 10 && p.stock > 0;
            if (status === 'outstock') matchesStatus = p.stock === 0;

            return matchesSearch && matchesStatus;
        });

        renderInventoryTable(currentInventory);
        updateInventoryStats(currentInventory); // Update stats based on filtered view or all? usually all, but let's update reflected stats
    };

    if (searchInput) searchInput.addEventListener('input', filterInventory);
    if (stockFilter) stockFilter.addEventListener('change', filterInventory);
}

function setupEventListeners() {
    const modal = document.getElementById('stockModal');
    const closeBtn = document.getElementById('closeStockModal');
    const form = document.getElementById('adjustStockForm');
    const tableBody = document.getElementById('inventory-table-body');
    let currentProductId = null;

    // Prevent duplicate listeners
    const container = document.querySelector('main');
    if (container) {
        if (container.getAttribute('data-events-init') === 'true') return;
        container.setAttribute('data-events-init', 'true');
    }

    const hideModal = () => {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.adjust-stock-btn');
            if (btn) {
                const id = btn.dataset.id;
                const product = AdminProductStore.getAll().find(p => p.id === id);

                if (product) {
                    currentProductId = id;
                    const nameEl = document.getElementById('stockProductName');
                    const qtyEl = document.getElementById('newStockQty');

                    if (nameEl) nameEl.textContent = product.name;
                    if (qtyEl) qtyEl.value = product.stock;

                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            }
        });
    }

    // Handle Submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newQty = parseInt(document.getElementById('newStockQty').value);
            const btn = document.getElementById('updateStockBtn');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Updating...';

            try {
                // Update Store
                await AdminProductStore.update(currentProductId, {
                    stock: newQty,
                    status: newQty > 0 ? 'instock' : 'outstock'
                });

                Toast.show(`Stock updated for Product ID ${currentProductId}`);
                hideModal();

                // Refresh
                currentInventory = AdminProductStore.getAll();
                renderInventoryTable(currentInventory);
                updateInventoryStats(currentInventory);

            } catch (error) {
                console.error(error);
                Toast.show('Failed to update stock', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }
}

function renderInventoryTable(products) {
    const container = document.getElementById('inventory-table-body');

    if (container) {
        if (!products || products.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">No inventory items found.</td></tr>';
            return;
        }

        container.innerHTML = products.map(product => `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap font-bold text-text-main text-sm">${product.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-muted font-mono text-xs">
                    <span class="border border-border-color rounded bg-slate-50 px-2 py-1">${product.sku || 'N/A'}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-main">
                    <div class="flex items-center gap-3">
                        <span class="font-bold w-8 text-right">${product.stock}</span>
                        <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div class="h-full ${getStockColorClass(product.stock, 100)}" style="width: ${Math.min(product.stock, 100)}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(product.stock)}">
                        ${product.stock === 0 ? 'Out of Stock' : (product.stock < 10 ? 'Low Stock' : 'In Stock')}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-text-main font-bold">$${(product.price * product.stock).toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="adjust-stock-btn text-primary hover:text-primary-dark font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-200" data-id="${product.id}">
                        Adjust
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function updateInventoryStats(products) {
    // Calculate stats based on ALL products, not just filtered ones? usually depends on requirement. Let's do ALL products to keep top stats consistent.
    // Actually, normally specific page stats reflect the view. But "Total Stock Value" usually implies everything. 
    // Let's use the Store check for stats to be accurate to global state.
    const allProducts = AdminProductStore.getAll();

    const totalValue = allProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStock = allProducts.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStock = allProducts.filter(p => p.stock === 0).length;

    const tvEl = document.getElementById('totalStockValue');
    const lsEl = document.getElementById('lowStockCount');
    const osEl = document.getElementById('outOfStockCount');

    if (tvEl) tvEl.textContent = '$' + totalValue.toLocaleString();
    if (lsEl) lsEl.textContent = lowStock;
    if (osEl) osEl.textContent = outOfStock;
}

function getStockColorClass(stock) {
    if (stock === 0) return 'bg-rose-500';
    if (stock < 10) return 'bg-amber-500';
    return 'bg-emerald-500';
}

function getStatusColor(stock) {
    if (stock === 0) return 'bg-rose-100 text-rose-800';
    if (stock < 10) return 'bg-amber-100 text-amber-800';
    return 'bg-emerald-100 text-emerald-800';
}
