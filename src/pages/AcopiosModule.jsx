import React from 'react';
import { Box, Radio, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/common/MetricCard';
import { usePlatform } from '../context/PlatformContext';
import { mockAcopios } from '../data/mockData';

const MATERIAL_COLOR = {
  Cobre:   '#D4A24E',
  Estéril: '#9CA3AF',
  Mineral: '#60A5FA',
  Áridos:  '#34D399',
};

const EmptyState = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Acopios Planta</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-600 text-xs max-w-xs">
        El inventario de acopios aparecerá aquí automáticamente cuando el sistema de medición esté conectado.
      </p>
    </div>
  </div>
);

const AcopiosModule = () => {
  const { demoMode } = usePlatform();
  if (!demoMode) return <EmptyState />;

  const { piles, volumeBy7d } = mockAcopios;
  const totalVolume   = piles.reduce((s, p) => s + p.volume_m3, 0);
  const totalCapacity = piles.reduce((s, p) => s + p.capacity_m3, 0);
  const occupancy     = ((totalVolume / totalCapacity) * 100).toFixed(1);

  const byMaterial = piles.reduce((acc, p) => {
    acc[p.material] = (acc[p.material] || 0) + p.volume_m3;
    return acc;
  }, {});
  const materialData = Object.entries(byMaterial).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Acopios Planta</h1>
        <p className="text-gray-400 mt-1">Inventario y movimiento de material acopiado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Acopios"            value={piles.length}                                  trend="up" trendValue="todos en línea"        icon={Box}        color="emerald" />
        <MetricCard title="Volumen total"      value={`${totalVolume.toLocaleString('es-CL')} m³`}    trend="up" trendValue={`${occupancy}% capacidad`} icon={TrendingUp} color="amber" />
        <MetricCard title="Capacidad libre"    value={`${(totalCapacity - totalVolume).toLocaleString('es-CL')} m³`} trend="down" trendValue="-2.1%" icon={Box} color="blue" />
        <MetricCard title="Último escaneo"     value="Hoy"                                            trend="up" trendValue="04/06/2026"            icon={Calendar}   color="purple" />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Volumen acopiado (últimos 7 días)</h3>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeBy7d} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(11,17,32,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#9CA3AF' }} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" fill="#D4A24E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Distribución por material</h3>
          <div className="space-y-3">
            {materialData.map((m) => {
              const pct = ((m.value / totalVolume) * 100).toFixed(1);
              return (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{m.name}</span>
                    <span className="text-gray-400 font-mono text-xs">{m.value.toLocaleString('es-CL')} m³ · {pct}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: MATERIAL_COLOR[m.name] || '#D4A24E' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Detalle por acopio</h3>
          <div className="space-y-3">
            {piles.map((p) => {
              const pct = (p.volume_m3 / p.capacity_m3) * 100;
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{p.material} · escaneo {p.lastSurvey}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono text-sm">{p.volume_m3.toLocaleString('es-CL')} m³</p>
                    <p className="text-xs text-brand-gold mt-0.5">{pct.toFixed(0)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcopiosModule;
