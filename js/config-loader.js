// Config loader for HTML pages
// Replaces {{CONFIG.key}} placeholders in DOM with actual values

import { config } from './config.js';

export function loadConfig() {
  // Update page title if it contains brand name
  if (document.title.includes('{{CONFIG')) {
    document.title = document.title.replace(/{{CONFIG\.([^}]+)}}/g, (match, key) => {
      return getConfigValue(key);
    });
  }

  // Replace all {{CONFIG.xxx}} placeholders in HTML
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodesToUpdate = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes('{{CONFIG')) {
      nodesToUpdate.push(node);
    }
  }

  nodesToUpdate.forEach(node => {
    node.textContent = node.textContent.replace(/{{CONFIG\.([^}]+)}}/g, (match, key) => {
      return getConfigValue(key);
    });
  });

  // Also update element attributes (like href, alt, etc.)
  document.querySelectorAll('[*]').forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.value.includes('{{CONFIG')) {
        attr.value = attr.value.replace(/{{CONFIG\.([^}]+)}}/g, (match, key) => {
          return getConfigValue(key);
        });
      }
    });
  });
}

function getConfigValue(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], config) || '';
}

// Auto-load when script is imported
loadConfig();
