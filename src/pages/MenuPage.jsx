import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Database, Truck, Layers, Settings, LogOut } from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import AIAvatar from '../components/common/AIAvatar';

const MenuPage = () => {
  const { user, logout } = useAuth();

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
    }
  ];

  // Filter items if needed based on role (though user said "oculten si no tiene permiso")
  // For now, all roles see these 4 modules, but maybe specific actions inside are restricted.
  // The prompt says: "Operario: Visión restringida... Asegúrate de que los elementos del menú se oculten... si el usuario no tiene permiso"
  // Assuming these 4 are basic operational modules. If Supervisor only sees "Settings", I'll add that separately.

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MENU_ITEMS.map((item) => (
            <Link 
              key={item.id} 
              to={item.path}
              className="group relative"
            >
              <div className={`
                glass-panel h-64 rounded-2xl p-6 flex flex-col items-center justify-center 
                transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl
                border border-white/5 hover:border-white/20
                relative overflow-hidden
              `}>
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center mb-6 
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
          ))}
        </div>

        {/* Global Settings for Superadmin only */}
        {user?.role === ROLES.SUPERADMIN && (
           <div className="mt-12 flex justify-center">
              <button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-gray-300">
                <Settings size={20} />
                <span>Configuración Global</span>
              </button>
           </div>
        )}
        {/* AI Assistant FAB */}
        <AIAvatar />
      </div>
    </div>
  );
};

export default MenuPage;
