#!/bin/bash
# Verify that the Supabase credentials are properly configured

set -e

SUPABASE_CLIENT="js/supabase-client.js"

echo "🔍 Verifying setup..."

if [ ! -f "$SUPABASE_CLIENT" ]; then
  echo "❌ Supabase client file not found: $SUPABASE_CLIENT"
  exit 1
fi

if grep -q "YOUR-PROJECT-REF" "$SUPABASE_CLIENT" || grep -q "YOUR-ANON-PUBLIC-KEY" "$SUPABASE_CLIENT"; then
  echo "❌ Supabase credentials not configured."
  echo "   Edit $SUPABASE_CLIENT and fill in SUPABASE_URL and SUPABASE_ANON_KEY"
  echo "   See: https://supabase.com/dashboard"
  exit 1
fi

echo "✅ Supabase credentials configured"
echo "✅ Setup complete! Start a local server:"
echo "   npx serve ."
echo ""
echo "   Then open: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin/login.html"
