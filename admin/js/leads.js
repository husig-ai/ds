import { supabase } from '../../js/supabase-client.js';
import { requireAuth, wireSignOut } from './admin-auth.js';
import { showError } from '../../js/errors.js';

await requireAuth();
wireSignOut();

const list = document.getElementById('leadsList');
const statusFilter = document.getElementById('statusFilter');

const statusOptions = ['new', 'contacted', 'qualified', 'touring', 'offer', 'closed', 'lost'];
let allLeads = [];
let openId = null;

function formatBudget(min, max) {
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (max) return `Up to ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return '—';
}

async function load() {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    list.innerHTML = '<p class="muted">Could not load leads.</p>';
    return;
  }
  allLeads = data;
  render();
}

function render() {
  const filter = statusFilter.value;
  const visible = filter === 'all' ? allLeads : allLeads.filter((l) => l.status === filter);

  if (visible.length === 0) {
    list.innerHTML = '<p class="muted">No leads to show.</p>';
    return;
  }

  list.innerHTML = visible.map(rowHTML).join('');
  wireRows();
}

function rowHTML(lead) {
  const isOpen = openId === lead.id;
  return `
    <div class="admin-card-row ${isOpen ? 'open' : ''}" data-row="${lead.id}">
      <div class="top-line" data-toggle="${lead.id}">
        <div>
          <h3>${lead.full_name} <span class="status-pill status-${lead.status}">${lead.status}</span></h3>
          <div class="meta">${lead.email} · Budget: ${formatBudget(lead.budget_min, lead.budget_max)}</div>
        </div>
        <span class="muted">${isOpen ? '▲' : '▼'}</span>
      </div>
      ${isOpen ? detailHTML(lead) : ''}
    </div>`;
}

function detailHTML(lead) {
  return `
    <div class="detail">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; font-size:14px; margin-bottom:14px;">
        ${detailField('Email', lead.email)}
        ${detailField('Phone', lead.phone)}
        ${detailField('Budget', formatBudget(lead.budget_min, lead.budget_max))}
        ${detailField('Timeline', (lead.timeline || '').replaceAll('_', ' '))}
        ${detailField('Financing', (lead.financing_status || '').replaceAll('_', ' '))}
        ${detailField('Preferred areas', lead.preferred_areas)}
        ${detailField('Property types', (lead.property_types || []).join(', '))}
        ${detailField('Bedrooms needed', lead.bedrooms_needed)}
        ${detailField('Bathrooms needed', lead.bathrooms_needed)}
        ${detailField('Submitted', new Date(lead.created_at).toLocaleString())}
      </div>
      ${lead.must_haves ? `<p style="font-size:13px;"><strong>Must-haves:</strong> ${lead.must_haves}</p>` : ''}
      ${lead.additional_notes ? `<p style="font-size:13px;"><strong>Additional notes:</strong> ${lead.additional_notes}</p>` : ''}

      <div class="field" style="max-width:240px;">
        <label class="tag">Status</label>
        <select data-status="${lead.id}">
          ${statusOptions.map((s) => `<option value="${s}" ${s === lead.status ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label class="tag">Agent notes (private)</label>
        <textarea data-notes="${lead.id}" placeholder="Internal notes about this lead…">${lead.agent_notes || ''}</textarea>
      </div>
      <div style="text-align:right;">
        <button class="link-delete" data-delete="${lead.id}" style="background:#FBEAE8; border:1px solid #E2B3AC; padding:8px 14px; border-radius:3px; cursor:pointer;">Delete lead</button>
      </div>
    </div>`;
}

function detailField(label, value) {
  return `<div><div class="muted" style="font-size:11px; font-family:'IBM Plex Mono',monospace; text-transform:uppercase;">${label}</div><div style="text-transform:capitalize;">${value || '—'}</div></div>`;
}

function wireRows() {
  list.querySelectorAll('[data-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.toggle;
      openId = openId === id ? null : id;
      render();
    });
  });

  list.querySelectorAll('[data-status]').forEach((sel) => {
    sel.addEventListener('click', (e) => e.stopPropagation());
    sel.addEventListener('change', async (e) => {
      e.stopPropagation();
      const id = sel.dataset.status;
      const { error } = await supabase.from('leads').update({ status: sel.value }).eq('id', id);
      if (error) {
        console.error('Failed to update lead status:', error);
        showError('Could not update status: ' + error.message);
        return;
      }
      const lead = allLeads.find((l) => l.id === id);
      if (lead) lead.status = sel.value;
      render();
    });
  });

  list.querySelectorAll('[data-notes]').forEach((ta) => {
    ta.addEventListener('click', (e) => e.stopPropagation());
    ta.addEventListener('blur', async () => {
      const id = ta.dataset.notes;
      const { error } = await supabase.from('leads').update({ agent_notes: ta.value }).eq('id', id);
      if (error) {
        console.error('Failed to save notes:', error);
        showError('Could not save notes: ' + error.message);
      }
    });
  });

  list.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete this lead? This cannot be undone.')) return;
      const { error } = await supabase.from('leads').delete().eq('id', btn.dataset.delete);
      if (error) {
        console.error('Failed to delete lead:', error);
        showError('Could not delete lead: ' + error.message);
        return;
      }
      allLeads = allLeads.filter((l) => l.id !== btn.dataset.delete);
      render();
    });
  });
}

statusFilter.addEventListener('change', render);

load();
