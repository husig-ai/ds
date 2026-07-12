import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';

await requireAuth();
wireSignOut();

const form = document.getElementById('testimonialForm');
const errorEl = document.getElementById('formError');
const saveBtn = document.getElementById('saveBtn');
const formTitle = document.getElementById('formTitle');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const isEdit = Boolean(id);

if (isEdit) {
  formTitle.textContent = 'Edit testimonial';
  saveBtn.textContent = 'Save changes';

  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
  if (error || !data) {
    errorEl.textContent = 'Testimonial not found.';
    errorEl.style.display = 'block';
  } else {
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements[key];
      if (!field) continue;
      if (field.type === 'checkbox') field.checked = Boolean(value);
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
  const str = (name) => {
    const v = (fd.get(name) || '').toString().trim();
    return v || null;
  };

  const payload = {
    client_name: str('client_name'),
    client_location: str('client_location'),
    transaction_type: fd.get('transaction_type'),
    rating: Number(fd.get('rating')),
    quote: str('quote'),
    photo_url: str('photo_url'),
    featured: form.elements['featured'].checked,
    published: form.elements['published'].checked,
  };

  const query = isEdit
    ? supabase.from('testimonials').update(payload).eq('id', id)
    : supabase.from('testimonials').insert(payload);

  const { error } = await query;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = 'block';
    saveBtn.disabled = false;
    saveBtn.textContent = isEdit ? 'Save changes' : 'Create testimonial';
    return;
  }

  window.location.href = './testimonials.html';
});
