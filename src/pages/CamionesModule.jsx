import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Truck, Camera, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const CamionesModule = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const load = async () => {
        const allModules = await api.data.getModules();
        setData(allModules.camiones);
        setLoading(false);
      };
      load();
    }, []);
  
    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Control de Transporte</h1>
            
            <div className="glass-panel rounded-xl overflow-hidden"> 
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-surface border-b border-white/5 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="p-4 rounded-tl-xl">ID / Patente</th>
                                <th className="p-4">Empresa / Material</th>
                                <th className="p-4 text-center">Hora</th>
                                <th className="p-4 text-center">Volumen</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-center rounded-tr-xl">Evidencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map(truck => (
                                <tr key={truck.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-brand-surface flex items-center justify-center mr-3 border border-white/10">
                                                <Truck className="w-5 h-5 text-gray-400 group-hover:text-brand-gold transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{truck.plate}</p>
                                                <p className="text-xs text-gray-500">{truck.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-white font-medium">{truck.company}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold">{truck.material}</span>
                                    </td>
                                    <td className="p-4 text-center text-gray-300 font-mono">{truck.time}</td>
                                    <td className="p-4 text-center">
                                        <span className="text-lg font-bold text-white">{truck.volume}</span>
                                        <span className="text-xs text-brand-gold ml-1">m³</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {truck.status === 'completed' && (
                                            <span className="flex items-center justify-center text-xs text-emerald-400 font-bold bg-emerald-500/10 py-1 px-2 rounded-full">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Completado
                                            </span>
                                        )}
                                        {truck.status === 'processing' && (
                                            <span className="flex items-center justify-center text-xs text-brand-gold font-bold bg-brand-gold/10 py-1 px-2 rounded-full">
                                                <Clock className="w-3 h-3 mr-1" /> En Proceso
                                            </span>
                                        )}
                                          {truck.status === 'entering' && (
                                            <span className="flex items-center justify-center text-xs text-blue-400 font-bold bg-blue-500/10 py-1 px-2 rounded-full">
                                                <ArrowRight className="w-3 h-3 mr-1" /> Ingresando
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="Ver Evidencia">
                                            <Camera className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CamionesModule;
