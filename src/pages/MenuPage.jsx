import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Database, Truck, Layers, Settings, LogOut, Lock, Users, Briefcase, Key, ArrowUpRight } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import AIAvatar from '../components/common/AIAvatar';

const MenuPage = () => {
  const { user, logout } = useAuth();
  const contracted = user?.contractedModules || [];

  const isDisabled = (moduleId) => !contracted.includes(moduleId) && user?.role !== ROLES.SUPERADMIN;

  const MENU_ITEMS = [
    { 
      id: 'cintas', 
      label: 'Cintas & Caudal', 
      desc: 'Monitoreo en tiempo real de flujo y transporte via correas.',
      icon: Activity, 
      path: '/cintas', 
      color: 'text-brand-gold', 
      bg: 'bg-brand-gold/10',
      border: 'border-brand-gold/20',
      gridClass: 'md:col-span-2 md:row-span-2' // Featured Item
    },
    { 
      id: 'arcones', 
      label: 'Control Arcones', 
      desc: 'Niveles de llenado',
      icon: Database, 
      path: '/arcones',
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      gridClass: 'md:row-span-2' // Tall Item
    },
    { 
      id: 'camiones', 
      label: 'Gestión Camiones', 
      desc: 'Entrada/Salida y tonelaje.',
      icon: Truck, 
      path: '/camiones',
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      gridClass: 'md:col-span-2' // Wide Item
    },
    { 
      id: 'buzones', 
      label: 'Buzones', 
      desc: 'Estado de compuertas',
      icon: Layers, 
      path: '/buzones',
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gridClass: ''
    },
    { 
      id: 'acopios', 
      label: 'Acopios Planta', 
      desc: 'Volumetría aérea',
      icon: Database, 
      path: '/acopios',
      color: 'text-orange-400', 
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      gridClass: ''
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-y-auto overflow-x-hidden flex flex-col p-6 md:p-12">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">{user?.name?.split(' ')[0]}</span>
              </h1>
              <div className="flex items-center space-x-3">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                    ${user?.role === ROLES.SUPERADMIN ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 
                      user?.role === ROLES.MANAGER ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold' : 
                      'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    {user?.role === ROLES.SUPERADMIN ? 'Super Admin' : user?.role === ROLES.MANAGER ? 'Gerente de Planta' : 'Operador'}
                 </span>
                 <span className="text-gray-500 text-sm">
                    {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                 </span>
              </div>
            </div>
            
            <button 
                onClick={logout} 
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all duration-300"
            >
              <span className="text-sm font-medium text-gray-400 group-hover:text-red-400">Cerrar Sesión</span>
              <LogOut size={16} className="text-gray-500 group-hover:text-red-400" />
            </button>
        </header>

        {/* Mosaic / Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4 mb-16">
          {MENU_ITEMS.map((item) => {
            const disabled = isDisabled(item.id);

            if (disabled) {
                return (
                    <div key={item.id} className={`${item.gridClass} relative p-1`}>
                        <div className="h-full w-full rounded-3xl bg-[#0A0F18]/80 border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden grayscale opacity-60">
                            {/* Locked Pattern Overlay */}
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHBhdGggZD0iTTAgMEw4IDhaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-20"></div>
                            
                            <div className="flex justify-between items-start z-10">
                                <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                                    <item.icon size={24} />
                                </div>
                                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500 uppercase flex items-center">
                                    <Lock size={10} className="mr-1" />
                                    No Contratado
                                </div>
                            </div>

                            <div className="z-10">
                                <h3 className="text-xl font-bold text-gray-500 mb-1">{item.label}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
              <Link to={item.path} key={item.id} className={`${item.gridClass} block group relative p-1`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-20 pointer-events-none"></div>
                
                <div className={`
                    h-full w-full rounded-3xl bg-[#121826] border border-white/5 hover:border-white/20 
                    p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300
                    hover:shadow-2xl hover:shadow-black/50 hover:bg-[#161d2d]
                `}>
                    {/* Hover Glow */}
                    <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${item.color.replace('text-', 'from-')}/20 to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="flex justify-between items-start z-10">
                        <div className={`
                            p-3 rounded-2xl ${item.bg} ${item.color} border ${item.border}
                            group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20
                        `}>
                            <item.icon size={28} />
                        </div>
                        <div className="text-white/20 group-hover:text-white transition-colors">
                            <ArrowUpRight size={24} />
                        </div>
                    </div>

                    <div className="z-10">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:tracking-wide transition-all">{item.label}</h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{item.desc}</p>
                    </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Admin Management Section */}
        {user?.role === ROLES.SUPERADMIN && (
           <div className="mt-8 border-t border-white/10 pt-8 animate-fade-in-up">
              <h3 className="text-white font-bold mb-6 flex items-center text-lg">
                 <Settings className="w-5 h-5 mr-2 text-gray-400" />
                 Panel de Administración
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 transition-all group">
                     <div className="p-3 bg-blue-500/10 rounded-lg mr-4 group-hover:bg-blue-500/20">
                        <Users className="text-blue-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white group-hover:text-blue-300 transition-colors">Usuarios</p>
                        <p className="text-xs text-gray-500">Gestionar accesos</p>
                     </div>
                  </Link>

                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 transition-all group">
                     <div className="p-3 bg-purple-500/10 rounded-lg mr-4 group-hover:bg-purple-500/20">
                        <Briefcase className="text-purple-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white group-hover:text-purple-300 transition-colors">Clientes</p>
                        <p className="text-xs text-gray-500">Contratos y módulos</p>
                     </div>
                  </Link>

                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 transition-all group">
                     <div className="p-3 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20">
                        <Key className="text-emerald-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white group-hover:text-emerald-300 transition-colors">Roles y Permisos</p>
                        <p className="text-xs text-gray-500">Configuración global</p>
                     </div>
                  </Link>
              </div>
           </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-12 pb-6 text-center text-xs text-gray-600 font-mono">
            INGEGLOBAL DASHBOARD v2.1.0 &bull; SYSTEM ONLINE
        </div>

        {/* AI Assistant FAB */}
        <AIAvatar />
      </div>
    </div>
  );
};
export default MenuPage;
