# Admin Login Setup & Troubleshooting

## Quick Setup

### 1. Create Admin User in Supabase

1. Go to your Supabase project dashboard
2. Click **Authentication** (left sidebar)
3. Click **Users** tab
4. Click **Add user** (top right)
5. Fill in:
   - **Email**: Your email address (e.g., `drew@drewsharmarealty.com`)
   - **Password**: Create a strong password
   - Toggle **Auto Confirm User** (ON)
6. Click **Save**

### 2. Access Admin Panel

1. Go to `/admin/login.html` (or click "Agent" link in navigation)
2. Enter your email and password from step 1
3. You'll be redirected to the admin dashboard at `/admin/index.html`

### 3. Start Managing

- **Listings** — Add, edit, delete property listings
- **Testimonials** — Add, publish, and feature testimonials  
- **Leads** — View and manage intake form submissions

---

## Troubleshooting

### Login Says "Incorrect email or password"

**Possible causes:**

1. **User doesn't exist in Supabase**
   - Go to Supabase → Authentication → Users
   - Verify your user account exists
   - If not, create it (see Quick Setup above)

2. **Wrong password**
   - Double-check your password (case-sensitive)
   - If forgotten, go to Supabase → Users → click user → **Reset Password**

3. **Supabase credentials not configured**
   - Check `js/supabase-client.js`:
     ```js
     const SUPABASE_URL = 'https://wcjahlvjzvwgaffrzmkm.supabase.co';
     const SUPABASE_ANON_KEY = 'eyJhbGci...';  // Full token
     ```
   - If placeholder values, update them from Supabase Dashboard → Settings → API

4. **Wrong Supabase project**
   - Verify `SUPABASE_URL` matches your Supabase project
   - Check Dashboard → Settings → General for correct URL
   - Compare URLs carefully (easy to mix up projects!)

### "Cannot connect to database" or network errors

1. **Check Supabase status**
   - Go to https://status.supabase.com/
   - Verify no outages
   
2. **Check browser console** (F12)
   - Look for error messages
   - Common issues:
     - `CORS error` → Check Supabase → Auth → Redirect URLs
     - `401 Unauthorized` → Check your anon key
     - `Network error` → Check internet connection

3. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Admin pages show but login redirect happens immediately

This means you're not authenticated. The `requireAuth()` function redirects to login if there's no session.

**Solution:** Make sure you're actually logged in by:
1. Visiting `/admin/login.html` directly
2. Entering credentials
3. Waiting for redirect to `/admin/index.html`

### "No listings" / "No testimonials" even after adding them

1. **Check your admin user is authenticated**
   - Reload page (F5)
   - Verify you see admin navigation

2. **Check Row Level Security (RLS) policies**
   - Go to Supabase → SQL Editor
   - Run: `SELECT * FROM listings;` (as authenticated user)
   - If no results, RLS policies might be blocking your user
   - Verify `supabase/schema.sql` was run completely

3. **Try adding a test listing**
   - Go to Listings → Add New
   - Fill in minimal info and save
   - Reload page
   - Does it appear?

---

## Database Setup

If you haven't run the schema yet:

1. Go to Supabase → SQL Editor
2. Click **New query**
3. Copy/paste contents of `supabase/schema.sql`
4. Click **Run**
5. Verify all tables are created in Database → Tables

---

## Common Questions

**Q: Is my password secure?**
A: Yes! Supabase handles auth securely. Passwords are hashed server-side and never exposed.

**Q: Can I have multiple admin users?**
A: Yes! Create more users in Supabase → Authentication → Users. Each can log in separately.

**Q: Can I change my password?**
A: Yes! You'll be able to add password reset functionality. For now, reset via Supabase Dashboard.

**Q: What if I lose access?**
A: Go to Supabase → Authentication → Users → Click your user → **Reset Password**

---

## Still Having Issues?

1. Check browser console (F12) for error messages
2. Verify all Supabase credentials are correct
3. Make sure your user exists in Supabase
4. Try in a different browser/incognito window
5. Check Supabase status at https://status.supabase.com/
