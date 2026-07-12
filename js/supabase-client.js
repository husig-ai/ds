// ============================================================
// Supabase client config
// Fill these in from: Supabase Dashboard -> Project Settings -> API
// The anon key is safe to expose here - it's public by design and
// only grants what the Row Level Security policies in schema.sql allow.
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://wcjahlvjzvwgaffrzmkm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjamFobHZqenZ3Z2FmZnJ6bWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTY3NjIsImV4cCI6MjA5OTM5Mjc2Mn0.lLWgQj6HJkbXoo2-C225wc1gqYOoUMcjsS8TTWTIWWQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
