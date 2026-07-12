import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';

await requireAuth();
wireSignOut();

const [{ count: newLeads }, { count: totalListings }, { count: totalTestimonials }] = await Promise.all([
  supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  supabase.from('listings').select('*', { count: 'exact', head: true }),
  supabase.from('testimonials').select('*', { count: 'exact', head: true }),
]);

document.getElementById('statNewLeads').textContent = newLeads ?? '0';
document.getElementById('statListings').textContent = totalListings ?? '0';
document.getElementById('statTestimonials').textContent = totalTestimonials ?? '0';
