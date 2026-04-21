import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const configured = Boolean(supabaseUrl && supabaseKey);

if (!configured) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "The app will boot, but Supabase-backed features will fall back to mock data.",
  );
}

export const supabase = configured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "ingeglobal.supabase.auth",
      },
    })
  : createClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

export const isSupabaseConfigured = () => configured;
