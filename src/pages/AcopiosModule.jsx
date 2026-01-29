import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { MapPin, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AcopiosModule = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePin, setActivePin] = useState(null);
  
    useEffect(() => {
      const load = async () => {
        const allModules = await api.data.getModules();
        setData(allModules.acopios);
        setLoading(false);
      };
      load();
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Monitoreo de Acopios</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Map Mock */}
                <div className="lg:col-span-2 glass-panel p-1 rounded-xl relative overflow-hidden h-[400px] lg:h-[500px]">
                    <div className="w-full h-full bg-black relative">
                         {/* Placeholder for Satellite Image */}
                        <img 
                            src="/planta-aerea.jpg" 
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700" 
                            alt="Planta Aérea"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                        {/* Interactive Pins */}
                        {data.items.map((item, index) => (
                             <motion.button
                                key={item.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + (index * 0.2) }}
                                onClick={() => setActivePin(item.id)}
                                className={`absolute w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-xl  transition-transform transform hover:scale-110
                                    ${activePin === item.id 
                                        ? 'bg-brand-gold border-white text-black scale-110 z-20' 
                                        : 'bg-black/60 border-brand-gold text-brand-gold hover:bg-black/80 z-10'}`}
                                style={{
                                    top: `${20 + (index * 15)}%`, // Mock positions
                                    left: `${30 + (index * 20)}%`
                                }}
                             >
                                {item.id}
                             </motion.button>
                        ))}

                        <div className="absolute bottom-4 left-4">
                            <h3 className="text-white font-bold bg-black/50 px-3 py-1 rounded backdrop-blur">Vista Aérea - Planta Lo Blanco</h3>
                            <p className="text-xs text-gray-300 mt-1 px-3">Último Vuelo: {data.lastSurvey}</p>
                        </div>
                    </div>
                </div>

                {/* Info Panel / Table */}
                <div className="glass-panel p-6 rounded-xl flex flex-col">
                    <div className="flex items-center mb-6 text-brand-gold">
                        <Info className="w-5 h-5 mr-2" />
                        <h3 className="font-bold text-white uppercase tracking-wider">Detalle Volumétrico</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {data.items.map(item => (
                             <div 
                                key={item.id} 
                                className={`p-4 rounded-lg border transition-all cursor-pointer
                                    ${activePin === item.id 
                                        ? 'bg-brand-gold/10 border-brand-gold' 
                                        : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                onClick={() => setActivePin(item.id)}
                             >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-gray-600">{item.id}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${activePin === item.id ? 'bg-brand-gold text-black' : 'bg-gray-700 text-gray-300'}`}>
                                        Calidad {item.quality}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white">{item.material}</h4>
                                <p className="text-3xl font-bold text-white mt-2 tracking-tight">
                                    {item.volume.toLocaleString()} <span className="text-sm font-normal text-gray-500">m³</span>
                                </p>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcopiosModule;
