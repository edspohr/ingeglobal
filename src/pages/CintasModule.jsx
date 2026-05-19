import React from 'react';
import { useLms511 } from '../hooks/useLms511';
import MetricCard from '../components/common/MetricCard';
import FlowChart from '../components/visualizations/FlowChart';
import { Activity, Clock, Calendar, BarChart2, ChevronDown, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import SkeletonBlock from '../components/common/SkeletonBlock';

const GRANULARITY_OPTIONS = [
  { key: 'shift',   label: 'Turno'  },
  { key: 'daily',   label: 'Día'    },
  { key: 'weekly',  label: 'Semana' },
  { key: 'monthly', label: 'Mes'    },
];

const CHART_UNIT = {
  shift:   'm³/h',
  daily:   'm³/día',
  weekly:  'm³/semana',
  monthly: 'm³/mes',
};

function toChartPoint(row, granularity) {
  return {
    time: row.bucket_label,
    value: granularity === 'shift'
      ? Number(row.avg_flow_m3_h?.toFixed(2) ?? 0)
      : Number(row.volume_m3?.toFixed(1) ?? 0),
  };
}

// Shown when Supabase is connected but no rows exist yet
const NoDataState = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center space-y-3"
  >
    <Radio size={28} className="text-gray-600" />
    <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
    <p className="text-gray-600 text-xs max-w-xs">
      El sensor aún no ha enviado mediciones. Los datos aparecerán aquí automáticamente en cuanto el equipo comience a operar.
    </p>
  </motion.div>
);

const CintasModule = () => {
  const {
    sensors,
    selectedSensor,
    setSelectedSensor,
    granularity,
    setGranularity,
    latest,
    history,
    loading,
    noData,
    configError,
  } = useLms511();

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock width={280} height={28} />
          <SkeletonBlock width={360} height={14} />
        </div>
        <SkeletonBlock width={220} height={36} rounded="rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} height={112} className="w-full" rounded="rounded-xl" />
        ))}
      </div>
      <SkeletonBlock height={300} className="w-full" rounded="rounded-xl" />
    </div>
  );

  if (configError || noData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Medición de Caudal</h1>
          <p className="text-gray-400 mt-1">Monitoreo en tiempo real de cintas transportadoras</p>
        </div>
        <div className="glass-panel rounded-xl">
          <NoDataState />
        </div>
      </div>
    );
  }

  const flow_m3_h  = latest?.flow_m3_h      ?? 0;
  const flow_m3_s  = latest?.flow_m3_s      ?? 0;
  const volume_day = latest?.volume_day_m3   ?? 0;
  const belt_speed = latest?.belt_speed_mps  ?? 0;
  const chartData  = history.map((row) => toChartPoint(row, granularity));
  const chartUnit  = CHART_UNIT[granularity];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Medición de Caudal</h1>
          <p className="text-gray-400 mt-1">Monitoreo en tiempo real de cintas transportadoras</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sensor selector — only visible when multiple sensors exist */}
          {sensors.length > 1 && (
            <div className="relative">
              <select
                value={`${selectedSensor?.site}|${selectedSensor?.host}`}
                onChange={(e) => {
                  const [site, host] = e.target.value.split('|');
                  setSelectedSensor({ site, host });
                }}
                className="appearance-none bg-brand-surface/60 border border-white/10 text-white text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              >
                {sensors.map((s) => (
                  <option key={`${s.site}|${s.host}`} value={`${s.site}|${s.host}`}>
                    {s.host} — {s.site}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Granularity filter */}
          <div className="flex bg-brand-surface/50 rounded-lg p-1 border border-white/5">
            {GRANULARITY_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setGranularity(key)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  granularity === key
                    ? 'bg-brand-gold text-brand-dark font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Flujo Actual"
          value={`${flow_m3_h.toLocaleString('es-CL', { maximumFractionDigits: 2 })} m³/h`}
          trend="up"
          trendValue={`${flow_m3_s.toLocaleString('es-CL', { maximumFractionDigits: 4 })} m³/s`}
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="Acumulado Hora"
          value={`${flow_m3_h.toLocaleString('es-CL', { maximumFractionDigits: 1 })} m³`}
          trend="up"
          trendValue="estimado"
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Total Diario"
          value={`${volume_day.toLocaleString('es-CL', { maximumFractionDigits: 0 })} m³`}
          trend="up"
          trendValue="hoy"
          icon={Calendar}
          color="amber"
        />
        <MetricCard
          title="Vel. Cinta"
          value={`${belt_speed.toLocaleString('es-CL', { maximumFractionDigits: 2 })} m/s`}
          trend="up"
          trendValue="operacional"
          icon={BarChart2}
          color="purple"
        />
      </div>

      {/* Chart */}
      <motion.div
        key={granularity}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-panel p-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Tendencia de Flujo</h3>
          <span className="text-xs text-gray-500">{chartUnit}</span>
        </div>
        {chartData.length > 0
          ? <FlowChart data={chartData} unit={chartUnit} />
          : <NoDataState />
        }
      </motion.div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sensor status */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Estado del Sensor</h3>
          <div className="space-y-3">
            {[
              {
                label: `${selectedSensor?.host ?? '—'} (LMS511 Láser)`,
                status: latest ? 'ONLINE' : 'SIN DATOS',
                color: latest ? 'emerald' : 'gray',
              },
              {
                label: 'Última lectura',
                status: latest?.source_created_at
                  ? new Date(latest.source_created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                  : '—',
                color: 'blue',
              },
              {
                label: 'Puntos válidos',
                status: latest?.valid_points != null ? `${latest.valid_points} pts` : '—',
                color: 'gray',
              },
            ].map(({ label, status, color }) => (
              <div
                key={label}
                className={`flex justify-between items-center p-3 bg-${color}-500/10 border border-${color}-500/20 rounded-lg`}
              >
                <span className={`text-${color}-200 text-sm font-medium`}>{label}</span>
                <span className={`text-xs font-bold text-${color}-400 bg-${color}-500/10 px-2 py-1 rounded`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume summary from history */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen de Volumen</h3>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(-4).map((row) => {
                const maxVol = Math.max(...history.map((r) => r.volume_m3), 1);
                return (
                  <div key={row.bucket_start} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm truncate max-w-[120px]">{row.bucket_label}</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-gold opacity-80 transition-all duration-700"
                        style={{ width: `${Math.min(100, (row.volume_m3 / maxVol) * 100)}%` }}
                      />
                    </div>
                    <span className="text-white font-mono text-sm whitespace-nowrap">
                      {Number(row.volume_m3).toLocaleString('es-CL', { maximumFractionDigits: 0 })} m³
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoDataState />
          )}
        </div>
      </div>
    </div>
  );
};

export default CintasModule;
