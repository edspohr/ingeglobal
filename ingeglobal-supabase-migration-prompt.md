# Ingeglobal Platform — Supabase Migration + LMS511 Data Wiring + Mining Robot Avatar

**Target repo:** `ingeglobal` (React 19 + Vite + Firebase + Tailwind, UI in Spanish).
**Execution:** Use this document phase by phase in Claude Code. Do **not** attempt all phases in one run.
**Reporting protocol:** At the end of EACH phase, report in 5 sections: (1) Files created, (2) Files modified, (3) Files deleted, (4) Commands the user must run manually outside Claude Code (npm install, npm run build, npm run lint, firebase/vercel deploy), (5) Next steps & known risks.
**Do NOT run `npm run lint`, `npm run build`, or any dev server from inside Claude Code.** I will run those in a native terminal and paste output back if needed.

---

## Global Context (read once, applies to all phases)

### Project state
- Repo uses **mockApi.js** and **mockData.js** for all data. Firebase is initialized but only really used for Auth. Supabase client library (`@supabase/supabase-js@^2.90.1`) is already in `package.json` and `src/services/supabase.js` exists as a stub.
- UI language is Spanish (es-CL). All user-facing strings must be Spanish. Code identifiers, comments, and commit messages in English.
- Brand theme: dark mode, gold `#D4A24E`, glassmorphism. See `tailwind.config.js` and `src/index.css`.
- Deployment: Vercel (frontend) + Firebase Hosting (alternate) + Supabase (Auth + DB). Vercel needs `VITE_` prefix for env vars to reach the bundle.

### Supabase dev branch credentials (already provisioned)
```
VITE_SUPABASE_URL=https://mwrmlaxcdbuzxjkcomwf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cm1sYXhjZGJ1enhqa2NvbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjk0MjAsImV4cCI6MjA4Nzc0NTQyMH0.4_gWVAGZgxdf3emviwNOzFSC3jxtXmCVA1xotc7yA0E
```
Redirect URLs configured in Supabase dashboard: `https://mav.codetronics.cl/auth/confirm`, `https://mav.codetronics.cl/auth/reset`, `https://mav.codetronics.cl/auth/*`, `https://ingeglobal.vercel.app/auth/*`.

### LMS511 data model (source of truth)
Defined by Juan Trujillo. Four tables + 2 views live in Supabase:

| Table / View | Purpose | Realtime enabled |
|---|---|---|
| `lms511_metrics` | Historical samples, one row per reading | No |
| `lms511_latest` | One row per `(site, host)` — always the latest | **Yes** |
| `lms511_scan_snapshots` | Downsampled scan profiles (JSONB arrays) | **Yes** |
| `lms511_device_config` | Device identity/configuration | No |
| `lms511_hourly` (view) | Hourly aggregates | No |
| `lms511_daily` (view) | Daily aggregates | No |

Identity = `(site, host)` composite. All timestamps are `timestamptz`. Units: distances in meters (`*_m`), areas in `m²`, flow in `m³/s`, volume in `m³`. RLS policies already grant `SELECT` to role `anon`.

### Data mapping (LMS511 → current mockData shape)
This table is authoritative. Do NOT invent different mappings.

**CintasModule — map from `lms511_latest` (live) and `lms511_hourly` (history):**
- `currentFlow` (display as m³/h) ← `lms511_latest.flow_m3_s * 3600`
- `stats.hour` (m³) ← derive from latest `lms511_hourly` bucket: `avg_flow_m3_s * 3600`
- `stats.day` (m³) ← sum over last 24 `lms511_hourly` buckets of `avg_flow_m3_s * 3600` (or use `lms511_daily`)
- `history` array `[{time, value}]` ← `lms511_hourly` rows, last 6-12 buckets. `time` = bucket formatted `HH:00`, `value` = `avg_flow_m3_s * 60` (m³/min, matches FlowChart tooltip label)
- `trend` ← compute % diff between last and previous bucket
- Sensor health panel ← use `lms511_latest.device_status` (0 = ONLINE), `valid_ratio` (threshold <0.9 = REV. PENDIENTE)

**BuzonesModule — map from `lms511_latest`:**
- `fillLevel` (%) ← derived: `clamp(100 * (1 - r_mean_m / r_max_configured), 0, 100)` — use `r_max_m` from the same row as the reference "empty" distance. If ambiguous, document the assumption in a code comment and use `100 * (1 - r_min_m / r_max_m)` as fallback.
- `status` ← logic: if `valid_ratio < 0.3` → `'blocked'`; if `fillLevel < 5` → `'empty'`; else `'flowing'`.
- `flow_m3_s` ← direct from `lms511_latest.flow_m3_s`

**AcopiosModule — map from `lms511_metrics` aggregated or `lms511_daily`:**
- Each `(site, host)` combination = one stockpile "pin" on the map
- `volume` ← latest `lms511_metrics.volume_acc_m3` per `(site, host)`
- `lastSurvey` ← `MAX(created_at)` per `(site, host)`
- `material`, `quality`, position coordinates on the aerial map: **not present in LMS511 model** → keep mockData for these fields, only swap `volume` and `lastSurvey` for real values.

**ArconesModule — NOT covered by LMS511 in the current model.**
Keep mock data. Add a visible "Datos Simulados con fines ilustrativos" badge on the module header.

**CamionesModule — NOT covered by LMS511.**
Keep mock data. Add the same badge.

**DashboardHome KPIs — hybrid:**
- "Flujo Volumétrico" ← real (from CintasModule source)
- "Volumen Acumulado" ← real (sum of all stockpiles' `volume_acc_m3`)
- "Stock Actual" ← mock + badge
- "Camiones Turno" ← mock + badge

### Simulated-data badge (reusable component)
Create `src/components/common/MockDataBadge.jsx` — a small pill component: gold outline, amber text, icon, text `"Datos Simulados con fines ilustrativos"`. Use it at the top of any module or KPI card showing non-real data. It must be visually unmissable but not break the layout.

### Fallback behavior (demo-safe)
When a Supabase query returns empty, `null`, or errors, components must silently fall back to `mockData.js` values AND render the mock badge. Log the error to console with prefix `[LMS511 fallback]` so debugging is obvious, but never show a red error state to the end user. The demo must always look healthy.

### Critical constraints
- **Do not delete `mockData.js` or `mockApi.js`**. They are the fallback source.
- **Do not break the existing routes or auth guards structure.** The `ProtectedRoute` flow (login → complete-profile → access-pending → active) must continue to work, just re-implemented on Supabase.
- **Keep English prompts for any new LLM-facing prompts** (e.g. Gemini system instructions), Spanish for all UI strings.
- **No `localStorage`/`sessionStorage` except what Supabase's SDK manages internally for its session** — that is fine, it's the SDK's own behavior.

---

## PHASE 1 — Supabase client setup + Mining Robot Avatar

### Goal
Establish the Supabase infrastructure layer and replace the generic `<Bot />` icon in `AIAvatar.jsx` with the mining robot character. Auth migration and data wiring come later — this phase does NOT touch `AuthContext.jsx` yet.

### Tasks

**1.1 — Update `.env.example`:**
Append Supabase and Gemini vars alongside existing Firebase ones. Do not remove Firebase vars yet.

```
# Supabase (LMS511 data + Auth — dev branch)
VITE_SUPABASE_URL=https://mwrmlaxcdbuzxjkcomwf.supabase.co
VITE_SUPABASE_ANON_KEY=<paste the anon key from the design doc>

# Gemini (AI assistant)
VITE_GEMINI_API_KEY=<your key>
```

**1.2 — Harden `src/services/supabase.js`:**
Replace the current stub with a client that:
- Throws a clear console warning (not an exception) if env vars are missing, so the app still boots
- Exports `supabase` client AND a helper `isSupabaseConfigured()` boolean
- Configures auth persistence to localStorage (Supabase default, explicit is better) and `detectSessionInUrl: true` for magic links / password reset redirects

**1.3 — Add the mining robot image asset:**
- Save the source image at `public/robot-minero.png` (user will paste the asset into `/public` — just reference the path in code). For now, add a placeholder file at `public/robot-minero.png` as an empty file WITH a comment in the PR/report reminding the user to replace it with the actual PNG. The user has the source image.
- Source image: orange/yellow cartoon robot with mining helmet, glowing headlamp, big blue illuminated eyes, tracked wheels, on a mining plant background (rock piles + conveyor). The existing JPEG can be converted to PNG by the user.

**1.4 — Refactor `src/components/common/AIAvatar.jsx`:**
Replace the floating-button `<Bot size={32} />` with a custom component `<MiningRobotAvatar />` that:

- Uses `public/robot-minero.png` as the base image (via `<img src="/robot-minero.png" />`, circular crop with `rounded-full object-cover`)
- Adds **framer-motion animations**:
  - **Headlamp glow pulse**: an SVG `<circle>` or positioned `<div>` overlay on top of the helmet lamp, 8-12px radius, gold `#FFD87A` → orange `#D4A24E` radial gradient, pulsing opacity `[0.4, 1, 0.4]` every 2.5s with `ease: "easeInOut"`, `repeat: Infinity`.
  - **Eye blink**: two small ellipse overlays positioned on top of the robot's blue eyes. Every ~4-6 seconds (random jitter between 3500-6500ms), animate `scaleY` from 1 → 0.1 → 1 in 150ms to simulate a blink. Implement with `useEffect` + `setTimeout` chain or framer-motion's `animate()` controls.
  - **Subtle idle breathing**: container translateY `[0, -2, 0]` cycle, 3s duration, infinite.
- Keeps the existing red notification dot (the `ping` dot in the current code) — but repositioned to not overlap the helmet.
- Keeps the existing `onClick={() => setIsOpen(true)}` wiring.
- Accepts a `size` prop (default 64, for 16x16 Tailwind → `w-16 h-16`), used both in the FAB and optionally in the chat panel header where currently `<Bot className="text-brand-gold w-6 h-6" />` appears. Make it reusable for the smaller header slot too.
- Place this `MiningRobotAvatar` component in its own file: `src/components/common/MiningRobotAvatar.jsx`. Then `AIAvatar.jsx` imports and uses it.

**1.5 — Update the chat header in `AIAvatar.jsx`:**
Replace the small header `<Bot />` icon with `<MiningRobotAvatar size={40} />` and change the header label from "Asistente IA" to "Asistente Minero IA". Update the greeting message to match the character's persona: `"Hola, soy tu asistente minero. ¿Qué necesitas analizar hoy?"`.

**1.6 — Update Gemini system instruction** in `AIAvatar.jsx` to reflect the new persona, still in Spanish, still grounded in mockData. Add one line: `"Tu personaje es un robot minero amigable. Mantén un tono profesional pero cercano, con un toque lúdico ocasional."`

### Acceptance criteria
- `npm run dev` boots without Supabase-related errors even if `.env.local` is missing (warning only)
- Floating avatar button shows the robot image with pulsing headlamp and occasional blinks
- Chat panel header shows the same robot avatar, smaller
- Chat greeting mentions the mining-robot persona
- No regressions in routing, auth, or any module

### Files expected to change
- `.env.example` (modify)
- `src/services/supabase.js` (modify)
- `src/components/common/MiningRobotAvatar.jsx` (new)
- `src/components/common/AIAvatar.jsx` (modify)
- `public/robot-minero.png` (placeholder — user replaces with real PNG)

---

## PHASE 2 — Migrate Auth from Firebase to Supabase

### Goal
Replace all Firebase Auth usage with Supabase Auth. Keep the exact same user-facing flow (login → complete-profile → access-pending → active) and the same role/status model. Firestore `users` collection data gets mirrored into a Supabase `profiles` table.

### Tasks

**2.1 — Create Supabase schema for user profiles:**
Emit a `supabase/migrations/001_profiles.sql` file with:

```sql
-- Profiles table, 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  phone_number text,
  job_title text,
  role text not null default 'guest' check (role in ('admin','manager','operator','guest')),
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  contracted_modules text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

grant select, update on public.profiles to authenticated;
```

The user will apply this migration manually via Supabase SQL editor — list that as a required manual step in the phase report.

**2.2 — Rewrite `src/context/AuthContext.jsx`:**
- Remove all Firebase imports (`firebase/auth`, `firebase/firestore`, `auth`, `db` from `services/firebase`)
- Import from `src/services/supabase.js`
- Use `supabase.auth.onAuthStateChange()` instead of `onAuthStateChanged`
- On auth state change, fetch the matching row from `public.profiles` and merge into user state
- Implement `login(email, password)` via `supabase.auth.signInWithPassword`
- Implement `register(email, password)` via `supabase.auth.signUp`. Trigger auto-creates the profile row.
- Implement `logout()` via `supabase.auth.signOut`
- Implement `resetPassword(email)` via `supabase.auth.resetPasswordForEmail` with `redirectTo: \`${window.location.origin}/auth/reset\``
- Implement `updateUserProfile(data)` via `supabase.from('profiles').update(data).eq('id', user.id)` — keep local state in sync.
- Implement `loginWithGoogle()` via `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: \`${window.location.origin}/auth/callback\` }})`
- Keep the same exported API surface: `{ user, loading, login, register, logout, resetPassword, updateUserProfile, loginWithGoogle, ROLES, STATUS }` — so consuming components don't need changes.
- `user` object shape must include: `uid` (alias for `id`), `email`, `displayName`, `jobTitle`, `phoneNumber`, `role`, `status`, `contractedModules`. Map snake_case DB columns to camelCase in context.

**2.3 — Add auth callback routes in `App.jsx`:**
Add these public routes (BEFORE the `*` catch-all):
- `/auth/callback` — a simple component that waits for `supabase.auth.getSession()` to resolve, then navigates to `/dashboard` or `/complete-profile` based on profile completeness.
- `/auth/reset` — a reset-password form that calls `supabase.auth.updateUser({ password })` then navigates to `/login`.
- `/auth/confirm` — email confirmation landing, just shows a success message and a CTA to `/login`.

Create these as pages under `src/pages/auth/`:
- `src/pages/auth/AuthCallback.jsx`
- `src/pages/auth/ResetPassword.jsx`
- `src/pages/auth/ConfirmEmail.jsx`

Use the existing glass-panel styling for consistency.

**2.4 — Delete or neutralize Firebase files:**
- `src/services/firebase.js`: replace its body with a clear comment stating Firebase Auth was removed in favor of Supabase. Keep the file for now (don't delete) so any stale imports break loudly rather than silently compile. Mark as `@deprecated`.
- `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`: leave untouched. They still configure Firebase Hosting which Edmundo may still use. No functional impact from auth removal.
- `package.json`: do NOT remove `firebase` dependency yet — instead, add a comment in the report that it can be removed in a later cleanup pass once we're sure nothing else uses it.

**2.5 — Update `README.md` and `CLAUDE.md`:**
- Replace the Firebase Auth + Firestore mentions with Supabase Auth + Supabase DB
- Document the new auth flow
- Document the `profiles` table schema
- Note the dual-storage-less nature: Firebase is only Hosting now

### Acceptance criteria
- User can register with email/password, gets redirected to `/complete-profile`, fills out profile, lands on `/access-pending` until admin marks them active.
- Google OAuth login works (user must configure the Google provider in Supabase dashboard manually — document this as a manual step).
- Password reset flow works end-to-end.
- Existing `ProtectedRoute` logic in `App.jsx` does NOT need modification — the context contract is preserved.
- Existing `DashboardLayout`, `MenuPage`, etc., continue to display user name, role, etc., with no changes.

### Files expected to change
- `supabase/migrations/001_profiles.sql` (new)
- `src/context/AuthContext.jsx` (rewrite)
- `src/App.jsx` (add 3 auth routes)
- `src/pages/auth/AuthCallback.jsx` (new)
- `src/pages/auth/ResetPassword.jsx` (new)
- `src/pages/auth/ConfirmEmail.jsx` (new)
- `src/services/firebase.js` (deprecate)
- `README.md` (update)
- `CLAUDE.md` (update)

---

## PHASE 3 — LMS511 Data Layer (Cintas + Buzones + Acopios + Dashboard KPIs)

### Goal
Wire real LMS511 data into the modules where the data model supports it. Fallback gracefully to mockData everywhere else, with the visible "Datos Simulados" badge.

### Tasks

**3.1 — Create data service `src/services/lms511.js`:**
This module encapsulates all Supabase queries + realtime subscriptions.

Export these functions:
- `getLatest(site?, host?)` → fetches from `lms511_latest`. Returns one row or null, or array if no filter.
- `getHourly(site, host, hoursBack = 12)` → fetches from `lms511_hourly`, last N buckets, ordered by `bucket ASC`.
- `getDaily(site, host, daysBack = 7)` → fetches from `lms511_daily`.
- `getLatestSnapshot(site, host)` → fetches latest row from `lms511_scan_snapshots`.
- `getAllDeviceAggregates()` → fetches all `(site, host)` pairs with their latest `volume_acc_m3` for the Acopios module.
- `subscribeToLatest(site, host, onChange)` → Supabase Realtime subscription to `lms511_latest` filtered by `(site, host)`. Returns an unsubscribe function. On any INSERT/UPDATE matching the filter, invoke `onChange(newRow)`.
- `subscribeToSnapshots(site, host, onChange)` → same for `lms511_scan_snapshots`.

All functions must:
- Accept an optional `{ throwOnError: false }` option. Default is never throw — log with `[LMS511 fallback]` prefix and return `null`/`[]`.
- Be defensive about Supabase not being configured (`isSupabaseConfigured()` false) — return null immediately.

**3.2 — Create custom hook `src/hooks/useLMS511Latest.js`:**
```
useLMS511Latest({ site, host, fallback })
  -> { data, loading, isMock, error }
```
- On mount: fetch from `lms511_latest`, then subscribe to realtime updates.
- If the initial fetch returns null/empty OR subscription fails: use `fallback`, set `isMock: true`.
- Unsubscribe on unmount.

**3.3 — Create custom hook `src/hooks/useLMS511Hourly.js`:**
```
useLMS511Hourly({ site, host, hoursBack, fallback })
  -> { data, loading, isMock, error }
```
Polling every 60 seconds (views don't emit realtime in a useful way). Same fallback semantics.

**3.4 — Create `src/components/common/MockDataBadge.jsx`:**
```jsx
export default function MockDataBadge({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
      <Info className="w-3 h-3" />
      {compact ? 'Simulado' : 'Datos Simulados con fines ilustrativos'}
    </span>
  );
}
```
Use `lucide-react` `Info` icon. Variant `compact` for KPI cards where space is tight.

**3.5 — Rewire `src/pages/CintasModule.jsx`:**
- Replace the `api.data.getModules()` call with `useLMS511Latest` + `useLMS511Hourly`.
- Use a configurable `(site, host)` — for now hardcode `site='Planta Principal'`, `host='lms511_01'` at the top of the file with a `// TODO: make configurable via admin panel` comment.
- Transform live `lms511_latest` row into the existing `data` shape expected by the rest of the component (see mapping table in the global context section). Keep the existing JSX structure unchanged.
- If `isMock` is true, show `<MockDataBadge />` next to the page title.
- Sensor health panel: drive from `device_status` and `valid_ratio` per the mapping rules.

**3.6 — Rewire `src/pages/BuzonesModule.jsx`:**
Same pattern. Compute `fillLevel` and `status` from the live row.

**3.7 — Rewire `src/pages/AcopiosModule.jsx`:**
- Fetch all device aggregates via `getAllDeviceAggregates()`.
- For each `(site, host)`, keep the mock-data metadata (material name, quality, pin coordinates) — that stays mock. Swap in real `volume` and `lastSurvey`.
- If no Supabase data, full mock + badge.
- Since material/quality/coordinates remain mock even in the happy path, show a compact `<MockDataBadge compact />` next to the "Detalle Volumétrico" section header, with tooltip text explaining "Metadatos de acopios (material, calidad, ubicación) son simulados. Volumen y fecha son datos reales del sensor LMS511."

**3.8 — Rewire `src/pages/DashboardHome.jsx`:**
- "Flujo Volumétrico" KPI: use `useLMS511Latest`, show real value. No badge.
- "Volumen Acumulado" KPI: use `getAllDeviceAggregates()` sum. No badge.
- "Stock Actual" KPI: keep mock, show `<MockDataBadge compact />` inside the card.
- "Camiones Turno" KPI: keep mock, show compact badge.

**3.9 — Keep `ArconesModule.jsx` and `CamionesModule.jsx` on mockData:**
Just add the full `<MockDataBadge />` next to each page title. No other changes.

### Acceptance criteria
- With empty Supabase DB: every module renders mock data + badge, no errors.
- With LMS511 data in Supabase: Cintas, Buzones, Acopios (partial), Dashboard top KPIs show live values, updated on realtime events for Cintas & Buzones.
- Admin can visually distinguish real vs mock data at a glance.
- No console errors in a fresh browser session.

### Files expected to change
- `src/services/lms511.js` (new)
- `src/hooks/useLMS511Latest.js` (new)
- `src/hooks/useLMS511Hourly.js` (new)
- `src/components/common/MockDataBadge.jsx` (new)
- `src/pages/CintasModule.jsx` (rewire)
- `src/pages/BuzonesModule.jsx` (rewire)
- `src/pages/AcopiosModule.jsx` (rewire)
- `src/pages/DashboardHome.jsx` (rewire)
- `src/pages/ArconesModule.jsx` (add badge only)
- `src/pages/CamionesModule.jsx` (add badge only)

---

## PHASE 4 — Admin Panel: real user management + device-to-site mapping

### Goal
Make `AdminPanel.jsx` functional against Supabase `profiles` table. Add a new tab for managing the `(site, host)` → display-name mapping so the hardcoded `'Planta Principal'/'lms511_01'` in Phase 3 can eventually be configured.

### Tasks

**4.1 — Users tab (real):**
- Fetch `profiles` table, render rows.
- Inline actions: activate (status → 'active'), suspend (→ 'suspended'), change role dropdown, edit `contractedModules` multi-select.
- Admin-only — rely on the RLS policy to enforce.

**4.2 — Devices tab (new):**
Create a `lms511_device_registry` table via a new migration `002_device_registry.sql`:
```sql
create table if not exists public.lms511_device_registry (
  id uuid primary key default gen_random_uuid(),
  site text not null,
  host text not null,
  display_name text not null,
  module_type text not null check (module_type in ('cinta','buzon','acopio','arcon')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (site, host)
);
alter table public.lms511_device_registry enable row level security;
create policy "Authenticated read devices" on public.lms511_device_registry
  for select using (auth.role() = 'authenticated');
create policy "Admins write devices" on public.lms511_device_registry
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
grant select on public.lms511_device_registry to authenticated;
```
Admin UI: list, add, edit, toggle active. CRUD against this table.

**4.3 — Update hardcoded references in modules:**
- `CintasModule`, `BuzonesModule`: read from `lms511_device_registry` at mount to pick the first `module_type='cinta'` (or 'buzon') active device. If none configured, fall back to the hardcoded defaults with a console warning.

**4.4 — Clients tab and Roles tab:**
Leave as mock UI with the "Datos Simulados" badge — out of scope for this iteration. Document in the report.

### Acceptance criteria
- Admin can approve a pending user and see them land on the dashboard on next login.
- Admin can register a new LMS511 device and the relevant module automatically uses it.
- Non-admin users can't see admin mutations (RLS enforced).

### Files expected to change
- `supabase/migrations/002_device_registry.sql` (new)
- `src/pages/AdminPanel.jsx` (major rewrite)
- `src/pages/CintasModule.jsx`, `src/pages/BuzonesModule.jsx` (read from registry)
- `src/services/lms511.js` (add `getActiveDevice(moduleType)` helper)

---

## PHASE 5 (OPTIONAL) — Security hardening: Gemini API key proxy

### Goal
The current `VITE_GEMINI_API_KEY` is exposed in the client bundle. Anyone inspecting the Vercel deploy can extract it and abuse the key. Fix this by proxying Gemini requests through a serverless function.

### Tasks

**5.1 — Create a Supabase Edge Function `supabase/functions/gemini-chat/index.ts`:**
- Accepts `{ history: [...], message: string }` POST body
- Requires an authenticated Supabase JWT in the `Authorization` header
- Server-side env var `GEMINI_API_KEY` (no `VITE_` prefix)
- Calls Gemini API, returns the response text
- Rate-limits per user (simple in-memory counter is acceptable for MVP, document the limitation)

**5.2 — Rewrite `AIAvatar.jsx` to call the edge function:**
- Remove `@google/generative-ai` SDK usage from the client
- Remove `VITE_GEMINI_API_KEY` from the client build
- Use `supabase.functions.invoke('gemini-chat', { body: { history, message } })`
- Keep the same UX (loading state, message rendering, etc.)

**5.3 — Document env var changes:**
- Remove `VITE_GEMINI_API_KEY` from `.env.example`
- Add a note that `GEMINI_API_KEY` now lives in Supabase secrets (`supabase secrets set GEMINI_API_KEY=...`)

### Acceptance criteria
- Opening DevTools on the deployed Vercel site shows no Gemini API key in the bundle
- Chat still works for authenticated users
- Unauthenticated requests to the edge function are rejected

### Files expected to change
- `supabase/functions/gemini-chat/index.ts` (new)
- `src/components/common/AIAvatar.jsx` (rewrite API call)
- `package.json` (optionally remove `@google/generative-ai`)
- `.env.example` (remove one line)
- `README.md`, `CLAUDE.md` (update env var docs)

---

## After each phase: manual steps for the user (Edmundo)

Claude Code cannot:
- Run `npm run dev`, `npm run build`, or `npm run lint`
- Apply SQL migrations to Supabase (user runs them in SQL editor)
- Configure Google OAuth provider in Supabase dashboard
- Set Supabase secrets (`supabase secrets set ...`)
- Deploy to Vercel or Firebase Hosting
- Replace `public/robot-minero.png` with the real PNG asset (user drops it in)

Always enumerate these in the final "Manual steps" section of each phase report.
