import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { initSidebarLogic, formatCurrency } from '../utils/ui-helpers.js';
import { ProductFormModal } from '../components/product-form.js';
import { AdminProductStore } from '../store/admin-product-store.js';
import { AdminCategoryStore } from '../store/admin-category-store.js';
import { AdminSettingsStore } from '../store/admin-settings-store.js';
import { Toast } from '../components/toast.js';
import { ConfirmationModal } from '../components/confirmation-modal.js';

let currentProducts = [];
let editMode = false;
let currentEditId = null;

export function renderProducts() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('products')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Products', 'Manage your product inventory')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-7xl mx-auto flex flex-col gap-4 md:gap-6">
                        <!-- Actions & Filters -->
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div class="bg-surface rounded-xl border border-border-color shadow-sm p-3 flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <input type="text" id="productSearch" placeholder="Search products..." class="flex-1 border border-border-color rounded-lg px-3 py-1.5 text-sm bg-white text-text-main focus:border-primary focus:outline-none w-full md:w-64" />
                                <select id="categoryFilter" class="border border-border-color rounded-lg px-3 py-1.5 text-sm bg-white text-text-main focus:border-primary focus:outline-none w-full md:w-48">
                                    <option value="">All Categories</option>
                                    ${AdminCategoryStore.getAll().map(cat => `<option value="${cat.slug}">${cat.name}</option>`).join('')}
                                </select>
                            </div>
                            <button id="openAddProductBtn" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors w-full md:w-auto">
                                <span class="material-symbols-outlined text-[20px]">add</span> Add New Product
                            </button>
                        </div>

                        <!-- Table -->
                        <div class="bg-surface border border-border-color rounded-xl shadow-sm overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-border-color">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Product</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Price</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Stock</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                            <th class="px-4 py-3 md:px-6 md:py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="products-table-body" class="divide-y divide-border-color text-sm bg-white"></tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </main>
            </div>
        </div>
        
        ${ProductFormModal()}

        <!-- View Product Modal -->
        <div id="viewProductModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div class="bg-surface w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-all max-h-[90vh] flex flex-col">
                 <div class="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-border-color bg-slate-50 shrink-0">
                    <div>
                        <h3 class="text-lg md:text-xl font-bold text-text-main">Product Details</h3>
                        <p class="text-xs md:text-sm text-text-muted mt-0.5">Full specifications and information</p>
                    </div>
                     <button id="closeViewModal" class="text-text-muted hover:text-text-main p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="p-0 overflow-y-auto bg-white flex-1">
                    <div class="grid grid-cols-1 lg:grid-cols-2">
                        <!-- Left: Image -->
                        <div class="bg-slate-100 p-4 md:p-8 flex items-center justify-center min-h-[250px] md:min-h-[400px] lg:h-full border-b lg:border-b-0 lg:border-r border-border-color relative group">
                            <img id="viewImage" src="" alt="Product Image" class="max-w-full max-h-[300px] md:max-h-[500px] object-contain shadow-sm rounded-lg mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                            <div id="viewImagePlaceholder" class="hidden flex-col items-center text-text-muted">
                                <span class="material-symbols-outlined text-6xl opacity-20">image</span>
                                <span class="text-sm mt-2 opacity-50">No image available</span>
                            </div>
                        </div>
                        
                        <!-- Right: Details -->
                        <div class="p-4 md:p-8 space-y-6 md:space-y-8">
                            <div>
                                <div class="flex justify-between items-start">
                                    <h2 class="text-2xl md:text-3xl font-bold text-text-main leading-tight" id="viewName">Product Name</h2>
                                    <span id="viewStatus" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-800">Status</span>
                                </div>
                                <div class="flex items-center gap-4 mt-3 mb-6">
                                    <p class="text-2xl md:text-3xl font-bold text-blue-600" id="viewPrice">$0.00</p>
                                    <div class="h-6 w-px bg-slate-200"></div>
                                    <p class="text-sm text-text-muted">Stock: <span class="font-bold text-text-main text-base" id="viewStock">0</span> units</p>
                                    <div class="h-6 w-px bg-slate-200"></div>
                                    <p class="text-sm text-text-muted">SKU: <span class="font-mono text-text-main" id="viewSku">--</span></p>
                                </div>
                                <div class="flex flex-wrap gap-2 mb-6">
                                    <span class="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider" id="viewCategory">Category</span>
                                    <span class="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider" id="viewBrand">Brand</span>
                                </div>
                            </div>

                            <div class="space-y-6">
                                <div>
                                    <h4 class="font-bold text-text-main flex items-center gap-2 mb-3">
                                        <span class="material-symbols-outlined text-primary text-[20px]">description</span> Description
                                    </h4>
                                    <p class="text-slate-600 leading-relaxed text-sm" id="viewDesc">No description provided.</p>
                                </div>

                                <div id="viewFeaturesContainer" class="hidden">
                                    <h4 class="font-bold text-text-main flex items-center gap-2 mb-3">
                                        <span class="material-symbols-outlined text-primary text-[20px]">check_circle</span> Key Features
                                    </h4>
                                    <ul class="space-y-2" id="viewFeatures">
                                        <!-- Features injected here -->
                                    </ul>
                                </div>

                                <div id="viewSpecsContainer" class="hidden">
                                     <h4 class="font-bold text-text-main flex items-center gap-2 mb-3">
                                        <span class="material-symbols-outlined text-primary text-[20px]">tune</span> Specifications
                                    </h4>
                                    <div class="bg-slate-50 rounded-xl border border-border-color overflow-hidden">
                                        <table class="min-w-full divide-y divide-border-color">
                                            <tbody class="divide-y divide-border-color" id="viewSpecs">
                                                <!-- Specs injected here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    initProductsLogic();
}

async function initProductsLogic() {
    const tableBody = document.getElementById('products-table-body');
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">Loading products...</td></tr>';

    try {
        await Promise.all([
            AdminProductStore.init(),
            AdminCategoryStore.init(),
            AdminSettingsStore.init()
        ]);
        currentProducts = AdminProductStore.getAll();
        renderTable(currentProducts);
    } catch (error) {
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-rose-500">Error loading data.</td></tr>';
        console.error(error);
        Toast.show('Failed to load products', 'error');
    }

    setupEventListeners();
    setupFilters();
    initSidebarLogic();
}

function setupFilters() {
    const searchInput = document.getElementById('productSearch');
    const categorySelect = document.getElementById('categoryFilter');

    const filterProducts = () => {
        const query = searchInput.value.toLowerCase();
        const cat = categorySelect.value;
        const allProducts = AdminProductStore.getAll();

        currentProducts = allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query));
            const matchesCat = cat === '' || p.category === cat;
            return matchesSearch && matchesCat;
        });
        renderTable(currentProducts);
    };

    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categorySelect) categorySelect.addEventListener('change', filterProducts);
}

function setupEventListeners() {
    const openAddBtn = document.getElementById('openAddProductBtn');
    const addModal = document.getElementById('addProductModal');
    const closeAddBtn = document.getElementById('closeModal');
    const cancelAddBtn = document.getElementById('cancelBtn');
    const addFeatureBtn = document.getElementById('addFeatureBtn');
    const addSpecBtn = document.getElementById('addSpecBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveProductBtn');

    const openModal = (isEdit = false) => {
        if (addModal) {
            addModal.classList.remove('hidden');
            addModal.classList.add('flex');

            if (modalTitle) modalTitle.textContent = isEdit ? 'Edit Product' : 'Add New Product';
            if (saveBtn) saveBtn.textContent = isEdit ? 'Update Product' : 'Create Product';

            editMode = isEdit;
            if (!isEdit) {
                currentEditId = null;
                document.getElementById('addProductForm').reset();
                document.getElementById('featuresList').innerHTML = '';
                document.getElementById('specsList').innerHTML = '';
            }
        }
    };

    const closeModal = () => {
        if (addModal) {
            addModal.classList.add('hidden');
            addModal.classList.remove('flex');
        }
    };

    if (openAddBtn) openAddBtn.addEventListener('click', () => openModal(false));
    if (closeAddBtn) closeAddBtn.addEventListener('click', closeModal);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeModal);
    if (addModal) {
        addModal.addEventListener('click', (e) => {
            if (e.target === addModal) closeModal();
        });
    }

    // Dynamic Fields Logic (Features/Specs) - kept mostly same but extracted for reuse if needed
    const createFeatureInput = (value = '') => {
        const list = document.getElementById('featuresList');
        const div = document.createElement('div');
        div.className = 'flex gap-2 mb-2';
        div.innerHTML = `
            <input placeholder="Feature" value="${value}" class="feature-input flex-1 rounded-lg border border-border-color bg-white p-2.5 text-sm text-text-main focus:border-primary focus:outline-none" />
            <button type="button" class="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-colors"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        `;
        div.querySelector('button').addEventListener('click', () => div.remove());
        list.appendChild(div);
    };

    const createSpecInput = (key = '', value = '') => {
        const list = document.getElementById('specsList');
        const div = document.createElement('div');
        div.className = 'grid grid-cols-2 gap-2 relative group mb-2';
        div.innerHTML = `
            <input placeholder="Key" value="${key}" class="spec-key rounded-lg border border-border-color bg-white p-2.5 text-sm text-text-main focus:border-primary focus:outline-none" />
            <input placeholder="Value" value="${value}" class="spec-value rounded-lg border border-border-color bg-white p-2.5 text-sm text-text-main focus:border-primary focus:outline-none" />
            <button type="button" class="absolute -right-8 top-1.5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-rose-700"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        `;
        div.querySelector('button').addEventListener('click', () => div.remove());
        list.appendChild(div);
    };

    if (addFeatureBtn) addFeatureBtn.addEventListener('click', () => createFeatureInput());
    if (addSpecBtn) addSpecBtn.addEventListener('click', () => createSpecInput());

    // Auto-SKU Generation
    const nameInput = document.getElementById('productName');
    const skuInput = document.getElementById('productSku');

    if (nameInput && skuInput) {
        nameInput.addEventListener('input', () => {
            // Only generate if not in edit mode OR if SKU is currently empty
            if (!editMode || !skuInput.value) {
                const namePart = (nameInput.value || 'PRD').substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
                const randomPart = Math.floor(100000 + Math.random() * 900000);
                skuInput.value = `${namePart}-${randomPart}`;
            }
        });
    }

    // Form Submit
    const form = document.getElementById('addProductForm');

    // Prevent duplicate listeners
    if (form && form.getAttribute('data-init') === 'true') {
        return;
    }

    if (saveBtn && form) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            form.requestSubmit();
        });
    }

    if (form) {
        form.setAttribute('data-init', 'true');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            const submitBtn = document.getElementById('saveProductBtn');
            const originalText = submitBtn.textContent;

            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            submitBtn.textContent = editMode ? 'Updating...' : 'Creating...';

            try {
                // 1. Gather Data
                const formData = new FormData(form);
                const imageFile = formData.get('image');
                let imageUrl = '';

                // Dynamically import CloudinaryService
                const { CloudinaryService } = await import('../../api/cloudinary-config.js');

                // 2. Upload Image if present
                if (imageFile && imageFile.size > 0) {
                    imageUrl = await CloudinaryService.uploadImage(imageFile);
                } else if (editMode && currentEditId) {
                    // Keep existing image if not replacing
                    const existing = AdminProductStore.getAll().find(p => p.id === currentEditId);
                    if (existing) imageUrl = existing.image;
                }

                // 3. Process Features & Specs
                const features = Array.from(document.querySelectorAll('.feature-input')).map(input => input.value).filter(v => v.trim() !== '');
                const specKeys = Array.from(document.querySelectorAll('.spec-key')).map(input => input.value);
                const specValues = Array.from(document.querySelectorAll('.spec-value')).map(input => input.value);

                const specifications = {};
                for (let i = 0; i < specKeys.length; i++) {
                    if (specKeys[i] && specValues[i]) {
                        specifications[specKeys[i]] = specValues[i];
                    }
                }

                // SKU Generation
                let sku = formData.get('sku');
                if (!sku || sku.trim() === '') {
                    const namePart = (formData.get('name') || 'PRD').substring(0, 3).toUpperCase();
                    const numPart = Math.floor(100000 + Math.random() * 900000);
                    sku = `${namePart}-${numPart}`;
                }

                const productData = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    brand: formData.get('brand'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price')),
                    stock: parseInt(formData.get('stock')),
                    sku: sku,
                    image: imageUrl,
                    features: features,
                    specifications: specifications,
                    status: parseInt(formData.get('stock')) > 0 ? 'instock' : 'outstock',
                    updatedAt: new Date().toISOString()
                };

                if (!editMode) {
                    productData.createdAt = new Date().toISOString();
                    await AdminProductStore.add(productData);
                    Toast.show('Product created successfully!');
                } else {
                    await AdminProductStore.update(currentEditId, productData);
                    Toast.show('Product updated successfully!');
                }

                // 5. Reset & Close
                form.reset();
                document.getElementById('featuresList').innerHTML = '';
                document.getElementById('specsList').innerHTML = '';
                closeModal();

                // Refresh
                currentProducts = AdminProductStore.getAll();
                renderTable(currentProducts);

            } catch (error) {
                console.error(error);
                Toast.show('Operation failed: ' + error.message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    }

    // View Modal Logic
    const viewModal = document.getElementById('viewProductModal');
    const closeViewBtn = document.getElementById('closeViewModal');
    const tableBody = document.getElementById('products-table-body');

    const hideViewModal = () => {
        if (viewModal) {
            viewModal.classList.add('hidden');
            viewModal.classList.remove('flex');
        }
    };

    if (closeViewBtn) closeViewBtn.addEventListener('click', hideViewModal);
    if (viewModal) {
        viewModal.addEventListener('click', (e) => {
            if (e.target === viewModal) hideViewModal();
        });
    }

    // Table Clicks (View/Edit/Delete)
    if (tableBody) {
        tableBody.addEventListener('click', async (e) => {
            const viewBtn = e.target.closest('.view-product-btn');
            const editBtn = e.target.closest('.edit-product-btn');
            const deleteBtn = e.target.closest('.delete-product-btn');

            if (viewBtn) {
                const id = viewBtn.dataset.id;
                const product = AdminProductStore.getAll().find(p => p.id === id);
                if (product) {
                    // Update content
                    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

                    setText('viewName', product.name);
                    setText('viewPrice', formatCurrency(product.price));
                    setText('viewCategory', product.category || 'Uncategorized');
                    setText('viewBrand', product.brand || 'Generic');
                    setText('viewStock', product.stock);
                    setText('viewSku', product.sku || 'N/A');
                    setText('viewDesc', product.description || 'No description available for this product.');

                    // Status
                    const statusEl = document.getElementById('viewStatus');
                    if (statusEl) {
                        const isInStock = product.stock > 0;
                        statusEl.textContent = isInStock ? 'In Stock' : 'Out of Stock';
                        statusEl.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`;
                    }

                    // Image
                    const imgEl = document.getElementById('viewImage');
                    const phEl = document.getElementById('viewImagePlaceholder');
                    if (imgEl && phEl) {
                        if (product.image) {
                            imgEl.src = product.image;
                            imgEl.classList.remove('hidden');
                            phEl.classList.add('hidden');
                            phEl.classList.remove('flex');
                        } else {
                            imgEl.classList.add('hidden');
                            phEl.classList.remove('hidden');
                            phEl.classList.add('flex');
                        }
                    }

                    // Features
                    const featContainer = document.getElementById('viewFeaturesContainer');
                    const featList = document.getElementById('viewFeatures');
                    if (featContainer && featList) {
                        if (product.features && product.features.length > 0) {
                            featList.innerHTML = product.features.map(f => `
                                <li class="flex items-start gap-2 text-sm text-slate-700">
                                    <span class="material-symbols-outlined text-emerald-500 text-[18px] mt-0.5">check</span>
                                    ${f}
                                </li>
                             `).join('');
                            featContainer.classList.remove('hidden');
                        } else {
                            featContainer.classList.add('hidden');
                        }
                    }

                    // Specs
                    const specContainer = document.getElementById('viewSpecsContainer');
                    const specBody = document.getElementById('viewSpecs');
                    if (specContainer && specBody) {
                        if (product.specifications && Object.keys(product.specifications).length > 0) {
                            specBody.innerHTML = Object.entries(product.specifications).map(([key, val]) => `
                                <tr class="bg-white">
                                    <td class="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide w-1/3">${key}</td>
                                    <td class="px-4 py-3 text-sm text-slate-900 font-medium">${val}</td>
                                </tr>
                            `).join('');
                            specContainer.classList.remove('hidden');
                        } else {
                            specContainer.classList.add('hidden');
                        }
                    }

                    viewModal.classList.remove('hidden');
                    viewModal.classList.add('flex');
                }
            }

            if (editBtn) {
                const id = editBtn.dataset.id;
                const product = AdminProductStore.getAll().find(p => p.id === id);
                if (product) {
                    currentEditId = id;
                    openModal(true); // Open in Edit Mode

                    // Populate Form
                    document.getElementById('productName').value = product.name;
                    document.getElementById('productCategory').value = product.category;
                    document.getElementById('productBrand').value = product.brand;
                    document.getElementById('productDescription').value = product.description;
                    document.getElementById('productPrice').value = product.price;
                    document.getElementById('productStock').value = product.stock;
                    document.getElementById('productSku').value = product.sku;

                    // Clear and Populate Features
                    document.getElementById('featuresList').innerHTML = '';
                    if (product.features) product.features.forEach(f => createFeatureInput(f));

                    // Clear and Populate Specs
                    document.getElementById('specsList').innerHTML = '';
                    if (product.specifications) {
                        Object.entries(product.specifications).forEach(([k, v]) => createSpecInput(k, v));
                    }
                }
            }

            if (deleteBtn) {
                const confirmed = await ConfirmationModal.show({
                    title: 'Delete Product',
                    message: 'Are you sure you want to delete this product? This action cannot be undone.',
                    confirmText: 'Delete Product',
                    variant: 'danger'
                });

                if (confirmed) {
                    const id = deleteBtn.dataset.id;
                    try {
                        await AdminProductStore.delete(id);
                        Toast.show('Product deleted successfully');
                        currentProducts = AdminProductStore.getAll();
                        renderTable(currentProducts);
                    } catch (err) {
                        Toast.show('Failed to delete product', 'error');
                    }
                }
            }
        });
    }
}

function renderTable(products) {
    const container = document.getElementById('products-table-body');

    if (container) {
        if (!products || products.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-text-muted">No products found. Add one to get started.</td></tr>';
            return;
        }

        container.innerHTML = products.map(product => `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                     <div class="flex items-center gap-3 md:gap-4">
                        <div class="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-slate-100 border border-border-color flex items-center justify-center text-slate-400 overflow-hidden relative">
                             ${product.image ? `<img src="${product.image}" class="w-full h-full object-cover" />` : '<span class="material-symbols-outlined text-[20px] md:text-[24px]">image</span>'}
                        </div>
                        <div>
                             <div class="font-bold text-text-main text-sm">${product.name}</div>
                             <div class="text-xs text-text-muted mt-0.5">SKU: ${product.sku || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-muted font-medium capitalize">${product.category}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-main font-semibold">${formatCurrency(product.price)}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-text-main font-medium">${product.stock}</td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                        ${getStatusColor(product.stock > 0 ? 'instock' : 'outstock')}">
                        ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </td>
                <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                        <button class="view-product-btn text-text-muted hover:text-primary p-2 hover:bg-blue-50 rounded-lg transition-colors" data-id="${product.id}" title="View Details">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button class="edit-product-btn text-text-muted hover:text-primary p-2 hover:bg-blue-50 rounded-lg transition-colors" data-id="${product.id}" title="Edit">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                         <button class="delete-product-btn text-text-muted hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors" data-id="${product.id}" title="Delete">
                            <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function getStatusColor(status) {
    if (status === 'outstock') return 'bg-rose-100 text-rose-800';
    if (status === 'lowstock') return 'bg-amber-100 text-amber-800';
    return 'bg-emerald-100 text-emerald-800';
}
