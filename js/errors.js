// Error display utility
// Shows user-friendly error messages on the page

export function showError(message, containerId = 'errorContainer') {
  let container = document.getElementById(containerId);

  if (!container) {
    // Create error container if it doesn't exist
    container = document.createElement('div');
    container.id = containerId;
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      padding: 16px;
      background: #fee;
      border: 1px solid #f99;
      border-radius: 4px;
      color: #c33;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
      <div>
        <strong>⚠️ Error</strong>
        <p style="margin: 8px 0 0 0;">${escapeHtml(message)}</p>
      </div>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="
        background: none;
        border: none;
        color: #c33;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 24px;
        height: 24px;
      ">×</button>
    </div>
  `;
  container.style.display = 'block';

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (container) container.style.display = 'none';
  }, 10000);
}

export function showSuccess(message, containerId = 'successContainer') {
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
      background: #efe;
      border: 1px solid #9f9;
      border-radius: 4px;
      color: #3a3;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
      <div>
        <strong>✓ Success</strong>
        <p style="margin: 8px 0 0 0;">${escapeHtml(message)}</p>
      </div>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="
        background: none;
        border: none;
        color: #3a3;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 24px;
        height: 24px;
      ">×</button>
    </div>
  `;
  container.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (container) container.style.display = 'none';
  }, 5000);
}

export function showWarning(message, containerId = 'warningContainer') {
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
      background: #ffd;
      border: 1px solid #fb3;
      border-radius: 4px;
      color: #963;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
      <div>
        <strong>⚡ Warning</strong>
        <p style="margin: 8px 0 0 0;">${escapeHtml(message)}</p>
      </div>
      <button onclick="this.parentElement.parentElement.style.display='none'" style="
        background: none;
        border: none;
        color: #963;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 24px;
        height: 24px;
      ">×</button>
    </div>
  `;
  container.style.display = 'block';

  // Auto-hide after 7 seconds
  setTimeout(() => {
    if (container) container.style.display = 'none';
  }, 7000);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
