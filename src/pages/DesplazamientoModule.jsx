import React from 'react';
import { AlertTriangle, Activity, ArrowRight, ArrowUp, ArrowDown, Clock, Wifi, WifiOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePlatform } from '../context/PlatformContext';
import { useDesplazamiento, DESPLAZAMIENTO_THRESHOLDS } from '../hooks/useDesplazamiento';

const MetricCard = ({ label, value, unit, icon: Icon, alert }) => (
  <div className={`glass-panel rounded-xl p-5 border ${alert ? 'border-red-500/40' : 'border-white/5'} flex flex-col gap-2`}>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <Icon size={16} className={alert ? 'text-red-400' : 'text-brand-gold'} />
    </div>
    <div className="flex items-end gap-1">
      <span className={`text-2xl font-bold tabular-nums ${alert ? 'text-red-400' : 'text-white'}`}>{value}</span>
      <span className="text-xs text-gray-500 mb-1">{unit}</span>
    </div>
    {alert && (
      <div className="flex items-center gap-1 text-xs text-red-400 font-medium">
        <AlertTriangle size={12} /> Umbral superado
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0F18]/95 border border-white/10 rounded-xl p-3 text-xs space-y-1">
      <p className="text-gray-400 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const DesplazamientoModule = () => {
  const { demoMode } = usePlatform();
  const { data, history, loading, isAlert } = useDesplazamiento(demoMode);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-gold animate-pulse font-mono text-sm">
        Cargando datos del sensor...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerta Temprana de Desplazamiento</h1>
          <p className="text-gray-400 mt-1 text-sm">Monitoreo de movimientos de plataforma</p>
        </div>

        <div className="glass-panel rounded-xl border border-white/5 p-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 flex items-center justify-center">
            <WifiOff size={32} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Sensor pendiente de instalación</h2>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              El sensor de desplazamiento de plataforma aún no ha sido instalado ni conectado.
              Una vez disponible, este módulo mostrará lecturas en tiempo real de los ejes X, Y, Z,
              inclinación y vibración del terreno.
            </p>
          </div>
          <div className="mt-2 px-4 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-mono uppercase tracking-widest">
            Activar Modo Demo para previsualizar
          </div>
        </div>
      </div>
    );
  }

  const lastSeen = data.ultima_medicion
    ? new Date(data.ultima_medicion).toLocaleString('es-CL', { timeZone: 'America/Santiago' })
    : '—';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerta Temprana de Desplazamiento</h1>
          <p className="text-gray-400 mt-1 text-sm">Monitoreo sísmico y de movimiento de plataforma</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {demoMode && (
            <span className="px-3 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold font-mono uppercase tracking-widest">
              Demo
            </span>
          )}
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono ${
            isAlert
              ? 'bg-red-500/15 border-red-500/40 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {isAlert ? <AlertTriangle size={12} /> : <Wifi size={12} />}
            {isAlert ? 'ALERTA ACTIVA' : 'ESTABLE'}
          </span>
        </div>
      </div>

      {/* Alert banner (inline within module) */}
      {isAlert && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold text-sm">Movimiento fuera de rango detectado</p>
            <p className="text-red-400/70 text-xs mt-0.5">
              Uno o más ejes han superado los umbrales de alerta. Verifique el estado físico de la plataforma.
            </p>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Desp. Eje X"
          value={data.dx_mm.toFixed(2)}
          unit="mm"
          icon={ArrowRight}
          alert={Math.abs(data.dx_mm) >= DESPLAZAMIENTO_THRESHOLDS.dx_mm}
        />
        <MetricCard
          label="Desp. Eje Y"
          value={data.dy_mm.toFixed(2)}
          unit="mm"
          icon={ArrowRight}
          alert={Math.abs(data.dy_mm) >= DESPLAZAMIENTO_THRESHOLDS.dy_mm}
        />
        <MetricCard
          label="Desp. Eje Z"
          value={data.dz_mm.toFixed(2)}
          unit="mm"
          icon={ArrowUp}
          alert={Math.abs(data.dz_mm) >= DESPLAZAMIENTO_THRESHOLDS.dz_mm}
        />
        <MetricCard
          label="Inclinación"
          value={data.inclinacion_deg.toFixed(3)}
          unit="°"
          icon={ArrowDown}
          alert={Math.abs(data.inclinacion_deg) >= DESPLAZAMIENTO_THRESHOLDS.inclinacion_deg}
        />
        <MetricCard
          label="Vibración"
          value={data.vibracion.toFixed(3)}
          unit="g"
          icon={Activity}
          alert={false}
        />
      </div>

      {/* Last reading */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock size={12} />
        Última medición: <span className="font-mono text-gray-400">{lastSeen}</span>
      </div>

      {/* History chart */}
      {history.length > 0 && (
        <div className="glass-panel rounded-xl border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Historial de desplazamiento — últimas 24 h</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={history} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hora" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="dx_mm" name="Eje X (mm)" stroke="#D4A24E" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="dy_mm" name="Eje Y (mm)" stroke="#60A5FA" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="dz_mm" name="Eje Z (mm)" stroke="#A78BFA" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Thresholds reference */}
      <div className="glass-panel rounded-xl border border-white/5 p-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Umbrales de alerta configurados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {Object.entries(DESPLAZAMIENTO_THRESHOLDS).map(([key, val]) => (
            <div key={key} className="bg-white/[0.03] rounded-lg p-3">
              <p className="text-gray-500">{key.replace('_', ' ')}</p>
              <p className="text-white font-mono font-bold mt-1">± {val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesplazamientoModule;
