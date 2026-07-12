import { supabase } from '../../js/supabase-client.js';

// Call this at the top of every protected admin page.
// Resolves with the session once confirmed; redirects to login otherwise.
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

export function wireSignOut(selector = '#signOutBtn') {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
}
