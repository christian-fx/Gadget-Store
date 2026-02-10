/**
 * Go Gadgets — Header Logic
 * Handles dynamic header elements based on auth state.
 */
document.addEventListener('DOMContentLoaded', () => {
    const userKey = 'gadget_user';
    const user = JSON.parse(localStorage.getItem(userKey));

    // Select the account link in the header
    // We look for the link that points to account.html inside the header
    const accountLink = document.querySelector('header a[href="account.html"]');

    if (accountLink) {
        if (!user) {
            // User is NOT logged in
            // Transform the icon link into a "Sign In" button
            accountLink.href = '/index.html';

            // Remove existing classes that make it a circle icon
            // Expected classes: w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center
            accountLink.className = '';

            // Add button classes
            accountLink.classList.add(
                'flex', 'items-center', 'justify-center',
                'px-4', 'py-1.5',
                'bg-primary', 'text-white',
                'text-sm', 'font-medium',
                'rounded-lg',
                'hover:bg-blue-600', 'transition-colors'
            );

            // Change content to text
            accountLink.textContent = 'Sign In';
        } else {
            // User IS logged in
            // Ensure it points to account.html
            accountLink.href = 'account.html';

            // Optionally, we could show user initials here if we wanted
            // But preserving the person icon is fine for now.
        }
    }

    // ─── Global Cart Badge Logic ──────────────────────────────────────
    function updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (!cartBadge) return;

        try {
            const cart = JSON.parse(localStorage.getItem('gadget_cart')) || [];
            const count = cart.reduce((s, i) => s + i.qty, 0);

            if (count > 0) {
                cartBadge.textContent = count;
                cartBadge.classList.remove('hidden');
                cartBadge.classList.add('flex');
            } else {
                cartBadge.classList.add('hidden');
                cartBadge.classList.remove('flex');
            }
        } catch (e) {
            console.error('Error updating cart badge:', e);
        }
    }

    // Expose to window so other scripts can call it
    window.updateCartBadge = updateCartBadge;

    // Initial check
    updateCartBadge();
});
