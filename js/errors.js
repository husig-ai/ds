// Error display utility
// Shows user-friendly error messages on the page

import { escapeHtml } from './components.js';

const TOAST_STYLES = {
  error: { bg: '#fee', border: '#f99', color: '#c33', icon: '⚠️', label: 'Error', duration: 10000 },
  success: { bg: '#efe', border: '#9f9', color: '#3a3', icon: '✓', label: 'Success', duration: 5000 },
  warning: { bg: '#ffd', border: '#fb3', color: '#963', icon: '⚡', label: 'Warning', duration: 7000 },
};

function showToast(type, message, containerId) {
  const { bg, border, color, icon, label, duration } = TOAST_STYLES[type];
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      padding: 16px;
      background: ${bg};
      border: 1px solid ${border};
      border-radius: 4px;
      color: ${color};
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
      <div>
        <strong>${icon} ${label}</strong>
        <p style="margin: 8px 0 0 0;">${escapeHtml(message)}</p>
      </div>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="
        background: none;
        border: none;
        color: ${color};
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 24px;
        height: 24px;
      ">×</button>
    </div>
  `;
  container.style.display = 'block';

  setTimeout(() => {
    if (container) container.style.display = 'none';
  }, duration);
}

export function showError(message, containerId = 'errorContainer') {
  showToast('error', message, containerId);
}

export function showSuccess(message, containerId = 'successContainer') {
  showToast('success', message, containerId);
}

export function showWarning(message, containerId = 'warningContainer') {
  showToast('warning', message, containerId);
}
