export function Topbar(title, subtitle) {
    return `
        <header class="bg-white border-b border-slate-200 px-4 md:px-8 py-6">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <!-- Hamburger Menu Button -->
                    <button id="openSidebar"
                        class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                    <div>
                        <h2 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">${title}</h2>
                        <p class="text-slate-500 text-sm mt-1">${subtitle}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <button id="notificationsBtn"
                            class="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <span class="material-symbols-outlined">notifications</span>
                            <span id="notificationBadge"
                                class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center hidden">3</span>
                        </button>
                        <!-- Notifications Dropdown would go here or be appended separately -->
                        <div id="notificationsDropdown" class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 hidden z-50">
                             <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 class="font-semibold text-slate-900">Notifications</h3>
                                <span class="text-xs text-primary font-medium cursor-pointer">Mark all read</span>
                            </div>
                            <div class="max-h-96 overflow-y-auto">
                                <!-- Notifications populated by JS -->
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div
                            class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span class="text-primary font-semibold text-sm">A</span>
                        </div>
                        <div class="hidden md:block">
                            <div id="topbar-user-name" class="text-sm font-medium text-slate-900 user-name">Admin User</div>
                            <div id="topbar-user-role" class="text-xs text-slate-500 user-role">Super Admin</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
}
