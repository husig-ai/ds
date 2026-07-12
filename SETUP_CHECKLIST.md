# 🚀 Setup Checklist

Follow these steps to customize the site for your real estate business.

## Step 1: Environment Configuration
- [ ] Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- [ ] Open `.env` and fill in all fields with your actual information
- [ ] **IMPORTANT:** Never commit `.env` to git (it's in `.gitignore`)

## Step 2: Site Branding
- [ ] Open `js/config.js`
- [ ] Update your agent name:
  ```js
  agentFirstName: 'Your Name'
  agentLastName: 'Your Last Name'
  ```
- [ ] Update company name:
  ```js
  companyName: 'Your Company'
  ```
- [ ] Update location (your primary service area):
  ```js
  primaryLocation: 'Your City, State'
  serviceAreas: 'Your service area description'
  ```
- [ ] Update your stats:
  ```js
  yearsInMarket: 10       // Your years of experience
  homesClosedCount: '100+' // Your total homes sold/closed
  clientRating: '5.0'     // Your average rating (1-5)
  ```

## Step 3: Supabase Setup
- [ ] Create a Supabase project at https://supabase.com
- [ ] Run SQL from `supabase/schema.sql` in SQL Editor
- [ ] Create your user account (Settings → Authentication → Add User)
  - Use your actual email and password
- [ ] Copy Project URL and Anon Key from Settings → API
- [ ] Update `.env` (never commit this file):
  ```
  VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=your-actual-anon-public-key
  ```
- [ ] Update `js/supabase-client.js`:
  ```js
  const SUPABASE_URL = 'https://your-actual-project-ref.supabase.co';
  const SUPABASE_ANON_KEY = 'your-actual-anon-public-key';
  ```

## Step 4: Contact Information
- [ ] Open `index.html`
- [ ] Find the "Your agent" section (search for `#about`)
- [ ] Update license number with your actual license
- [ ] Update office phone with your actual number
- [ ] Update email with your actual email address

## Step 5: Social & Marketing Links (Optional)
- [ ] Update `.env` with your social media URLs (if you have them):
  ```
  FACEBOOK_URL=https://facebook.com/your-page
  INSTAGRAM_URL=https://instagram.com/your-profile
  LINKEDIN_URL=https://linkedin.com/in/your-profile
  YOUTUBE_URL=https://youtube.com/@your-handle
  ```
- [ ] Add Google Analytics ID (optional, if you use analytics):
  ```
  GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
  ```
- [ ] Note: These are stored in `.env` which is not committed to git

## Step 6: Test Locally
- [ ] Run verification script:
  ```bash
  bash scripts/verify-setup.sh
  ```
- [ ] Start a local server:
  ```bash
  npx serve .
  ```
- [ ] Open http://localhost:3000
- [ ] Check that:
  - [ ] Your name appears in navigation
  - [ ] Your company name displays correctly
  - [ ] Location and stats show correctly
  - [ ] Admin login works at `/admin/login.html`
  - [ ] Can submit a lead form
  - [ ] Can view listings (once added)

## Step 7: Add Listings
- [ ] Log into admin at `/admin/login.html`
- [ ] Go to **Listings → Add New**
- [ ] Fill in property details
- [ ] Add image URLs (from Supabase Storage, S3, Cloudinary, etc.)
- [ ] Check "Featured" to show on homepage
- [ ] Save

## Step 8: Add Testimonials
- [ ] Go to **Testimonials → Add New**
- [ ] Fill in client info and quote
- [ ] Set rating (1-5 stars)
- [ ] Check "Published" to make public
- [ ] Check "Featured" to show on homepage
- [ ] Save

## Step 9: Deploy to GitHub Pages
- [ ] Create a GitHub repository
- [ ] Push code:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Go to repo **Settings → Pages**
- [ ] Set source to `main` branch, `/ (root)`
- [ ] Wait for deployment (usually 1-2 minutes)
- [ ] Visit `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Step 10: Finalize
- [ ] Test all pages work on live site
- [ ] Test form submission
- [ ] Check listings display correctly
- [ ] Test admin login on live site
- [ ] Share link with friends/family for feedback

## Common Issues

### Your name/company still shows as placeholder
- Check `js/config.js` — make sure all values are updated
- Reload the page (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache if needed

### Supabase credentials not working
- Verify URL and key in `js/supabase-client.js`
- Check that Row Level Security policies were created in `supabase/schema.sql`
- Ensure your user account is created in Authentication

### Listings not showing
- Check that listings exist in Supabase dashboard
- Verify `status` is not `off_market`
- Check browser console for errors (F12)

### Forms not submitting
- Check Supabase RLS policies allow public insert to `leads` table
- Verify Supabase URL and key are correct
- Check browser console for detailed error messages

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **GitHub Pages:** https://pages.github.com
- **CONFIG_GUIDE.md** — Detailed configuration documentation
- **README.md** — Full setup instructions

---

✅ **Once you complete this checklist, your site is ready!**
