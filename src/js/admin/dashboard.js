// Dashboard functionality
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const recentOrders = document.getElementById('recentOrders');
    const chartPeriod = document.getElementById('chartPeriod');
    const topCategories = document.getElementById('topCategories');
    const topProducts = document.getElementById('topProducts');
    const recentCustomers = document.getElementById('recentCustomers');
    const quickStats = document.getElementById('quickStats');

    // Local Storage Keys
    const STORAGE_KEYS = {
        PRODUCTS: 'gadget_admin_products',
        CATEGORIES: 'gadget_admin_categories',
        INVENTORY_HISTORY: 'gadget_admin_inventory_history',
        DASHBOARD_DATA: 'gadget_admin_dashboard'
    };

    // Dashboard data with fallback
    const DASHBOARD_DATA = {
        revenue: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [28500, 31200, 29800, 36500, 39800, 42580],
                    borderColor: '#2b8cee',
                    backgroundColor: 'rgba(43, 140, 238, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        recentOrders: [
            {
                id: 'ORD-7821',
                customer: 'Alex Smith',
                date: 'Feb 15, 2024',
                amount: '$1,248.00',
                status: 'delivered'
            },
            {
                id: 'ORD-7820',
                customer: 'Maria Johnson',
                date: 'Feb 14, 2024',
                amount: '$1,299.00',
                status: 'shipped'
            },
            {
                id: 'ORD-7819',
                customer: 'Robert Wilson',
                date: 'Feb 14, 2024',
                amount: '$749.00',
                status: 'processing'
            },
            {
                id: 'ORD-7818',
                customer: 'Sarah Chen',
                date: 'Feb 13, 2024',
                amount: '$1,198.00',
                status: 'pending'
            },
            {
                id: 'ORD-7817',
                customer: 'Thomas Miller',
                date: 'Feb 12, 2024',
                amount: '$348.00',
                status: 'cancelled'
            }
        ],
        notifications: [
            {
                id: 1,
                type: 'order',
                title: 'New Order Received',
                message: 'Order #7821 from Alex Smith for $1,248.00',
                time: '10 min ago',
                read: false
            },
            {
                id: 2,
                type: 'inventory',
                title: 'Low Stock Alert',
                message: 'MacBook Air M3 stock is below threshold',
                time: '2 hours ago',
                read: false
            },
            {
                id: 3,
                type: 'customer',
                title: 'New Customer Registered',
                message: 'Emma Davis signed up for premium account',
                time: '1 day ago',
                read: false
            },
            {
                id: 4,
                type: 'system',
                title: 'Backup Completed',
                message: 'System backup completed successfully',
                time: '2 days ago',
                read: true
            },
            {
                id: 5,
                type: 'review',
                title: 'New Product Review',
                message: 'iPhone 15 Pro received a 5-star review',
                time: '3 days ago',
                read: true
            }
        ],
        recentCustomers: [
            {
                id: 1,
                name: 'Alex Smith',
                email: 'alex@example.com',
                initials: 'AS',
                totalSpent: '$15,240',
                orders: 24,
                joinDate: '2023-08-15'
            },
            {
                id: 2,
                name: 'Maria Johnson',
                email: 'maria@example.com',
                initials: 'MJ',
                totalSpent: '$28,950',
                orders: 42,
                joinDate: '2023-06-22'
            },
            {
                id: 3,
                name: 'Emma Davis',
                email: 'emma@example.com',
                initials: 'ED',
                totalSpent: '$42,800',
                orders: 56,
                joinDate: '2023-11-05'
            }
        ]
    };

    // Storage Helper Functions
    class StorageManager {
        static initStorage() {
            // Initialize products if empty (for mock data)
            if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
                const mockProducts = [
                    {
                        id: 1,
                        name: "iPhone 15 Pro",
                        sku: "APP-15P-256",
                        category: "smartphones",
                        brand: "Apple",
                        price: 999.00,
                        stock: 42,
                        status: "instock",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1RYD7d0kHslXStM27Vw-b6UJeh3zmbnRQLud4T7R3RUL9FnSIcGPpDhlvSTmKRmEm83zzBWi3wetM3svok88fCegSOmq9AmR3V_bEy271HM0yjUc9QLdMpTLxdeAKsW5UdAGMwHjZzwb-vaIywTt8YD5kvARpxNronmoH-QGekTkYMjBMbAmNkUyFCrBu8m3SVzCzm3qyQu-MLeglHtGhnDJjV5TzL37kGrTt3b9Ht1M5TYiZOR2EfALq0261KmFcxGuesqMj2eQ",
                        description: "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system."
                    },
                    {
                        id: 2,
                        name: "MacBook Air M3",
                        sku: "APP-MBA-M3",
                        category: "laptops",
                        brand: "Apple",
                        price: 1299.00,
                        stock: 8,
                        status: "lowstock",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANhR9ZVBt6rFIzUvc-Gy-fipQtTPkc7UwJ9rK52zJK-NVkicNz-eTX7IgKNZDDKsQStn8KHynDyQlQeDB5jh0R0zvRj0Dc7ZxB4QLd2sMOEPYX0TRRQNLVQ39vRh50cJkD9CwQpcnX08aR3G6e2JLIrEejGHb0cRbMZSCqpg6_p-pP9RuprQ_9xnzEMS_UYhPxtbKbA54eI03fMW_9PIUMby_qJkEzVD-LFN6baVVFJV2jg_UEhFnMvo1cdBSK3Rbglbn30yLPSHY",
                        description: "Supercharged by M3 chip with up to 18 hours of battery life."
                    },
                    {
                        id: 3,
                        name: "Sony WH-1000XM5",
                        sku: "SNY-XM5-BLK",
                        category: "audio",
                        brand: "Sony",
                        price: 348.00,
                        stock: 156,
                        status: "instock",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8bVs-y3VSoI_GD_Clqj98NAXdQMlv2ZZTBirGlWkaG_YEk-sQkd5gRkvM-vPpMBPwNFwVpavZOB5lUUqmEfIk_OyVah5ut4Qso_Ws7_C4OHHfv3eMki4-_K3oQZTZX-5pEiUI8SUEsQO0lMz9r0VYvKBh2yxCY04OL7VkuzwMa_9apMOeE1yfeMR5wADPjEzmw-jV24sIEaUiq4i6raARft9KRzOhCF5q8dywBUt-qW_td3wF9WalIgUDqTdVPxUZv5z2KdxVSU4",
                        description: "Industry-leading noise cancellation with 30-hour battery life."
                    }
                ];
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
            }

            // Initialize categories if empty
            if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
                const mockCategories = [
                    { id: 1, name: "Smartphones", slug: "smartphones", icon: "smartphone", status: "active", type: "main", productCount: 1, displayOrder: 1 },
                    { id: 2, name: "Laptops", slug: "laptops", icon: "computer", status: "active", type: "main", productCount: 1, displayOrder: 2 },
                    { id: 3, name: "Audio", slug: "audio", icon: "headphones", status: "active", type: "main", productCount: 1, displayOrder: 3 }
                ];
                localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
            }

            // Initialize dashboard data if empty
            if (!localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA)) {
                localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(DASHBOARD_DATA));
            }
        }

        static getProducts() {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        }

        static getCategories() {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
        }

        static getDashboardData() {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA)) || DASHBOARD_DATA;
        }

        static getLowStockProducts() {
            const products = this.getProducts();
            return products.filter(product => product.stock <= 10 && product.stock > 0);
        }

        static getOutOfStockProducts() {
            const products = this.getProducts();
            return products.filter(product => product.stock === 0);
        }

        static getTotalStockValue() {
            const products = this.getProducts();
            return products.reduce((total, product) => total + (product.price * product.stock), 0);
        }

        static getTopProducts(limit = 3) {
            const products = this.getProducts();
            // Sort by stock value (price * quantity sold approximation)
            return products
                .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                .slice(0, limit);
        }

        static getCategoryRevenue() {
            const products = this.getProducts();
            const categories = this.getCategories();

            const categoryRevenue = {};
            categories.forEach(cat => {
                categoryRevenue[cat.slug] = {
                    name: cat.name,
                    revenue: 0,
                    productCount: 0
                };
            });

            products.forEach(product => {
                if (categoryRevenue[product.category]) {
                    categoryRevenue[product.category].revenue += product.price * product.stock;
                    categoryRevenue[product.category].productCount += 1;
                }
            });

            // Calculate percentages
            const totalRevenue = Object.values(categoryRevenue).reduce((sum, cat) => sum + cat.revenue, 0);
            Object.values(categoryRevenue).forEach(cat => {
                cat.percentage = totalRevenue > 0 ? Math.round((cat.revenue / totalRevenue) * 100) : 0;
            });

            // Sort by revenue
            return Object.values(categoryRevenue)
                .filter(cat => cat.revenue > 0)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);
        }
    }

    // Function to open sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden', 'opacity-0');
        sidebarOverlay.classList.add('block', 'opacity-100');
        document.body.style.overflow = 'hidden';
    }

    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.remove('block', 'opacity-100');
        sidebarOverlay.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
    }

    // Function to toggle notifications dropdown
    function toggleNotifications() {
        notificationsDropdown.classList.toggle('hidden');
        if (!notificationsDropdown.classList.contains('hidden')) {
            // Mark notifications as read when dropdown is opened
            const dashboardData = StorageManager.getDashboardData();
            const unreadCount = dashboardData.notifications.filter(n => !n.read).length;
            if (unreadCount > 0) {
                dashboardData.notifications.forEach(n => n.read = true);
                localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(dashboardData));
                updateNotificationBadge();
                populateNotifications();
            }
        }
    }

    // Function to update notification badge
    function updateNotificationBadge() {
        const dashboardData = StorageManager.getDashboardData();
        const unreadCount = dashboardData.notifications.filter(n => !n.read).length;
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }

    // Function to populate notifications
    function populateNotifications() {
        const container = notificationsDropdown.querySelector('.max-h-96');
        container.innerHTML = '';

        const dashboardData = StorageManager.getDashboardData();
        dashboardData.notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${notification.read ? '' : 'bg-blue-50'}`;

            const icon = notification.type === 'order' ? 'shopping_cart' :
                notification.type === 'inventory' ? 'inventory_2' :
                    notification.type === 'customer' ? 'group' :
                        notification.type === 'system' ? 'settings' : 'star';

            const iconColor = notification.type === 'order' ? 'text-primary' :
                notification.type === 'inventory' ? 'text-amber-500' :
                    notification.type === 'customer' ? 'text-emerald-500' :
                        notification.type === 'system' ? 'text-indigo-500' : 'text-amber-500';

            notificationItem.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined ${iconColor}">${icon}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-slate-900">${notification.title}</h4>
                        <p class="text-xs text-slate-500 mt-0.5">${notification.message}</p>
                        <p class="text-xs text-slate-400 mt-1">${notification.time}</p>
                    </div>
                    ${!notification.read ? `
                        <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                    ` : ''}
                </div>
            `;

            container.appendChild(notificationItem);
        });

        updateNotificationBadge();
    }

    // Function to populate recent orders
    function populateRecentOrders() {
        recentOrders.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center">
                    <div class="text-slate-600">
                        <div class="font-bold text-lg mb-1">Coming Soon</div>
                        <div class="text-sm text-slate-400">No data yet</div>
                    </div>
                </td>
            </tr>
        `;
    }

    // Function to populate top categories
    function populateTopCategories() {
        topCategories.innerHTML = '';

        const categoryRevenue = StorageManager.getCategoryRevenue();

        if (categoryRevenue.length === 0) {
            topCategories.innerHTML = `
                <div class="text-center py-4 text-slate-500">
                    No category revenue data available
                </div>
            `;
            return;
        }

        const colors = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];

        categoryRevenue.forEach((category, index) => {
            const color = colors[index] || 'bg-slate-500';
            const revenueFormatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(category.revenue);

            const categoryItem = document.createElement('div');
            categoryItem.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-slate-900">${category.name}</span>
                        <span class="text-sm font-medium text-slate-900">${category.percentage}%</span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full ${color} rounded-full" style="width: ${category.percentage}%"></div>
                    </div>
                    <div class="text-xs text-slate-500 mt-1">${revenueFormatted} revenue • ${category.productCount} products</div>
                </div>
            `;
            topCategories.appendChild(categoryItem);
        });
    }

    // Function to populate top products
    function populateTopProducts() {
        topProducts.innerHTML = '';

        const topProductsData = StorageManager.getTopProducts(8);

        if (topProductsData.length === 0) {
            topProducts.innerHTML = `
                <div class="text-center py-4 text-slate-500">
                    No products available
                </div>
            `;
            return;
        }

        topProductsData.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'flex items-center gap-3';
            productItem.innerHTML = `
                <div class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-slate-900 truncate">${product.name}</h4>
                    <p class="text-xs text-slate-500">${product.stock} in stock • ${getStatusText(product.status)}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold text-slate-900">$${(product.price * product.stock).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                    <div class="text-xs ${product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}">${product.stock <= 10 ? 'Low stock' : 'Trending'}</div>
                </div>
            `;
            topProducts.appendChild(productItem);
        });
    }

    // Function to populate recent customers
    function populateRecentCustomers() {
        recentCustomers.innerHTML = `
            <div class="text-center py-8">
                <div class="text-slate-600">
                    <div class="font-bold text-lg mb-1">Coming Soon</div>
                    <div class="text-sm text-slate-400">No data yet</div>
                </div>
            </div>
        `;
    }

    // Function to populate quick stats
    function populateQuickStats() {
        quickStats.innerHTML = '';

        const products = StorageManager.getProducts();
        const lowStockProducts = StorageManager.getLowStockProducts();
        const outOfStockProducts = StorageManager.getOutOfStockProducts();
        const totalStockValue = StorageManager.getTotalStockValue();

        const stats = [
            {
                icon: 'pending',
                color: 'blue',
                title: 'Pending Orders',
                value: 'N/A',
                change: '+0 today',
                changeColor: 'text-amber-600'
            },
            {
                icon: 'local_shipping',
                color: 'emerald',
                title: 'Processing',
                value: 'N/A',
                change: '-0 today',
                changeColor: 'text-slate-600'
            },
            {
                icon: 'cancel',
                color: 'rose',
                title: 'Out of Stock',
                value: outOfStockProducts.length.toString(),
                change: 'Requires attention',
                changeColor: 'text-rose-600'
            },
            {
                icon: 'star',
                color: 'indigo',
                title: 'Avg. Rating',
                value: 'N/A',
                change: '+0.0 this month',
                changeColor: 'text-emerald-600'
            }
        ];

        stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'flex items-center justify-between';
            statItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center">
                        <span class="material-symbols-outlined text-${stat.color}-500">${stat.icon}</span>
                    </div>
                    <div>
                        <p class="text-sm text-slate-500">${stat.title}</p>
                        <p class="text-lg font-bold text-slate-900">${stat.value}</p>
                    </div>
                </div>
                <span class="text-xs font-medium ${stat.changeColor}">${stat.change}</span>
            `;
            quickStats.appendChild(statItem);
        });
    }

    // Function to update dashboard summary
    function updateDashboardSummary() {
        const products = StorageManager.getProducts();
        const lowStockProducts = StorageManager.getLowStockProducts();
        const outOfStockProducts = StorageManager.getOutOfStockProducts();
        const totalStockValue = StorageManager.getTotalStockValue();

        // Update total products
        document.getElementById('totalProducts').textContent = products.length.toString();

        // Update low stock count
        document.getElementById('lowStockCount').textContent = lowStockProducts.length.toString();

        // Update total revenue (based on stock value)
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(totalStockValue);

        document.getElementById('totalRevenue').textContent = formattedValue;
    }

    // Helper function for status text
    function getStatusText(status) {
        switch (status) {
            case 'instock': return 'In Stock';
            case 'lowstock': return 'Low Stock';
            case 'outstock': return 'Out of Stock';
            default: return 'Unknown';
        }
    }

    // Function to initialize revenue chart
    function initRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');

        // Destroy existing chart if it exists
        if (window.revenueChartInstance) {
            window.revenueChartInstance.destroy();
        }

        const dashboardData = StorageManager.getDashboardData();

        window.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: dashboardData.revenue,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                return `$${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    // Function to update chart data based on period
    function updateChartData(period) {
        let newData;

        switch (period) {
            case '1y':
                newData = {
                    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
                    data: [24500, 26800, 28500, 31200, 29800, 32000, 28500, 31200, 29800, 36500, 39800, 42580]
                };
                break;
            case 'ytd':
                newData = {
                    labels: ['Jan', 'Feb'],
                    data: [39800, 42580]
                };
                break;
            default: // 6m
                const dashboardData = StorageManager.getDashboardData();
                newData = {
                    labels: dashboardData.revenue.labels,
                    data: dashboardData.revenue.datasets[0].data
                };
        }

        window.revenueChartInstance.data.labels = newData.labels;
        window.revenueChartInstance.data.datasets[0].data = newData.data;
        window.revenueChartInstance.update();
    }

    // Function to update live statistics (simulated)
    function updateLiveStatistics() {
        // Update low stock count from real data
        const lowStockProducts = StorageManager.getLowStockProducts();
        document.getElementById('lowStockCount').textContent = lowStockProducts.length.toString();

        // Update notification badge randomly
        if (Math.random() > 0.8) { // 20% chance to add notification
            const dashboardData = StorageManager.getDashboardData();
            const unreadCount = dashboardData.notifications.filter(n => !n.read).length;
            if (unreadCount < 5) {
                dashboardData.notifications.unshift({
                    id: Date.now(),
                    type: 'order',
                    title: 'New Order Received',
                    message: `Order #${Math.floor(Math.random() * 1000)} received`,
                    time: 'Just now',
                    read: false
                });
                localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(dashboardData));
                updateNotificationBadge();
                populateNotifications();
            }
        }
    }

    // Initialize dashboard
    function initDashboard() {
        StorageManager.initStorage();
        populateNotifications();
        populateRecentOrders();
        populateTopCategories();
        populateTopProducts();
        populateRecentCustomers();
        populateQuickStats();
        updateDashboardSummary();
        initRevenueChart();
        updateNotificationBadge();

        // Start live updates
        setInterval(updateLiveStatistics, 30000); // Update every 30 seconds
    }

    // Event listeners
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    notificationsBtn.addEventListener('click', toggleNotifications);

    // Chart period change
    chartPeriod.addEventListener('change', function () {
        updateChartData(this.value);
    });

    // Close notifications dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!notificationsBtn.contains(event.target) && !notificationsDropdown.contains(event.target)) {
            notificationsDropdown.classList.add('hidden');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnOpenBtn = openSidebarBtn.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnOpenBtn && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
            closeSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        } else {
            if (!sidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        }
    });

    // Handle escape key for closing sidebar and notifications
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (!notificationsDropdown.classList.contains('hidden')) {
                notificationsDropdown.classList.add('hidden');
            }
            if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                closeSidebar();
            }
        }
    });

    // Initialize the dashboard
    initDashboard();
});