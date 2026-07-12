// Load .env file and make values available to config.js
// This script should be included BEFORE config.js is imported
// Usage: <script src="js/load-env.js"></script>

// Resolve .env relative to this script's own location (js/load-env.js is
// always one directory below the site root), not the page's URL, so this
// still works when the site is served from a subpath.
const envUrl = new URL('../.env', document.currentScript.src).href;

async function loadEnv() {
  // If js/env.js (generated at deploy time from GitHub Secrets) already
  // populated this, don't fall back to fetching the raw .env file.
  if (window.__env) return;

  try {
    const response = await fetch(envUrl);
    if (!response.ok) {
      console.warn('Could not load .env file - using defaults');
      return;
    }

    const text = await response.text();
    const env = {};

    // Parse .env file format (KEY=VALUE)
    text.split('\n').forEach(line => {
      line = line.trim();
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;

      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        env[key] = value.slice(1, -1);
      } else {
        env[key] = value;
      }
    });

    // Make available globally
    window.__env = env;
    console.log('✓ Environment loaded');
  } catch (error) {
    console.warn('Error loading .env file:', error.message);
  }
}

// Load env when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadEnv);
} else {
  loadEnv();
}
