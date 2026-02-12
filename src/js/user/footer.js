/**
 * Go Gadgets — Shared Footer Component
 * Injects a standardized footer into any page with <footer id="appFooter"></footer>
 */
(() => {
    const footer = document.getElementById('appFooter');
    if (!footer) return;

    footer.className = 'bg-white border-t border-slate-200 mt-16';
    footer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <a href="/" class="flex items-center gap-2 text-primary font-bold text-lg mb-3">
                        <span class="material-symbols-outlined text-[24px]">bolt</span>
                        Go Gadgets
                    </a>
                    <p class="text-sm text-slate-500 leading-relaxed">Your one-stop destination for the latest tech, smart home devices, and premium electronics.</p>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-900 mb-4">Shop</h4>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="/" class="text-slate-500 hover:text-primary transition-colors">All Products</a></li>
                        <li><a href="/" class="text-slate-500 hover:text-primary transition-colors">Featured</a></li>
                        <li><a href="/" class="text-slate-500 hover:text-primary transition-colors">New Arrivals</a></li>
                        <li><a href="/" class="text-slate-500 hover:text-primary transition-colors">Deals</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-900 mb-4">Support</h4>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Help Center</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Returns</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Shipping Info</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-slate-900 mb-4">Company</h4>
                    <ul class="space-y-2.5 text-sm">
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">About</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Blog</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Careers</a></li>
                        <li><a href="/public/users/404.html" class="text-slate-500 hover:text-primary transition-colors">Privacy</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs text-slate-400">&copy; ${new Date().getFullYear()} Go Gadgets. All rights reserved.</p>
                <div class="flex items-center gap-4">
                    <a href="/public/users/404.html" class="text-slate-400 hover:text-primary transition-colors"><span class="text-xs">Terms</span></a>
                    <a href="/public/users/404.html" class="text-slate-400 hover:text-primary transition-colors"><span class="text-xs">Privacy</span></a>
                    <a href="/public/users/404.html" class="text-slate-400 hover:text-primary transition-colors"><span class="text-xs">Cookies</span></a>
                </div>
            </div>
        </div>
    `;
})();
