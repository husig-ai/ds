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
  // Agent information (loaded from .env)
  agentFirstName: getEnv('VITE_AGENT_FIRST_NAME', 'Drew'),
  agentLastName: getEnv('VITE_AGENT_LAST_NAME', 'Sharma'),
  companyName: getEnv('VITE_COMPANY_NAME', 'Realty'),

  // Derived (auto-formatted)
  get agentFullName() {
    return `${this.agentFirstName} ${this.agentLastName}`;
  },
  get brandName() {
    return `${this.agentFullName} ${this.companyName}`;
  },

  // Location (loaded from .env)
  primaryLocation: getEnv('VITE_PRIMARY_LOCATION', 'Frisco, TX'),
  serviceAreas: getEnv('VITE_SERVICE_AREAS', 'Frisco and the surrounding North Texas suburbs'),
  buyerRepresentation: 'buyer representation',

  // Agent stats (loaded from .env)
  yearsInMarket: parseInt(getEnv('VITE_YEARS_IN_MARKET', '14')),
  homesClosedCount: getEnv('VITE_HOMES_CLOSED_COUNT', '120+'),
  clientRating: getEnv('VITE_CLIENT_RATING', '4.9'),

  // Legal
  copyrightYear: new Date().getFullYear(),
};

// Optional: Load from window.appConfig if defined globally (for runtime config override)
if (typeof window !== 'undefined' && window.appConfig) {
  Object.assign(config, window.appConfig);
}
