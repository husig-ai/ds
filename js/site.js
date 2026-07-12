import { supabase } from './supabase-client.js';
import { listingCardHTML, formatPrice } from './components.js';
import { showError, showSuccess } from './errors.js';

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ---------- Featured listings ----------

async function loadFeaturedListings() {
  const el = document.getElementById('featuredListings');
  if (!el) return;

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Failed to load listings:', error);
      showError('Could not load listings. Please try refreshing the page.');
      el.innerHTML = '<p class="muted">Could not load listings.</p>';
      return;
    }

    if (!data || data.length === 0) {
      el.innerHTML = '<p class="muted">No featured listings yet.</p>';
      return;
    }
    el.innerHTML = data.map(listingCardHTML).join('');
  } catch (err) {
    console.error('Listings error:', err);
    showError('Error loading listings: ' + err.message);
    el.innerHTML = '<p class="muted">Error loading listings.</p>';
  }
}

// ---------- Featured testimonials ----------
function testimonialCardHTML(t) {
  const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
  return `
    <div class="test-card">
      <div class="stars" aria-label="${t.rating} out of 5 stars">${stars}</div>
      <p class="quote">"${escapeHtml(t.quote)}"</p>
      <div class="who">${escapeHtml(t.client_name)}</div>
      <div class="loc">${escapeHtml(t.client_location || '')}</div>
    </div>`;
}

async function loadFeaturedTestimonials() {
  const el = document.getElementById('featuredTestimonials');
  if (!el) return;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

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

// ---------- Intake form (multi-step + Supabase submit) ----------
function initIntakeForm() {
  const form = document.getElementById('intakeForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.step-panel'));
  const segs = Array.from(form.querySelectorAll('.seg'));
  const stepMeta = document.getElementById('stepMeta');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const formSteps = document.getElementById('formSteps');
  const donePanel = document.getElementById('donePanel');
  const errorEl = document.getElementById('formError');
  const stepNames = ['Contact info', 'Budget & timeline', 'Home preferences', 'Anything else'];
  let current = 0;

  const state = { timeline: null, financing_status: null, property_types: [] };

  form.querySelectorAll('.pill-row').forEach((row) => {
    const group = row.dataset.group;
    const multi = row.dataset.multi === 'true';
    row.querySelectorAll('.pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        if (!multi) {
          row.querySelectorAll('.pill').forEach((p) => p.classList.remove('selected'));
          pill.classList.add('selected');
          state[group] = pill.dataset.value;
        } else {
          pill.classList.toggle('selected');
          const idx = state[group].indexOf(pill.dataset.value);
          if (idx === -1) state[group].push(pill.dataset.value);
          else state[group].splice(idx, 1);
        }
      });
    });
  });

  function showFormError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = msg ? 'block' : 'none';
    }
    // Also show global error if it exists
    if (msg) {
      try {
        showError(msg);
      } catch (e) {
        // Fallback if global error handler not available
        console.error('Form error:', msg);
      }
    }
  }

  function render() {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    segs.forEach((s, i) => s.classList.toggle('done', i <= current));
    stepMeta.textContent = `Step ${current + 1} of ${steps.length} — ${stepNames[current]}`;
    backBtn.disabled = current === 0;
    nextBtn.textContent = current === steps.length - 1 ? 'Submit' : 'Continue';
    showFormError('');
  }

  function validateCurrent() {
    if (current === 0) {
      const name = form.querySelector('[name="full_name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      if (!name || !email) {
        showFormError('Please fill in your name and email to continue.');
        return false;
      }
      if (!isValidEmail(email)) {
        showFormError('Please enter a valid email address.');
        return false;
      }
    }
    return true;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function submitLead() {
    nextBtn.disabled = true;
    nextBtn.textContent = 'Submitting…';
    showFormError('');

    try {
      const val = (name) => form.querySelector(`[name="${name}"]`)?.value.trim() || null;
      const num = (name) => {
        const v = val(name);
        return v ? Number(v) : null;
      };

      const payload = {
        full_name: val('full_name'),
        email: val('email'),
        phone: val('phone'),
        budget_min: num('budget_min'),
        budget_max: num('budget_max'),
        timeline: state.timeline,
        financing_status: state.financing_status,
        preferred_areas: val('preferred_areas'),
        property_types: state.property_types,
        bedrooms_needed: num('bedrooms_needed'),
        bathrooms_needed: num('bathrooms_needed'),
        must_haves: val('must_haves'),
        additional_notes: val('additional_notes'),
      };

      console.log('Submitting form data:', payload);

      // Add timeout to prevent hanging
      const submitPromise = supabase.from('leads').insert(payload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Submission timeout - please check your connection')), 15000)
      );

      const { error } = await Promise.race([submitPromise, timeoutPromise]);

      if (error) {
        console.error('Form submission error:', error);
        showError(`Could not submit form: ${error.message || 'Unknown error'}. Make sure Supabase is configured correctly.`);
        nextBtn.disabled = false;
        nextBtn.textContent = 'Submit';
        return;
      }

      const firstName = (payload.full_name || '').split(' ')[0];
      const message = firstName
        ? `Thanks, ${firstName} — I've got your details and I'll follow up shortly with homes that match what you're looking for.`
        : `Thanks — I've got your details and I'll follow up shortly with homes that match what you're looking for.`;

      console.log('Form submitted successfully!');
      showSuccess('Form submitted successfully!');
      donePanel.querySelector('p').textContent = message;
      formSteps.style.display = 'none';
      donePanel.style.display = 'block';
    } catch (err) {
      console.error('Form error:', err);
      showError('Error: ' + (err.message || 'Unable to submit form'));
      nextBtn.disabled = false;
      nextBtn.textContent = 'Submit';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!validateCurrent()) return;
    if (current < steps.length - 1) {
      current++;
      render();
    } else {
      submitLead();
    }
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      render();
    }
  });

  render();
}

loadFeaturedListings();
loadFeaturedTestimonials();
initIntakeForm();
