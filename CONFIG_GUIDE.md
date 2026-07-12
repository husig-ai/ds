# Site Configuration Guide

All hardcoded names and branding have been removed and moved to a centralized configuration system. The site automatically loads and displays these values wherever they're needed.

## Quick Start

### For Development (Local)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your actual information
3. Also edit [`js/config.js`](./js/config.js) with your branding
4. Run locally and reload to see changes

### Security Note
**Never commit `.env` to git.** It's already in `.gitignore`. The `.env` file contains sensitive information like:
- Supabase API keys
- Phone numbers
- Email addresses
- License numbers

Only `.env.example` (with placeholder values) should be in version control.

## Configuration Options

### Agent Information
```js
agentFirstName: 'Drew'      // Your first name
agentLastName: 'Sharma'     // Your last name
companyName: 'Realty'       // Your company name
```
**Derived values** (auto-formatted):
- `agentFullName` → "Drew Sharma"
- `brandName` → "Drew Sharma Realty"

### Location
```js
primaryLocation: 'Frisco, TX'                    // Main service area
serviceAreas: 'Frisco and the surrounding area'  // Full description
buyerRepresentation: 'buyer representation'      // Your focus area
```

### Agent Stats
```js
yearsInMarket: 14           // Years of experience
homesClosedCount: '120+'    // Total homes closed
clientRating: '4.9'         // Average client rating (1-5)
```

### Legal
```js
copyrightYear: 2024         // Auto-set to current year
```

## Where Config Values Appear

The configuration values are used throughout the site:

### On Homepage (index.html)
- Page title: `"{{CONFIG.brandName}} — Find your next home"`
- Navigation: `"{{CONFIG.agentFullName}} {{CONFIG.companyName}}"`
- Hero section: Location and buyer representation
- Stats: Years, homes closed, rating
- About section: Agent name and experience description
- Footer: Copyright year and brand name

### On All Pages
- Page titles
- Navigation branding
- Footer copyright

### Admin Pages
- Dashboard titles
- Admin panel branding

## How It Works

1. **`js/config.js`** — Contains your configuration object
2. **`js/config-loader.js`** — Automatically finds all `{{CONFIG.xxx}}` placeholders in the page HTML and replaces them with actual values
3. **Every HTML page** imports `config-loader.js` first, so placeholders are replaced before the page renders

## Updating Branding

### Simple Update (Recommended)
Just edit the values in `js/config.js`:
```js
export const config = {
  agentFirstName: 'Jane',
  agentLastName: 'Johnson',
  companyName: 'Realty Group',
  // ... etc
};
```

### Environment Variables (For Deployment)
If you're using a build system, you can also set environment variables:
```bash
VITE_AGENT_FIRST_NAME=Jane
VITE_AGENT_LAST_NAME=Johnson
VITE_COMPANY_NAME="Realty Group"
```

See [`.env.example`](./.env.example) for all available variables.

### Runtime Configuration (Advanced)
Set `window.appConfig` in a script tag before the config-loader loads:
```html
<script>
  window.appConfig = {
    agentFirstName: 'Jane',
    agentLastName: 'Johnson',
    // ... etc
  };
</script>
```

## What Was Removed

- ❌ Hardcoded "Drew Sharma" in HTML
- ❌ Hardcoded "Realty" company name
- ❌ Hardcoded "Frisco, TX" location
- ❌ Hardcoded stats and years
- ❌ Hardcoded copyright years

## Contact Information

**Note:** The following information is still stored separately and should be updated directly:
- License number (in `index.html#about`)
- Office phone (in `index.html#about`)
- Email address (in `index.html#about`)

These are specific to your business and less likely to change, so they're kept as hardcoded values. Update them directly in `index.html` if needed.

## Testing Your Configuration

After updating `config.js`, reload any page in your browser. The site should immediately display your new branding information.

**Tip:** Use your browser's developer console to check that values are loading:
```js
import { config } from './js/config.js';
console.log(config.brandName); // Should show your brand name
```
