import React from 'react';
import { Database, Radio, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MetricCard from '../components/common/MetricCard';
import { usePlatform } from '../context/PlatformContext';
import { mockArcones } from '../data/mockData';

const EmptyState = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-600 text-xs max-w-xs">
        Los niveles de arcones aparecerán aquí automáticamente cuando el sistema de medición esté conectado.
      </p>
    </div>
  </div>
);

const fillColor = (pct) => {
  if (pct >= 85) return 'bg-rose-500';
  if (pct >= 60) return 'bg-brand-gold';
  return 'bg-emerald-500';
};

const ArconesModule = () => {
  const { demoMode } = usePlatform();
  if (!demoMode) return <EmptyState />;

  const { bins, history24h } = mockArcones;
  const totalCapacity = bins.reduce((s, b) => s + b.capacity, 0);
  const totalCurrent  = bins.reduce((s, b) => s + b.current,  0);
  const occupancy     = ((totalCurrent / totalCapacity) * 100).toFixed(1);
  const critical      = bins.filter((b) => b.current / b.capacity >= 0.85).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
        <p className="text-gray-400 mt-1">Monitoreo de capacidad por arcón en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Arcones activos"    value={bins.length}                          trend="up"   trendValue="100% en línea" icon={Database}      color="emerald" />
        <MetricCard title="Volumen total"      value={`${totalCurrent.toLocaleString('es-CL')} m³`} trend="up"   trendValue={`de ${totalCapacity.toLocaleString('es-CL')} m³`} icon={TrendingUp}    color="blue" />
        <MetricCard title="Ocupación promedio" value={`${occupancy}%`}                       trend="up"   trendValue="+3.2%" icon={TrendingUp}    color="amber" />
        <MetricCard title="Arcones críticos"   value={critical}                              trend={critical > 0 ? 'down' : 'up'} trendValue={critical > 0 ? 'sobre 85%' : 'sin alertas'} icon={AlertTriangle} color={critical > 0 ? 'rose' : 'emerald'} />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Tendencia de nivel (últimas 24 h)</h3>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history24h} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(11,17,32,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#9CA3AF' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="A1" stroke="#D4A24E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="B1" stroke="#60A5FA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="C1" stroke="#34D399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Capacidad por arcón</h3>
        <div className="space-y-4">
          {bins.map((b) => {
            const pct = (b.current / b.capacity) * 100;
            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{b.name} <span className="text-gray-500 text-xs ml-1">· {b.material}</span></span>
                  <span className="text-gray-400 font-mono text-xs">
                    {b.current.toLocaleString('es-CL')} / {b.capacity.toLocaleString('es-CL')} m³ · <span className="text-white">{pct.toFixed(0)}%</span>
                  </span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${fillColor(pct)} transition-all duration-700`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArconesModule;
