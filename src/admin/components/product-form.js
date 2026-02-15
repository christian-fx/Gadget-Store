import { AdminCategoryStore } from '../store/admin-category-store.js';

export function ProductFormModal() {
    return `
        <!-- Add Product Modal -->
        <div id="addProductModal"
            class="fixed inset-0 z-50 hidden items-center justify-center p-4 animate-fade-in modal-overlay bg-slate-900/50 backdrop-blur-sm">
            <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                <!-- Modal Header -->
                <div class="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h3 id="modalTitle" class="text-xl font-bold text-slate-900">Add New Product</h3>
                        <p class="text-sm text-slate-500 mt-0.5">Fill in the information to create a new gadget listing</p>
                    </div>
                    <button id="closeModal"
                        class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                <!-- Modal Content -->
                <form id="addProductForm" class="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        <div class="lg:col-span-2 space-y-6 md:space-y-8">
                            <!-- General Info -->
                            <section class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 class="font-semibold text-lg mb-6 flex items-center gap-2"><span class="material-symbols-outlined text-primary">feed</span> General Information</h4>
                                <div class="space-y-5">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
                                        <input id="productName" name="name" required class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5" placeholder="e.g. Wireless Headphones" />
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                                            <select id="productCategory" name="category" required class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5">
                                                <option value="">Select Category</option>
                                                ${AdminCategoryStore.getAll().map(cat => `<option value="${cat.slug}">${cat.name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-1.5">Brand *</label>
                                            <input id="productBrand" name="brand" required class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5" placeholder="e.g. Sony" />
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                        <textarea id="productDescription" name="description" rows="4" class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5"></textarea>
                                    </div>
                                </div>
                            </section>

                            <!-- Pricing -->
                             <section class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 class="font-semibold text-lg mb-6 flex items-center gap-2"><span class="material-symbols-outlined text-primary">payments</span> Pricing & Inventory</h4>
                                 <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Price *</label>
                                        <input id="productPrice" name="price" type="number" step="0.01" required class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Stock *</label>
                                        <input id="productStock" name="stock" type="number" required class="block w-full rounded-lg border-slate-200 bg-slate-50 p-2.5" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1.5">SKU (Auto-generated)</label>
                                        <input id="productSku" name="sku" readonly class="block w-full rounded-lg border-slate-200 bg-slate-100 text-slate-500 p-2.5 cursor-not-allowed" placeholder="Will be generated..." />
                                    </div>
                                </div>
                            </section>
                        </div>
                         <!-- Images -->
                         <div class="space-y-6">
                            <section class="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                                <h4 class="font-semibold text-lg mb-6 flex items-center gap-2 text-text-main"><span class="material-symbols-outlined text-primary">imagesmode</span> Product Image</h4>
                                <input id="productImage" name="image" type="file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"/>
                            </section>

                            <!-- Features -->
                            <section class="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                                <h4 class="font-semibold text-lg mb-6 flex items-center gap-2 text-text-main"><span class="material-symbols-outlined text-primary">list</span> Features</h4>
                                <div id="featuresList" class="space-y-3 mb-3">
                                    <!-- Dynamic features inputs -->
                                </div>
                                <button type="button" id="addFeatureBtn" class="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1">
                                    <span class="material-symbols-outlined text-base">add</span> Add Feature
                                </button>
                            </section>

                             <!-- Specifications -->
                            <section class="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                                <h4 class="font-semibold text-lg mb-6 flex items-center gap-2 text-text-main"><span class="material-symbols-outlined text-primary">fact_check</span> Specifications</h4>
                                <div id="specsList" class="space-y-3 mb-3">
                                    <!-- Dynamic specs inputs -->
                                     <div class="grid grid-cols-2 gap-2">
                                        <input placeholder="Key" class="rounded-lg border-border-color bg-background-dark p-2 text-sm" />
                                        <input placeholder="Value" class="rounded-lg border-border-color bg-background-dark p-2 text-sm" />
                                    </div>
                                </div>
                                <button type="button" id="addSpecBtn" class="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1">
                                    <span class="material-symbols-outlined text-base">add</span> Add Specification
                                </button>
                            </section>
                        </div>
                    </div>
                </form>

                <div class="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10 w-full">
                    <button id="cancelBtn" type="button" class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">Cancel</button>
                    <button id="saveProductBtn" type="button" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">Create Product</button>
                </div>
            </div>
        </div>
    `;
}
