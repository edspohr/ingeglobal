import React from 'react';
import {
  AlertTriangle, Wifi, WifiOff, Radio as RadioIcon, Cloud, Shield, Clock,
  ShieldCheck, ShieldAlert, FileText, Map as MapIcon, Activity, Satellite,
  Zap, Database as DbIcon, Signal,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { usePlatform } from '../context/PlatformContext';
import { useDesplazamiento, GNSS_THRESHOLDS_CM } from '../hooks/useDesplazamiento';

const STATUS_META = {
  normal:   { label: 'NORMAL',      color: '#10B981', ring: 'border-emerald-500/60', text: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  warning:  { label: 'ADVERTENCIA', color: '#D4A24E', ring: 'border-amber-500/60',   text: 'text-amber-400',   bg: 'bg-amber-500/10',   dot: 'bg-amber-500'   },
  critical: { label: 'CRÍTICO',     color: '#EF4444', ring: 'border-red-500/60',     text: 'text-red-400',     bg: 'bg-red-500/10',     dot: 'bg-red-500'     },
};

const SystemChip = ({ icon: Icon, label, value, tone = 'neutral' }) => {
  const tones = {
    neutral: 'text-white',
    good:    'text-emerald-400',
    warn:    'text-amber-400',
    bad:     'text-red-400',
  };
  return (
    <div className="glass-panel rounded-lg border border-white/5 px-4 py-3 flex items-center gap-3 min-w-[140px]">
      <Icon size={18} className="text-gray-400" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{label}</p>
        <p className={`text-sm font-bold tabular-nums ${tones[tone]}`}>{value}</p>
      </div>
    </div>
  );
};

const RoverCard = ({ rover }) => {
  const meta = STATUS_META[rover.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-xl border-2 ${meta.ring} p-4 flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-md ${meta.bg} ${meta.text} font-bold text-xs flex items-center justify-center border ${meta.ring}`}>
            {rover.id}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{rover.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{rover.location}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${meta.bg} ${meta.text} border ${meta.ring}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-gray-500">Desplazamiento actual (mm)</p>
          <div className={`space-y-0.5 text-xs font-mono ${meta.text}`}>
            <p className="flex justify-between"><span className="text-gray-500">N (norte)</span><span className="font-bold">{rover.current.n > 0 ? '+' : ''}{rover.current.n.toFixed(1)}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">E (este)</span><span className="font-bold">{rover.current.e > 0 ? '+' : ''}{rover.current.e.toFixed(1)}</span></p>
            <p className="flex justify-between"><span className="text-gray-500">Z (vertical)</span><span className="font-bold">{rover.current.z > 0 ? '+' : ''}{rover.current.z.toFixed(1)}</span></p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-gray-500">Últimas 24 h (mm)</p>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rover.history24h} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Line type="monotone" dataKey="value" stroke={meta.color} strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Tendencia histórica (últimos 7 días)</p>
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rover.history7d} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
              <Line type="monotone" dataKey="value" stroke={meta.color} strokeWidth={1.8} dot={{ r: 1.5, fill: meta.color }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
        <span className="text-gray-500">Desp. total</span>
        <span className={`font-mono font-bold ${meta.text}`}>{rover.totalCm.toFixed(2)} cm</span>
      </div>
    </motion.div>
  );
};

const RulesPanel = () => (
  <div className="glass-panel rounded-xl border border-white/5 p-4 space-y-3">
    <div>
      <p className="text-xs font-bold text-white uppercase tracking-wider">Regla de Alerta</p>
      <p className="text-[10px] text-gray-500 mt-0.5">(Desplazamiento total)</p>
    </div>
    <div className="space-y-2">
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <p className="text-sm font-bold text-emerald-400">VERDE</p>
        </div>
        <p className="text-xs text-white mt-1">1 mm a {GNSS_THRESHOLDS_CM.warning} cm</p>
        <p className="text-[10px] text-gray-500">Operación normal.</p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-400" />
          <p className="text-sm font-bold text-amber-400">AMARILLO</p>
        </div>
        <p className="text-xs text-white mt-1">{GNSS_THRESHOLDS_CM.warning + 0.5} cm a {GNSS_THRESHOLDS_CM.critical} cm</p>
        <p className="text-[10px] text-gray-500">Advertencia preventiva.</p>
      </div>
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <p className="text-sm font-bold text-red-400">ROJO</p>
        </div>
        <p className="text-xs text-white mt-1">&gt; {GNSS_THRESHOLDS_CM.critical} cm</p>
        <p className="text-[10px] text-gray-500">Alerta crítica inmediata.</p>
      </div>
    </div>
  </div>
);

const EventsPanel = ({ events }) => (
  <div className="glass-panel rounded-xl border border-white/5 p-4 space-y-3">
    <p className="text-xs font-bold text-white uppercase tracking-wider">Eventos Recientes</p>
    <div className="space-y-2">
      {events.map((ev) => {
        const meta = STATUS_META[ev.kind];
        return (
          <div key={ev.id} className="flex items-start gap-3 text-xs">
            <span className="font-mono text-gray-500 tabular-nums pt-0.5">{ev.time}</span>
            <div className="flex-1 min-w-0">
              <p className={`font-bold ${meta.text}`}>{ev.label}</p>
              <p className={`${meta.text} text-[11px]`}>{ev.detail}</p>
              <p className="text-gray-500 text-[10px] mt-0.5 truncate">{ev.metric}</p>
            </div>
          </div>
        );
      })}
    </div>
    <button className="w-full text-left text-[10px] text-gray-400 hover:text-white border-t border-white/5 pt-2 mt-2 uppercase tracking-widest font-semibold flex items-center justify-between">
      Ver todos los eventos <span>›</span>
    </button>
  </div>
);

const ReportPanel = () => (
  <button className="w-full glass-panel rounded-xl border border-white/5 p-4 flex items-center gap-3 hover:border-brand-gold/40 transition-colors">
    <FileText size={20} className="text-brand-gold" />
    <div className="text-left">
      <p className="text-xs font-bold text-white uppercase tracking-wider">Generar Reporte</p>
      <p className="text-[10px] text-gray-500">Reporte diario automático</p>
    </div>
  </button>
);

const MapPanel = ({ rovers }) => (
  <div className="glass-panel rounded-xl border border-white/5 p-4">
    <div className="flex items-center gap-2 mb-3">
      <MapIcon size={14} className="text-gray-400" />
      <p className="text-xs font-bold text-white uppercase tracking-wider">Mapa de Monitoreo GNSS</p>
    </div>
    <div
      className="relative w-full rounded-lg overflow-hidden border border-white/5"
      style={{
        height: 320,
        background:
          'radial-gradient(circle at 50% 40%, rgba(96,165,250,0.08), transparent 60%), linear-gradient(135deg, #1a2030 0%, #0a0f18 100%)',
      }}
    >
      {/* Base GNSS al centro */}
      <div className="absolute" style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
          <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest whitespace-nowrap">Base GNSS</span>
        </div>
      </div>

      {/* Líneas SVG hacia cada rover */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        {rovers.map((r) => (
          <line
            key={r.id}
            x1="50" y1="40"
            x2={r.mapPosition.x} y2={r.mapPosition.y}
            stroke={STATUS_META[r.status].color}
            strokeWidth="0.2"
            strokeDasharray="0.8 0.8"
            opacity="0.5"
          />
        ))}
      </svg>

      {/* Rovers */}
      {rovers.map((r) => {
        const meta = STATUS_META[r.status];
        return (
          <div
            key={r.id}
            className="absolute"
            style={{ left: `${r.mapPosition.x}%`, top: `${r.mapPosition.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`flex flex-col items-center gap-1`}>
              <div
                className={`w-6 h-6 rounded-md ${meta.bg} ${meta.text} border-2 ${meta.ring} flex items-center justify-center text-[10px] font-bold ${r.status === 'critical' ? 'animate-pulse' : ''}`}
              >
                {r.id}
              </div>
            </div>
          </div>
        );
      })}

      {/* Leyenda */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-[10px] text-gray-400 bg-black/30 backdrop-blur-sm rounded px-2 py-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Advertencia</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Crítico</span>
      </div>
    </div>
  </div>
);

const FooterMetric = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon size={14} className="text-gray-500" />
    <div>
      <p className="text-[9px] uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-xs font-mono text-white">{value}</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-white">Sistema de Alerta Temprana GNSS</h1>
      <p className="text-gray-400 mt-1 text-sm">Monitoreo de alta precisión en tiempo real</p>
    </div>
    <div className="glass-panel rounded-xl border border-white/5 p-12 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-700/30 flex items-center justify-center">
        <WifiOff size={32} className="text-gray-500" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">Sistema GNSS pendiente de instalación</h2>
        <p className="text-gray-400 text-sm mt-1 max-w-md">
          Aún no se han conectado los rovers GNSS de la plataforma. Una vez disponibles, este módulo mostrará lecturas RTK en tiempo real, alertas tempranas y reportes automáticos.
        </p>
      </div>
      <div className="mt-2 px-4 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-mono uppercase tracking-widest">
        Activar Modo Demo para previsualizar
      </div>
    </div>
  </div>
);

const DesplazamientoModule = () => {
  const { demoMode } = usePlatform();
  const { system, rtk, rovers, events } = useDesplazamiento(demoMode);

  if (!demoMode || !system) return <EmptyState />;

  const riskTone = system.globalRisk === 'CRÍTICO' ? 'bad' : system.globalRisk === 'ADVERTENCIA' ? 'warn' : 'good';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel rounded-xl border border-white/5 p-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SISTEMA DE ALERTA TEMPRANA GNSS</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Monitoreo de alta precisión en tiempo real</p>
            <p className="text-[11px] text-gray-500 mt-1">Cliente: <span className="text-white font-semibold">{system.client}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SystemChip icon={Wifi}        label="Rovers Online" value={`${system.roversOnline} / ${system.roversTotal}`} tone="good" />
            <SystemChip icon={RadioIcon}   label="Base GNSS"     value={system.baseStatus} tone="good" />
            <SystemChip icon={Signal}      label="Comunicación"  value={system.comm} tone="good" />
            <SystemChip icon={Cloud}       label="Nube"          value={system.cloud} tone="good" />
            <SystemChip icon={Shield}      label="Riesgo Global" value={system.globalRisk} tone={riskTone} />
            <SystemChip icon={Clock}       label="Hora Servidor" value={system.serverTime} />
          </div>
        </div>
        <div className="text-[10px] text-gray-500 text-right mt-2 font-mono">{system.serverDate} · UTC-4</div>
      </div>

      {/* Grid: rovers + side panels */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rovers.slice(0, 3).map((r) => <RoverCard key={r.id} rover={r} />)}
          {rovers.slice(3).map((r) => <RoverCard key={r.id} rover={r} />)}
          {/* El mapa rellena el slot 6 del grid de 3×2 */}
          <div className="md:col-span-2 lg:col-span-1">
            <MapPanel rovers={rovers} />
          </div>
        </div>

        <div className="space-y-4">
          <RulesPanel />
          <EventsPanel events={events} />
          <ReportPanel />
        </div>
      </div>

      {/* Footer RTK */}
      <div className="glass-panel rounded-xl border border-white/5 px-5 py-3 flex flex-wrap items-center justify-between gap-4">
        <FooterMetric icon={Clock}     label="Última actualización" value={rtk.lastUpdate} />
        <FooterMetric icon={Activity}  label="Precisión RTK"        value={rtk.precision} />
        <FooterMetric icon={Satellite} label="Satélites visibles"   value={rtk.satellites} />
        <FooterMetric icon={Signal}    label="Latencia 4G"          value={rtk.latency} />
        <FooterMetric icon={Zap}       label="Energía"              value={rtk.energy} />
        <FooterMetric icon={DbIcon}    label="Almacenamiento nube"  value={rtk.storage} />
      </div>
    </div>
  );
};

export default DesplazamientoModule;
