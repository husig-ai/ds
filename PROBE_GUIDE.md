# Probe Script Guide

The probe script automatically diagnoses all issues with your site. It tests:
- Configuration loading
- Supabase connection
- Database schema
- Row Level Security
- Data population
- Form submission

## How to Run

### Method 1: Quick Run (Recommended)

1. Open your site (http://localhost:3000)
2. Press **F12** to open Developer Console
3. Type and press Enter:
   ```js
   window.probe.runAll()
   ```
4. Read the output - it will show exactly what's wrong

### Method 2: Run Individual Tests

```js
// Check your configuration
window.probe.checkConfig()

// Test Supabase connection
window.probe.checkSupabaseConnection()

// Check database tables exist
window.probe.checkDatabaseSchema()

// Test Row Level Security
window.probe.checkRLS()

// Check if data exists
window.probe.checkData()

// Test actual form submission
window.probe.testFormSubmission()
```

## Reading the Output

### ✓ All Green (Example Output)

```
✓ CHECKING CONFIGURATION
✓ Agent Name: Drew Sharma
✓ Company: Drew Sharma Realty
✓ Location: Frisco, TX
✓ Years In Market: 14
✓ Homes Closed: 120+
✓ Rating: 4.9

✓ CHECKING SUPABASE CONNECTION
✓ Connection successful
✓ SUPABASE_URL: https://wcjahlvjzvwgaffrzmkm.supabase.co
✓ ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5c...

✓ CHECKING DATABASE SCHEMA
✓ listings table exists
✓ testimonials table exists
✓ leads table exists

✓ CHECKING ROW LEVEL SECURITY
✓ Can read listings (public read policy working)
✓ Can read testimonials
✓ Can insert leads (form should work)

✓ CHECKING DATA IN DATABASE
✓ Listings: 7 rows
✓ Testimonials: 6 rows
✓ Leads: 12 rows

✓ TESTING FORM SUBMISSION
✓ Form submission successful (234ms)

✓ ALL SYSTEMS OK - SITE IS READY
```

### ❌ Issues Found (Example)

```
❌ leads table: relation "leads" does not exist

Fix: Run schema.sql in Supabase SQL Editor

---

❌ Cannot insert leads: 401 Unauthorized

Fix: Check Supabase anon key in .env

---

❌ Connection failed: fetch failed

Fix: Check internet connection and Supabase status
```

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `relation "leads" does not exist` | Schema not run | Run `supabase/schema.sql` in Supabase |
| `401 Unauthorized` | Bad Supabase key | Check `.env` has correct ANON_KEY |
| `403 Forbidden` | RLS policy blocks insert | Run `supabase/schema.sql` to recreate policies |
| `fetch failed` | Network issue | Check internet, check Supabase status |
| `No listings found` | Seed data not inserted | Run `supabase/seed.sql` in Supabase |
| `SUPABASE_URL is not defined` | .env not loaded | Verify .env file exists and is readable |

## What Each Test Does

### 1. Configuration Check
Verifies that config is loading from `.env`:
- Agent name, company, location
- Years, homes closed, rating
- All from environment variables

### 2. Supabase Connection
Tests that Supabase is reachable and credentials work:
- Runs a basic query
- Shows your URL and key
- If fails → credentials are wrong

### 3. Database Schema
Checks if tables exist:
- listings ✓
- testimonials ✓
- leads ✓

If any fail → run `schema.sql`

### 4. Row Level Security
Tests what operations are allowed:
- Public read listings ✓
- Public read testimonials ✓
- **Public insert leads** ✓ (critical for form)

If insert fails → form won't work

### 5. Data Check
Shows how much data is in each table:
- Count rows in listings
- Count rows in testimonials  
- Count rows in leads

If counts are 0 → run `seed.sql`

### 6. Form Submission
Actually attempts to submit a test lead:
- Creates a test lead in database
- Measures submit time
- Cleans up test data
- If succeeds → form is ready

## Troubleshooting Workflow

1. **Run:** `window.probe.runAll()`
2. **Look for:** First ❌ error in the output
3. **Read:** The error message
4. **Find:** The matching fix in the table above
5. **Apply:** The fix (usually run a SQL script)
6. **Repeat:** Run probe again to verify fix

## Pro Tips

- **Before deploying:** Run probe to make sure everything works
- **After changes:** Run probe to verify nothing broke
- **When debugging:** Run individual test to isolate the issue
- **Share with team:** Screenshot the probe output if issues occur

## Sample Debug Session

```js
// User reports: "Form stuck on Submitting"

// Step 1: Run full probe
window.probe.runAll()

// Output shows:
// ❌ Cannot insert leads: 403 Forbidden

// Step 2: Read what this means
// RLS policy is blocking inserts

// Step 3: Fix it
// Go to Supabase > SQL Editor
// Run supabase/schema.sql again

// Step 4: Verify
// window.probe.runAll()
// Now shows: ✓ Can insert leads (form should work)

// Step 5: Test
// Try submitting form - should work now!
```

## More Help

- **FORM_TROUBLESHOOTING.md** - Detailed form debugging
- **DEBUG_GUIDE.md** - Other debug commands
- **Browser Console (F12)** - Raw error messages
- **Supabase Dashboard Logs** - Server-side errors
