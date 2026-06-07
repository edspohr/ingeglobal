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
// Cada arcón define sus propios umbrales (warningPct / criticalPct) para el
// semáforo, así el componente sólo renderiza y la lógica vive con el dato —
// listo para mapearse 1:1 contra columnas de una tabla `bins` en producción.
export const mockArcones = {
  bins: [
    // Niveles calibrados para reflejar la lógica de la foto:
    // 85% verde, 60% amarillo, 45% rojo, 90% verde, 30% rojo, 75% verde.
    { id: 'A1', name: 'Arcón 1', material: 'Arena',    capacity: 1500, current: 1275, dailyConsumption: 120, warningPct: 65, criticalPct: 50 },
    { id: 'A2', name: 'Arcón 2', material: 'Gravilla', capacity: 1200, current:  720, dailyConsumption:  90, warningPct: 65, criticalPct: 45 },
    { id: 'A3', name: 'Arcón 3', material: 'Grava',    capacity: 1800, current:  810, dailyConsumption:  80, warningPct: 60, criticalPct: 50 },
    { id: 'A4', name: 'Arcón 4', material: 'Bolones',  capacity: 1000, current:  900, dailyConsumption:  40, warningPct: 60, criticalPct: 40 },
    { id: 'A5', name: 'Arcón 5', material: 'Integral', capacity: 2000, current:  600, dailyConsumption: 150, warningPct: 50, criticalPct: 35 },
    { id: 'A6', name: 'Arcón 6', material: 'Filler',   capacity:  800, current:  600, dailyConsumption:  60, warningPct: 60, criticalPct: 40 },
  ],
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
// `mapPosition` son coordenadas porcentuales (0–100) sobre planta-aerea.jpg.
// Cuando se reemplace por backend real, las pilas vienen con su `mapPosition`
// asignada por el levantamiento topográfico (o por configuración del cliente).
export const mockAcopios = {
  piles: [
    { id: 'P1', name: 'Acopio 1', material: 'Arena',    volume_m3: 14200, capacity_m3: 20000, lastSurvey: '04/06/2026', mapPosition: { x: 18, y: 28 } },
    { id: 'P2', name: 'Acopio 2', material: 'Gravilla', volume_m3:  8650, capacity_m3: 15000, lastSurvey: '04/06/2026', mapPosition: { x: 14, y: 46 } },
    { id: 'P3', name: 'Acopio 3', material: 'Grava',    volume_m3: 11820, capacity_m3: 18000, lastSurvey: '03/06/2026', mapPosition: { x: 70, y: 30 } },
    { id: 'P4', name: 'Acopio 4', material: 'Bolones',  volume_m3:  5240, capacity_m3: 12000, lastSurvey: '04/06/2026', mapPosition: { x: 72, y: 52 } },
    { id: 'P5', name: 'Acopio 5', material: 'Integral', volume_m3:  9300, capacity_m3: 14000, lastSurvey: '04/06/2026', mapPosition: { x: 50, y: 38 } },
    { id: 'P6', name: 'Acopio 6', material: 'Filler',   volume_m3:  3100, capacity_m3:  6000, lastSurvey: '02/06/2026', mapPosition: { x: 28, y: 36 } },
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

// --- GNSS / DESPLAZAMIENTO (Sistema de alerta temprana) ---------------------
// Esquema alineado a un feed real de telemetría RTK (Trimble/Leica):
// `rovers[].current` y `history*` se reemplazan por el fetch al endpoint
// del proveedor sin tocar el componente. Umbrales en cm (foto).
export const GNSS_THRESHOLDS_CM = { warning: 2.5, critical: 5 };
const SERVER_DATE = '20/05/2025';
const SERVER_TIME = '10:24:37';

const HOURS_24_AXIS = ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00', '10:00'];
const DAYS_7_AXIS   = ['14/05', '15/05', '16/05', '17/05', '18/05', '19/05', '20/05'];

const gnssRand = seeded(7);
const buildHistory = (baseline, amplitude, drift = 0, axis = HOURS_24_AXIS) =>
  axis.map((label, i) => ({
    time: label,
    value: +(baseline + Math.sin(i / 1.5) * amplitude + drift * (i / (axis.length - 1)) + (gnssRand() - 0.5) * amplitude * 0.4).toFixed(2),
  }));

export const mockGnss = {
  system: {
    client: 'Ingeglobal Planta Central',
    serverDate: SERVER_DATE,
    serverTime: SERVER_TIME,
    roversOnline: 5,
    roversTotal: 5,
    baseStatus: 'ACTIVA',
    comm: '4G OK',
    cloud: 'CONECTADA',
    globalRisk: 'NORMAL',
  },
  rtk: {
    lastUpdate: SERVER_TIME,
    precision: '8 mm + 1 ppm',
    satellites: '32 / 36',
    latency: '28 ms',
    energy: 'SOLAR 92%',
    storage: 'OK',
  },
  rovers: [
    {
      id: '01', name: 'Rover 01', location: 'Talud Norte',
      mapPosition: { x: 22, y: 70 },
      current: { n: 12.4, e: -3.8, z: 0.7 },
      history24h: buildHistory(8, 4),
      history7d:  buildHistory(6, 3, 2, DAYS_7_AXIS),
    },
    {
      id: '02', name: 'Rover 02', location: 'Plataforma Este',
      mapPosition: { x: 55, y: 52 },
      current: { n: 32.6, e: -18.7, z: 9.4 },
      history24h: buildHistory(18, 8, 12),
      history7d:  buildHistory(12, 6, 22, DAYS_7_AXIS),
    },
    {
      id: '03', name: 'Rover 03', location: 'Cresta Superior',
      mapPosition: { x: 78, y: 48 },
      current: { n: 8.2, e: 1.6, z: -0.3 },
      history24h: buildHistory(5, 3),
      history7d:  buildHistory(4, 2, 1, DAYS_7_AXIS),
    },
    {
      id: '04', name: 'Rover 04', location: 'Plataforma Oeste',
      mapPosition: { x: 25, y: 82 },
      current: { n: -4.1, e: 2.9, z: 1.2 },
      history24h: buildHistory(3, 2),
      history7d:  buildHistory(3, 2, 0.5, DAYS_7_AXIS),
    },
    {
      id: '05', name: 'Rover 05', location: 'Pie de Talud Sur',
      mapPosition: { x: 65, y: 86 },
      current: { n: 58.7, e: -37.9, z: 22.1 },
      history24h: buildHistory(28, 12, 28),
      history7d:  buildHistory(15, 8, 55, DAYS_7_AXIS),
    },
  ],
  events: [
    { id: 1, time: '10:23', roverId: '05', label: 'Rover 05', kind: 'critical', detail: 'Alerta crítica', metric: '58.7 mm desplazamiento N' },
    { id: 2, time: '10:21', roverId: '02', label: 'Rover 02', kind: 'warning',  detail: 'Advertencia',    metric: '32.6 mm desplazamiento N' },
    { id: 3, time: '10:18', roverId: '01', label: 'Rover 01', kind: 'normal',   detail: 'Normal',         metric: '12.4 mm desplazamiento N' },
  ],
};

// Clasifica un rover por desplazamiento total = √(N² + E² + Z²) en cm.
export const classifyRover = (rover) => {
  const { n, e, z } = rover.current;
  const totalCm = Math.sqrt(n * n + e * e + z * z) / 10;
  if (totalCm > GNSS_THRESHOLDS_CM.critical) return { status: 'critical', totalCm };
  if (totalCm > GNSS_THRESHOLDS_CM.warning)  return { status: 'warning',  totalCm };
  return { status: 'normal', totalCm };
};


