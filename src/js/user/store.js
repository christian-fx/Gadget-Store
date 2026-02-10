/**
 * Go Gadgets — Store Page JS
 * Renders product cards, handles filtering, sorting, and numbered pagination.
 */
(() => {
    // ─── Product Catalog (24 products for multi-page display) ────────
    // PRODUCTS are now loaded from src/js/data.js

    const PAGE_SIZE = 12;
    let currentPage = 1;

    // ─── Category map (checkbox value → product category) ────────────
    const CATEGORY_MAP = {
        'computers': ['Computers'],
        'smartphones': ['Smartphones'],
        'audio': ['Audio'],
        'wearables': ['Wearables'],
        'cameras': ['Photography', 'Drones'],
        'gaming': ['Gaming'],
    };

    // ─── DOM Elements ─────────────────────────────────────────────────
    const grid = document.getElementById('productGrid');
    const pagination = document.getElementById('pagination');
    const resultCount = document.getElementById('resultCount');
    const sortSelect = document.getElementById('sortSelect');
    // cartBadge is now handled by header.js, but we might still populate it if store.js loads first? 
    // actually header.js runs on DOMContentLoaded, store.js runs immediately (IIFE).
    // Let's rely on header.js for the badge element selection if possible, or re-select it here.
    const cartBadge = document.getElementById('cartBadge'); // We keep this for the bounce animation


    // Filter elements
    const categoryChecks = document.querySelectorAll('#categoryFilters input[name="category"]');
    const brandChecks = document.querySelectorAll('#brandFilters input[name="brand"]');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    const availabilityChecks = document.querySelectorAll('input[name="availability"]');

    function getFiltered() {
        let products = Object.values(PRODUCTS);

        // Category filter
        const allCheck = document.querySelector('#categoryFilters input[value="all"]');
        if (!allCheck.checked) {
            const selectedCats = [...categoryChecks]
                .filter(c => c.value !== 'all' && c.checked)
                .flatMap(c => CATEGORY_MAP[c.value] || []);
            if (selectedCats.length > 0) {
                products = products.filter(p => selectedCats.includes(p.category));
            }
        }

        // Brand filter
        const selectedBrands = [...brandChecks].filter(c => c.checked).map(c => c.value);
        if (selectedBrands.length > 0) {
            products = products.filter(p => selectedBrands.includes(p.brand));
        }

        // Price filter
        const minPrice = parseInt(priceMinInput.value.replace(/[^0-9]/g, '')) || 0;
        const maxPrice = parseInt(priceMaxInput.value.replace(/[^0-9]/g, '')) || Infinity;
        products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Availability filter
        const inStockChecked = document.querySelector('input[name="availability"][value="in_stock"]')?.checked;
        const preOrderChecked = document.querySelector('input[name="availability"][value="pre_order"]')?.checked;
        if (inStockChecked && !preOrderChecked) {
            products = products.filter(p => p.inStock);
        } else if (preOrderChecked && !inStockChecked) {
            products = products.filter(p => !p.inStock);
        }

        return products;
    }

    // ─── Sorting ──────────────────────────────────────────────────────
    function getSorted(products) {
        const sorted = [...products];
        const val = sortSelect.value;
        if (val.includes('Low to High')) sorted.sort((a, b) => a.price - b.price);
        else if (val.includes('High to Low')) sorted.sort((a, b) => b.price - a.price);
        else if (val.includes('Newest')) sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        else if (val.includes('Rating')) sorted.sort((a, b) => b.rating - a.rating);
        return sorted;
    }

    // ─── Render Card ──────────────────────────────────────────────────
    function renderCard(p) {
        const stockBadge = !p.inStock ? '<span class="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded tracking-wider">Out of Stock</span>' : '';

        // Wishlist State
        const wishlist = JSON.parse(localStorage.getItem('gadget_wishlist') || '[]');
        const user = JSON.parse(localStorage.getItem('gadget_user'));
        const isInWishlist = user && wishlist.some(item => item.userId === user.id && item.productId === p.id);
        const heartIcon = isInWishlist ? 'favorite' : 'favorite'; // Icon name is same, class changes
        const heartClass = isInWishlist ? 'text-red-500 fill-current' : 'text-slate-300';

        return `
        <div class="group block rounded-xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 relative">
            <a href="product.html?id=${p.id}" class="block relative bg-slate-50 aspect-square overflow-hidden">
                <img src="${p.images[0]}" alt="${p.name}" loading="lazy"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ${p.badge ? `<span class="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded tracking-wider">${p.badge}</span>` : ''}
                ${stockBadge}
            </a>
            
            <!-- Wishlist Button -->
            <button onclick="toggleWishlist(${p.id}, this)" 
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-sm z-10 transition-all">
                <span class="material-symbols-outlined text-[20px] ${isInWishlist ? 'text-red-500 font-variation-FILL-1' : 'text-slate-400 hover:text-red-500'} transition-colors">${isInWishlist ? 'favorite' : 'favorite'}</span>
            </button>

            <div class="p-4">
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-medium text-primary">${p.category}</span>
                </div>
                <a href="product.html?id=${p.id}">
                    <h3 class="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">${p.name}</h3>
                </a>
                <div class="flex items-center gap-1 mb-3">
                    <span class="text-yellow-400 text-xs">★</span>
                    <span class="text-xs text-slate-500">4.8 (120 reviews)</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-base font-bold text-slate-900">$${p.price.toLocaleString()}</span>
                    <button onclick="addToCart(${p.id})"
                        class="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                        ${!p.inStock ? 'disabled' : ''}>
                        <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>`;
    }

    // ─── Render Page ──────────────────────────────────────────────────
    function renderPage() {
        const filtered = getFiltered();
        const sorted = getSorted(filtered);
        const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, sorted.length);
        const pageItems = sorted.slice(start, end);

        grid.innerHTML = pageItems.length
            ? pageItems.map(p => renderCard(p)).join('')
            : '<div class="col-span-full text-center py-16"><p class="text-slate-400 text-lg">No products match your filters</p></div>';

        resultCount.textContent = sorted.length > 0
            ? `Showing ${start + 1}–${end} of ${sorted.length} results`
            : 'No results';

        renderPagination(totalPages);
    }

    // ─── Render Pagination Buttons ────────────────────────────────────
    function renderPagination(totalPages) {
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }

        let html = '';
        // Previous button
        html += `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}
            class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
                if (i === 3 || i === totalPages - 2) html += '<span class="text-slate-400 px-1">…</span>';
                continue;
            }
            html += `<button onclick="goToPage(${i})"
                class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${i === currentPage ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                ${i}
            </button>`;
        }

        // Next button
        html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}
            class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>`;

        pagination.innerHTML = html;
    }

    window.goToPage = function (page) {
        const filtered = getFiltered();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ─── "All Products" toggle ────────────────────────────────────────
    const allCheck = document.querySelector('#categoryFilters input[value="all"]');
    allCheck.addEventListener('change', () => {
        categoryChecks.forEach(c => {
            if (c.value !== 'all') c.checked = false;
        });
        currentPage = 1;
        renderPage();
    });

    // When any individual category changes
    categoryChecks.forEach(c => {
        if (c.value === 'all') return;
        c.addEventListener('change', () => {
            const anyCatChecked = [...categoryChecks].some(cb => cb.value !== 'all' && cb.checked);
            allCheck.checked = !anyCatChecked;
            currentPage = 1;
            renderPage();
        });
    });

    // ─── Other filter listeners ────────────────────────────────────────
    brandChecks.forEach(c => c.addEventListener('change', () => { currentPage = 1; renderPage(); }));
    availabilityChecks.forEach(c => c.addEventListener('change', () => { currentPage = 1; renderPage(); }));

    // Price filter: apply on Enter or on blur
    [priceMinInput, priceMaxInput].forEach(inp => {
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { currentPage = 1; renderPage(); } });
        inp.addEventListener('blur', () => { currentPage = 1; renderPage(); });
    });

    sortSelect.addEventListener('change', () => { currentPage = 1; renderPage(); });

    // ─── Cart ─────────────────────────────────────────────────────────
    function getCart() {
        try { return JSON.parse(localStorage.getItem('gadget_cart')) || []; }
        catch { return []; }
    }

    function updateCartBadge() {
        // Delegate to global function if available
        if (window.updateCartBadge) {
            window.updateCartBadge();
        } else {
            // Fallback
            const cart = getCart();
            const count = cart.reduce((s, i) => s + i.qty, 0);
            if (cartBadge) {
                if (count > 0) {
                    cartBadge.textContent = count;
                    cartBadge.classList.remove('hidden');
                    cartBadge.classList.add('flex');
                } else {
                    cartBadge.classList.add('hidden');
                    cartBadge.classList.remove('flex');
                }
            }
        }
    }

    window.addToCart = function (id) {
        const product = PRODUCTS[id]; // Fixed: Access by ID directly
        if (!product) return; // Removed inStock check here to allow trying (button disabled anyway) or we can keep it

        const cart = getCart();
        const existing = cart.find(i => i.id === id);
        if (existing) { existing.qty++; } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0], // Fixed: Access first image
                category: product.category,
                qty: 1
            });
        }
        localStorage.setItem('gadget_cart', JSON.stringify(cart));
        updateCartBadge();

        // Bounce animation
        if (cartBadge) {
            cartBadge.classList.add('animate-bounce');
            setTimeout(() => cartBadge.classList.remove('animate-bounce'), 500);
        }
    };

    window.toggleWishlist = function (id, btn) {
        const user = JSON.parse(localStorage.getItem('gadget_user'));
        if (!user) {
            window.location.href = '/index.html';
            return;
        }

        let wishlist = JSON.parse(localStorage.getItem('gadget_wishlist') || '[]');
        const existingIndex = wishlist.findIndex(item => item.userId === user.id && item.productId === id);

        if (existingIndex > -1) {
            // Remove
            wishlist.splice(existingIndex, 1);
        } else {
            // Add
            wishlist.push({ userId: user.id, productId: id, date: new Date().toISOString() });
        }

        localStorage.setItem('gadget_wishlist', JSON.stringify(wishlist));

        // Re-render the specific card or just toggle the icon classes
        // RenderPage is expensive, let's toggle classes for immediate feedback
        const icon = btn.querySelector('.material-symbols-outlined');
        if (existingIndex > -1) {
            // Was in wishlist, now removed
            icon.classList.remove('text-red-500', 'font-variation-FILL-1');
            icon.classList.add('text-slate-400');
        } else {
            // Was not, now added
            icon.classList.remove('text-slate-400');
            icon.classList.add('text-red-500', 'font-variation-FILL-1');
        }
    };

    // ─── Init ─────────────────────────────────────────────────────────
    renderPage();
    updateCartBadge();
})();
