// Debug console for troubleshooting
// Type: window.debug.test() in browser console to test

import { showError, showSuccess, showWarning } from './errors.js';
import { config } from './config.js';

export const debug = {
  // Test error messages
  testError: () => showError('This is a test error message'),
  testSuccess: () => showSuccess('This is a test success message'),
  testWarning: () => showWarning('This is a test warning message'),

  // Show current config
  showConfig: () => {
    console.log('Current configuration:', config);
    return config;
  },

  // Check Supabase connection
  testSupabase: async () => {
    try {
      const { supabase } = await import('./supabase-client.js');
      const { data, error } = await supabase.from('listings').select('count');
      if (error) {
        console.error('Supabase error:', error);
        showError('Supabase error: ' + error.message);
        return false;
      }
      console.log('✓ Supabase connected successfully');
      showSuccess('Supabase connection successful!');
      return true;
    } catch (err) {
      console.error('Connection test failed:', err);
      showError('Connection test failed: ' + err.message);
      return false;
    }
  },

  // Check environment loading
  testEnv: () => {
    console.log('window.__env:', window.__env);
    if (!window.__env) {
      console.warn('⚠️  window.__env not loaded. .env file may not have loaded.');
      showWarning('.env file not loaded. Check that .env exists and is accessible.');
      return false;
    }
    console.log('✓ Environment loaded');
    showSuccess('Environment variables loaded!');
    return true;
  },

  // List all available debug commands
  help: () => {
    const commands = `
Debug Commands Available:
  window.debug.testError()      - Test error message display
  window.debug.testSuccess()    - Test success message display
  window.debug.testWarning()    - Test warning message display
  window.debug.showConfig()     - Show current config
  window.debug.testSupabase()   - Test Supabase connection
  window.debug.testEnv()        - Check if .env loaded
  window.debug.help()           - Show this help
    `;
    console.log(commands);
    return commands;
  }
};

// Make debug global for console access
if (typeof window !== 'undefined') {
  window.debug = debug;
  console.log('Debug tools loaded. Type: window.debug.help()');
}
