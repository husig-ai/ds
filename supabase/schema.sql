-- ============================================================
-- Real Estate Agent Site — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- LISTINGS
-- ------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  title text not null,
  description text,

  address text,
  city text,
  state text,
  zip text,

  price numeric,
  listing_type text not null default 'for_sale' check (listing_type in ('for_sale', 'for_rent')),
  property_type text default 'single_family' check (property_type in ('single_family','condo','townhouse','multi_family','land','other')),
  status text not null default 'active' check (status in ('active','pending','sold','coming_soon','off_market')),

  bedrooms numeric,
  bathrooms numeric,
  square_feet integer,
  lot_size text,
  year_built integer,
  mls_number text,

  image_urls text[] not null default '{}',
  featured boolean not null default false
);

-- ------------------------------------------------------------
-- TESTIMONIALS
-- ------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  client_name text not null,
  client_location text,
  transaction_type text check (transaction_type in ('buyer','seller','both')),
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null,
  photo_url text,

  featured boolean not null default false,
  published boolean not null default true
);

-- ------------------------------------------------------------
-- BUYER INTAKE LEADS  (the primary-focus form)
-- ------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- contact info
  full_name text not null,
  email text not null,
  phone text,

  -- buyer intake details
  budget_min numeric,
  budget_max numeric,
  preferred_areas text,
  property_types text[] default '{}',
  bedrooms_needed numeric,
  bathrooms_needed numeric,
  timeline text check (timeline in ('immediately','1_3_months','3_6_months','6_12_months','just_browsing')),
  financing_status text check (financing_status in ('pre_approved','needs_preapproval','cash_buyer','unsure')),
  must_haves text,
  additional_notes text,

  -- CRM / pipeline fields (agent-managed)
  status text not null default 'new' check (status in ('new','contacted','qualified','touring','offer','closed','lost')),
  agent_notes text,
  source text not null default 'website'
);

-- ------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.listings enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;

-- LISTINGS: public can read everything; only logged-in agent can write
create policy "listings_public_read" on public.listings
  for select using (true);

create policy "listings_agent_write" on public.listings
  for insert to authenticated with check (true);
create policy "listings_agent_update" on public.listings
  for update to authenticated using (true) with check (true);
create policy "listings_agent_delete" on public.listings
  for delete to authenticated using (true);

-- TESTIMONIALS: public can read published ones; agent can read/write all
create policy "testimonials_public_read" on public.testimonials
  for select using (published = true or auth.role() = 'authenticated');

create policy "testimonials_agent_write" on public.testimonials
  for insert to authenticated with check (true);
create policy "testimonials_agent_update" on public.testimonials
  for update to authenticated using (true) with check (true);
create policy "testimonials_agent_delete" on public.testimonials
  for delete to authenticated using (true);

-- LEADS: anyone can submit (insert) the intake form, but only the
-- authenticated agent can read, update, or delete leads.
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated with check (true);

create policy "leads_agent_read" on public.leads
  for select to authenticated using (true);
create policy "leads_agent_update" on public.leads
  for update to authenticated using (true) with check (true);
create policy "leads_agent_delete" on public.leads
  for delete to authenticated using (true);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_featured on public.listings(featured);
create index if not exists idx_testimonials_featured on public.testimonials(featured);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
