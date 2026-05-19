import { supabase, isSupabaseConfigured } from "./supabase";

const SCHEMA = "huincha_1";

// granularity → table name
const TABLE_MAP = {
  shift:   "lms511_dashboard_shift",
  daily:   "lms511_dashboard_daily",
  weekly:  "lms511_dashboard_weekly",
  monthly: "lms511_dashboard_monthly",
};

const LIMIT_MAP = {
  shift:   10,
  daily:   14,
  weekly:  8,
  monthly: 6,
};

// Returns all sensors visible in lms511_dashboard_latest.
// Empty array means Supabase is reachable but no data has arrived yet.
// null means Supabase is not configured.
export async function fetchSensors() {
  if (!isSupabaseConfigured()) return { data: null, error: "not_configured" };

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from("lms511_dashboard_latest")
    .select("site, host, updated_at, flow_m3_s, flow_m3_h, belt_speed_mps, volume_day_m3, valid_points, source_created_at");

  if (error) {
    console.error("[lms511Api] fetchSensors:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ?? [], error: null };
}

// Returns the latest row for one sensor, or null if not found.
export async function fetchLatest(site, host) {
  if (!isSupabaseConfigured()) return { data: null, error: "not_configured" };

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from("lms511_dashboard_latest")
    .select("*")
    .eq("site", site)
    .eq("host", host)
    .maybeSingle();

  if (error) {
    console.error("[lms511Api] fetchLatest:", error.message);
    return { data: null, error: error.message };
  }

  return { data: data ?? null, error: null };
}

// Returns time-series rows for chart rendering.
// Empty array = connected but no rows in this period.
export async function fetchHistory(site, host, granularity = "daily") {
  if (!isSupabaseConfigured()) return { data: null, error: "not_configured" };

  const table = TABLE_MAP[granularity] ?? TABLE_MAP.daily;
  const limit = LIMIT_MAP[granularity] ?? 14;

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from(table)
    .select("bucket_label, bucket_start, bucket_end, volume_m3, avg_flow_m3_h, avg_flow_m3_s, sample_count")
    .eq("site", site)
    .eq("host", host)
    .order("bucket_start", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[lms511Api] fetchHistory:", error.message, { table, site, host });
    return { data: null, error: error.message };
  }

  // Return chronologically ascending for the chart (left → right)
  return { data: [...(data ?? [])].reverse(), error: null };
}
