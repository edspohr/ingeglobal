import React from 'react';
import { Truck, Radio, Package, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/common/MetricCard';
import { usePlatform } from '../context/PlatformContext';
import { mockCamiones } from '../data/mockData';

const STATUS_META = {
  completed:  { label: 'Completado', color: 'emerald' },
  processing: { label: 'En planta',  color: 'amber'   },
  entering:   { label: 'Ingresando', color: 'blue'    },
};

const EmptyState = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Reportes de Transporte</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-600 text-xs max-w-xs">
        El registro de camiones aparecerá aquí automáticamente cuando el sistema de pesaje esté conectado.
      </p>
    </div>
  </div>
);

const CamionesModule = () => {
  const { demoMode } = usePlatform();
  if (!demoMode) return <EmptyState />;

  const { fleet, tripsByHour } = mockCamiones;
  const totalVolume   = fleet.reduce((s, t) => s + t.volume_m3, 0);
  const completed     = fleet.filter((t) => t.status === 'completed').length;
  const inPlant       = fleet.filter((t) => t.status === 'processing').length;
  const totalTrips    = tripsByHour.reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Reportes de Transporte</h1>
        <p className="text-gray-400 mt-1">Gestión de flota y registro de viajes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Camiones en flota" value={fleet.length}                              trend="up" trendValue="hoy"                 icon={Truck}        color="emerald" />
        <MetricCard title="Viajes del día"    value={totalTrips}                                trend="up" trendValue="+8 vs ayer"          icon={CheckCircle2} color="blue" />
        <MetricCard title="Volumen transportado" value={`${totalVolume.toFixed(1)} m³`}         trend="up" trendValue="+12%"                icon={Package}      color="amber" />
        <MetricCard title="En planta ahora"   value={inPlant}                                   trend="up" trendValue={`${completed} completados`} icon={Clock} color="purple" />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Viajes por hora</h3>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tripsByHour} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(11,17,32,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: '#9CA3AF' }} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" fill="#60A5FA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Detalle de flota</h3>
          <span className="text-xs text-gray-500">{fleet.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Patente</th>
                <th className="px-6 py-3">Empresa</th>
                <th className="px-6 py-3">Material</th>
                <th className="px-6 py-3 text-right">Volumen</th>
                <th className="px-6 py-3">Ingreso</th>
                <th className="px-6 py-3">Salida</th>
                <th className="px-6 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {fleet.map((t) => {
                const meta = STATUS_META[t.status];
                return (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-white">{t.id}</td>
                    <td className="px-6 py-3 font-mono text-xs">PAT-{t.plate}</td>
                    <td className="px-6 py-3">{t.company}</td>
                    <td className="px-6 py-3">{t.material}</td>
                    <td className="px-6 py-3 text-right font-mono text-white">{t.volume_m3.toFixed(1)} m³</td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-400">{t.entryTime}</td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-400">{t.exitTime}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-${meta.color}-500/10 text-${meta.color}-400`}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CamionesModule;
