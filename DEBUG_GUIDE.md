# Debugging Guide

If error messages aren't showing or things aren't working, use these tools to diagnose.

## Quick Debug Commands

Open your browser's **Developer Console** (F12) and type these commands:

### Test Error Display
```js
window.debug.testError()
```
Should show a red error box in top-right corner.

### Test Success Display
```js
window.debug.testSuccess()
```
Should show a green success box in top-right corner.

### Test Warning Display
```js
window.debug.testWarning()
```
Should show a yellow warning box in top-right corner.

### Check if .env Loaded
```js
window.debug.testEnv()
```
Shows whether the `.env` file was successfully loaded and parsed.

Returns:
- `true` - .env is loaded ✓
- `false` - .env is NOT loaded ❌

If false, your environment variables aren't available. Check:
1. `.env` file exists in root directory
2. Web server is serving it (static servers like `npx serve` should)
3. Look at `window.__env` to see what loaded

### Check Configuration
```js
window.debug.showConfig()
```
Prints the current config object with:
- Agent name, company, location
- Years in market, homes closed, rating
- Copyright year

### Test Supabase Connection
```js
window.debug.testSupabase()
```
Attempts to connect to Supabase and run a simple query.

Returns:
- `true` - Supabase is working ✓
- `false` - Supabase connection failed ❌

If false, check:
1. Supabase URL and key are correct in `.env`
2. Supabase URL is reachable from your location
3. No CORS issues (check Network tab in DevTools)

### View All Debug Commands
```js
window.debug.help()
```
Lists all available debug commands.

---

## Troubleshooting Checklist

### "No featured listings yet" - but no error message

This means:
- ✓ Supabase is connecting
- ✓ No error occurred
- ❌ There are just no featured listings

**Solution:** 
1. Log in to admin (`/admin/login.html`)
2. Add a listing
3. Check "Featured" checkbox
4. Save
5. Reload page

### Error messages not appearing

1. **Check if error handler loaded:**
   ```js
   window.debug.testError()
   ```
   If nothing appears, the error system didn't load.

2. **Check browser console for JS errors (F12)**
   - Look for red error messages
   - Click on them to see details

3. **Check if files exist:**
   ```js
   window.debug.help()
   ```
   If this fails, `debug.js` didn't load.

### Supabase connection fails

1. **Test connection:**
   ```js
   window.debug.testSupabase()
   ```

2. **Check your credentials:**
   ```js
   window.debug.showConfig()  // Won't show Supabase key, but shows URL
   ```

3. **Verify in .env:**
   - URL matches your Supabase project
   - Anon key is complete (starts with `eyJ...`)

4. **Check Network tab (F12):**
   - Do requests go to Supabase?
   - Are they returning 401/403 errors?
   - Is there a CORS error?

### Forms don't submit

1. **Check Supabase connection first:**
   ```js
   window.debug.testSupabase()
   ```

2. **Check browser console for errors (F12)**

3. **Verify admin user exists in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Should see your user account

4. **Check RLS policies:**
   - Go to Supabase → SQL Editor
   - Run: `SELECT * FROM leads;`
   - If it fails, RLS policies need fixing

---

## Console Output to Look For

### Normal Operation
```
✓ Environment loaded
✓ Supabase connected successfully
load-env.js loaded
config-loader.js loaded
site.js loaded
debug.js loaded
```

### Problem Signs
```
⚠️ Could not load .env file        ← .env not found
❌ Supabase error: 401             ← Bad credentials
❌ Supabase error: CORS error      ← Network/domain issue
Error loading listings             ← Data fetch failed
```

---

## Network Debugging

In browser DevTools (F12):

1. **Click Network tab**
2. **Filter to fetch/XHR**
3. **Look for requests to:**
   - `supabase.co` - Should see requests here
   - `.env` - Should see a request loading .env

4. **Check status codes:**
   - 200 = Success ✓
   - 304 = Cached (still OK) ✓
   - 404 = Not found ❌
   - 401 = Unauthorized ❌
   - 403 = Forbidden ❌
   - CORS error = Network issue ❌

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "No featured listings" | No listings created | Create listings in admin panel |
| "Could not load listings" | Supabase connection failed | Check .env credentials |
| Form won't submit | No admin user or RLS issue | Create user in Supabase |
| Blank page | JavaScript error | Check console (F12) |
| Error messages don't show | errors.js not loaded | Hard refresh (Ctrl+Shift+R) |
| Config shows placeholders | .env didn't load | Check .env exists and server serves it |

---

## Still Stuck?

1. **Check browser console (F12)** for actual error messages
2. **Run:** `window.debug.testSupabase()` to isolate the issue
3. **Check Supabase Dashboard** for data/errors
4. **Look at Network tab (F12)** for failed requests
5. **Try hard refresh:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)

The debug tools will help pinpoint exactly what's failing!
