// Site Configuration
// Customize these values for your real estate agent site

export const config = {
  // Agent information
  agentFirstName: 'Drew',
  agentLastName: 'Sharma',
  companyName: 'Realty',

  // Derived (auto-formatted)
  get agentFullName() {
    return `${this.agentFirstName} ${this.agentLastName}`;
  },
  get brandName() {
    return `${this.agentFullName} ${this.companyName}`;
  },

  // Location
  primaryLocation: 'Frisco, TX',
  serviceAreas: 'Frisco and the surrounding area',
  buyerRepresentation: 'buyer representation',

  // Agent stats
  yearsInMarket: 14,
  homesClosedCount: '120+',
  clientRating: '4.9',

  // Legal
  copyrightYear: new Date().getFullYear(),

  // Load from environment if available (for deployment)
  static: {
    load(envPrefix = 'VITE_') {
      if (typeof process !== 'undefined' && process.env) {
        this.agentFirstName = process.env[`${envPrefix}AGENT_FIRST_NAME`] || this.agentFirstName;
        this.agentLastName = process.env[`${envPrefix}AGENT_LAST_NAME`] || this.agentLastName;
        this.companyName = process.env[`${envPrefix}COMPANY_NAME`] || this.companyName;
        this.primaryLocation = process.env[`${envPrefix}PRIMARY_LOCATION`] || this.primaryLocation;
        this.serviceAreas = process.env[`${envPrefix}SERVICE_AREAS`] || this.serviceAreas;
        this.yearsInMarket = parseInt(process.env[`${envPrefix}YEARS_IN_MARKET`]) || this.yearsInMarket;
        this.homesClosedCount = process.env[`${envPrefix}HOMES_CLOSED_COUNT`] || this.homesClosedCount;
        this.clientRating = process.env[`${envPrefix}CLIENT_RATING`] || this.clientRating;
      }
      return this;
    }
  }
};

// Optional: Load from window.appConfig if defined globally (for runtime config)
if (typeof window !== 'undefined' && window.appConfig) {
  Object.assign(config, window.appConfig);
}
