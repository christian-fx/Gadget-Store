export const ConfirmationModal = {
    show({ title, message, onConfirm, confirmText = 'Confirm', variant = 'danger' }) {
        // Remove existing if any
        const existing = document.getElementById('confirmation-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200';

        const btnColor = variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700';

        modal.innerHTML = `
            <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform duration-200 p-6">
                 <div class="w-12 h-12 rounded-full ${variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center mb-4 mx-auto">
                    <span class="material-symbols-outlined text-[28px]">warning</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900 text-center mb-2">${title}</h3>
                <p class="text-slate-500 text-center text-sm mb-6">${message}</p>
                
                <div class="flex gap-3">
                    <button id="cancel-confirm-btn" class="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">Cancel</button>
                    <button id="action-confirm-btn" class="flex-1 px-4 py-2.5 rounded-lg ${btnColor} text-white font-medium text-sm shadow-sm transition-colors">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        return new Promise((resolve) => {
            const cleanup = () => {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.remove(), 200);
            };

            modal.querySelector('#cancel-confirm-btn').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            modal.querySelector('#action-confirm-btn').addEventListener('click', async () => {
                const btn = modal.querySelector('#action-confirm-btn');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Processing...';

                try {
                    if (onConfirm && typeof onConfirm === 'function') {
                        await onConfirm();
                    }
                    cleanup();
                    resolve(true);
                } catch (e) {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    console.error(e);
                }
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });
        });
    }
};
