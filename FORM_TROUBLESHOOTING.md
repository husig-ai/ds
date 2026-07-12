# Form Submission Troubleshooting

If the intake form gets stuck on "Submitting…", use these steps to diagnose the issue.

## Quick Diagnosis

1. **Open Browser Console** (F12)
2. **Look for error messages** - you should see console logs showing what's happening
3. **Check the specific error** and follow the steps below

## Common Issues & Solutions

### Issue 1: "leads table does not exist"

**Cause:** Schema hasn't been run yet

**Solution:**
1. Go to Supabase → SQL Editor
2. Open `supabase/schema.sql`
3. Copy all contents
4. Paste and **Run** in SQL Editor
5. Reload page and try again

### Issue 2: "Submission timeout"

**Cause:** Supabase not responding or network issue

**Solution:**
1. Check your internet connection
2. Verify Supabase URL is correct:
   ```js
   window.debug.showConfig()
   ```
3. Check Supabase status: https://status.supabase.com
4. Try again in a few seconds

### Issue 3: "Could not submit form: 401 Unauthorized"

**Cause:** Invalid Supabase anon key

**Solution:**
1. Go to `.env` file
2. Check `VITE_SUPABASE_ANON_KEY` 
3. Get fresh key from Supabase:
   - Dashboard → Settings → API
   - Copy the `anon/public` key
4. Update in both:
   - `.env`
   - `js/supabase-client.js`
5. Reload page and try again

### Issue 4: "Could not submit form: 403 Forbidden"

**Cause:** Row Level Security (RLS) policy blocking insert

**Solution:**
1. Go to Supabase → SQL Editor
2. Check RLS policy allows public insert:
   ```sql
   -- Should see this policy:
   CREATE POLICY "leads_public_insert" ON leads
   FOR INSERT TO anon, authenticated
   WITH CHECK (true);
   ```
3. If missing, run `supabase/schema.sql` again to add it

### Issue 5: Form still says "Submitting…" after 15 seconds

**Cause:** Request is hanging or failing silently

**Solution:**
1. **Reload the page** (this resets the button)
2. Open Console (F12) to see exact error
3. Try one of the above solutions based on error message
4. If no error message, check Supabase connection:
   ```js
   window.debug.testSupabase()
   ```

## Debugging Steps

### Step 1: Check Supabase Connection
```js
window.debug.testSupabase()
```
Should show: `true` ✓ or `false` ❌

If false, your Supabase credentials are wrong.

### Step 2: Check Environment
```js
window.debug.showConfig()
```
Look for:
- Agent name should be "Drew Sharma"
- Company should be "Realty"
- If showing defaults, .env didn't load

### Step 3: Check Browser Console Logs
1. Press F12
2. Click **Console** tab
3. Look for "Submitting form data:" message
4. Should show the payload being sent
5. Look for any error messages below it

### Step 4: Verify Database Tables Exist
In Supabase Dashboard:
1. Click **Table Editor**
2. You should see:
   - `listings` table ✓
   - `testimonials` table ✓
   - `leads` table ✓

If any are missing, run `schema.sql`

## Testing the Form

### Minimal Test
Try submitting with just:
- Name: "Test"
- Email: "test@example.com"
- Leave everything else blank

If this works, the issue is with optional fields.

### Full Test
After fixing the issue, try with complete data:
- Name: "John Doe"
- Email: "john@example.com"
- Phone: "(555) 123-4567"
- Budget: 400000 - 600000
- Timeline: "3_6_months"
- Financing: "pre_approved"
- Property: Select "single_family"
- Bedrooms: 3
- Bathrooms: 2

## Reset Instructions

If form gets completely stuck:

1. **Hard refresh page:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear browser cache** (Settings → Clear browsing data)
3. **Try in Incognito/Private mode** (eliminates cache issues)

## Still Stuck?

Check this checklist:

- [ ] Schema.sql has been run in Supabase
- [ ] Supabase URL is correct in `.env` and `js/supabase-client.js`
- [ ] Supabase anon key is correct
- [ ] `leads` table exists in Table Editor
- [ ] RLS policies allow public insert
- [ ] Browser console shows no errors
- [ ] `window.debug.testSupabase()` returns true
- [ ] Network is working (other sites load fine)

If all of these pass and it's still not working, check the Supabase Database logs for more details.

## Advanced: Check Supabase Logs

In Supabase Dashboard:
1. Click **Logs** (in left sidebar)
2. Look for your failed insert attempts
3. The error message should tell you exactly what went wrong
