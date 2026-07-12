// Site Configuration
// Values come from environment variables (loaded from .env)
// Set via window.__env object or update defaults directly

function getEnv(key, defaultValue) {
  // Check if window.__env is defined (for runtime config)
  if (typeof window !== 'undefined' && window.__env && window.__env[key]) {
    return window.__env[key];
  }
  return defaultValue;
}

export const config = {
  // Agent information
  agentFirstName: getEnv('VITE_AGENT_FIRST_NAME', 'Agent'),
  agentLastName: getEnv('VITE_AGENT_LAST_NAME', 'Name'),
  companyName: getEnv('VITE_COMPANY_NAME', 'Realty'),

  // Derived (auto-formatted)
  get agentFullName() {
    return `${this.agentFirstName} ${this.agentLastName}`;
  },
  get brandName() {
    return `${this.agentFullName} ${this.companyName}`;
  },

  // Location
  primaryLocation: getEnv('VITE_PRIMARY_LOCATION', 'City, State'),
  serviceAreas: getEnv('VITE_SERVICE_AREAS', 'Local service area description'),
  buyerRepresentation: 'buyer representation',

  // Agent stats
  yearsInMarket: parseInt(getEnv('VITE_YEARS_IN_MARKET', '10')),
  homesClosedCount: getEnv('VITE_HOMES_CLOSED_COUNT', '100+'),
  clientRating: getEnv('VITE_CLIENT_RATING', '5.0'),

  // Legal
  copyrightYear: new Date().getFullYear(),
};

// Optional: Load from window.appConfig if defined globally (for runtime config override)
if (typeof window !== 'undefined' && window.appConfig) {
  Object.assign(config, window.appConfig);
}
