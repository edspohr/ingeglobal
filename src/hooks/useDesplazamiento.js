import { useState, useEffect } from 'react';

// Mock data for demo mode — simulates a multi-axis ground displacement sensor
const MOCK_HISTORY = Array.from({ length: 24 }, (_, i) => {
  const base = i * (Math.PI / 12);
  return {
    hora: `${String(i).padStart(2, '0')}:00`,
    dx_mm: +(Math.sin(base) * 0.8 + Math.random() * 0.3).toFixed(2),
    dy_mm: +(Math.cos(base) * 0.5 + Math.random() * 0.2).toFixed(2),
    dz_mm: +(Math.random() * 0.4 - 0.1).toFixed(2),
    inclinacion_deg: +(0.12 + Math.sin(base) * 0.06 + Math.random() * 0.02).toFixed(3),
    vibracion: +(Math.random() * 0.25 + 0.05).toFixed(3),
  };
});

const MOCK_LATEST = {
  dx_mm: 1.24,
  dy_mm: 0.87,
  dz_mm: 0.11,
  inclinacion_deg: 0.142,
  vibracion: 0.18,
  estado: 'normal',
  ultima_medicion: new Date(Date.now() - 45_000).toISOString(),
};

// Thresholds (mm) for alert banner
export const DESPLAZAMIENTO_THRESHOLDS = {
  dx_mm: 2.0,
  dy_mm: 2.0,
  dz_mm: 1.0,
  inclinacion_deg: 0.5,
};

export function useDesplazamiento(isDemoMode) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setData(MOCK_LATEST);
      setHistory(MOCK_HISTORY);
      setLoading(false);
    } else {
      // Production: no sensor wired yet
      setData(null);
      setHistory([]);
      setLoading(false);
    }
  }, [isDemoMode]);

  const isAlert = data
    ? Math.abs(data.dx_mm) >= DESPLAZAMIENTO_THRESHOLDS.dx_mm ||
      Math.abs(data.dy_mm) >= DESPLAZAMIENTO_THRESHOLDS.dy_mm ||
      Math.abs(data.dz_mm) >= DESPLAZAMIENTO_THRESHOLDS.dz_mm ||
      Math.abs(data.inclinacion_deg) >= DESPLAZAMIENTO_THRESHOLDS.inclinacion_deg
    : false;

  return { data, history, loading, isAlert };
}
