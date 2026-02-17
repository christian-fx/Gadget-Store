import { Sidebar } from '../components/sidebar.js';
import { Topbar } from '../components/topbar.js';
import { AdminSettingsStore } from '../store/admin-settings-store.js';
import { Toast } from '../components/toast.js';
import { updateGlobalUI } from '../utils/ui-helpers.js';

export async function renderSettings() {
    const app = document.getElementById('app');

    // Init Store
    await AdminSettingsStore.init();
    const settings = AdminSettingsStore.getSettings();

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-slate-100">
            ${Sidebar('settings')}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                ${Topbar('Settings', 'Configure store preferences')}
                <main class="flex-1 overflow-y-auto p-4 md:p-8">
                     <div class="max-w-4xl mx-auto flex flex-col gap-6">
                        
                        <!-- Profile Settings -->
                        <div class="bg-white rounded-xl border border-border-color shadow-sm p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-semibold text-text-main">Profile Settings</h3>
                                <button id="editProfileBtn" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                            <form id="profileForm" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-text-main mb-1">First Name</label>
                                        <input type="text" id="firstName" class="block w-full rounded-lg border border-border-color bg-slate-50 text-text-main p-2.5 focus:border-primary focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed" value="${settings.firstName}" disabled />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-text-main mb-1">Last Name</label>
                                        <input type="text" id="lastName" class="block w-full rounded-lg border border-border-color bg-slate-50 text-text-main p-2.5 focus:border-primary focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed" value="${settings.lastName}" disabled />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Email <span class="text-xs text-text-muted font-normal">(Read Only)</span></label>
                                    <input type="email" class="block w-full rounded-lg border border-border-color bg-slate-100 text-text-muted p-2.5 cursor-not-allowed" value="akabuezechris432@gmail.com" disabled readonly />
                                </div>
                                <div id="saveProfileContainer" class="pt-4 hidden">
                                    <button type="submit" id="saveProfileBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">Save Changes</button>
                                </div>
                            </form>
                        </div>

                        <!-- Appearance Settings -->
                         <div class="bg-white rounded-xl border border-border-color shadow-sm p-6">
                            <h3 class="text-lg font-semibold text-text-main mb-6">Appearance</h3>
                             <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-text-main">Dark Mode</p>
                                    <p class="text-sm text-text-muted">Adjust the appearance of the application to reduce eye strain.</p>
                                </div>
                                <button id="themeToggleBtn" class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span class="sr-only">Toggle Dark Mode</span>
                                    <span id="themeToggleCircle" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                                </button>
                            </div>
                        </div>

                        <!-- Store Settings -->
                         <div class="bg-white rounded-xl border border-border-color shadow-sm p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-semibold text-text-main">Store Configuration</h3>
                                <button id="editStoreBtn" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    Edit Configuration
                                </button>
                            </div>
                             <form id="storeForm" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Store Name</label>
                                    <input type="text" id="storeName" class="block w-full rounded-lg border border-border-color bg-slate-50 text-text-main p-2.5 focus:border-primary focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed" value="${settings.storeName}" disabled />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-text-main mb-1">Currency</label>
                                    <select id="currency" class="block w-full rounded-lg border border-border-color bg-slate-50 text-text-main p-2.5 focus:border-primary focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed" disabled>
                                        <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                                        <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                        <option value="GBP" ${settings.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                                        <option value="NGN" ${settings.currency === 'NGN' ? 'selected' : ''}>Nigerian Naira (₦)</option>
                                    </select>
                                </div>
                                <div id="saveStoreContainer" class="pt-4 hidden">
                                    <button type="submit" id="saveStoreBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">Update Configuration</button>
                                </div>
                            </form>
                        </div>

                     </div>
                </main>
            </div>
        </div>
    `;

    initSettingsLogic();
    // Update global UI on load just in case
    updateGlobalUI();
}

function initSettingsLogic() {
    // Theme Logic
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleCircle = document.getElementById('themeToggleCircle');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme');
    const isDark = currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        html.classList.add('dark');
        themeToggleBtn.classList.replace('bg-slate-200', 'bg-blue-600');
        themeToggleCircle.classList.replace('translate-x-1', 'translate-x-6');
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = html.classList.toggle('dark');
        if (isDarkMode) {
            themeToggleBtn.classList.replace('bg-slate-200', 'bg-blue-600');
            themeToggleCircle.classList.replace('translate-x-1', 'translate-x-6');
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.classList.replace('bg-blue-600', 'bg-slate-200');
            themeToggleCircle.classList.replace('translate-x-6', 'translate-x-1');
            localStorage.setItem('theme', 'light');
        }
    });

    // Profile Edit Logic
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileContainer = document.getElementById('saveProfileContainer');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const profileForm = document.getElementById('profileForm');

    let isEditingProfile = false;

    editProfileBtn.addEventListener('click', () => {
        isEditingProfile = !isEditingProfile;
        if (isEditingProfile) {
            // Enable Mode
            editProfileBtn.textContent = 'Cancel';
            editProfileBtn.classList.add('text-rose-600', 'hover:bg-rose-50');
            editProfileBtn.classList.remove('text-blue-600', 'hover:bg-blue-50');

            firstNameInput.disabled = false;
            lastNameInput.disabled = false;
            firstNameInput.classList.remove('bg-slate-50');
            lastNameInput.classList.remove('bg-slate-50');
            firstNameInput.classList.add('bg-white');
            lastNameInput.classList.add('bg-white');

            saveProfileContainer.classList.remove('hidden');
        } else {
            // Cancel Mode
            resetProfileForm();
        }
    });

    function resetProfileForm() {
        isEditingProfile = false;
        const settings = AdminSettingsStore.getSettings();

        editProfileBtn.textContent = 'Edit Profile';
        editProfileBtn.classList.remove('text-rose-600', 'hover:bg-rose-50');
        editProfileBtn.classList.add('text-blue-600', 'hover:bg-blue-50');

        firstNameInput.value = settings.firstName;
        lastNameInput.value = settings.lastName;

        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        firstNameInput.classList.add('bg-slate-50');
        lastNameInput.classList.add('bg-slate-50');
        firstNameInput.classList.remove('bg-white');
        lastNameInput.classList.remove('bg-white');

        saveProfileContainer.classList.add('hidden');
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveProfileBtn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving...';

        try {
            await AdminSettingsStore.updateProfile({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value
            });
            Toast.show('Profile updated successfully');
            updateGlobalUI(); // Update Header
            // Reset UI state but keep new values
            editProfileBtn.click(); // Toggle back to view mode
        } catch (error) {
            console.error(error);
            Toast.show('Failed to save profile', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });

    // Store Config Logic
    const editStoreBtn = document.getElementById('editStoreBtn');
    const saveStoreContainer = document.getElementById('saveStoreContainer');
    const storeNameInput = document.getElementById('storeName');
    const currencyInput = document.getElementById('currency');
    const storeForm = document.getElementById('storeForm');

    let isEditingStore = false;

    editStoreBtn.addEventListener('click', () => {
        isEditingStore = !isEditingStore;
        if (isEditingStore) {
            // Enable Mode
            editStoreBtn.textContent = 'Cancel';
            editStoreBtn.classList.add('text-rose-600', 'hover:bg-rose-50');
            editStoreBtn.classList.remove('text-blue-600', 'hover:bg-blue-50');

            storeNameInput.disabled = false;
            currencyInput.disabled = false;
            storeNameInput.classList.remove('bg-slate-50');
            currencyInput.classList.remove('bg-slate-50');
            storeNameInput.classList.add('bg-white');
            currencyInput.classList.add('bg-white');

            saveStoreContainer.classList.remove('hidden');
        } else {
            resetStoreForm();
        }
    });

    function resetStoreForm() {
        isEditingStore = false;
        const settings = AdminSettingsStore.getSettings();

        editStoreBtn.textContent = 'Edit Configuration';
        editStoreBtn.classList.remove('text-rose-600', 'hover:bg-rose-50');
        editStoreBtn.classList.add('text-blue-600', 'hover:bg-blue-50');

        storeNameInput.value = settings.storeName;
        currencyInput.value = settings.currency;

        storeNameInput.disabled = true;
        currencyInput.disabled = true;
        storeNameInput.classList.add('bg-slate-50');
        currencyInput.classList.add('bg-slate-50');
        storeNameInput.classList.remove('bg-white');
        currencyInput.classList.remove('bg-white');

        saveStoreContainer.classList.add('hidden');
    }

    storeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveStoreBtn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Updating...';

        try {
            await AdminSettingsStore.updateStoreConfig({
                storeName: storeNameInput.value,
                currency: currencyInput.value
            });
            Toast.show('Store configuration updated');
            updateGlobalUI(); // Update Sidebar
            editStoreBtn.click(); // Toggle back
        } catch (error) {
            console.error(error);
            Toast.show('Failed to update config', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });

    initSidebarLogic();
}
