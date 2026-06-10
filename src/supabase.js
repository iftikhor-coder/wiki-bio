// src/supabase.js

const SUPABASE_URL = window.ENV_SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ENV_SUPABASE_KEY;

// Supabase CDN download
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

const { createClient } = supabase;

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

window.sb = sb;
