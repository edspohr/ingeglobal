import { useMemo } from 'react';
import { mockGnss, classifyRover, GNSS_THRESHOLDS_CM } from '../data/mockData';

export { GNSS_THRESHOLDS_CM };

// Devuelve el snapshot completo del sistema GNSS: sistema, RTK, rovers
// (con estado calculado), eventos y la bandera global de alerta crítica
// que consume el banner del DashboardLayout. Hoy lee del mock; mañana
// se reemplaza por un fetch al endpoint del proveedor sin tocar consumidores.
export function useDesplazamiento(isDemoMode) {
  return useMemo(() => {
    if (!isDemoMode) {
      return {
        loading: false,
        system: null,
        rtk: null,
        rovers: [],
        events: [],
        isAlert: false,
        criticalRover: null,
      };
    }

    const rovers = mockGnss.rovers.map((r) => {
      const { status, totalCm } = classifyRover(r);
      return { ...r, status, totalCm };
    });

    const criticalRover = rovers.find((r) => r.status === 'critical') || null;
    const hasWarning    = rovers.some((r) => r.status === 'warning');
    const globalRisk    = criticalRover ? 'CRÍTICO' : hasWarning ? 'ADVERTENCIA' : 'NORMAL';

    return {
      loading: false,
      system: { ...mockGnss.system, globalRisk },
      rtk: mockGnss.rtk,
      rovers,
      events: mockGnss.events,
      isAlert: Boolean(criticalRover),
      criticalRover,
    };
  }, [isDemoMode]);
}
