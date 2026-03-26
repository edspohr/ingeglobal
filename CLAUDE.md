# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Build production bundle to /dist
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

There is no test suite configured.

## Environment Variables

Create `.env.local` with:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GEMINI_API_KEY   # Required for AI assistant
```

On Vercel, the Gemini key must be prefixed `VITE_` for Vite to inject it at build time.

## Architecture

**Stack:** React 19 + Vite, React Router v7, Tailwind CSS 3.4, Firebase (Auth + Firestore), Google Generative AI (Gemini 2.5 Flash Lite), Recharts, Framer Motion.

**Language:** Pure JavaScript (no TypeScript). UI language is Spanish (es-CL).

### Authentication & Authorization

`src/context/AuthContext.jsx` manages all auth state. The flow enforced by `ProtectedRoute` in `App.jsx`:

1. Not authenticated → `/login`
2. Profile incomplete → `/complete-profile`
3. Status `pending` → `/access-pending`
4. Status `active` → app (role-based access)
5. Status `suspended` → blocked

Roles: `admin`, `manager`, `operator`, `guest`. Firestore `users` collection stores: uid, email, role, status, displayName, jobTitle, contractedModules, createdAt.

### Mock Data vs. Real Backend

The app defaults to **mock data** — real Firebase/Supabase calls are bypassed by mock implementations in `src/services/mockApi.js` and `src/data/mockData.js`. This is intentional for demos. To wire real backend, swap the mock calls.

### Module Pages

Each operational module in `src/pages/` is self-contained:
- **CintasModule** — Belt conveyor flow monitoring
- **ArconesModule** — Storage bin capacity tracking
- **CamionesModule** — Truck fleet management with PDF export (jsPDF)
- **BuzonesModule** — Hopper/silo monitoring
- **AcopiosModule** — Stockpile material tracking
- **AdminPanel** — User/role management (admin only)

All modules consume mock data from `src/data/mockData.js` and display via `MetricCard` + Recharts.

### AI Assistant

`src/components/common/AIAvatar.jsx` is a floating chatbot using Gemini 2.5 Flash Lite. It passes the entire `mockData` context as system instruction. Only renders if `VITE_GEMINI_API_KEY` is set.

### Design System

Dark theme with brand gold `#D4A24E`. Tailwind custom tokens: `brand-gold`, `brand-dark` (`#0B1120`), `brand-darker` (`#050914`), `brand-surface` (`#1F2937`). Glassmorphism panels are the primary UI pattern.
