import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Layers, AlertOctagon, CheckCircle2 } from 'lucide-react';

const BuzonesModule = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const load = async () => {
        const allModules = await api.data.getModules();
        setData(allModules.buzones);
        setLoading(false);
      };
      load();
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    const isFlowing = data.status === 'flowing';
    const isBlocked = data.status === 'blocked';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Monitoreo de Buzones</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Status Visual */}
                <div className={`glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center border-t-4 
                    ${isFlowing ? 'border-emerald-500 bg-emerald-500/5' : isBlocked ? 'border-red-500 bg-red-500/5' : 'border-gray-500'}`}>
                    
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 
                        ${isFlowing ? 'bg-emerald-500/20 text-emerald-400' : isBlocked ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
                        {isFlowing ? <Layers className="w-16 h-16" /> : isBlocked ? <AlertOctagon className="w-16 h-16" /> : <Layers className="w-16 h-16" />}
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-2">
                        {isFlowing ? 'FLUJO NORMAL' : isBlocked ? 'ATASCO DETECTADO' : 'VACÍO'}
                    </h2>
                    <p className="text-gray-400 text-lg">Buzón Alimentador Principal</p>

                    {isBlocked && (
                        <div className="mt-8 px-6 py-3 bg-red-500/20 rounded-lg border border-red-500/30">
                            <span className="text-red-200 font-bold flex items-center">
                                <AlertOctagon className="w-5 h-5 mr-2" />
                                REQUIERE INTERVENCIÓN INMEDIATA
                            </span>
                        </div>
                    )}
                </div>

                {/* Fill Gauge */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-8">Nivel de Llenado</h3>
                    
                    <div className="relative h-64 w-24 mx-auto bg-gray-800 rounded-full border-4 border-gray-700 overflow-hidden">
                        <div 
                            className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out ${isBlocked ? 'bg-red-500' : 'bg-brand-gold'}`}
                            style={{ height: `${data.fillLevel}%` }}
                        >
                            <div className="absolute top-0 w-full h-4 bg-white/20 animate-pulse"></div>
                        </div>
                        {/* Ticks */}
                        <div className="absolute inset-y-0 right-0 w-full border-l border-white/5 flex flex-col justify-between py-4">
                            {[100, 75, 50, 25, 0].map(v => (
                                <div key={v} className="w-3 border-t border-gray-500 relative">
                                    <span className="absolute left-4 -top-3 text-xs text-gray-500 font-mono">{v}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="text-center mt-6">
                        <span className="text-5xl font-bold text-white">{data.fillLevel}%</span>
                        <p className="text-gray-500 text-sm mt-1">Capacidad Ocupada</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuzonesModule;
