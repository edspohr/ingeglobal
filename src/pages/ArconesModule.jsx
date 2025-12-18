import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Database, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const BunkerVisual = ({ data, index }) => {
  const percentage = (data.current / data.max) * 100;
  const isLow = percentage < 30;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 flex flex-col justify-between h-80 relative overflow-hidden"
    >
      <div className="z-10 flex justify-between items-start">
        <div>
           <h3 className="text-xl font-bold text-white">Arcón {data.id}</h3>
           <p className="text-brand-gold font-medium">{data.material}</p>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-white">{data.current} <span className="text-sm text-gray-400">/ {data.max} m³</span></p>
            <p className="text-xs text-gray-500">Capacidad Total</p>
        </div>
      </div>

      {/* Visual Bar Container */}
      <div className="flex-1 w-full bg-gray-800/50 rounded-lg mx-auto mt-6 mb-2 relative overflow-hidden border border-white/5">
         {/* Liquid/Fill Level */}
         <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute bottom-0 left-0 w-full ${isLow ? 'bg-red-500/60' : 'bg-brand-gold/60'} backdrop-blur-sm transition-colors duration-500`}
         >
            {/* Wave Effect Mock */}
            <div className="absolute top-0 w-full h-2 bg-white/20"></div>
         </motion.div>
         
         {/* Grid Lines */}
         <div className="absolute inset-0 flex flex-col justify-between py-2 px-2 pointer-events-none">
             {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-white/5 text-[10px] text-gray-600 pl-1">{100 - (i*20)}%</div>)}
         </div>
      </div>

      <div className="z-10 flex justify-between items-center mt-2">
         {isLow && (
             <span className="flex items-center text-xs font-bold text-red-400 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" /> STOCK CRÍTICO
             </span>
         )}
         <span className="ml-auto text-xs text-gray-400">Consumo diario: <span className="text-white">{data.consumed} m³</span></span>
      </div>
    </motion.div>
  );
};

const ArconesModule = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const load = async () => {
        const allModules = await api.data.getModules();
        setData(allModules.arcones);
        setLoading(false);
      };
      load();
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <BunkerVisual key={item.id} data={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default ArconesModule;
