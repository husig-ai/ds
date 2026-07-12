-- ============================================================
-- Seed Data for Drew Sharma Realty
-- Run this in Supabase SQL Editor to populate test data
-- ============================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM leads;
-- DELETE FROM testimonials;
-- DELETE FROM listings;

-- ============================================================
-- LISTINGS
-- ============================================================

INSERT INTO listings (title, description, address, city, state, zip, price, listing_type, property_type, status, bedrooms, bathrooms, square_feet, lot_size, year_built, mls_number, image_urls, featured)
VALUES
-- Featured listings
(
  'Modern Home in Prestigious Frisco Heights',
  'Stunning 4-bedroom, 3-bath home with contemporary design. Features open floor plan, chef''s kitchen with island seating, and covered patio overlooking mature trees. Master suite has spa-like bath with dual vanities and walk-in closet.',
  '1247 Oakmont Drive',
  'Frisco',
  'TX',
  '75034',
  850000,
  'for_sale',
  'single_family',
  'active',
  4,
  3,
  2850,
  '0.45 acres',
  2018,
  'FRS2024001',
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800'],
  true
),
(
  'Luxury Condo with Golf Course Views',
  'Elegant 3-bedroom condo in gated community. Panoramic golf course views from wraparound balcony. Marble counters, hardwood floors, and smart home features throughout. Resort-style amenities include pool, spa, and fitness center.',
  '5432 Golf View Lane, Unit 312',
  'Frisco',
  'TX',
  '75034',
  625000,
  'for_sale',
  'condo',
  'pending',
  3,
  2.5,
  2100,
  'Common area',
  2015,
  'FRS2024002',
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  true
),
(
  'Spacious Family Home Near Top-Rated Schools',
  'Charming 5-bedroom, 3-bath home perfect for growing families. Large backyard with mature oak trees, perfect for entertaining. Recently updated: new HVAC, fresh paint, updated kitchen with stainless appliances.',
  '8956 Meadowbrook Lane',
  'Frisco',
  'TX',
  '75034',
  725000,
  'for_sale',
  'single_family',
  'active',
  5,
  3,
  3200,
  '0.55 acres',
  2008,
  'FRS2024003',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
  true
),
-- Additional listings
(
  'Cozy Townhouse with Attached Garage',
  '2-bedroom, 2-bath townhouse in quiet neighborhood. Private patio, open living area, and convenient location near shopping and dining.',
  '3421 Birch Street',
  'Frisco',
  'TX',
  '75034',
  385000,
  'for_sale',
  'townhouse',
  'active',
  2,
  2,
  1400,
  'Common area',
  2010,
  'FRS2024004',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
  false
),
(
  'Executive Estate with Pool and Guest House',
  'Prestigious 6-bedroom home on 1.2-acre lot. Saltwater pool with waterfall, separate guest house with kitchenette, home theater, and wine cellar. Perfect for entertaining.',
  '1111 Premier Estates Boulevard',
  'Frisco',
  'TX',
  '75034',
  1450000,
  'for_sale',
  'single_family',
  'active',
  6,
  5.5,
  5400,
  '1.2 acres',
  2019,
  'FRS2024005',
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800'],
  false
),
(
  'Recently Sold - Legacy Home',
  'Beautiful 4-bedroom home with wraparound porch. Sold at asking price in 5 days. Perfect example of smart pricing strategy.',
  '2789 Heritage Oak Lane',
  'Frisco',
  'TX',
  '75034',
  695000,
  'for_sale',
  'single_family',
  'sold',
  4,
  2.5,
  2650,
  '0.40 acres',
  2012,
  'FRS2024006',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
  false
),
(
  'Coming Soon - New Construction',
  'Exciting new build opening soon. Modern design with energy-efficient features. Pre-construction pricing available for select units.',
  '4200 Innovation Drive',
  'Frisco',
  'TX',
  '75034',
  550000,
  'for_sale',
  'single_family',
  'coming_soon',
  3,
  2.5,
  2200,
  '0.35 acres',
  null,
  'FRS2024007',
  ARRAY[]::text[],
  false
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

INSERT INTO testimonials (client_name, client_location, transaction_type, rating, quote, photo_url, featured, published)
VALUES
(
  'Sarah & Michael Thompson',
  'Frisco, TX',
  'buyer',
  5,
  'Drew made our home buying experience seamless and stress-free. He listened carefully to our needs and found us the perfect home within our timeline and budget. Highly recommend!',
  'https://i.pravatar.cc/150?img=1',
  true,
  true
),
(
  'Jennifer Martinez',
  'Plano, TX',
  'seller',
  5,
  'As a first-time home seller, I was nervous. Drew walked me through every step, answered all my questions, and got me an offer 3% above asking price. Best decision ever!',
  'https://i.pravatar.cc/150?img=2',
  true,
  true
),
(
  'David & Lisa Chen',
  'Frisco, TX',
  'both',
  5,
  'We sold our previous home and bought a new one with Drew. His market knowledge and negotiation skills saved us thousands of dollars. We trust him completely.',
  'https://i.pravatar.cc/150?img=3',
  true,
  true
),
(
  'Robert Johnson',
  'McKinney, TX',
  'buyer',
  4.9,
  'Drew found us a great investment property in an up-and-coming neighborhood. His insights about market trends were invaluable. Already seeing great returns!',
  'https://i.pravatar.cc/150?img=4',
  false,
  true
),
(
  'Amanda Rodriguez',
  'Frisco, TX',
  'seller',
  5,
  'Sold my home in just 8 days! Drew''s marketing strategy and professional presentation brought multiple offers. He negotiated the best terms for me.',
  'https://i.pravatar.cc/150?img=5',
  false,
  true
),
(
  'James & Patricia Wilson',
  'Prosper, TX',
  'buyer',
  4.8,
  'Drew helped us upsize to our dream home. He was patient, professional, and always had our best interests in mind. Can''t thank him enough!',
  'https://i.pravatar.cc/150?img=6',
  false,
  true
);

-- ============================================================
-- LEADS (Form Submissions)
-- ============================================================

INSERT INTO leads (full_name, email, phone, budget_min, budget_max, preferred_areas, property_types, bedrooms_needed, bathrooms_needed, timeline, financing_status, must_haves, additional_notes, status, agent_notes, source)
VALUES
(
  'Emily Watson',
  'emily.watson@email.com',
  '(214) 555-0101',
  400000,
  600000,
  'Frisco, near schools',
  ARRAY['single_family', 'townhouse'],
  3,
  2.5,
  '3_6_months',
  'pre_approved',
  'Good schools, modern kitchen, backyard',
  'First-time home buyers, very interested',
  'qualified',
  'Scheduled showing for Saturday. Very interested in Meadowbrook property.',
  'website'
),
(
  'Mark Anderson',
  'manderson@business.com',
  '(469) 555-0102',
  1200000,
  1800000,
  'Prestigious neighborhoods, golf community',
  ARRAY['single_family'],
  5,
  4,
  'immediately',
  'pre_approved',
  'Executive home, luxury finishes, pool',
  'Corporate relocation, flexible timeline',
  'qualified',
  'Looking at Premier Estates properties. Ready to move quickly.',
  'website'
),
(
  'Jessica Lee',
  'j.lee.realtor@email.com',
  '(972) 555-0103',
  450000,
  650000,
  'Any area in Frisco',
  ARRAY['single_family', 'condo'],
  2,
  2,
  '1_3_months',
  'needs_preapproval',
  'Walk-in closets, modern appliances',
  'Investor, interested in rental potential',
  'contacted',
  'Follow up - sent pre-approval resources',
  'website'
),
(
  'Robert & Susan Price',
  'rprice@email.com',
  '(214) 555-0104',
  500000,
  750000,
  'Near parks and trails',
  ARRAY['single_family'],
  4,
  3,
  '6_12_months',
  'cash_buyer',
  'Green space, quiet street, mature trees',
  'Downsizing from larger home',
  'new',
  'Initial contact received. Need to schedule consultation.',
  'website'
),
(
  'Michael Chen',
  'm.chen.tech@email.com',
  '(469) 555-0105',
  800000,
  1100000,
  'Tech corridor area, new construction',
  ARRAY['single_family', 'condo'],
  3,
  2.5,
  '1_3_months',
  'pre_approved',
  'Smart home features, energy efficient, modern design',
  'Tech professional, work from home setup',
  'touring',
  'Showed 3 properties. Interested in Innovation Drive coming soon.',
  'website'
),
(
  'Nicole Thompson',
  'nthompson.design@email.com',
  null,
  600000,
  800000,
  'Walkable neighborhoods, near downtown',
  ARRAY['townhouse', 'condo'],
  2,
  2,
  'just_browsing',
  'unsure',
  'Contemporary design, balcony/patio',
  'Just browsing, not ready yet',
  'new',
  'Browsing phase. Send quarterly market updates.',
  'website'
);

-- ============================================================
-- Summary of Seed Data
-- ============================================================
-- Listings: 7 total (3 featured)
-- Testimonials: 6 total (3 featured)
-- Leads: 6 total (various stages of pipeline)
--
-- Run this script in Supabase SQL Editor to populate your development database
-- ============================================================
