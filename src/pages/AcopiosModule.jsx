import React, { useState } from 'react';
import { Box, Radio, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/common/MetricCard';
import { usePlatform } from '../context/PlatformContext';
import { mockAcopios } from '../data/mockData';

// Paleta por material (áridos). Se usa SOLO en la barra de "Distribución
// por material" — los marcadores del mapa son todos dorados por decisión
// de diseño (ver tooltip para el detalle por pila).
const MATERIAL_COLOR = {
  Arena:    '#FCD34D',
  Gravilla: '#A3A3A3',
  Grava:    '#78716C',
  Bolones:  '#57534E',
  Integral: '#60A5FA',
  Filler:   '#F472B6',
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

const PileTooltip = ({ pile }) => {
  const pct = (pile.volume_m3 / pile.capacity_m3) * 100;
  return (
    <div className="bg-[#0A0F18]/95 border border-white/15 rounded-lg p-3 shadow-2xl min-w-[200px] backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-white">{pile.name}</p>
        <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-1.5 py-0.5 rounded">
          {pile.id}
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Material</span>
          <span className="text-white font-medium">{pile.material}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Volumen</span>
          <span className="text-white font-mono">{pile.volume_m3.toLocaleString('es-CL')} m³</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Capacidad</span>
          <span className="text-white font-mono">{pile.capacity_m3.toLocaleString('es-CL')} m³</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ocupación</span>
          <span className="text-brand-gold font-mono font-bold">{pct.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between pt-1 mt-1 border-t border-white/10">
          <span className="text-gray-500">Último escaneo</span>
          <span className="text-gray-300 font-mono">{pile.lastSurvey}</span>
        </div>
      </div>
    </div>
  );
};

const PileMarker = ({ pile, hovered, onHover, onLeave }) => (
  <div
    className="absolute"
    style={{ left: `${pile.mapPosition.x}%`, top: `${pile.mapPosition.y}%`, transform: 'translate(-50%, -50%)' }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <div className="relative flex flex-col items-center group cursor-pointer">
      {/* Pulse ring */}
      <span className="absolute inline-flex w-9 h-9 rounded-full bg-brand-gold/30 animate-ping opacity-60" />

      {/* Marker dot */}
      <div
        className={`relative w-9 h-9 rounded-full bg-brand-gold text-black font-bold text-xs flex items-center justify-center border-2 border-white/80 shadow-lg transition-transform duration-150 ${
          hovered ? 'scale-110' : 'scale-100'
        }`}
      >
        {pile.id.replace('P', '')}
      </div>

      {/* Label always visible */}
      <span className="mt-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] text-white font-semibold whitespace-nowrap shadow-md">
        {pile.material}
      </span>

      {/* Tooltip on hover */}
      {hovered && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20">
          <PileTooltip pile={pile} />
        </div>
      )}
    </div>
  </div>
);

const PlantMap = ({ piles }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl border border-white/5 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-brand-gold" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mapa de Acopios — Vista Aérea</h3>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          {piles.length} acopios · pasa el cursor por un marcador
        </span>
      </div>

      <div
        className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-brand-darker"
        style={{ aspectRatio: '4 / 3', maxHeight: 560 }}
      >
        <img
          src="/planta-aerea.jpg"
          alt="Vista aérea de la planta"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Sutil oscurecimiento para que los marcadores dorados destaquen */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

        {piles.map((p) => (
          <PileMarker
            key={p.id}
            pile={p}
            hovered={hoveredId === p.id}
            onHover={() => setHoveredId(p.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}

        {/* Leyenda */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-gold border border-white/80" />
          <span className="text-[10px] text-white font-semibold uppercase tracking-widest">Acopio activo</span>
        </div>
      </div>
    </motion.div>
  );
};

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

      {/* Mapa hero */}
      <PlantMap piles={piles} />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Acopios"         value={piles.length}                                                  trend="up"   trendValue="todos en línea"           icon={Box}        color="emerald" />
        <MetricCard title="Volumen total"   value={`${totalVolume.toLocaleString('es-CL')} m³`}                   trend="up"   trendValue={`${occupancy}% capacidad`} icon={TrendingUp} color="amber" />
        <MetricCard title="Capacidad libre" value={`${(totalCapacity - totalVolume).toLocaleString('es-CL')} m³`} trend="down" trendValue="-2.1%"                     icon={Box}        color="blue" />
        <MetricCard title="Último escaneo"  value="Hoy"                                                           trend="up"   trendValue="04/06/2026"                icon={Calendar}   color="purple" />
      </div>

      {/* Volumen 7 días */}
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

      {/* Distribución + detalle */}
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
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-brand-gold text-black font-bold text-xs flex items-center justify-center">
                      {p.id.replace('P', '')}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.material} · escaneo {p.lastSurvey}</p>
                    </div>
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
