export const Toast = {
    show(message, type = 'success') {
        const container = document.getElementById('toast-container') || this.createContainer();

        const toast = document.createElement('div');
        toast.className = `
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-y-10 opacity-0
            ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}
            min-w-[300px] max-w-md pointer-events-auto
        `;

        const icon = type === 'success' ? 'check_circle' : 'error';

        toast.innerHTML = `
            <span class="material-symbols-outlined text-[20px]">${icon}</span>
            <p class="text-sm font-medium flex-1">${message}</p>
            <button class="opacity-70 hover:opacity-100 transition-opacity p-1">
                <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
        `;

        // Close button logic
        toast.querySelector('button').addEventListener('click', () => {
            this.dismiss(toast);
        });

        container.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        // Auto Dismiss
        setTimeout(() => {
            this.dismiss(toast);
        }, 4000);
    },

    dismiss(toast) {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 300);
    },

    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
        return container;
    }
};
