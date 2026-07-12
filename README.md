# Real Estate Agent Static Site — no build step

Plain HTML/CSS/JS. No React, no bundler. Talks directly to Supabase from
the browser using the `@supabase/supabase-js` ESM build off a CDN. Deploys
to GitHub Pages by just pushing the files — nothing to build.

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
Edit [`.env`](./.env) with your information — this file is loaded automatically by the site:
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

**How it works:**
- `.env` is loaded by `js/load-env.js` when the page starts
- `js/config.js` reads values from `.env` and provides them to the site
- All `{{CONFIG.xxx}}` placeholders in HTML are replaced with actual values
- Never commit `.env` to git (it's in `.gitignore`) — keep it local only

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
1. Verify setup with `bash scripts/verify-setup.sh`.
2. Push this folder to a GitHub repo.
3. Repo **Settings → Pages → Build and deployment → Source** → **Deploy
   from a branch** → pick `main` and `/ (root)`.
4. Done — no Actions, no build. Your site is live at
   `https://yourusername.github.io/your-repo/`.

**Deployment checklist:**
- [ ] Supabase credentials configured in `js/supabase-client.js`
- [ ] Repository pushed to GitHub
- [ ] GitHub Pages source set to main branch, root folder
- [ ] Site is publicly accessible
- [ ] Admin login works at `/admin/login.html`

## File structure
```
index.html              Home: hero, agent bio, intake form (primary focus),
                         featured listings + testimonials previews
listings.html           Full listings list (filter chips, no search)
listing.html            Listing detail (?id=... query param)
testimonials.html       Full testimonials list
css/style.css           Shared design system (blueprint/survey concept)
js/supabase-client.js   <- put your credentials here
js/site.js              Home page logic + intake form submission
js/listings.js          Listings page logic
js/listing-detail.js    Listing detail logic
js/testimonials.js      Testimonials page logic

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
```

## Notes
- Every admin page calls `requireAuth()` on load, which redirects to
  `login.html` if there's no active Supabase session.
- Blog and search are intentionally not included, per the original brief.
- To add photos: host them anywhere (Supabase Storage, S3, Cloudinary) and
  paste URLs into the listing form's "Image URLs" field, one per line.

## Code Quality & Security
- **Shared components** (`js/components.js`): Common UI patterns (listing cards,
  price formatting) are centralized to avoid duplication.
- **HTML sanitization**: User-submitted content (quotes, titles) is escaped to
  prevent XSS injection.
- **Email validation**: Client-side validation ensures proper email format.
- **Image handling**: Listings show fallback "No photo available" when images
  are missing, with proper `alt` attributes for accessibility.
- **Numeric inputs**: Budget and bedroom fields use `type="number"` with
  appropriate constraints.
