import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';
import { showError } from '../../js/errors.js';

await requireAuth();
wireSignOut();

const list = document.getElementById('testimonialsList');

async function load() {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    list.innerHTML = '<p class="muted">No testimonials yet.</p>';
    return;
  }

  list.innerHTML = data.map(rowHTML).join('');

  list.querySelectorAll('[data-toggle-publish]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.togglePublish;
      const current = btn.dataset.published === 'true';
      const { error } = await supabase.from('testimonials').update({ published: !current }).eq('id', id);
      if (error) {
        console.error('Failed to update testimonial:', error);
        showError('Could not update testimonial: ' + error.message);
        return;
      }
      load();
    });
  });

  list.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete this testimonial? This cannot be undone.')) return;
      const { error } = await supabase.from('testimonials').delete().eq('id', btn.dataset.delete);
      if (error) {
        console.error('Failed to delete testimonial:', error);
        showError('Could not delete testimonial: ' + error.message);
        return;
      }
      load();
    });
  });
}

function rowHTML(t) {
  const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
  return `
    <div class="admin-card-row">
      <div class="top-line">
        <div>
          <h3>${t.client_name} <span style="color:#B08D35; font-size:13px;">${stars}</span>
            ${t.featured ? '<span class="status-pill status-closed">Featured</span>' : ''}
            ${!t.published ? '<span class="status-pill status-lost">Unpublished</span>' : ''}
          </h3>
          <div class="meta">${t.quote}</div>
        </div>
        <div class="row-actions" style="white-space:nowrap;">
          <button data-toggle-publish="${t.id}" data-published="${t.published}" class="link-edit">${t.published ? 'Unpublish' : 'Publish'}</button>
          <a href="testimonial-form.html?id=${t.id}" class="link-edit">Edit</a>
          <button data-delete="${t.id}" class="link-delete">Delete</button>
        </div>
      </div>
    </div>`;
}

load();
