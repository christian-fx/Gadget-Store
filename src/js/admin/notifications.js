/**
 * Gadget Admin — Shared Notifications Module
 * Generates categorised notifications from localStorage product data,
 * injects a dropdown panel + badge onto the notification bell button,
 * and handles open / close / dismiss behaviour.
 *
 * Include AFTER settings-manager.js on every admin page.
 */

const NotificationsManager = (() => {
    const DISMISSED_KEY = 'gadget_admin_notifications_dismissed';
    const PRODUCTS_KEY = 'gadget_products';

    // ── Helpers ────────────────────────────────────────────────────────

    function getDismissed() {
        try {
            return JSON.parse(localStorage.getItem(DISMISSED_KEY)) || [];
        } catch { return []; }
    }

    function saveDismissed(ids) {
        localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
    }

    // ── Notification generator ────────────────────────────────────────

    function generateNotifications() {
        const items = [];
        const threshold = (typeof SettingsManager !== 'undefined')
            ? SettingsManager.getSetting('lowStockThreshold')
            : 10;

        // — Product-based notifications ————————————————————————————
        try {
            const raw = localStorage.getItem(PRODUCTS_KEY);
            const products = raw ? JSON.parse(raw) : [];

            products.forEach(p => {
                if (p.stock === 0) {
                    items.push({
                        id: `oos_${p.id || p.sku}`,
                        category: 'Out of Stock',
                        icon: 'error',
                        color: 'rose',
                        title: `${p.name} is out of stock`,
                        detail: `SKU: ${p.sku || '—'}`,
                        time: 'Now',
                    });
                } else if (p.stock > 0 && p.stock <= threshold) {
                    items.push({
                        id: `low_${p.id || p.sku}`,
                        category: 'Low Stock',
                        icon: 'warning',
                        color: 'amber',
                        title: `${p.name} is low on stock`,
                        detail: `Only ${p.stock} left (threshold: ${threshold})`,
                        time: 'Now',
                    });
                }
            });
        } catch { /* ignore parse errors */ }

        // — System notifications ———————————————————————————————————
        try {
            if (typeof SettingsManager !== 'undefined') {
                const settings = SettingsManager.getSettings();
                if (settings.maintenanceMode) {
                    items.push({
                        id: 'sys_maintenance',
                        category: 'System',
                        icon: 'engineering',
                        color: 'blue',
                        title: 'Maintenance mode is active',
                        detail: 'Storefront is showing maintenance banner',
                        time: 'Active',
                    });
                }
            }
        } catch { /* ignore */ }

        // Filter out dismissed
        const dismissed = getDismissed();
        return items.filter(n => !dismissed.includes(n.id));
    }

    // ── Category colour map (Tailwind token fragments) ────────────────

    const COLORS = {
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    };

    // ── Render ─────────────────────────────────────────────────────────

    function renderNotificationItem(n) {
        const c = COLORS[n.color] || COLORS.blue;
        return `
        <div class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0" data-notif-id="${n.id}">
            <div class="mt-0.5 w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined ${c.text} text-[18px]">${n.icon}</span>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}">${n.category}</span>
                    <span class="text-[11px] text-slate-400 ml-auto flex-shrink-0">${n.time}</span>
                </div>
                <p class="text-sm font-medium text-slate-800 mt-1 truncate">${n.title}</p>
                <p class="text-xs text-slate-500 mt-0.5 truncate">${n.detail}</p>
            </div>
        </div>`;
    }

    function renderDropdown(notifications) {
        const body = notifications.length
            ? notifications.map(renderNotificationItem).join('')
            : `<div class="px-4 py-8 text-center">
                   <span class="material-symbols-outlined text-3xl text-slate-300 mb-2">notifications_off</span>
                   <p class="text-sm text-slate-500">No new notifications</p>
               </div>`;

        return `
        <div id="notificationsDropdown"
             class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-[100] overflow-hidden"
             style="display:none;">
            <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <h3 class="font-semibold text-slate-900 text-sm">Notifications</h3>
                <button id="markAllRead" class="text-xs text-primary hover:text-blue-700 font-medium transition-colors">Mark all as read</button>
            </div>
            <div class="max-h-80 overflow-y-auto">${body}</div>
            <div class="px-4 py-2.5 border-t border-slate-200 text-center bg-slate-50/50">
                <span class="text-xs text-slate-500">${notifications.length} notification${notifications.length !== 1 ? 's' : ''}</span>
            </div>
        </div>`;
    }

    // ── Init ───────────────────────────────────────────────────────────

    function init() {
        // 1. Find the notification bell button
        let btn = document.getElementById('notificationsBtn');
        if (!btn) return; // no bell on this page

        const notifications = generateNotifications();

        // 2. Make sure the button wrapper is relatively positioned
        let wrapper = btn.parentElement;
        if (wrapper && getComputedStyle(wrapper).position === 'static') {
            wrapper.style.position = 'relative';
        }

        // 3. Remove any old static dropdown (dashboard had one hardcoded)
        const old = document.getElementById('notificationsDropdown');
        if (old) old.remove();

        // 4. Add badge
        let badge = btn.querySelector('.notif-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notif-badge absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center';
            btn.style.position = 'relative';
            btn.appendChild(badge);
        }
        if (notifications.length > 0) {
            badge.textContent = notifications.length > 9 ? '9+' : notifications.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }

        // 5. Inject dropdown HTML next to the button
        wrapper.insertAdjacentHTML('beforeend', renderDropdown(notifications));

        const dropdown = document.getElementById('notificationsDropdown');
        if (!dropdown) return;

        // 6. Toggle on click
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display !== 'none';
            dropdown.style.display = isOpen ? 'none' : 'block';
        });

        // 7. Close on click outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        // 8. "Mark all as read"
        const markBtn = document.getElementById('markAllRead');
        if (markBtn) {
            markBtn.addEventListener('click', () => {
                const allIds = notifications.map(n => n.id);
                const dismissed = getDismissed();
                saveDismissed([...new Set([...dismissed, ...allIds])]);
                // Re-render empty state
                dropdown.querySelector('.max-h-80').innerHTML =
                    `<div class="px-4 py-8 text-center">
                        <span class="material-symbols-outlined text-3xl text-slate-300 mb-2">notifications_off</span>
                        <p class="text-sm text-slate-500">No new notifications</p>
                    </div>`;
                badge.style.display = 'none';
                dropdown.querySelector('.border-t.text-center span').textContent = '0 notifications';
            });
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init, generateNotifications };
})();
