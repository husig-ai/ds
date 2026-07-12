# Real Estate Agent Static Site — no build step

Plain HTML/CSS/JS. No React, no bundler. Talks directly to Supabase from
the browser using the `@supabase/supabase-js` ESM build off a CDN. Deploys
to GitHub Pages via GitHub Actions.

## Features

- **Public site** — home page with agent bio and a multi-step lead intake
  form, a browsable listings grid, a listing detail page with an embedded
  map + "Get Directions" link, and a client testimonials page.
- **Admin dashboard** — authenticated CRUD for listings and testimonials,
  and a leads inbox with a status pipeline, private agent notes, and
  delete — all gated behind Supabase Auth, with a link back to the public
  site from every admin page.
- **Config-driven branding** — agent name, company, location, and contact
  info are all environment-driven and swapped into `{{CONFIG.xxx}}`
  placeholders at runtime, so none of it is hardcoded in the HTML.
- **Secrets-backed deploys** — GitHub Actions generates the runtime config
  from GitHub Secrets at deploy time (`js/env.js`), so real credentials and
  contact info never live in the repo.
- **SEO basics** — meta description and Open Graph tags on public pages, a
  favicon, `sitemap.xml`, and `robots.txt`.
- **Accessible by default** — keyboard focus states on interactive
  elements, escaped/sanitized user content, descriptive `alt` text.

## 1. Create the Supabase project
1. https://supabase.com -> New project.
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates `listings`, `testimonials`, `leads` tables with Row Level
   Security:
   - Public can read listings + published testimonials, and can **insert**
     into `leads` (submit the intake form) — nothing else.
   - Authenticated agent (you) can read/write/delete everything.
3. **Project Settings -> API** -> copy the Project URL and the `anon public` key.

## 2. Create your agent login
One agent, so skip public sign-up:
1. **Authentication -> Users -> Add user**.
2. Enter your email + password, toggle **Auto Confirm**.
3. That's what you'll use at `/admin/login.html`.

## 3. Customize branding & site config
For local development, copy [`.env.example`](./.env.example) to `.env` and
fill in your information:
```env
VITE_AGENT_FIRST_NAME=Your Name
VITE_AGENT_LAST_NAME=Your Last Name
VITE_COMPANY_NAME=Your Company
VITE_PRIMARY_LOCATION=City, State
VITE_SERVICE_AREAS=Your service area
VITE_YEARS_IN_MARKET=12
VITE_HOMES_CLOSED_COUNT=350+
VITE_CLIENT_RATING=4.9
```

**How it works locally:**
- `.env` is loaded by `js/load-env.js` when the page starts
- `js/config.js` reads values and provides them to the site
- All `{{CONFIG.xxx}}` placeholders in HTML are replaced with actual values
- Never commit `.env` to git (it's in `.gitignore`) — keep it local only

**How it works in production:** the same key/value pairs live in
**GitHub Secrets** instead of a committed `.env`. The deploy workflow
([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) generates
`js/env.js` from those secrets at build time, which sets `window.__env`
directly — `load-env.js`'s `.env` fetch is only a local-dev fallback.

See [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md) and [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md) for detailed setup instructions.

## 4. Plug in your Supabase credentials
Open [`js/supabase-client.js`](./js/supabase-client.js) and replace:
```js
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
```
The anon key is safe to expose in a static site; it only grants what the
Row Level Security policies allow.

## 5. Verify setup
Before running locally, verify your configuration:
```bash
bash scripts/verify-setup.sh
```
This checks that Supabase credentials are filled in before you start.

## 6. Run locally
No build step — just serve the folder. Any static server works, e.g.:
```bash
npx serve .
```
or the VS Code "Live Server" extension. (Opening `index.html` directly via
`file://` will NOT work — ES modules require an http server.)

Then open `http://localhost:3000`.

Admin panel is at `/admin/login.html`.

## 7. Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Add each branding/contact value as a **GitHub Secret**
   (Settings → Secrets and variables → Actions), matching the keys in
   `.env.example`. Via the CLI:
   ```bash
   cat .env | grep -v '^#' | grep '=' | while IFS='=' read -r key value; do
     gh secret set "$key" --body "$value"
   done
   ```
3. Repo **Settings → Pages → Build and deployment → Source** → **GitHub
   Actions**.
4. Push to `main` — the workflow builds `js/env.js` from your secrets and
   deploys via `actions/deploy-pages`. Your site is live at
   `https://yourusername.github.io/your-repo/` (or your custom domain).

## File structure
```
index.html              Home: hero, agent bio, intake form (primary focus),
                         featured listings + testimonials previews
listings.html           Full listings list (filter chips, no search)
listing.html            Listing detail (?id=... query param), incl. map
testimonials.html       Full testimonials list
404.html                Custom not-found page
favicon.svg             Site icon
robots.txt, sitemap.xml SEO basics
css/style.css           Shared design system (blueprint/survey concept)

js/supabase-client.js   <- put your credentials here
js/site.js              Home page logic + intake form submission
js/listings.js          Listings page logic
js/listing-detail.js    Listing detail logic + map embed
js/testimonials.js      Testimonials page logic
js/components.js        Shared UI helpers (escapeHtml, card renderers, formatPrice)
js/errors.js            Toast notifications (showError/showSuccess/showWarning)
js/config.js            Reads runtime config into `config` object
js/config-loader.js     Replaces {{CONFIG.xxx}} placeholders in the DOM
js/load-env.js          Loads env locally (.env fallback) or from js/env.js
js/env.js               Generated at deploy time from GitHub Secrets — not in git

admin/login.html            Agent sign-in
admin/index.html             Dashboard overview (counts)
admin/listings.html          Listings CRUD: list + delete
admin/listing-form.html      Listings CRUD: create/edit (?id= to edit)
admin/testimonials.html      Testimonials CRUD: list + publish toggle + delete
admin/testimonial-form.html  Testimonials CRUD: create/edit (?id= to edit)
admin/leads.html              Leads inbox: status pipeline, private notes, delete
admin/js/admin-auth.js        Auth guard used by every admin page
admin/js/*.js                 Per-page logic, each imports supabase-client.js

supabase/schema.sql      Tables + Row Level Security policies
supabase/seed.sql        Sample data for local development

.github/workflows/deploy.yml  Builds js/env.js from secrets, deploys to Pages
```

## Notes
- Every admin page calls `requireAuth()` on load, which redirects to
  `login.html` if there's no active Supabase session.
- Blog and search are intentionally not included, per the original brief.
- To add photos: host them anywhere (Supabase Storage, S3, Cloudinary) and
  paste URLs into the listing form's "Image URLs" field, one per line.
- The map on the listing detail page is a plain Google Maps embed built
  from the listing's address fields — no API key or billing required.

## Code Quality & Security
- **Shared components** (`js/components.js`): Common UI patterns (listing
  cards, testimonial cards, price formatting, HTML escaping) are
  centralized to avoid duplication.
- **HTML sanitization**: User-submitted content (quotes, titles, addresses)
  is escaped consistently to prevent XSS injection.
- **Email validation**: Client-side validation ensures proper email format.
- **Image handling**: Listings show fallback "No photo available" when
  images are missing, with proper `alt` attributes for accessibility.
- **Numeric inputs**: Budget and bedroom fields use `type="number"` with
  appropriate constraints.
- **Error handling**: Admin writes (status updates, deletes, publish
  toggles) surface Supabase errors to the user instead of failing silently.
