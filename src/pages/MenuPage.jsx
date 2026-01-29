import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Database, Truck, Layers, Settings, LogOut, Lock, Users, Briefcase, Key } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import AIAvatar from '../components/common/AIAvatar';

const MenuPage = () => {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(null);

  const contracted = user?.contractedModules || []; // List of contracted modules

  const MENU_ITEMS = [
    { 
      id: 'cintas', 
      label: 'Cintas', 
      icon: Activity, 
      path: '/cintas', 
      color: 'text-brand-gold', 
      bg: 'bg-brand-gold/10',
      border: 'border-brand-gold/20'
    },
    { 
      id: 'arcones', 
      label: 'Arcones', 
      icon: Database, 
      path: '/arcones',
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    { 
      id: 'camiones', 
      label: 'Camiones', 
      icon: Truck, 
      path: '/camiones',
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    { 
      id: 'buzones', 
      label: 'Buzones', 
      icon: Layers, 
      path: '/buzones',
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      id: 'acopios', 
      label: 'Acopios', 
      icon: Database, 
      path: '/acopios',
      color: 'text-orange-400', 
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    }
  ];

  const isDisabled = (moduleId) => !contracted.includes(moduleId) && user?.role !== ROLES.SUPERADMIN; // Superadmin bypassed

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Hola, {user?.name || 'Usuario'}</h1>
              <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold border border-white/10 px-2 py-1 rounded inline-block mt-2">
                {user?.role === ROLES.SUPERADMIN ? 'Super Admin' : user?.role === ROLES.MANAGER ? 'Gerente de Planta' : 'Operador'}
              </span>
            </div>
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <LogOut size={24} />
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {MENU_ITEMS.map((item) => {
            const disabled = isDisabled(item.id);

            return (
              <div key={item.id} className="group relative">
                {disabled ? (
                  /* Disabled Card */
                  <div className="glass-panel h-64 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 opacity-50 relative cursor-not-allowed grayscale">
                     <div className="absolute top-3 right-3 text-gray-500">
                        <Lock size={20} />
                     </div>
                     <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-800 border border-gray-700">
                        <item.icon className="w-8 h-8 text-gray-500" />
                     </div>
                     <h3 className="text-lg font-bold text-gray-500 tracking-wide">{item.label}</h3>
                     <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 text-[10px] uppercase font-bold mt-2">No Contratado</span>
                  </div>
                ) : (
                  /* Active Link */
                  <Link to={item.path}>
                    <div className={`
                      glass-panel h-64 rounded-2xl p-6 flex flex-col items-center justify-center 
                      transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl
                      border border-white/5 hover:border-white/20 relative overflow-hidden
                    `}>
                      <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center mb-6 
                        ${item.bg} border ${item.border}
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <item.icon className={`w-10 h-10 ${item.color}`} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white tracking-wide">{item.label}</h3>
                      
                      <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 font-mono">
                         ENTRAR &rarr;
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Admin Management Section */}
        {user?.role === ROLES.SUPERADMIN && (
           <div className="mt-16 border-t border-white/10 pt-8">
              <h3 className="text-white font-bold mb-6 flex items-center">
                 <Settings className="w-5 h-5 mr-2 text-brand-gold" />
                 Panel de Administración
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                     <div className="p-3 bg-blue-500/10 rounded-lg mr-4 group-hover:bg-blue-500/20">
                        <Users className="text-blue-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white">Usuarios</p>
                        <p className="text-xs text-gray-500">Gestionar accesos</p>
                     </div>
                  </Link>

                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                     <div className="p-3 bg-purple-500/10 rounded-lg mr-4 group-hover:bg-purple-500/20">
                        <Briefcase className="text-purple-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white">Clientes</p>
                        <p className="text-xs text-gray-500">Contratos y módulos</p>
                     </div>
                  </Link>

                  <Link to="/admin" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                     <div className="p-3 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20">
                        <Key className="text-emerald-400" size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-white">Roles y Permisos</p>
                        <p className="text-xs text-gray-500">Configuración global</p>
                     </div>
                  </Link>
              </div>
           </div>
        )}

        {/* AI Assistant FAB */}
        <AIAvatar />
      </div>
    </div>
  );
};
export default MenuPage;
