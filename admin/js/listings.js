import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';
import { showError } from '../../js/errors.js';

await requireAuth();
wireSignOut();

const wrap = document.getElementById('listingsTableWrap');

async function load() {
  const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    wrap.innerHTML = '<p class="muted">No listings yet. Create your first one.</p>';
    return;
  }

  wrap.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr><th>Title</th><th>Price</th><th>Status</th><th>Featured</th><th></th></tr>
      </thead>
      <tbody>
        ${data.map(rowHTML).join('')}
      </tbody>
    </table>`;

  wrap.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this listing? This cannot be undone.')) return;
      const { error } = await supabase.from('listings').delete().eq('id', btn.dataset.delete);
      if (error) {
        console.error('Failed to delete listing:', error);
        showError('Could not delete listing: ' + error.message);
        return;
      }
      load();
    });
  });
}

function rowHTML(l) {
  return `
    <tr>
      <td>${l.title}</td>
      <td>${l.price ? '$' + Number(l.price).toLocaleString() : '—'}</td>
      <td style="text-transform:capitalize;">${(l.status || '').replaceAll('_', ' ')}</td>
      <td>${l.featured ? 'Yes' : '—'}</td>
      <td class="row-actions">
        <a href="listing-form.html?id=${l.id}" class="link-edit">Edit</a>
        <button class="link-delete" data-delete="${l.id}">Delete</button>
      </td>
    </tr>`;
}

load();
