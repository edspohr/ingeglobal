import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/common/MetricCard';
import { Activity, Database, Truck, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockSensorData } from '../data/mockData';

const DashboardHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, ROLES } = useAuth();

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData(mockSensorData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;

  const isOperator = user?.role === ROLES.OPERATOR;
  
  // Calculations
  const flowRateM3H = (data.cintas.currentFlow * 3600).toFixed(2); // Convert m3/s to m3/h
  const totalVolumeAcc = data.arcones.reduce((acc, curr) => acc + curr.volume_acc_m3, 0).toLocaleString('es-CL');
  const currentStock = data.arcones.reduce((acc, curr) => acc + curr.current, 0);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Resumen General de Operaciones</h1>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                SISTEMA OPERATIVO
            </span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* KPI 1: Tasa de Flujo (Convertida) */}
           <Link to="/cintas" className="block transform transition hover:scale-105">
                <MetricCard 
                    title="Flujo Volumétrico" 
                    value={`${flowRateM3H} m³/h`} 
                    trend="up"
                    trendValue="Live"
                    icon={Activity}
                    color="brand-gold"
                />
           </Link>
           
           {/* KPI 2: Stock Actual (Visible para todos, pero detalle restringido en módulo) */}
           {!isOperator && (
             <Link to="/arcones" className="block transform transition hover:scale-105">
                  <MetricCard 
                      title="Stock Actual" 
                      value={`${currentStock} m³`} 
                      trend="down"
                      trendValue="-120 m³"
                      icon={Database}
                      color="blue"
                  />
             </Link>
           )}

            {/* KPI 3: Volumen Acumulado (Total Historico) */}
            <div className="block transform transition hover:scale-105">
                <MetricCard 
                    title="Volumen Acumulado" 
                    value={`${totalVolumeAcc} m³`} 
                    trend="up"
                    trendValue="Total Histórico"
                    icon={Database}
                    color="purple"
                />
            </div>

            {/* KPI 4: Camiones */}
            <Link to="/camiones" className="block transform transition hover:scale-105">
                <MetricCard 
                    title="Camiones Turno" 
                    value={data.camiones.filter(t => t.time > '08:00').length} 
                    trend="up"
                    trendValue="En proceso"
                    icon={Truck}
                    color="emerald"
                />
           </Link>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-4">Avisos Recientes</h3>
                <div className="space-y-4 relative z-10">
                    <div className="p-4 bg-white/5 rounded-lg border-l-4 border-brand-gold">
                        <p className="font-bold text-white text-sm">Mantenimiento Cinta 3</p>
                        <p className="text-xs text-gray-400">Programado para mañana 14:00 hrs.</p>
                    </div>
                     <div className="p-4 bg-white/5 rounded-lg border-l-4 border-blue-500">
                        <p className="font-bold text-white text-sm">Nuevo Reporte de Topografía</p>
                        <p className="text-xs text-gray-400">Disponible en módulo Acopios.</p>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute right-0 top-0 p-10 opacity-5">
                    <Activity className="w-40 h-40 text-white" />
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Reporte de Turno</h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">Descargue el informe consolidado de operación del turno actual (08:00 - 16:00).</p>
                    <button className="px-6 py-3 bg-brand-gold text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(212,162,78,0.3)] transition-all">
                        Generar PDF
                    </button>
                </div>
            </div>
       </div>
    </div>
  );
};

export default DashboardHome;
