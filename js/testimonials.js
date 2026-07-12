import { supabase } from './supabase-client.js';
import { showError } from './errors.js';
import { testimonialCardHTML } from './components.js';

async function load() {
  const el = document.getElementById('testimonialsGrid');

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load testimonials:', error);
      showError('Could not load testimonials. Please try refreshing the page.');
      el.innerHTML = '<p class="muted">Could not load testimonials.</p>';
      return;
    }

    if (!data || data.length === 0) {
      el.innerHTML = '<p class="muted">No testimonials yet.</p>';
      return;
    }
    el.innerHTML = data.map(testimonialCardHTML).join('');
  } catch (err) {
    console.error('Testimonials error:', err);
    showError('Error loading testimonials: ' + err.message);
    el.innerHTML = '<p class="muted">Error loading testimonials.</p>';
  }
}

load();
