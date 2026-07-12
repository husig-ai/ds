import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';

await requireAuth();
wireSignOut();

const form = document.getElementById('listingForm');
const errorEl = document.getElementById('formError');
const saveBtn = document.getElementById('saveBtn');
const formTitle = document.getElementById('formTitle');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const isEdit = Boolean(id);

if (isEdit) {
  formTitle.textContent = 'Edit listing';
  saveBtn.textContent = 'Save changes';

  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error || !data) {
    errorEl.textContent = 'Listing not found.';
    errorEl.style.display = 'block';
  } else {
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements[key];
      if (!field) continue;
      if (key === 'image_urls') field.value = (value || []).join('\n');
      else if (field.type === 'checkbox') field.checked = Boolean(value);
      else field.value = value ?? '';
    }
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.style.display = 'none';
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';

  const fd = new FormData(form);
  const num = (name) => {
    const v = fd.get(name);
    return v ? Number(v) : null;
  };
  const str = (name) => {
    const v = (fd.get(name) || '').toString().trim();
    return v || null;
  };

  const payload = {
    title: str('title'),
    description: str('description'),
    address: str('address'),
    city: str('city'),
    state: str('state'),
    zip: str('zip'),
    price: num('price'),
    listing_type: fd.get('listing_type'),
    property_type: fd.get('property_type'),
    status: fd.get('status'),
    bedrooms: num('bedrooms'),
    bathrooms: num('bathrooms'),
    square_feet: num('square_feet'),
    lot_size: str('lot_size'),
    year_built: num('year_built'),
    mls_number: str('mls_number'),
    image_urls: (fd.get('image_urls') || '').toString().split('\n').map((s) => s.trim()).filter(Boolean),
    featured: form.elements['featured'].checked,
  };

  const query = isEdit
    ? supabase.from('listings').update(payload).eq('id', id)
    : supabase.from('listings').insert(payload);

  const { error } = await query;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = 'block';
    saveBtn.disabled = false;
    saveBtn.textContent = isEdit ? 'Save changes' : 'Create listing';
    return;
  }

  window.location.href = './listings.html';
});
