import { supabase } from '../../js/supabase-client.js';

// If already logged in, skip straight to the dashboard.
const { data: { session } } = await supabase.auth.getSession();
if (session) window.location.href = '/admin/index.html';

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('loginError');
const btn = document.getElementById('loginBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = 'Incorrect email or password.';
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Sign in';
    return;
  }

  window.location.href = '/admin/index.html';
});
