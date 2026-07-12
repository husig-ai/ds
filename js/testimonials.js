import { supabase } from './supabase-client.js';

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function testimonialCardHTML(t) {
  const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
  return `
    <div class="test-card">
      <div class="stars" aria-label="${t.rating} out of 5 stars">${stars}</div>
      <p class="quote">"${escapeHtml(t.quote)}"</p>
      <div class="who">${escapeHtml(t.client_name)}</div>
      <div class="loc">${escapeHtml(t.client_location || '')}</div>
    </div>`;
}

async function load() {
  const el = document.getElementById('testimonialsGrid');
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    el.innerHTML = '<p class="muted">No testimonials yet.</p>';
    return;
  }
  el.innerHTML = data.map(testimonialCardHTML).join('');
}

load();
