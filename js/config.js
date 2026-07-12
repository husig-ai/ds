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
  // Agent information (loaded from .env at runtime)
  get agentFirstName() {
    return getEnv('VITE_AGENT_FIRST_NAME', 'Drew');
  },
  get agentLastName() {
    return getEnv('VITE_AGENT_LAST_NAME', 'Sharma');
  },
  get companyName() {
    return getEnv('VITE_COMPANY_NAME', 'Realty');
  },

  // Derived (auto-formatted)
  get agentFullName() {
    return `${this.agentFirstName} ${this.agentLastName}`;
  },
  get brandName() {
    return `${this.agentFullName} ${this.companyName}`;
  },

  // Location (loaded from .env at runtime)
  get primaryLocation() {
    return getEnv('VITE_PRIMARY_LOCATION', 'Frisco, TX');
  },
  get serviceAreas() {
    return getEnv('VITE_SERVICE_AREAS', 'Frisco and the surrounding North Texas suburbs');
  },
  buyerRepresentation: 'buyer representation',

  // Agent stats (loaded from .env at runtime)
  get yearsInMarket() {
    return parseInt(getEnv('VITE_YEARS_IN_MARKET', '14'));
  },
  get homesClosedCount() {
    return getEnv('VITE_HOMES_CLOSED_COUNT', '120+');
  },
  get clientRating() {
    return getEnv('VITE_CLIENT_RATING', '4.9');
  },

  // Legal
  get copyrightYear() {
    return new Date().getFullYear();
  },
};

// Optional: Load from window.appConfig if defined globally (for runtime config override)
if (typeof window !== 'undefined' && window.appConfig) {
  Object.assign(config, window.appConfig);
}
