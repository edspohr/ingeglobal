// Mock datasets used ONLY when Modo Demo is active in AdminPanel.
// Real production data comes from Supabase (LMS511 sensor) and the future
// per-module integrations. These mocks exist so commercial demos show a
// fully populated dashboard.

const HOURS_24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const DAYS_7   = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Deterministic pseudo-random so charts look "alive" but stay consistent.
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// --- CINTAS (Belt) ----------------------------------------------------------
const cintasRand = seeded(1);
export const mockCintas = {
  latest: {
    host: 'LMS511-DEMO-01',
    site: 'Planta Norte (Demo)',
    flow_m3_h: 62.4,
    flow_m3_s: 0.0173,
    belt_speed_mps: 1.45,
    volume_day_m3: 842,
    valid_points: 1184,
    source_created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  history: HOURS_24.map((label, i) => {
    const base = 58 + Math.sin(i / 3) * 6;
    const noise = (cintasRand() - 0.5) * 4;
    const flow = +(base + noise).toFixed(2);
    return {
      bucket_start: `2026-06-05T${label}:00Z`,
      bucket_label: label,
      avg_flow_m3_h: flow,
      volume_m3: +(flow * 1).toFixed(1),
    };
  }),
};

// --- ARCONES (Storage bins) -------------------------------------------------
const arconesRand = seeded(2);
export const mockArcones = {
  bins: [
    { id: 'A1', name: 'Arcón A1', capacity: 1500, current: 1180, material: 'Cobre',   trend: 'up'   },
    { id: 'A2', name: 'Arcón A2', capacity: 1500, current:  920, material: 'Cobre',   trend: 'up'   },
    { id: 'B1', name: 'Arcón B1', capacity: 1200, current:  410, material: 'Estéril', trend: 'down' },
    { id: 'B2', name: 'Arcón B2', capacity: 1200, current:  860, material: 'Estéril', trend: 'up'   },
    { id: 'C1', name: 'Arcón C1', capacity: 1800, current: 1540, material: 'Mineral', trend: 'up'   },
    { id: 'C2', name: 'Arcón C2', capacity: 1800, current:  680, material: 'Mineral', trend: 'down' },
  ],
  history24h: HOURS_24.map((label, i) => ({
    time: label,
    A1: Math.round(900 + Math.sin(i / 4) * 250 + arconesRand() * 60),
    B1: Math.round(500 + Math.sin(i / 5 + 1) * 200 + arconesRand() * 50),
    C1: Math.round(1200 + Math.sin(i / 3 + 2) * 280 + arconesRand() * 80),
  })),
};

// --- BUZONES (Hoppers) ------------------------------------------------------
const buzonesRand = seeded(3);
export const mockBuzones = {
  units: [
    { id: 'BZ-01', name: 'Buzón 01', fillLevel: 78, status: 'flowing', flow_m3_h: 54.2 },
    { id: 'BZ-02', name: 'Buzón 02', fillLevel: 35, status: 'flowing', flow_m3_h: 47.6 },
    { id: 'BZ-03', name: 'Buzón 03', fillLevel: 92, status: 'blocked', flow_m3_h:  0   },
    { id: 'BZ-04', name: 'Buzón 04', fillLevel: 12, status: 'empty',   flow_m3_h:  0   },
  ],
  flowHistory: HOURS_24.map((label, i) => ({
    time: label,
    value: +(45 + Math.sin(i / 4) * 12 + (buzonesRand() - 0.5) * 5).toFixed(2),
  })),
};

// --- ACOPIOS (Stockpiles) ---------------------------------------------------
export const mockAcopios = {
  piles: [
    { id: 'P1', name: 'Acopio Norte',  material: 'Cobre',   volume_m3: 14200, capacity_m3: 20000, lastSurvey: '04/06/2026' },
    { id: 'P2', name: 'Acopio Sur',    material: 'Estéril', volume_m3:  8650, capacity_m3: 15000, lastSurvey: '04/06/2026' },
    { id: 'P3', name: 'Acopio Este',   material: 'Mineral', volume_m3: 11820, capacity_m3: 18000, lastSurvey: '03/06/2026' },
    { id: 'P4', name: 'Acopio Oeste',  material: 'Cobre',   volume_m3:  5240, capacity_m3: 12000, lastSurvey: '04/06/2026' },
  ],
  volumeBy7d: DAYS_7.map((day, i) => ({
    time: day,
    value: Math.round(38000 + Math.sin(i) * 1500 + i * 350),
  })),
};

// --- CAMIONES (Trucks) ------------------------------------------------------
const camionesRand = seeded(5);
const COMPANIES = ['TransMin', 'LogísticaPro', 'CarriersCL', 'MoviTierra'];
const MATERIALS = ['Cobre', 'Estéril', 'Mineral', 'Áridos'];
const STATUSES  = ['completed', 'processing', 'entering'];
export const mockCamiones = {
  fleet: Array.from({ length: 18 }, (_, i) => {
    const hour = 6 + (i % 12);
    return {
      id: `TRK-${100 + i}`,
      plate: `PAT-${(200 + i * 7).toString().slice(-3).padStart(3, '0')}`,
      company: COMPANIES[i % COMPANIES.length],
      material: MATERIALS[i % MATERIALS.length],
      volume_m3: +(14 + camionesRand() * 8).toFixed(1),
      status: STATUSES[i % STATUSES.length],
      entryTime: `${String(hour).padStart(2, '0')}:${String(((i * 13) % 60)).padStart(2, '0')}`,
      exitTime:  `${String(hour + 1).padStart(2, '0')}:${String(((i * 17) % 60)).padStart(2, '0')}`,
    };
  }),
  // Trips per hour (operational throughput)
  tripsByHour: HOURS_24.slice(6, 20).map((label, i) => ({
    time: label,
    value: Math.round(8 + Math.sin(i / 2) * 3 + camionesRand() * 2),
  })),
};
