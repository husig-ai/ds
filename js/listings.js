import { supabase } from './supabase-client.js';
import { listingCardHTML } from './components.js';
import { showError } from './errors.js';

const grid = document.getElementById('listingsGrid');
const filterRow = document.getElementById('filterRow');
let currentFilter = 'all';

async function load() {
  grid.innerHTML = '<p class="muted">Loading listings…</p>';

  try {
    let query = supabase.from('listings').select('*').neq('status', 'off_market').order('created_at', { ascending: false });
    if (currentFilter !== 'all') query = query.eq('listing_type', currentFilter);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to load listings:', error);
      showError('Could not load listings. Please try refreshing the page.');
      grid.innerHTML = '<p class="muted">Could not load listings.</p>';
      return;
    }

    if (!data || data.length === 0) {
      grid.innerHTML = '<p class="muted">No listings to show right now — check back soon.</p>';
      return;
    }
    grid.innerHTML = data.map(listingCardHTML).join('');
  } catch (err) {
    console.error('Listings error:', err);
    showError('Error loading listings: ' + err.message);
    grid.innerHTML = '<p class="muted">Error loading listings.</p>';
  }
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
