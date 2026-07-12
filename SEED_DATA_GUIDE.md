# Seed Data Guide

This guide shows how to populate your Supabase database with sample data for testing and development.

## What's Included in Seed Data

### Listings (7 total)
- 3 **Featured** listings (shown on homepage)
- 4 additional listings
- Mix of statuses: active, pending, sold, coming_soon
- Various property types: single family, condo, townhouse
- Price range: $385K - $1.45M

### Testimonials (6 total)
- 3 **Featured** testimonials (shown on homepage)
- 3 additional testimonials
- All published and ready to display
- Mix of buyer/seller/both transaction types
- 4.8-5.0 star ratings

### Leads (6 total)
- Various stages of sales pipeline: new, contacted, qualified, touring
- Different timelines: immediate to just browsing
- Various financing statuses and budgets
- Real-world use cases for testing CRM functionality

## How to Insert Seed Data

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New query**

### Step 2: Copy the Seed SQL

1. Open `/supabase/seed.sql` in your text editor
2. Copy ALL the contents

### Step 3: Run in Supabase

1. Paste into the SQL Editor
2. Click **Run** (blue button)
3. Wait for confirmation message

You should see:
```
Query successful
7 rows affected (listings)
6 rows affected (testimonials)
6 rows affected (leads)
```

### Step 4: Verify

1. Go to Supabase **Table Editor**
2. Check each table:
   - `listings` - should show 7 rows
   - `testimonials` - should show 6 rows
   - `leads` - should show 6 rows

## What the Seed Data Represents

### Listings

| Address | Type | Price | Status | Featured |
|---------|------|-------|--------|----------|
| Oakmont Drive | Single Family | $850K | Active | ✓ |
| Golf View Lane | Condo | $625K | Pending | ✓ |
| Meadowbrook Lane | Single Family | $725K | Active | ✓ |
| Birch Street | Townhouse | $385K | Active | |
| Premier Estates | Single Family | $1.45M | Active | |
| Heritage Oak Lane | Single Family | $695K | Sold | |
| Innovation Drive | Single Family | $550K | Coming Soon | |

### Testimonials

All testimonials are from satisfied clients with 4.8-5.0 ratings. Featured ones will show on the homepage immediately.

### Leads

Sample leads at various stages:
- **New** - Just submitted form
- **Contacted** - Reached out, waiting response
- **Qualified** - Pre-approved, ready to view
- **Touring** - Actively viewing properties
- **Browsing** - Just looking, not ready yet

## Testing Workflow

After inserting seed data:

1. **Reload homepage** (`/`)
   - Should show 3 featured listings
   - Should show 3 featured testimonials

2. **View all listings** (`/listings.html`)
   - Should show 7 listings (excluding off_market)
   - Can filter by type

3. **View listing details** (`/listing.html?id=...`)
   - Click on any listing to see full details

4. **View testimonials** (`/testimonials.html`)
   - Should show all 6 testimonials

5. **Submit contact form** (homepage)
   - Should create new lead in database
   - Check `/admin/leads.html` to see it

6. **Admin panel** (`/admin/login.html`)
   - View/edit listings
   - View/publish testimonials
   - Manage leads pipeline

## Modifying Seed Data

### To Add More Listings

Edit `seed.sql` and add to the listings INSERT block:

```sql
(
  'Property Title',
  'Description here',
  '123 Street Name',
  'Frisco',
  'TX',
  '75034',
  600000,
  'for_sale',
  'single_family',
  'active',
  3,
  2.5,
  2000,
  '0.35 acres',
  2018,
  'FRS2024999',
  ARRAY['https://image-url.com/photo.jpg'],
  true  -- featured
),
```

### To Add More Testimonials

Similar pattern - add to testimonials INSERT block with fields:
- client_name
- client_location
- transaction_type (buyer/seller/both)
- rating (1-5)
- quote
- photo_url
- featured (true/false)
- published (true/false)

### To Add More Leads

Add to leads INSERT block with fields:
- full_name
- email
- phone
- budget_min / budget_max
- preferred_areas
- property_types
- bedrooms_needed / bathrooms_needed
- timeline
- financing_status
- must_haves
- additional_notes
- status (new/contacted/qualified/touring/offer/closed/lost)
- agent_notes
- source (always 'website' for seed data)

## Clearing Seed Data

To remove all seed data (WARNING: irreversible):

1. Open Supabase SQL Editor
2. Run:
```sql
DELETE FROM leads;
DELETE FROM testimonials;
DELETE FROM listings;
```

This deletes everything. Seed data can be re-inserted anytime by running seed.sql again.

## Notes

- Seed data uses placeholder image URLs from Unsplash and Pravatar
- Testimonial photos are avatar placeholders
- All data is realistic but fictional (no real people)
- Great for testing the entire system end-to-end
- Safe to delete and re-run anytime

## Next Steps

1. Run the seed.sql script
2. Check each page shows the data
3. Test admin CRUD operations
4. Add your own real listings as needed

Your database is now ready for development! 🎉
