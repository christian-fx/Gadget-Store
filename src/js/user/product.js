/**
 * Go Gadgets — Product Detail Page JS
 * Loads product data dynamically, renders configuration options, specs, and handles add-to-bag.
 */
(() => {
    // ─── Full Product Catalog ──────────────────────────────────────────
    // PRODUCTS are now loaded from src/js/data.js

    // Default fallback product
    const DEFAULT = {
        id: 0, name: 'Premium Gadget', subtitle: 'Amazing Technology', category: 'Electronics', badge: 'New', price: 499,
        description: 'A premium gadget designed for performance and style.',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
        colors: [{ name: 'Black', value: '#1a1a2e' }, { name: 'Silver', value: '#c0c0c0' }],
        specs: { 'Material': 'Premium', 'Warranty': '1 Year' },
        features: [{ icon: 'star', title: 'Premium Quality', detail: 'Built to last' }],
    };

    // ─── Get product by URL param ─────────────────────────────────────
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')) || 10;
    const product = PRODUCTS[productId] || DEFAULT;

    let selectedModel = product.models ? product.models[0] : null;
    let selectedColor = product.colors[0];
    let selectedStorage = product.storage ? product.storage[0] : null;

    // ─── DOM helpers ──────────────────────────────────────────────────
    const $ = id => document.getElementById(id);

    function getCurrentPrice() {
        let base = selectedModel ? selectedModel.price : product.price;
        if (selectedStorage) base += selectedStorage.extra;
        return base;
    }

    // ─── Render ───────────────────────────────────────────────────────
    function render() {
        $('breadcrumbCategory').textContent = product.category;
        $('breadcrumbName').textContent = product.name;
        $('productBadge').textContent = product.badge || '';
        $('productName').textContent = product.name;
        $('productSubtitle').textContent = product.subtitle;
        document.title = `Go Gadgets - ${product.name}`;

        // Badge
        if (product.badge === 'New') {
            $('newBadge').classList.remove('hidden');
            $('newBadge').textContent = product.badge;
        }

        // Main Image
        $('mainImage').src = product.images[0];
        $('mainImage').alt = product.name;

        // Thumbnails
        $('thumbnails').innerHTML = product.images.map((img, i) =>
            `<button onclick="setMainImage(${i})" class="w-16 h-16 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-slate-200 hover:border-slate-300'} transition-colors">
                <img src="${img}" alt="" class="w-full h-full object-cover" />
            </button>`
        ).join('');

        // Price
        updatePrice();

        // Models
        if (product.models) {
            $('modelSection').classList.remove('hidden');
            $('selectedModelLabel').textContent = selectedModel.name;
            $('modelOptions').innerHTML = product.models.map((m, i) =>
                `<button onclick="selectModel(${i})"
                    class="w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${m.name === selectedModel.name ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}">
                    <div>
                        <p class="text-sm font-semibold text-slate-900">${m.name}</p>
                        <p class="text-xs text-slate-500">${m.detail}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-bold text-slate-900">From $${m.price}</p>
                        <p class="text-xs text-slate-500">or $${m.monthly}/mo.</p>
                    </div>
                </button>`
            ).join('');
        } else {
            $('modelSection').classList.add('hidden');
        }

        // Colors
        $('selectedColorLabel').textContent = selectedColor.name;
        $('colorOptions').innerHTML = product.colors.map((c, i) =>
            `<button onclick="selectColor(${i})"
                class="w-9 h-9 rounded-full border-2 transition-all ${c.name === selectedColor.name ? 'border-primary ring-2 ring-primary/30' : 'border-slate-300 hover:border-slate-400'}"
                style="background-color: ${c.value}"
                title="${c.name}"></button>`
        ).join('');

        // Storage
        if (product.storage) {
            $('storageSection').classList.remove('hidden');
            $('selectedStorageLabel').textContent = selectedStorage.size;
            $('storageOptions').innerHTML = product.storage.map((s, i) =>
                `<button onclick="selectStorage(${i})"
                    class="p-3 border-2 rounded-xl text-center transition-all ${s.size === selectedStorage.size ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}">
                    <p class="text-sm font-bold text-slate-900">${s.size}</p>
                    <p class="text-xs text-slate-500 mt-0.5">${s.label}</p>
                </button>`
            ).join('');
        } else {
            $('storageSection').classList.add('hidden');
        }

        // Description
        if (product.description) {
            $('descriptionSection').classList.remove('hidden');
            $('productDescription').textContent = product.description;
        }

        // Specifications
        if (product.specs) {
            $('specsSection').classList.remove('hidden');
            $('specsGrid').innerHTML = Object.entries(product.specs).map(([key, value]) =>
                `<div class="flex justify-between py-2.5 text-sm">
                    <span class="text-slate-500 font-medium">${key}</span>
                    <span class="text-slate-900 font-medium text-right max-w-[60%]">${value}</span>
                </div>`
            ).join('');
        }

        // Features
        if (product.features) {
            $('features').innerHTML = product.features.map(f =>
                `<div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <span class="material-symbols-outlined text-primary text-[28px] mb-2">${f.icon}</span>
                    <h4 class="text-sm font-bold text-slate-900">${f.title}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">${f.detail}</p>
                </div>`
            ).join('');
        }

        // Summary
        $('summaryName').textContent = product.name;
    }

    function updatePrice() {
        const price = getCurrentPrice();
        $('productPrice').textContent = `From $${price}`;
        const monthly = (price / 24).toFixed(2);
        $('productPriceMonthly').textContent = `or $${monthly}/mo. for 24 mo. before trade-in`;
        $('summaryPrice').textContent = `$${price}.00`;
    }

    // ─── Interactions ─────────────────────────────────────────────────
    window.setMainImage = function (i) {
        $('mainImage').src = product.images[i];
        document.querySelectorAll('#thumbnails button').forEach((btn, idx) => {
            btn.className = btn.className.replace(/border-primary|border-slate-200/, idx === i ? 'border-primary' : 'border-slate-200');
        });
    };

    window.selectModel = function (i) {
        selectedModel = product.models[i];
        render();
    };

    window.selectColor = function (i) {
        selectedColor = product.colors[i];
        render();
    };

    window.selectStorage = function (i) {
        selectedStorage = product.storage[i];
        render();
    };

    // ─── Cart ─────────────────────────────────────────────────────────
    function getCart() {
        try { return JSON.parse(localStorage.getItem('gadget_cart')) || []; }
        catch { return []; }
    }

    function updateCartBadge() {
        if (window.updateCartBadge) {
            window.updateCartBadge();
        } else {
            const cart = getCart();
            const count = cart.reduce((s, i) => s + i.qty, 0);
            const badge = $('cartBadge');
            if (badge) {
                if (count > 0) {
                    badge.textContent = count;
                    badge.classList.remove('hidden');
                    badge.classList.add('flex');
                } else {
                    badge.classList.add('hidden');
                    badge.classList.remove('flex');
                }
            }
        }
    }

    $('addToBagBtn').addEventListener('click', () => {
        const cart = getCart();
        const variant = [selectedModel?.name, selectedColor?.name, selectedStorage?.size].filter(Boolean).join(' / ');
        const price = getCurrentPrice();
        const key = `${product.id}_${variant}`;
        const existing = cart.find(i => i.key === key);
        if (existing) { existing.qty++; } else {
            cart.push({ key, id: product.id, name: product.name, variant, price, image: product.images[0], qty: 1 });
        }
        localStorage.setItem('gadget_cart', JSON.stringify(cart));
        updateCartBadge();

        // Visual feedback
        const btn = $('addToBagBtn');
        const orig = btn.textContent;
        btn.textContent = '✓ Added to Bag';
        btn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
        btn.classList.remove('bg-primary', 'hover:bg-blue-600');
        setTimeout(() => {
            btn.textContent = orig;
            btn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
            btn.classList.add('bg-primary', 'hover:bg-blue-600');
        }, 1500);
    });

    // ─── Init ─────────────────────────────────────────────────────────
    render();
    updateCartBadge();
    updateWishlistUI();
})();
