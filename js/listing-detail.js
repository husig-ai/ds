import { supabase } from './supabase-client.js';
import { formatPrice, escapeHtml } from './components.js';
import { showError } from './errors.js';

const container = document.getElementById('listingContent');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function load() {
  if (!id) {
    container.innerHTML = '<p class="muted">No listing specified.</p><a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>';
    return;
  }

  try {
    const { data: l, error } = await supabase.from('listings').select('*').eq('id', id).single();

    if (error) {
      console.error('Failed to load listing:', error);
      showError('Could not load this listing.');
      container.innerHTML = `
        <p class="muted">This listing couldn't be found.</p>
        <a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>`;
      return;
    }

    if (!l) {
      container.innerHTML = `
        <p class="muted">This listing couldn't be found.</p>
        <a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>`;
      return;
    }

  const addr = [l.address, l.city, l.state, l.zip].filter(Boolean).join(', ');
  const cover = l.image_urls && l.image_urls[0];

  const mapHTML = addr ? `
    <div style="margin-bottom:32px;">
      <iframe src="https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed" style="border:0; border-radius:6px; width:100%; height:300px; display:block;" loading="lazy" title="Map showing ${escapeHtml(addr)}"></iframe>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}" target="_blank" rel="noopener" style="display:inline-block; margin-top:10px; font-size:13px; color:var(--brass-dark); text-decoration:none;">Get Directions →</a>
    </div>` : '';

  container.innerHTML = `
    <a href="listings.html" style="font-size:13px; color:var(--ink-soft); text-decoration:none; display:inline-block; margin-bottom:16px;">← Back to listings</a>

    <div style="border-radius:6px; overflow:hidden; background:var(--paper-dim); aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; color:var(--ink-soft); margin-bottom:32px;">
      ${cover ? `<img src="${cover}" alt="${escapeHtml(l.title)}" style="width:100%; height:100%; object-fit:cover;">` : 'No photo available'}
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:8px;">
      <div>
        <h1 style="font-size:30px; margin-bottom:4px;">${escapeHtml(l.title)}</h1>
        <p class="muted">${escapeHtml(addr)}</p>
      </div>
      <p style="font-size:30px; font-family:'Fraunces',serif; color:var(--brass-dark); margin:0;">${formatPrice(l.price)}</p>
    </div>

    <div style="display:flex; flex-wrap:wrap; gap:20px 28px; padding:24px 0; margin:24px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
      ${l.bedrooms != null ? statBlock(l.bedrooms, 'Bedrooms') : ''}
      ${l.bathrooms != null ? statBlock(l.bathrooms, 'Bathrooms') : ''}
      ${l.square_feet != null ? statBlock(l.square_feet.toLocaleString(), 'Sqft') : ''}
      ${l.year_built != null ? statBlock(l.year_built, 'Year built') : ''}
    </div>

    ${mapHTML}

    ${l.description ? `<p style="line-height:1.7; white-space:pre-line; margin-bottom:32px;">${escapeHtml(l.description)}</p>` : ''}

    <div style="background:var(--paper-dim); border-radius:6px; padding:24px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
      <p style="font-weight:600; margin:0;">Interested in this home or something similar?</p>
      <a href="index.html#intake" class="btn btn-brass">Tell me what you're looking for</a>
    </div>
  `;
  } catch (err) {
    console.error('Listing detail error:', err);
    showError('Error loading listing: ' + err.message);
    container.innerHTML = `
      <p class="muted">An error occurred while loading this listing.</p>
      <a href="listings.html" style="color:var(--brass-dark);">← Back to listings</a>`;
  }
}

function statBlock(value, label) {
  return `<div><p style="font-size:22px; font-family:'Fraunces',serif; margin:0;">${value}</p><p class="muted" style="font-size:13px; margin:2px 0 0;">${label}</p></div>`;
}

load();
