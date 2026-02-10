/**
 * Go Gadgets — Login Page JS
 */
(() => {
    const $ = id => document.getElementById(id);

    // Redirect if already logged in
    const current = JSON.parse(localStorage.getItem('gadget_user') || 'null');
    if (current) { window.location.href = 'account.html'; return; }

    // Toggle password
    $('togglePwd').addEventListener('click', () => {
        const inp = $('password');
        const icon = $('togglePwd').querySelector('span');
        if (inp.type === 'password') { inp.type = 'text'; icon.textContent = 'visibility_off'; }
        else { inp.type = 'password'; icon.textContent = 'visibility'; }
    });

    $('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('email').value.trim().toLowerCase();
        const password = $('password').value;
        const err = $('errorMsg');
        err.classList.add('hidden');

        const users = JSON.parse(localStorage.getItem('gadget_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            err.textContent = 'Invalid email or password. Please try again.';
            err.classList.remove('hidden');
            return;
        }

        // Set current user (omit password from session)
        const session = { ...user };
        delete session.password;
        localStorage.setItem('gadget_user', JSON.stringify(session));
        window.location.href = 'account.html';
    });
})();
