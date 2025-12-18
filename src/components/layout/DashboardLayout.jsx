import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, LayoutDashboard, Activity, Database, Truck, Box, Layers } from 'lucide-react'; // Added Layers, removed unused icons

const SidebarItem = ({ icon: Icon, label, path, onClick, active }) => (
  <Link 
    to={path}
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group
      ${active 
        ? 'bg-gradient-to-r from-brand-gold/20 to-transparent border-l-2 border-brand-gold text-brand-gold' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-brand-gold' : 'text-gray-500 group-hover:text-white'}`} />
    {label}
  </Link>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-[#0F1623] border-r border-white/5 flex flex-col transition-all duration-300 relative z-20`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0A0F18]">
          <img src="/logo_full.jpg" className="h-8 w-auto mr-3 rounded" />
          {sidebarOpen && <span className="text-white font-bold tracking-wide">INGEGLOBAL</span>}
        </div>

        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg
                ${user?.role === 'manager' ? 'bg-gradient-to-br from-brand-gold to-yellow-600 text-black' : 
                  user?.role === 'admin' ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white' : 
                  'bg-gradient-to-br from-blue-600 to-blue-800 text-white'}`}>
                {user?.name?.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className={`text-[10px] uppercase tracking-wider truncate font-bold
                    ${user?.role === 'manager' ? 'text-brand-gold' : 
                      user?.role === 'admin' ? 'text-purple-400' : 
                      'text-blue-400'}`}>
                    {user?.role === 'manager' ? 'Gerente de Planta' :
                     user?.role === 'admin' ? 'Administrador Global' : 'Operario de Terreno'}
                  </p>
                </div>
              )}
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <SidebarItem icon={LayoutDashboard} label={sidebarOpen ? "Visión General" : ""} path="/" active={location.pathname === '/'} />
          
          <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {sidebarOpen ? 'Módulos Operativos' : '---'}
          </div>

          <SidebarItem icon={Activity} label={sidebarOpen ? "Cintas & Caudal" : ""} path="/cintas" active={location.pathname.includes('cintas')} />
          
          {/* Modules restricted for Operators */}
          {user?.role !== 'operator' && (
            <>
              <SidebarItem icon={Database} label={sidebarOpen ? "Control Arcones" : ""} path="/arcones" active={location.pathname.includes('arcones')} />
              <SidebarItem icon={Layers} label={sidebarOpen ? "Monitoreo Buzones" : ""} path="/buzones" active={location.pathname.includes('buzones')} />
              <SidebarItem icon={Box} label={sidebarOpen ? "Acopios Planta" : ""} path="/acopios" active={location.pathname.includes('acopios')} />
            </>
          )}

          <SidebarItem icon={Truck} label={sidebarOpen ? "Gestión Camiones" : ""} path="/camiones" active={location.pathname.includes('camiones')} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-brand-dark">
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">{sidebarOpen ? 'Panel de Control' : ''}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Admin Company Selector */}
            {user?.role === 'admin' && (
              <div className="hidden md:flex items-center pl-6 border-l border-white/10">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Cliente Visualizado</span>
                    <select className="bg-black/20 border border-white/10 rounded text-sm text-white px-2 py-1 outline-none focus:border-brand-gold cursor-pointer">
                       <option>Ingeglobal Planta Central (Demo)</option>
                       <option>Minera Escondida - Fase IV</option>
                       <option>Codelco Andina - Chancado</option>
                    </select>
                 </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
             <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
