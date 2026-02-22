import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic, formatCurrency } from '../utils/ui-helpers.js';
import { Chart } from 'chart.js/auto';
import { AdminProductStore } from '../store/admin-product-store.js';
import { AdminOrderStore } from '../store/admin-order-store.js';
import { AdminUserStore } from '../store/admin-user-store.js';
import { AdminSettingsStore } from '../store/admin-settings-store.js';

export async function renderDashboard() {
    const app = document.getElementById('app');

    // Initialize Stores
    try {
        await Promise.all([
            AdminProductStore.init(),
            AdminOrderStore.init(),
            AdminUserStore.init(),
            AdminSettingsStore.init()
        ]);
    } catch (error) {
        console.error("Dashboard Config Error:", error);
        app.innerHTML = `
            <div class="flex h-screen items-center justify-center bg-slate-100">
                <div class="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
                    <span class="material-symbols-outlined text-4xl text-rose-500 mb-4">error</span>
                    <h2 class="text-xl font-bold text-slate-900 mb-2">Failed to Load Dashboard</h2>
                    <p class="text-slate-600 mb-6 text-sm">
                        Could not connect to the database. This usually means API keys are missing or permissions are denied.
                    </p>
                    <button onclick="window.location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Retry Connection
                    </button>
                    <div class="mt-4 p-2 bg-slate-50 rounded text-xs text-left overflow-auto max-h-32 text-slate-500 font-mono">
                        ${error.message || JSON.stringify(error)}
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // We will render shells first, then update
    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('dashboard')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Dashboard', "Welcome back, Admin! Here's what's happening today.")}
                <main class="flex-1 overflow-y-auto p-4 md:p-8" id="dashboard-content">
                    <div class="flex items-center justify-center py-20">
                        <div class="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                </main>
            </div>
        </div>
    `;

    initSidebarLogic();

    // Initial render
    updateDashboardContent();

    // Subscribe to live order changes for charts and revenue
    AdminOrderStore.subscribe(() => {
        updateDashboardContent();
    });
}

let dashboardChartInstance = null;

function updateDashboardContent() {
    const products = AdminProductStore.getAll();
    const orders = AdminOrderStore.getAll();
    const users = AdminUserStore.getAll();

    // Calculate Stats
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount !== undefined ? order.totalAmount : (order.total || 0)) || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock < 10).length;

    // Calculate Top Categories (Revenue based)
    const categoryRevenue = {};
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                // Try to find product to get category
                const product = products.find(p => p.id === item.productId || p.name === item.name);
                const cat = product?.category || 'Uncategorized';
                if (!categoryRevenue[cat]) categoryRevenue[cat] = 0;
                categoryRevenue[cat] += (item.price * item.quantity);
            });
        }
    });

    const topCategories = Object.entries(categoryRevenue)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, revenue]) => ({
            name,
            revenue,
            percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
        }));

    // Calculate Revenue Over Time (Last 6 Months)
    const months = [];
    const revenueData = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        months.push(monthName);

        // Filter orders for this month
        const monthlyRevenue = orders.filter(order => {
            if (!order.createdAt) return false;
            // Handle Firestore Timestamp or Date string or ISO string
            const orderDate = order.createdAt.seconds ? new Date(order.createdAt.seconds * 1000) : new Date(order.createdAt);
            return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear();
        }).reduce((sum, order) => sum + (parseFloat(order.totalAmount !== undefined ? order.totalAmount : (order.total || 0)) || 0), 0);

        revenueData.push(monthlyRevenue);
    }


    const contentContainer = document.getElementById('dashboard-content');
    if (!contentContainer) return;

    contentContainer.innerHTML = `
        <div class="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 transition-all duration-300">
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <!-- Revenue -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 flex items-start justify-between">
                    <div>
                        <p class="text-slate-500 font-medium text-sm">Total Revenue</p>
                        <h3 class="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">${formatCurrency(totalRevenue)}</h3>
                        <p class="text-emerald-600 text-sm font-medium mt-1 inline-flex items-center">
                            <span class="material-symbols-outlined text-[16px] mr-1">trending_up</span> Real Data
                        </p>
                    </div>
                    <div class="bg-emerald-50 p-2 md:p-3 rounded-xl text-emerald-600">
                        <span class="material-symbols-outlined text-3xl">attach_money</span>
                    </div>
                </div>

                <!-- Orders -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 flex items-start justify-between">
                    <div>
                        <p class="text-slate-500 font-medium text-sm">Total Orders</p>
                        <h3 class="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">${totalOrders.toLocaleString()}</h3>
                        <p class="text-emerald-600 text-sm font-medium mt-1 inline-flex items-center">
                            <span class="material-symbols-outlined text-[16px] mr-1">shopping_cart</span> Real Data
                        </p>
                    </div>
                    <div class="bg-blue-50 p-2 md:p-3 rounded-xl text-blue-600">
                        <span class="material-symbols-outlined text-3xl">shopping_cart</span>
                    </div>
                </div>

                <!-- Customers -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 flex items-start justify-between">
                    <div>
                        <p class="text-slate-500 font-medium text-sm">Total Customers</p>
                        <h3 class="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">${totalCustomers.toLocaleString()}</h3>
                         <p class="text-blue-600 text-sm font-medium mt-1 inline-flex items-center">
                            <span class="material-symbols-outlined text-[16px] mr-1">person</span> Active
                        </p>
                    </div>
                    <div class="bg-purple-50 p-2 md:p-3 rounded-xl text-purple-600">
                        <span class="material-symbols-outlined text-3xl">group</span>
                    </div>
                </div>

                <!-- Products -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 flex items-start justify-between">
                    <div>
                        <p class="text-slate-500 font-medium text-sm">Total Products</p>
                        <h3 class="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">${totalProducts.toLocaleString()}</h3>
                        <p class="text-amber-600 text-sm font-medium mt-1 inline-flex items-center">
                            <span class="material-symbols-outlined text-[16px] mr-1">warning</span> ${lowStockCount} Low Stock
                        </p>
                    </div>
                    <div class="bg-amber-50 p-2 md:p-3 rounded-xl text-amber-600">
                        <span class="material-symbols-outlined text-3xl">shopping_bag</span>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <!-- Revenue Chart -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 lg:col-span-2">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Revenue Overview</h3>
                        <span class="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">Last 6 Months</span>
                    </div>
                    <div class="h-64 md:h-80 w-full relative">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>

                <!-- Top Categories -->
                <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
                    <h3 class="text-lg font-semibold text-slate-900 mb-6">Top Categories</h3>
                    <div class="space-y-6">
                        ${topCategories.length > 0 ? topCategories.map(cat => `
                            <div>
                                <div class="flex justify-between text-sm font-medium mb-2">
                                    <span class="text-slate-700 capitalize">${cat.name}</span>
                                    <span class="text-slate-900">${cat.percentage}%</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-2.5">
                                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${cat.percentage}%"></div>
                                </div>
                                <p class="text-xs text-slate-500 mt-1">${formatCurrency(cat.revenue)} revenue</p>
                            </div>
                        `).join('') : '<p class="text-slate-500 text-sm text-center py-8">No sales data yet.</p>'}
                    </div>
                </div>
            </div>

         </div>
    `;

    initDashboardChart(months, revenueData);
}

function initDashboardChart(labels, data) {
    if (dashboardChartInstance) {
        dashboardChartInstance.destroy(); // Destroy previous instance to prevent overlaps on re-render
    }

    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        dashboardChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    borderColor: '#2563eb', // blue-600
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0', // Slate 200
                            borderDash: [5, 5]
                        },
                        ticks: {
                            callback: function (value) {
                                return formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}
