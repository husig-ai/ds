import { supabase } from './supabase-client.js';
import { formatPrice } from './components.js';

const container = document.getElementById('listingContent');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function load() {
  if (!id) {
    container.innerHTML = '<p class="muted">No listing specified.</p><a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>';
    return;
  }

  const { data: l, error } = await supabase.from('listings').select('*').eq('id', id).single();

  if (error || !l) {
    container.innerHTML = `
      <p class="muted">This listing couldn't be found.</p>
      <a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>`;
    return;
  }

  const addr = [l.address, l.city, l.state, l.zip].filter(Boolean).join(', ');
  const cover = l.image_urls && l.image_urls[0];

  container.innerHTML = `
    <a href="listings.html" style="font-size:13px; color:var(--ink-soft); text-decoration:none; display:inline-block; margin-bottom:16px;">← Back to listings</a>

    <div style="border-radius:6px; overflow:hidden; background:var(--paper-dim); aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; color:var(--ink-soft); margin-bottom:32px;">
      ${cover ? `<img src="${cover}" alt="${l.title}" style="width:100%; height:100%; object-fit:cover;">` : 'No photo available'}
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:8px;">
      <div>
        <h1 style="font-size:30px; margin-bottom:4px;">${escapeHtml(l.title)}</h1>
        <p class="muted">${escapeHtml(addr)}</p>
      </div>
      <p style="font-size:30px; font-family:'Fraunces',serif; color:var(--brass-dark); margin:0;">${formatPrice(l.price)}</p>
    </div>

    <div style="display:flex; gap:28px; padding:24px 0; margin:24px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
      ${l.bedrooms != null ? statBlock(l.bedrooms, 'Bedrooms') : ''}
      ${l.bathrooms != null ? statBlock(l.bathrooms, 'Bathrooms') : ''}
      ${l.square_feet != null ? statBlock(l.square_feet.toLocaleString(), 'Sqft') : ''}
      ${l.year_built != null ? statBlock(l.year_built, 'Year built') : ''}
    </div>

    ${l.description ? `<p style="line-height:1.7; white-space:pre-line; margin-bottom:32px;">${escapeHtml(l.description)}</p>` : ''}

    <div style="background:var(--paper-dim); border-radius:6px; padding:24px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
      <p style="font-weight:600; margin:0;">Interested in this home or something similar?</p>
      <a href="index.html#intake" class="btn btn-brass">Tell me what you're looking for</a>
    </div>
  `;
}

function statBlock(value, label) {
  return `<div><p style="font-size:22px; font-family:'Fraunces',serif; margin:0;">${value}</p><p class="muted" style="font-size:13px; margin:2px 0 0;">${label}</p></div>`;
}

load();
