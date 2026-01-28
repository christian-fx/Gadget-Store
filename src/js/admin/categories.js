// Local Storage Keys (shared with products page)
const STORAGE_KEYS = {
    PRODUCTS: 'gadget_admin_products',
    CATEGORIES: 'gadget_admin_categories',
    INVENTORY_HISTORY: 'gadget_admin_inventory_history'
};

// Available icons for selection
const availableIcons = [
    "smartphone", "computer", "headphones", "tablet", "watch", "cable",
    "photo_camera", "tv", "videogame_asset", "speaker", "keyboard",
    "mouse", "memory", "sd_storage", "usb", "power", "battery_full",
    "router", "wifi", "bluetooth", "sports_esports", "toys", "home",
    "kitchen", "car_repair", "construction", "fitness_center", "medical_services",
    "devices", "shopping_bag", "shopping_cart", "group", "category", "inventory_2",
    "settings", "attach_money", "dashboard", "menu_book", "flight", "view_in_ar",
    "desktop_windows", "home", "star", "local_shipping", "warning", "cancel",
    "check_circle", "error", "refresh", "close", "add", "remove", "edit",
    "visibility", "delete", "search", "expand_more", "filter_alt", "layers",
    "subdirectory_arrow_right", "cloud_upload", "feed", "payments", "imagesmode",
    "pending", "backup", "history"
];

// Mock categories data
const MOCK_CATEGORIES = [
    { id: 1, name: "Smartphones", slug: "smartphones", icon: "smartphone", status: "active", type: "main", productCount: 4, displayOrder: 1, description: "Mobile phones and accessories" },
    { id: 2, name: "Laptops", slug: "laptops", icon: "computer", status: "active", type: "main", productCount: 4, displayOrder: 2, description: "Portable computers and workstations" },
    { id: 3, name: "Audio", slug: "audio", icon: "headphones", status: "active", type: "main", productCount: 5, displayOrder: 3, description: "Headphones, speakers, and audio equipment" },
    { id: 4, name: "Tablets", slug: "tablets", icon: "tablet", status: "active", type: "main", productCount: 2, displayOrder: 4, description: "Tablet devices and accessories" },
    { id: 5, name: "Wearables", slug: "wearables", icon: "watch", status: "active", type: "main", productCount: 2, displayOrder: 5, description: "Smart watches and fitness trackers" },
    { id: 6, name: "Accessories", slug: "accessories", icon: "cable", status: "active", type: "main", productCount: 4, displayOrder: 6, description: "Cases, cables, and other accessories" },
    { id: 7, name: "Gaming", slug: "gaming", icon: "sports_esports", status: "active", type: "main", productCount: 3, displayOrder: 7, description: "Gaming consoles and accessories" },
    { id: 8, name: "Cameras", slug: "cameras", icon: "photo_camera", status: "active", type: "main", productCount: 1, displayOrder: 8, description: "Cameras and photography equipment" },
    { id: 9, name: "Drones", slug: "drones", icon: "flight", status: "active", type: "main", productCount: 1, displayOrder: 9, description: "Drones and aerial photography equipment" },
    { id: 10, name: "E-readers", slug: "e-readers", icon: "menu_book", status: "active", type: "main", productCount: 1, displayOrder: 10, description: "E-readers and digital books" },
    { id: 11, name: "VR", slug: "vr", icon: "view_in_ar", status: "active", type: "main", productCount: 1, displayOrder: 11, description: "Virtual reality headsets and equipment" },
    { id: 12, name: "TVs", slug: "tvs", icon: "tv", status: "active", type: "main", productCount: 1, displayOrder: 12, description: "Televisions and home entertainment" },
    { id: 13, name: "Monitors", slug: "monitors", icon: "desktop_windows", status: "active", type: "main", productCount: 1, displayOrder: 13, description: "Computer monitors and displays" },
    { id: 14, name: "Storage", slug: "storage", icon: "sd_storage", status: "active", type: "main", productCount: 1, displayOrder: 14, description: "Storage devices and memory cards" },
    { id: 15, name: "Smart Home", slug: "smart-home", icon: "home", status: "active", type: "main", productCount: 1, displayOrder: 15, description: "Smart home devices and automation" }
];

// Storage Helper Functions
class StorageManager {
    static initStorage() {
        // Initialize categories in localStorage if empty
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
        }
        
        // Initialize other storage if needed
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_HISTORY)) {
            localStorage.setItem(STORAGE_KEYS.INVENTORY_HISTORY, JSON.stringify([]));
        }
    }
    
    static getCategories() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    }
    
    static saveCategories(categories) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    
    static getProducts() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    }
    
    static getNextCategoryId() {
        const categories = this.getCategories();
        return categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    }
    
    static updateCategoryProductCounts() {
        const categories = this.getCategories();
        const products = this.getProducts();
        
        // Reset all counts to 0
        categories.forEach(category => {
            category.productCount = 0;
        });
        
        // Count products per category
        products.forEach(product => {
            const category = categories.find(c => c.slug === product.category);
            if (category) {
                category.productCount = (category.productCount || 0) + 1;
            }
        });
        
        // Save updated categories
        this.saveCategories(categories);
        return categories;
    }
}

// Categories functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    const modal = document.getElementById('addCategoryModal');
    const openModalBtn = document.getElementById('addCategoryBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveCategoryBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveText = document.getElementById('saveText');
    const saveIcon = document.getElementById('saveIcon');
    
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    const categoryNameInput = document.getElementById('categoryName');
    const categorySlugInput = document.getElementById('categorySlug');
    const categoryDescriptionInput = document.getElementById('categoryDescription');
    const parentCategoryInput = document.getElementById('parentCategory');
    const displayOrderInput = document.getElementById('displayOrder');
    const iconSearchInput = document.getElementById('iconSearch');
    const iconGrid = document.getElementById('iconGrid');
    const selectedIcon = document.getElementById('selectedIcon');
    const iconPreview = document.getElementById('iconPreview');

    // State management
    let currentCategories = [];
    let isEditing = false;
    let editingId = null;

    // Initialize storage and page
    StorageManager.initStorage();
    initializePage();
    
    // Function to initialize the page
    function initializePage() {
        // Update product counts and get categories
        const categories = StorageManager.updateCategoryProductCounts();
        
        // Set current categories and render
        currentCategories = [...categories];
        renderCategories(currentCategories);
        updateSummaryCards(categories);
        
        // Populate parent category dropdown
        populateParentCategoryDropdown(categories);
        
        // Initialize icon selector
        populateIconGrid();
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
    
    // Function to open modal (add or edit)
    function openModal(category = null) {
        if (category) {
            // Edit mode
            isEditing = true;
            editingId = category.id;
            modalTitle.textContent = 'Edit Category';
            saveText.textContent = 'Update Category';
            
            // Fill form with category data
            categoryNameInput.value = category.name;
            categorySlugInput.value = category.slug;
            categoryDescriptionInput.value = category.description || '';
            parentCategoryInput.value = category.type === 'sub' ? (category.parent || '') : '';
            displayOrderInput.value = category.displayOrder || 0;
            selectedIcon.textContent = category.icon || 'category';
            iconPreview.classList.remove('bg-slate-100');
            iconPreview.classList.add('bg-primary', 'text-white');
        } else {
            // Add mode
            isEditing = false;
            editingId = null;
            modalTitle.textContent = 'Add New Category';
            saveText.textContent = 'Create Category';
            
            // Reset form
            resetForm();
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        resetForm();
        isEditing = false;
        editingId = null;
    }
    
    // Function to reset form
    function resetForm() {
        categoryNameInput.value = '';
        categorySlugInput.value = '';
        categoryDescriptionInput.value = '';
        parentCategoryInput.value = '';
        displayOrderInput.value = '0';
        selectedIcon.textContent = 'category';
        iconPreview.classList.remove('bg-primary', 'text-white');
        iconPreview.classList.add('bg-slate-100');
        iconSearchInput.value = '';
        populateIconGrid();
    }
    
    // Function to populate parent category dropdown
    function populateParentCategoryDropdown(categories) {
        parentCategoryInput.innerHTML = '<option value="">None (Top Level)</option>';
        
        // Only show main categories as parents
        categories
            .filter(cat => cat.type === 'main' && cat.status === 'active')
            .forEach(category => {
                const option = document.createElement('option');
                option.value = category.slug;
                option.textContent = category.name;
                parentCategoryInput.appendChild(option);
            });
    }
    
    // Function to render categories
    function renderCategories(categoriesToRender) {
        categoriesGrid.innerHTML = '';
        
        categoriesToRender.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow';
            categoryCard.innerHTML = `
                <div class="p-5">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg ${category.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'} flex items-center justify-center">
                            <span class="material-symbols-outlined text-2xl">${category.icon || 'category'}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <button class="text-slate-400 hover:text-primary transition-colors p-1 edit-btn" data-id="${category.id}" title="Edit">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button class="text-slate-400 hover:text-rose-500 transition-colors p-1 delete-btn" data-id="${category.id}" title="Delete">
                                <span class="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">${category.name}</h3>
                    <p class="text-sm text-slate-500 mb-4">${category.description || 'No description'}</p>
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'}">
                                <span class="w-1.5 h-1.5 rounded-full ${category.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'} mr-1.5"></span>
                                ${category.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            ${category.type === 'sub' ? `
                                <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                    Subcategory
                                </span>
                            ` : ''}
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-medium text-slate-900">${category.productCount || 0}</div>
                            <div class="text-xs text-slate-500">Products</div>
                        </div>
                    </div>
                </div>
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-xs text-slate-500">
                        Slug: <span class="font-mono">${category.slug}</span>
                    </div>
                    <div class="text-xs text-slate-500">
                        Order: ${category.displayOrder || 0}
                    </div>
                </div>
            `;
            categoriesGrid.appendChild(categoryCard);
        });
        
        // Update total count
        document.getElementById('totalCategories').textContent = categoriesToRender.length;
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const category = currentCategories.find(c => c.id === id);
                if (category) {
                    openModal(category);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteCategory(id);
            });
        });
    }
    
    // Function to update summary cards
    function updateSummaryCards(categories) {
        const totalCategories = categories.length;
        const mainCategories = categories.filter(c => c.type === 'main').length;
        const subCategories = categories.filter(c => c.type === 'sub').length;
        const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
        
        document.getElementById('totalCategories').textContent = totalCategories;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('mainCategories').textContent = mainCategories;
        document.getElementById('subCategories').textContent = subCategories;
    }
    
    // Function to filter categories
    function filterCategories() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const type = typeFilter.value;
        
        currentCategories = StorageManager.getCategories().filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm) || 
                                 (category.description || '').toLowerCase().includes(searchTerm) ||
                                 category.slug.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || category.status === status;
            const matchesType = !type || category.type === type;
            
            return matchesSearch && matchesStatus && matchesType;
        });
        
        renderCategories(currentCategories);
    }
    
    // Function to save category
    function saveCategory() {
        const name = categoryNameInput.value.trim();
        const slug = categorySlugInput.value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const description = categoryDescriptionInput.value.trim();
        const icon = selectedIcon.textContent;
        const parent = parentCategoryInput.value;
        const displayOrder = parseInt(displayOrderInput.value) || 0;
        const type = parent ? 'sub' : 'main';
        
        // Validation
        if (!name || !slug) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Check for duplicate slug when adding new category
        if (!isEditing) {
            const categories = StorageManager.getCategories();
            if (categories.some(c => c.slug === slug)) {
                showNotification('Category slug already exists. Please use a unique slug.', 'error');
                return;
            }
        }
        
        // Show loading state
        const originalIcon = saveIcon.innerHTML;
        saveIcon.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            const categories = StorageManager.getCategories();
            
            if (isEditing) {
                // Update existing category
                const index = categories.findIndex(c => c.id === editingId);
                if (index !== -1) {
                    categories[index] = {
                        ...categories[index],
                        name,
                        slug,
                        description,
                        icon,
                        type,
                        parent: parent || null,
                        displayOrder,
                        status: 'active' // Keep existing status
                    };
                }
            } else {
                // Add new category
                const newCategory = {
                    id: StorageManager.getNextCategoryId(),
                    name,
                    slug,
                    description,
                    icon,
                    productCount: 0,
                    status: 'active',
                    type,
                    parent: parent || null,
                    displayOrder,
                    createdAt: new Date().toISOString()
                };
                categories.unshift(newCategory);
            }
            
            // Save to localStorage
            StorageManager.saveCategories(categories);
            
            // Update product counts and UI
            const updatedCategories = StorageManager.updateCategoryProductCounts();
            currentCategories = [...updatedCategories];
            renderCategories(currentCategories);
            updateSummaryCards(updatedCategories);
            populateParentCategoryDropdown(updatedCategories);
            
            // Reset and close
            saveIcon.innerHTML = originalIcon;
            saveBtn.disabled = false;
            closeModal();
            showNotification(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
        }, 1000);
    }
    
    // Function to delete category
    function deleteCategory(id) {
        const category = currentCategories.find(c => c.id === id);
        if (!category) return;
        
        // Check if category has products
        if (category.productCount > 0) {
            if (!confirm(`This category has ${category.productCount} product(s). Deleting it will make these products uncategorized. Are you sure you want to delete this category?`)) {
                return;
            }
        } else {
            if (!confirm('Are you sure you want to delete this category?')) {
                return;
            }
        }
        
        // If category has products, update them to have no category
        if (category.productCount > 0) {
            const products = StorageManager.getProducts();
            products.forEach(product => {
                if (product.category === category.slug) {
                    product.category = '';
                }
            });
            StorageManager.saveProducts(products);
        }
        
        // Remove category
        const categories = StorageManager.getCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories.splice(index, 1);
            StorageManager.saveCategories(categories);
            
            // Update UI
            const updatedCategories = StorageManager.updateCategoryProductCounts();
            currentCategories = [...updatedCategories];
            filterCategories();
            updateSummaryCards(updatedCategories);
            populateParentCategoryDropdown(updatedCategories);
            
            showNotification('Category deleted successfully!');
        }
    }
    
    // Function to populate icon grid
    function populateIconGrid(searchTerm = '') {
        iconGrid.innerHTML = '';
        const filteredIcons = availableIcons.filter(icon => 
            icon.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        filteredIcons.forEach(icon => {
            const iconButton = document.createElement('button');
            iconButton.type = 'button';
            iconButton.className = 'w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors';
            iconButton.innerHTML = `<span class="material-symbols-outlined text-lg text-slate-600">${icon}</span>`;
            iconButton.addEventListener('click', () => {
                selectedIcon.textContent = icon;
                iconPreview.classList.remove('bg-slate-100');
                iconPreview.classList.add('bg-primary', 'text-white');
            });
            iconGrid.appendChild(iconButton);
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
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
    
    // Auto-generate slug from name
    categoryNameInput.addEventListener('input', function() {
        if (!isEditing) {
            const slug = this.value.toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-');
            categorySlugInput.value = slug;
        }
    });
    
    // Icon search functionality
    iconSearchInput.addEventListener('input', function() {
        populateIconGrid(this.value);
    });
    
    // Event listeners
    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    openModalBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveCategory);
    
    // Filter event listeners
    searchInput.addEventListener('input', filterCategories);
    statusFilter.addEventListener('change', filterCategories);
    typeFilter.addEventListener('change', filterCategories);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnOpenBtn = openSidebarBtn.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnOpenBtn && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
            closeSidebar();
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
        } else {
            if (!sidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
            if (!sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
                closeSidebar();
            }
        }
    });
});