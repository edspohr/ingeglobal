import React from 'react';
import { Radio, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlatform } from '../context/PlatformContext';
import { mockArcones } from '../data/mockData';

const EmptyState = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-500 text-xs max-w-sm">
        Aún no se ha conectado el módulo de Arcones a los sensores de planta.
      </p>
    </div>
  </div>
);

// Semáforo: el nivel "saludable" es nivel ALTO. Si baja del warningPct
// se muestra ámbar (REVISAR NIVEL); si baja del criticalPct se muestra
// rojo (NIVEL CRÍTICO). Los umbrales viven con cada arcón en mockData.
const semaforo = (bin) => {
  const pct = (bin.current / bin.capacity) * 100;
  if (pct < bin.criticalPct) return { level: 'critical', pct, barClass: 'bg-red-500',        label: 'NIVEL CRÍTICO' };
  if (pct < bin.warningPct)  return { level: 'warning',  pct, barClass: 'bg-brand-gold',     label: 'REVISAR NIVEL' };
  return { level: 'normal', pct, barClass: 'bg-emerald-500', label: null };
};

const BinCard = ({ bin }) => {
  const s = semaforo(bin);
  const fillPct = Math.min(100, Math.max(4, s.pct));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl border border-white/5 p-5 flex flex-col gap-4 min-h-[260px]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{bin.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{bin.material}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white tabular-nums">
            {Math.round(s.pct)} <span className="text-sm text-gray-500 font-normal">/ 100 m³</span>
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Capacidad Total</p>
        </div>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden bg-white/[0.03] border border-white/5 min-h-[120px]">
        <div className="absolute inset-0 flex flex-col justify-between px-3 py-2 text-[10px] text-gray-600 font-mono pointer-events-none z-10">
          <span>80%</span>
          <span>60%</span>
          <span>40%</span>
          <span>20%</span>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 ${s.barClass} transition-all duration-700`}
          style={{ height: `${fillPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        {s.label ? (
          <span className={`flex items-center gap-1 font-semibold ${s.level === 'critical' ? 'text-red-400' : 'text-brand-gold'}`}>
            <AlertTriangle size={12} /> {s.label}
          </span>
        ) : <span />}
        <span className="text-gray-400">
          Consumo diario: <span className="text-white font-semibold">{bin.dailyConsumption} m³</span>
        </span>
      </div>
    </motion.div>
  );
};

const ArconesModule = () => {
  const { demoMode } = usePlatform();
  if (!demoMode) return <EmptyState />;

  const { bins } = mockArcones;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
        <p className="text-gray-400 mt-1">Monitoreo de capacidad por arcón en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bins.map((b) => <BinCard key={b.id} bin={b} />)}
      </div>
    </div>
  );
};

export default ArconesModule;
