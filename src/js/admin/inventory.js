/**
 * Gadget Admin - Inventory Management
 * Handles inventory management functionality including stock updates, filters, and reports
 */

// Local Storage Keys (shared with other pages)
const STORAGE_KEYS = {
    PRODUCTS: 'gadget_admin_products',
    CATEGORIES: 'gadget_admin_categories',
    INVENTORY_HISTORY: 'gadget_admin_inventory_history'
};

// Storage Helper Functions
class StorageManager {
    static initStorage() {
        // Initialize storage if empty (shared with other pages)
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            // Use mock data from products page
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
                    description: "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.",
                    minStock: 20
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
                    description: "Supercharged by M3 chip with up to 18 hours of battery life.",
                    minStock: 15
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
                    description: "Industry-leading noise cancellation with 30-hour battery life.",
                    minStock: 50
                },
                {
                    id: 4,
                    name: "Google Pixel 8",
                    sku: "GGL-PX8-128",
                    category: "smartphones",
                    brand: "Google",
                    price: 699.00,
                    stock: 0,
                    status: "outstock",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1tUR_ZcU38wwDO1iyq7ukS8EA7BWMtSDT0hq9QFzs15vjN9fgg_buh_KaE2ak-zA8Y6W1-iZDgUdfxtXqBQxL3grtp_uZ2AVsrQ6pModS23F26q0eQcUvEof0wqn_mCRbsTs--GgkFYKN7CA0o2SzMwjouP5SNGS9i1lPEEKtbAiUcWt3EKGvRMK59etzb4WpgdG1m2ItaN_k4SV_Sl303vhZfc9hmYNsUbZumzLEhiF9MvQAVLN-YPEjgOwNXHC96bftuMyXF8",
                    description: "Powered by Google AI with advanced photo editing tools.",
                    minStock: 10
                },
                {
                    id: 5,
                    name: "Logitech G Pro X",
                    sku: "LOG-GPX-WHT",
                    category: "accessories",
                    brand: "Logitech",
                    price: 149.99,
                    stock: 89,
                    status: "instock",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCeOgHJ9MnfsowZI6Qh3EWCfSy2MrJLx63nP-nz2zu0yZOIdDLDJKtj-ehVyK25HIUoxATZxO8ucYdtBSaX0lMzHG05ue7y_8aIngXfXopJWwy5xnlVwJNvSqnUEwz211dRZxA5fdJl3jyfXi1wNQpWFOixxkPgGue24p6MP8KUmeRFq3TS7rDe6ahUezapUOKXr94GE37I4D2yIVnj8Imk67xIG0ke0pyu0MKpWMivUZpez1LGbuUDEwM8ZwUcl0037zyhISAWyw",
                    description: "Professional-grade gaming headset with Blue VO!CE microphone technology.",
                    minStock: 30
                }
            ];
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
        }

        // Initialize categories if empty
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            const mockCategories = [
                { id: 1, name: "Smartphones", slug: "smartphones", icon: "smartphone", status: "active", type: "main", productCount: 2, displayOrder: 1 },
                { id: 2, name: "Laptops", slug: "laptops", icon: "computer", status: "active", type: "main", productCount: 1, displayOrder: 2 },
                { id: 3, name: "Audio", slug: "audio", icon: "headphones", status: "active", type: "main", productCount: 1, displayOrder: 3 },
                { id: 4, name: "Accessories", slug: "accessories", icon: "cable", status: "active", type: "main", productCount: 1, displayOrder: 4 }
            ];
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
        }

        // Initialize inventory history if empty
        if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_HISTORY)) {
            localStorage.setItem(STORAGE_KEYS.INVENTORY_HISTORY, JSON.stringify([]));
        }
    }

    static getProducts() {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        return products.map(product => ({
            ...product,
            inventoryStatus: this.getInventoryStatus(product.stock, product.minStock || 10)
        }));
    }

    static saveProducts(products) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    static getCategories() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    }

    static getInventoryHistory() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY_HISTORY)) || [];
    }

    static saveInventoryHistory(history) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY_HISTORY, JSON.stringify(history));
    }

    static getInventoryStatus(currentStock, minStock) {
        if (minStock === undefined) {
            minStock = (typeof SettingsManager !== 'undefined') ? SettingsManager.getSetting('lowStockThreshold') : 10;
        }
        if (currentStock === 0) return 'out_of_stock';
        if (currentStock <= minStock) return 'low_stock';
        return 'in_stock';
    }

    static getLowStockProducts() {
        const products = this.getProducts();
        return products.filter(product => product.inventoryStatus === 'low_stock');
    }

    static getOutOfStockProducts() {
        const products = this.getProducts();
        return products.filter(product => product.inventoryStatus === 'out_of_stock');
    }

    static getTotalStockValue() {
        const products = this.getProducts();
        return products.reduce((total, product) => total + (product.price * product.stock), 0);
    }

    static getTotalStockCount() {
        const products = this.getProducts();
        return products.reduce((total, product) => total + product.stock, 0);
    }

    static updateProductStock(productId, quantity, type, reason, notes) {
        const products = this.getProducts();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) return null;

        const product = products[productIndex];
        const oldStock = product.stock;
        const newStock = type === 'add' ? oldStock + quantity : oldStock - quantity;

        if (newStock < 0) {
            throw new Error('Cannot remove more stock than available');
        }

        // Update product stock
        product.stock = newStock;
        product.status = newStock > 20 ? 'instock' : newStock > 0 ? 'lowstock' : 'outstock';

        // Save updated products
        this.saveProducts(products);

        // Log to inventory history
        const history = this.getInventoryHistory();
        const historyEntry = {
            id: history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1,
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            type: type,
            quantity: quantity,
            oldStock: oldStock,
            newStock: newStock,
            reason: reason,
            notes: notes,
            timestamp: new Date().toISOString(),
            user: "Admin"
        };

        history.unshift(historyEntry);
        this.saveInventoryHistory(history);

        return {
            product: product,
            historyEntry: historyEntry
        };
    }
}

// Inventory Manager Class
class InventoryManager {
    constructor() {
        this.currentInventory = [];
        this.selectedProduct = null;
        this.updateType = 'add';

        this.initializeElements();
        this.bindEvents();
        this.initializePage();
    }

    initializeElements() {
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.openSidebarBtn = document.getElementById('openSidebar');
        this.closeSidebarBtn = document.getElementById('closeSidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');

        // Modal elements
        this.modal = document.getElementById('updateStockModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.updateBtn = document.getElementById('updateStockBtn');
        this.lowStockReportBtn = document.getElementById('lowStockReport');

        // Filter elements
        this.searchInput = document.getElementById('searchInput');
        this.stockFilter = document.getElementById('stockFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.inventoryTable = document.getElementById('inventoryTable');

        // Update form elements
        this.typeAddBtn = document.getElementById('typeAdd');
        this.typeRemoveBtn = document.getElementById('typeRemove');
        this.quantityInput = document.getElementById('quantityInput');
        this.reasonSelect = document.getElementById('reasonSelect');
        this.notesInput = document.getElementById('notesInput');

        // Product info elements
        this.productName = document.getElementById('productName');
        this.productSku = document.getElementById('productSku');
        this.currentStock = document.getElementById('currentStock');
        this.productImage = document.getElementById('productImage');

        // Preview elements
        this.previewCurrent = document.getElementById('previewCurrent');
        this.previewQuantity = document.getElementById('previewQuantity');
        this.previewTypeLabel = document.getElementById('previewTypeLabel');
        this.previewNew = document.getElementById('previewNew');
        this.updateIcon = document.getElementById('updateIcon');
    }

    bindEvents() {
        // Sidebar events
        this.openSidebarBtn?.addEventListener('click', () => this.openSidebar());
        this.closeSidebarBtn?.addEventListener('click', () => this.closeSidebar());
        this.sidebarOverlay?.addEventListener('click', () => this.closeSidebar());

        // Modal events
        this.closeModalBtn?.addEventListener('click', () => this.closeModal());
        this.cancelBtn?.addEventListener('click', () => this.closeModal());
        this.updateBtn?.addEventListener('click', () => this.updateStock());
        this.lowStockReportBtn?.addEventListener('click', () => this.showLowStockReport());

        // Filter events
        this.searchInput?.addEventListener('input', () => this.filterInventory());
        this.stockFilter?.addEventListener('change', () => this.filterInventory());
        this.categoryFilter?.addEventListener('change', () => this.filterInventory());

        // Update type events
        this.typeAddBtn?.addEventListener('click', () => this.setUpdateType('add'));
        this.typeRemoveBtn?.addEventListener('click', () => this.setUpdateType('remove'));

        // Preview events
        this.quantityInput?.addEventListener('input', () => this.updatePreview());

        // Modal close on outside click
        this.modal?.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const isClickInsideSidebar = this.sidebar?.contains(event.target);
            const isClickOnOpenBtn = this.openSidebarBtn?.contains(event.target);

            if (!isClickInsideSidebar && !isClickOnOpenBtn && !this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                this.closeSidebar();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (!this.modal?.classList.contains('hidden')) {
                    this.closeModal();
                }
                if (!this.sidebar?.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.sidebar?.classList.remove('-translate-x-full');
                this.sidebarOverlay?.classList.add('hidden');
            } else {
                if (!this.sidebar?.classList.contains('-translate-x-full')) {
                    this.closeSidebar();
                }
            }
        });
    }

    initializePage() {
        // Initialize storage
        StorageManager.initStorage();

        // Get data from localStorage
        const products = StorageManager.getProducts();
        const categories = StorageManager.getCategories();

        // Populate category dropdown
        this.populateCategoryDropdown(categories);

        // Set current inventory and render
        this.currentInventory = [...products];
        this.renderInventory(this.currentInventory);
        this.updateSummaryCards();
    }

    populateCategoryDropdown(categories) {
        if (!this.categoryFilter) return;

        this.categoryFilter.innerHTML = '<option value="">All Categories</option>';

        categories
            .filter(cat => cat.status === 'active')
            .forEach(category => {
                const option = document.createElement('option');
                option.value = category.slug;
                option.textContent = category.name;
                this.categoryFilter.appendChild(option);
            });
    }

    openSidebar() {
        this.sidebar?.classList.remove('-translate-x-full');
        this.sidebarOverlay?.classList.remove('hidden', 'opacity-0');
        this.sidebarOverlay?.classList.add('block', 'opacity-100');
        document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
        this.sidebar?.classList.add('-translate-x-full');
        this.sidebarOverlay?.classList.remove('block', 'opacity-100');
        this.sidebarOverlay?.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
    }

    openUpdateModal(product) {
        this.selectedProduct = product;

        // Set modal title and product info
        this.productName.textContent = product.name;
        this.productSku.textContent = `SKU: ${product.sku}`;
        this.currentStock.innerHTML = `Current Stock: <span class="text-slate-900">${product.stock}</span>`;
        this.productImage.innerHTML = `<img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover">`;

        // Reset form
        this.setUpdateType('add');
        this.quantityInput.value = '';
        this.reasonSelect.value = 'restock';
        this.notesInput.value = '';

        // Update preview
        this.updatePreview();

        // Open modal
        this.modal?.classList.remove('hidden');
        this.modal?.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal?.classList.remove('flex');
        this.modal?.classList.add('hidden');
        document.body.style.overflow = '';
        this.selectedProduct = null;
    }

    setUpdateType(type) {
        this.updateType = type;

        if (type === 'add') {
            this.typeAddBtn?.classList.add('border-emerald-500', 'bg-emerald-500', 'text-white');
            this.typeAddBtn?.classList.remove('border-emerald-200', 'bg-emerald-50', 'text-emerald-700');
            this.typeRemoveBtn?.classList.remove('border-rose-500', 'bg-rose-500', 'text-white');
            this.typeRemoveBtn?.classList.add('border-rose-200', 'bg-rose-50', 'text-rose-700');
        } else {
            this.typeRemoveBtn?.classList.add('border-rose-500', 'bg-rose-500', 'text-white');
            this.typeRemoveBtn?.classList.remove('border-rose-200', 'bg-rose-50', 'text-rose-700');
            this.typeAddBtn?.classList.remove('border-emerald-500', 'bg-emerald-500', 'text-white');
            this.typeAddBtn?.classList.add('border-emerald-200', 'bg-emerald-50', 'text-emerald-700');
        }

        this.updatePreview();
    }

    renderInventory(inventoryToRender) {
        if (!this.inventoryTable) return;

        this.inventoryTable.innerHTML = '';

        inventoryToRender.forEach(item => {
            const statusClass = this.getStatusClass(item.inventoryStatus);
            const statusText = this.getStatusText(item.inventoryStatus);
            const invCurrency = (typeof SettingsManager !== 'undefined') ? SettingsManager.getSetting('currency') : 'USD';
            const stockValue = (item.stock * item.price).toLocaleString('en-US', {
                style: 'currency',
                currency: invCurrency
            });
            const minStock = item.minStock || 10;

            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-50 transition-colors';
            row.innerHTML = `
                <td class="px-4 md:px-6 py-4">
                    <div class="flex items-center">
                        <div class="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover">
                        </div>
                        <div class="ml-3">
                            <div class="font-medium text-slate-900">${item.name}</div>
                            <div class="text-slate-500 text-xs mt-0.5">${item.sku}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-slate-600">
                    ${this.getCategoryName(item.category)}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div class="text-lg font-bold text-slate-900">${item.stock}</div>
                    <div class="text-xs text-slate-500">units</div>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-slate-600">
                    ${minStock}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${this.getStatusDotClass(item.inventoryStatus)} mr-1.5"></span>
                        ${statusText}
                    </span>
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    ${stockValue}
                </td>
                <td class="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-slate-400 hover:text-primary transition-colors p-1 update-btn" data-id="${item.id}" title="Update Stock">
                        <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button class="text-slate-400 hover:text-primary transition-colors p-1 view-btn" data-id="${item.id}" title="View History">
                        <span class="material-symbols-outlined text-[20px]">history</span>
                    </button>
                </td>
            `;
            this.inventoryTable.appendChild(row);
        });

        // Update count
        const totalProducts = StorageManager.getProducts().length;
        const inventoryCount = document.getElementById('inventoryCount');
        if (inventoryCount) {
            inventoryCount.textContent =
                `Showing <span class="font-medium">1</span> to <span class="font-medium">${inventoryToRender.length}</span> of <span class="font-medium">${totalProducts}</span> results`;
        }

        // Add event listeners to action buttons
        setTimeout(() => {
            document.querySelectorAll('.update-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    const product = this.currentInventory.find(p => p.id === id);
                    if (product) {
                        this.openUpdateModal(product);
                    }
                });
            });

            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    this.showHistory(id);
                });
            });
        }, 0);
    }

    getCategoryName(slug) {
        const categories = StorageManager.getCategories();
        const category = categories.find(c => c.slug === slug);
        return category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1);
    }

    getStatusClass(status) {
        switch (status) {
            case 'in_stock': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'low_stock': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'out_of_stock': return 'bg-rose-100 text-rose-800 border border-rose-200';
            default: return 'bg-slate-100 text-slate-800 border border-slate-200';
        }
    }

    getStatusDotClass(status) {
        switch (status) {
            case 'in_stock': return 'bg-emerald-500';
            case 'low_stock': return 'bg-amber-500';
            case 'out_of_stock': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'in_stock': return 'In Stock';
            case 'low_stock': return 'Low Stock';
            case 'out_of_stock': return 'Out of Stock';
            default: return 'Unknown';
        }
    }

    updateSummaryCards() {
        const totalValue = StorageManager.getTotalStockValue();
        const totalItems = StorageManager.getTotalStockCount();
        const lowStockCount = StorageManager.getLowStockProducts().length;
        const outOfStockCount = StorageManager.getOutOfStockProducts().length;

        const totalValueEl = document.getElementById('totalValue');
        const totalItemsEl = document.getElementById('totalItems');
        const lowStockCountEl = document.getElementById('lowStockCount');
        const outOfStockCountEl = document.getElementById('outOfStockCount');

        if (totalValueEl) {
            const sumCurrency = (typeof SettingsManager !== 'undefined') ? SettingsManager.getSetting('currency') : 'USD';
            totalValueEl.textContent = totalValue.toLocaleString('en-US', {
                style: 'currency',
                currency: sumCurrency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }

        if (totalItemsEl) totalItemsEl.textContent = totalItems.toLocaleString();
        if (lowStockCountEl) lowStockCountEl.textContent = lowStockCount;
        if (outOfStockCountEl) outOfStockCountEl.textContent = outOfStockCount;
    }

    filterInventory() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const stockStatus = this.stockFilter?.value || '';
        const category = this.categoryFilter?.value || '';
        const products = StorageManager.getProducts();

        this.currentInventory = products.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                item.sku.toLowerCase().includes(searchTerm) ||
                item.brand.toLowerCase().includes(searchTerm);
            const matchesStock = !stockStatus || item.inventoryStatus === stockStatus;
            const matchesCategory = !category || item.category === category;

            return matchesSearch && matchesStock && matchesCategory;
        });

        this.renderInventory(this.currentInventory);
    }

    updateStock() {
        const quantity = parseInt(this.quantityInput?.value);
        const reason = this.reasonSelect?.value;
        const notes = this.notesInput?.value.trim();

        // Validation
        if (!quantity || quantity <= 0) {
            this.showNotification('Please enter a valid quantity', 'error');
            return;
        }

        if (this.updateType === 'remove' && quantity > this.selectedProduct.stock) {
            this.showNotification('Cannot remove more stock than available', 'error');
            return;
        }

        // Show loading state
        const originalIcon = this.updateIcon?.innerHTML;
        if (this.updateIcon) {
            this.updateIcon.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>';
        }
        this.updateBtn.disabled = true;

        try {
            // Update stock in localStorage
            const result = StorageManager.updateProductStock(
                this.selectedProduct.id,
                quantity,
                this.updateType,
                reason,
                notes
            );

            if (result) {
                // Update UI
                const updatedProducts = StorageManager.getProducts();
                this.currentInventory = [...updatedProducts];
                this.filterInventory();
                this.updateSummaryCards();

                // Close modal
                this.closeModal();

                // Show success notification
                this.showNotification(`Stock ${this.updateType === 'add' ? 'added' : 'removed'} successfully!`);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            // Reset loading state
            if (this.updateIcon) {
                this.updateIcon.innerHTML = originalIcon;
            }
            this.updateBtn.disabled = false;
        }
    }

    updatePreview() {
        if (!this.selectedProduct) return;

        const quantity = parseInt(this.quantityInput?.value) || 0;
        const current = this.selectedProduct.stock;

        if (this.previewCurrent) this.previewCurrent.textContent = current;
        if (this.previewQuantity) {
            this.previewQuantity.textContent = this.updateType === 'add' ? `+${quantity}` : `-${quantity}`;
            this.previewQuantity.className = this.updateType === 'add' ? 'font-medium text-emerald-600' : 'font-medium text-rose-600';
        }
        if (this.previewTypeLabel) {
            this.previewTypeLabel.textContent = this.updateType === 'add' ? 'Adding:' : 'Removing:';
        }

        const newStock = this.updateType === 'add' ? current + quantity : current - quantity;
        if (this.previewNew) this.previewNew.textContent = newStock;
    }

    showHistory(productId) {
        const product = this.currentInventory.find(p => p.id === productId);
        if (!product) return;

        const history = StorageManager.getInventoryHistory();
        const productHistory = history.filter(h => h.productId === productId);

        // Create modal for history
        const historyModal = document.createElement('div');
        historyModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in modal-overlay';
        historyModal.innerHTML = `
            <div class="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                <div class="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900">Stock History: ${product.name}</h3>
                        <p class="text-sm text-slate-500 mt-0.5">All stock updates for this product</p>
                    </div>
                    <button class="close-history-modal w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                    ${productHistory.length > 0 ? `
                        <div class="space-y-4">
                            ${productHistory.map(entry => `
                                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="flex items-center gap-2">
                                            <span class="material-symbols-outlined ${entry.type === 'add' ? 'text-emerald-500' : 'text-rose-500'}">
                                                ${entry.type === 'add' ? 'add' : 'remove'}
                                            </span>
                                            <span class="font-medium text-slate-900">${entry.type === 'add' ? 'Stock Added' : 'Stock Removed'}</span>
                                        </div>
                                        <span class="text-sm text-slate-500">${new Date(entry.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <p class="text-xs text-slate-500">Quantity</p>
                                            <p class="font-medium ${entry.type === 'add' ? 'text-emerald-600' : 'text-rose-600'}">
                                                ${entry.type === 'add' ? '+' : '-'}${entry.quantity}
                                            </p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500">Reason</p>
                                            <p class="font-medium text-slate-900">${entry.reason.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500">From</p>
                                            <p class="font-medium text-slate-900">${entry.oldStock}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500">To</p>
                                            <p class="font-medium text-slate-900">${entry.newStock}</p>
                                        </div>
                                    </div>
                                    ${entry.notes ? `
                                        <div class="mt-3 pt-3 border-t border-slate-100">
                                            <p class="text-xs text-slate-500">Notes</p>
                                            <p class="text-sm text-slate-900">${entry.notes}</p>
                                        </div>
                                    ` : ''}
                                    <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                                        Updated by: ${entry.user} • ${new Date(entry.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12">
                            <span class="material-symbols-outlined text-4xl text-slate-300 mb-3">history</span>
                            <p class="text-slate-500">No stock history available for this product</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(historyModal);
        document.body.style.overflow = 'hidden';

        // Add close event
        historyModal.querySelector('.close-history-modal').addEventListener('click', () => {
            historyModal.remove();
            document.body.style.overflow = '';
        });

        // Close when clicking outside
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                historyModal.remove();
                document.body.style.overflow = '';
            }
        });
    }

    showLowStockReport() {
        const lowStockProducts = StorageManager.getLowStockProducts();
        const outOfStockProducts = StorageManager.getOutOfStockProducts();
        const allLowStock = [...lowStockProducts, ...outOfStockProducts];

        // Create report modal
        const reportModal = document.createElement('div');
        reportModal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in modal-overlay';
        reportModal.innerHTML = `
            <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                <div class="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900">Low Stock Report</h3>
                        <p class="text-sm text-slate-500 mt-0.5">Products that need attention</p>
                    </div>
                    <button class="close-report-modal w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="mb-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div class="text-amber-800 font-semibold">Low Stock Items: ${lowStockProducts.length}</div>
                                <div class="text-sm text-amber-600 mt-1">Stock below minimum level</div>
                            </div>
                            <div class="bg-rose-50 border border-rose-200 rounded-xl p-4">
                                <div class="text-rose-800 font-semibold">Out of Stock: ${outOfStockProducts.length}</div>
                                <div class="text-sm text-rose-600 mt-1">No stock available</div>
                            </div>
                        </div>
                    </div>
                    
                    ${allLowStock.length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-slate-200">
                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Current Stock</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Min Level</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Difference</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Action Needed</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    ${allLowStock.map(item => {
            const minStock = item.minStock || 10;
            const difference = minStock - item.stock;
            const actionNeeded = item.inventoryStatus === 'out_of_stock' ? 'URGENT: Restock immediately' : `Restock ${difference} units`;
            return `
                                            <tr class="hover:bg-slate-50">
                                                <td class="px-4 py-3">
                                                    <div class="flex items-center">
                                                        <div class="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                            <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover">
                                                        </div>
                                                        <div class="ml-3">
                                                            <div class="font-medium text-slate-900">${item.name}</div>
                                                            <div class="text-slate-500 text-xs">${item.sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-3 font-medium ${item.inventoryStatus === 'out_of_stock' ? 'text-rose-600' : 'text-amber-600'}">${item.stock}</td>
                                                <td class="px-4 py-3 text-slate-600">${minStock}</td>
                                                <td class="px-4 py-3 font-bold ${difference > 0 ? 'text-rose-600' : 'text-slate-600'}">${difference > 0 ? `-${difference}` : difference}</td>
                                                <td class="px-4 py-3">
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${this.getStatusClass(item.inventoryStatus)}">
                                                        ${this.getStatusText(item.inventoryStatus)}
                                                    </span>
                                                </td>
                                                <td class="px-4 py-3">
                                                    <span class="text-sm ${item.inventoryStatus === 'out_of_stock' ? 'text-rose-600 font-semibold' : 'text-amber-600'}">${actionNeeded}</span>
                                                </td>
                                            </tr>
                                        `;
        }).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="text-center py-12">
                            <span class="material-symbols-outlined text-4xl text-emerald-300 mb-3">check_circle</span>
                            <p class="text-slate-500">All products have sufficient stock!</p>
                        </div>
                    `}
                </div>
                <div class="px-6 md:px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                    <button class="print-report px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50">
                        Print Report
                    </button>
                    <button class="export-report px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-blue-600">
                        Export as PDF
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(reportModal);
        document.body.style.overflow = 'hidden';

        // Add event listeners
        reportModal.querySelector('.close-report-modal').addEventListener('click', () => {
            reportModal.remove();
            document.body.style.overflow = '';
        });

        reportModal.querySelector('.print-report').addEventListener('click', () => {
            window.print();
        });

        reportModal.querySelector('.export-report').addEventListener('click', () => {
            // Simulate export
            const btn = reportModal.querySelector('.export-report');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Exporting...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                this.showNotification('Report exported successfully!');
            }, 1500);
        });

        // Close when clicking outside
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                reportModal.remove();
                document.body.style.overflow = '';
            }
        });
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Inventory Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const inventoryManager = new InventoryManager();
});