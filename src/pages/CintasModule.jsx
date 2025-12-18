import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import MetricCard from '../components/common/MetricCard';
import FlowChart from '../components/visualizations/FlowChart';
import { Activity, Clock, Calendar, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CintasModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const allModules = await api.data.getModules();
      setData(allModules.cintas);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Cargando monitoreo...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Medición de Caudal</h1>
           <p className="text-gray-400 mt-1">Monitoreo en tiempo real de cintas transportadoras</p>
        </div>
        
        {/* Date Filter Mock */}
        <div className="flex bg-brand-surface/50 rounded-lg p-1 border border-white/5">
           <button className="px-4 py-1.5 bg-brand-gold text-brand-dark font-bold rounded text-sm shadow-sm">Día</button>
           <button className="px-4 py-1.5 text-gray-400 hover:text-white rounded text-sm transition-colors">Semana</button>
           <button className="px-4 py-1.5 text-gray-400 hover:text-white rounded text-sm transition-colors">Mes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Flujo Actual" 
          value={`${data.currentFlow} m³/min`} 
          trend="up" 
          trendValue={data.trend} 
          icon={Activity} 
          color="emerald"
        />
         <MetricCard 
          title="Acumulado Hora" 
          value={`${data.stats.hour} m³`} 
          trend="up" 
          trendValue="2.1%" 
          icon={Clock} 
          color="blue"
        />
         <MetricCard 
          title="Total Diario" 
          value={`${data.stats.day.toLocaleString()} m³`} 
          trend="down" 
          trendValue="0.5%" 
          icon={Calendar} 
          color="amber" // Gold-ish
        />
         <MetricCard 
          title="Eficiencia" 
          value="94%" 
          trend="up" 
          trendValue="1.2%" 
          icon={BarChart2} 
          color="purple"
        />
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Tendencia de Flujo</h3>
        <FlowChart data={data.history} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Detalle por Material</h3>
            <div className="space-y-4">
                {['Arena', 'Gravilla', 'Grava', 'Otros'].map((m, i) => (
                    <div key={m} className="flex items-center justify-between">
                        <span className="text-gray-400">{m}</span>
                        <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-gold opacity-80" style={{ width: `${65 - (i*15)}%` }}></div>
                        </div>
                        <span className="text-white font-mono">{(data.stats.day * (0.4 - (i*0.1))).toFixed(0)} m³</span>
                    </div>
                ))}
            </div>
         </div>
         
         <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-lg font-semibold text-white mb-4">Estado de Sensores</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-200 text-sm font-medium">Sensor Cinta 1 (Láser)</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">ONLINE</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-200 text-sm font-medium">Báscula de Retorno</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">CALIBRADO</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <span className="text-yellow-200 text-sm font-medium">Telémetro Buzón</span>
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">REV. PENDIENTE</span>
                 </div>
              </div>
         </div>
      </div>
    </div>
  );
};

export default CintasModule;
