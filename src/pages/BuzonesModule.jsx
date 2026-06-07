import React from 'react';
import { Layers, Radio, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MetricCard from '../components/common/MetricCard';
import FlowChart from '../components/visualizations/FlowChart';
import { usePlatform } from '../context/PlatformContext';
import { mockBuzones } from '../data/mockData';

const STATUS_BADGE = {
  flowing: { label: 'En flujo', color: 'emerald', Icon: Activity },
  blocked: { label: 'Bloqueado', color: 'rose',    Icon: AlertTriangle },
  empty:   { label: 'Vacío',     color: 'gray',    Icon: Radio },
};

const EmptyState = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Monitoreo de Buzones</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-600 text-xs max-w-xs">
        El estado de los buzones aparecerá aquí automáticamente cuando el sistema de medición esté conectado.
      </p>
    </div>
  </div>
);

const BuzonesModule = () => {
  const { demoMode } = usePlatform();
  if (!demoMode) return <EmptyState />;

  const { units, flowHistory } = mockBuzones;
  const activeFlow = units.filter((u) => u.status === 'flowing').length;
  const totalFlow  = units.reduce((s, u) => s + u.flow_m3_h, 0);
  const blocked    = units.filter((u) => u.status === 'blocked').length;
  const avgLevel   = Math.round(units.reduce((s, u) => s + u.fillLevel, 0) / units.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Monitoreo de Buzones</h1>
        <p className="text-gray-400 mt-1">Estado y caudal de tolvas / silos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Buzones activos"  value={units.length}                          trend="up"   trendValue={`${activeFlow} en flujo`} icon={Layers}        color="emerald" />
        <MetricCard title="Caudal combinado" value={`${totalFlow.toFixed(1)} m³/h`}        trend="up"   trendValue="+5.4%" icon={Activity}      color="blue" />
        <MetricCard title="Bloqueados"       value={blocked}                               trend={blocked > 0 ? 'down' : 'up'} trendValue={blocked > 0 ? 'requiere acción' : 'sin alertas'} icon={blocked > 0 ? AlertTriangle : CheckCircle2} color={blocked > 0 ? 'rose' : 'emerald'} />
        <MetricCard title="Nivel promedio"   value={`${avgLevel}%`}                        trend="up"   trendValue="estable" icon={Layers}        color="amber" />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Caudal agregado (últimas 24 h)</h3>
          <span className="text-xs text-gray-500">m³/h</span>
        </div>
        <FlowChart data={flowHistory} unit="m³/h" />
      </motion.div>

      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Estado por buzón</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map((u) => {
            const meta = STATUS_BADGE[u.status];
            const Icon = meta.Icon;
            return (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{u.name}</p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">{u.id}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-${meta.color}-500/10 text-${meta.color}-400`}>
                    <Icon size={11} /> {meta.label}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Nivel</span>
                    <span className="font-mono text-white">{u.fillLevel}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-${meta.color}-500 transition-all duration-700`} style={{ width: `${u.fillLevel}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-gray-500">Caudal</span>
                  <span className="text-white font-mono">{u.flow_m3_h.toFixed(1)} m³/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuzonesModule;
