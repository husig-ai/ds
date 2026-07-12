// ============================================================
// Supabase client config
// Fill these in from: Supabase Dashboard -> Project Settings -> API
// The anon key is safe to expose here - it's public by design and
// only grants what the Row Level Security policies in schema.sql allow.
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
