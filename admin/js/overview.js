import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';
import { showError } from '../../js/errors.js';

await requireAuth();
wireSignOut();

const [leadsResult, listingsResult, testimonialsResult] = await Promise.all([
  supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  supabase.from('listings').select('*', { count: 'exact', head: true }),
  supabase.from('testimonials').select('*', { count: 'exact', head: true }),
]);

function renderStat(elId, { count, error }) {
  if (error) console.error('Failed to load stat:', error);
  document.getElementById(elId).textContent = error ? '—' : (count ?? '0');
}

renderStat('statNewLeads', leadsResult);
renderStat('statListings', listingsResult);
renderStat('statTestimonials', testimonialsResult);

if (leadsResult.error || listingsResult.error || testimonialsResult.error) {
  showError('Some dashboard stats could not be loaded.');
}
