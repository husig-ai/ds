import { supabase } from './supabase-client.js';
import { listingCardHTML } from './components.js';

const grid = document.getElementById('listingsGrid');
const filterRow = document.getElementById('filterRow');
let currentFilter = 'all';

async function load() {
  grid.innerHTML = '<p class="muted">Loading listings…</p>';
  let query = supabase.from('listings').select('*').neq('status', 'off_market').order('created_at', { ascending: false });
  if (currentFilter !== 'all') query = query.eq('listing_type', currentFilter);

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    grid.innerHTML = '<p class="muted">No listings to show right now — check back soon.</p>';
    return;
  }
  grid.innerHTML = data.map(listingCardHTML).join('');
}

filterRow.querySelectorAll('.pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    filterRow.querySelectorAll('.pill').forEach((p) => p.classList.remove('selected'));
    pill.classList.add('selected');
    currentFilter = pill.dataset.value;
    load();
  });
});

load();
