/**
 * Go Gadgets — Signup Page JS
 */
(() => {
    const $ = id => document.getElementById(id);

    // Redirect if already logged in
    const current = JSON.parse(localStorage.getItem('gadget_user') || 'null');
    if (current) { window.location.href = 'account.html'; return; }

    $('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const err = $('errorMsg');
        err.classList.add('hidden');

        const firstName = $('firstName').value.trim();
        const lastName = $('lastName').value.trim();
        const email = $('email').value.trim().toLowerCase();
        const phone = $('phone').value.trim();
        const password = $('password').value;
        const confirm = $('confirmPassword').value;

        if (password !== confirm) {
            err.textContent = 'Passwords do not match.';
            err.classList.remove('hidden');
            return;
        }
        if (password.length < 6) {
            err.textContent = 'Password must be at least 6 characters.';
            err.classList.remove('hidden');
            return;
        }

        const users = JSON.parse(localStorage.getItem('gadget_users') || '[]');
        if (users.some(u => u.email === email)) {
            err.textContent = 'An account with this email already exists.';
            err.classList.remove('hidden');
            return;
        }

        const user = {
            id: 'user_' + Date.now(),
            firstName,
            lastName,
            email,
            phone,
            password,
            createdAt: new Date().toISOString(),
        };

        users.push(user);
        localStorage.setItem('gadget_users', JSON.stringify(users));

        // Auto-login (omit password from session)
        const session = { ...user };
        delete session.password;
        localStorage.setItem('gadget_user', JSON.stringify(session));

        window.location.href = 'account.html';
    });
})();
