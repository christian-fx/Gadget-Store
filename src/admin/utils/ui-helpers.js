export function initSidebarLogic() {
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = (show) => {
        if (!sidebar) return;
        if (show) {
            sidebar.classList.remove('-translate-x-full');
            if (overlay) overlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            if (overlay) overlay.classList.add('hidden');
        }
    };

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing if we click outside logic exists
            toggleSidebar(true);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleSidebar(false));
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleSidebar(false));
    }

    // Check if we are on a page with a sidebar and it is missing the overlay in HTML
    // We can dynamically inject it if needed, or assume it's added in the layout
}
