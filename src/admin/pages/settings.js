import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';

export function renderSettings() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('settings')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Settings', 'Configure store preferences')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-4xl mx-auto flex flex-col gap-6">
                        
                        <!-- Profile Settings -->
                        <div class="bg-white rounded-xl border border-border-color shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-text-main mb-6">Profile Settings</h3>
                            <form class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-text-main mb-1">First Name</label>
                                        <input type="text" class="block w-full rounded-lg border-border-color bg-background-dark p-2.5" value="Admin" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-text-main mb-1">Last Name</label>
                                        <input type="text" class="block w-full rounded-lg border-border-color bg-background-dark p-2.5" value="User" />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Email</label>
                                    <input type="email" class="block w-full rounded-lg border-border-color bg-background-dark p-2.5" value="admin@gadgetstore.com" />
                                </div>
                                <div class="pt-4">
                                    <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">Save Changes</button>
                                </div>
                            </form>
                        </div>

                        <!-- Store Settings -->
                         <div class="bg-white rounded-xl border border-border-color shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-text-main mb-6">Store Configuration</h3>
                             <form class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Store Name</label>
                                    <input type="text" class="block w-full rounded-lg border-border-color bg-background-dark p-2.5" value="Gadget Store" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Currency</label>
                                    <select class="block w-full rounded-lg border-border-color bg-background-dark p-2.5">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div class="pt-4">
                                    <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">Update Configuration</button>
                                </div>
                            </form>
                        </div>

                     </div>
                </main>
            </div>
        </div>
    `;
}
