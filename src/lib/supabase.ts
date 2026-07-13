import { createClient } from '@supabase/supabase-js';

// Read-only anon client. NEVER put the service_role key here.
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } },
);
