import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic } from '../utils/ui-helpers.js';
import { AdminUserStore } from '../store/admin-user-store.js';
import { Toast } from '../components/toast.js';

let currentUsers = [];

export function renderCustomers() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('customers')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Customers', 'Manage your customer base')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-7xl mx-auto flex flex-col gap-6">
                        <!-- Filters -->
                         <div class="bg-surface rounded-xl border border-border-color shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4">
                            <input type="text" id="customerSearch" placeholder="Search customers by name or email..." class="flex-1 border-2 border-border-color rounded-lg px-3 py-2 text-sm bg-white text-text-main focus:border-primary focus:outline-none w-full" />
                        </div>
                        
                        <!-- Table -->
                        <div class="bg-surface border border-border-color rounded-xl shadow-sm overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-border-color">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Email</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Orders</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Total Spent</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Join Date</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="customers-table-body" class="divide-y divide-border-color text-sm bg-white"></tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </main>
            </div>
        </div>

        <!-- View Customer Modal -->
        <div id="customerModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div class="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-hidden transform scale-100 transition-all">
                <div class="flex justify-between items-center mb-6 border-b border-border-color pb-4">
                    <h3 class="text-xl font-bold text-text-main">Customer Details</h3>
                    <button id="closeCustomerModal" class="text-text-muted hover:text-text-main p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col items-center bg-slate-50 p-6 rounded-xl border border-border-color justify-center">
                        <h4 class="text-2xl font-bold text-text-main text-center" id="modalCustomerName">Customer Name</h4>
                        <p class="text-text-muted text-base mt-2" id="modalCustomerEmail">email@example.com</p>
                        <span class="mt-4 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">Active</span>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-slate-50 p-4 rounded-xl border border-border-color">
                            <p class="text-xs font-bold text-text-muted uppercase mb-1">Total Orders</p>
                            <p class="text-xl font-bold text-text-main" id="modalCustomerOrders">0</p>
                        </div>
                         <div class="bg-slate-50 p-4 rounded-xl border border-border-color">
                            <p class="text-xs font-bold text-text-muted uppercase mb-1">Lifetime Value</p>
                            <p class="text-xl font-bold text-primary" id="modalCustomerSpent">$0.00</p>
                        </div>
                         <div class="bg-slate-50 p-4 rounded-xl border border-border-color">
                            <p class="text-xs font-bold text-text-muted uppercase mb-1">Member Since</p>
                            <p class="text-base font-medium text-text-main" id="modalCustomerJoinDate">Jan 1, 2024</p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-border-color">
                     <button class="px-4 py-2 rounded-lg border border-border-color text-text-main hover:bg-slate-50 font-medium text-sm transition-colors">Contact Customer</button>
                    <button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">Edit Profile</button>
                </div>
            </div>
        </div>
    `;

    initCustomersLogic();
}

async function initCustomersLogic() {
    const tableBody = document.getElementById('customers-table-body');
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">Loading customers...</td></tr>';

    try {
        await AdminUserStore.init();
        currentUsers = AdminUserStore.getAll();
        renderTable(currentUsers);
    } catch (error) {
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-rose-500">Error loading customers.</td></tr>';
        console.error(error);
        Toast.show('Failed to load customers', 'error');
    }

    setupEventListeners();
    setupFilters();
    initSidebarLogic();
}

function setupFilters() {
    const searchInput = document.getElementById('customerSearch');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const allUsers = AdminUserStore.getAll();

            currentUsers = allUsers.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
            renderTable(currentUsers);
        });
    }
}

function setupEventListeners() {
    const modal = document.getElementById('customerModal');
    const closeBtn = document.getElementById('closeCustomerModal');
    const tableBody = document.getElementById('customers-table-body');

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
            const btn = e.target.closest('.view-customer-btn');
            if (btn) {
                const id = btn.dataset.id; // Firebase IDs are strings
                const user = AdminUserStore.getAll().find(u => u.id === id);

                if (user) {
                    const name = document.getElementById('modalCustomerName');
                    const email = document.getElementById('modalCustomerEmail');
                    const orders = document.getElementById('modalCustomerOrders');
                    const spent = document.getElementById('modalCustomerSpent');
                    const joinDate = document.getElementById('modalCustomerJoinDate');

                    if (name) name.textContent = user.name || 'Unknown User';
                    if (email) email.textContent = user.email || 'N/A';
                    if (orders) orders.textContent = user.orders || 0;
                    if (spent) spent.textContent = `$${(user.totalSpent || 0).toLocaleString()}`;
                    if (joinDate) {
                        if (user.createdAt) {
                            let d = new Date(user.createdAt);
                            if (user.createdAt.seconds) d = new Date(user.createdAt.seconds * 1000);
                            joinDate.textContent = d.toLocaleDateString();
                        } else {
                            joinDate.textContent = user.joinDate || 'N/A';
                        }
                    }

                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            }
        });
    }
}

function renderTable(users) {
    const container = document.getElementById('customers-table-body');

    if (container) {
        if (!users || users.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">No customers found.</td></tr>';
            return;
        }

        container.innerHTML = users.map(user => {
            let joinDate = 'N/A';
            if (user.createdAt) {
                let d = new Date(user.createdAt);
                if (user.createdAt.seconds) d = new Date(user.createdAt.seconds * 1000);
                joinDate = d.toLocaleDateString();
            } else if (user.joinDate) {
                joinDate = user.joinDate;
            }

            return `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div class="font-bold text-text-main text-sm">${user.name || 'Unknown User'}</div>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-muted">${user.email || 'N/A'}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-main font-medium">${user.orders || 0}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-main font-bold">$${(user.totalSpent || 0).toLocaleString()}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-muted text-sm">${joinDate}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="view-customer-btn text-primary hover:text-primary-dark font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-200" data-id="${user.id}">
                        View
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    }
}
