import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Activity, Database, Truck, Box, Layers, Users, Menu, X as XIcon, AlertTriangle } from 'lucide-react';
import AIAvatar from '../common/AIAvatar';
import { getInitials } from '../../lib/formatUser';
import { usePlatform } from '../../context/PlatformContext';
import { useDesplazamiento } from '../../hooks/useDesplazamiento';

const BREADCRUMB_LABELS = {
  cintas: 'Cintas & Caudal',
  arcones: 'Control Arcones',
  camiones: 'Gestión Camiones',
  buzones: 'Monitoreo Buzones',
  acopios: 'Acopios Planta',
  desplazamiento: 'Alerta Desplazamiento',
  admin: 'Gestión Global',
};

// Derives the sub-section label (if any) from a pathname like "/dashboard/cintas".
// Returns null for the dashboard root or any unknown segment, so callers can fall
// back to just "Panel de Control".
const getBreadcrumbSubLabel = (pathname) => {
  if (typeof pathname !== 'string') return null;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2 || segments[0] !== 'dashboard') return null;
  return BREADCRUMB_LABELS[segments[1]] ?? null;
};

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
    <Icon className={`w-5 h-5 flex-shrink-0 ${label ? 'mr-3' : ''} ${active ? 'text-brand-gold' : 'text-gray-500 group-hover:text-white'}`} />
    {label && <span className="truncate">{label}</span>}
  </Link>
);

const SYNC_CYCLE_SECONDS = 45;

const MOBILE_BREAKPOINT = 768;

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { demoMode } = usePlatform();
  const { isAlert: desplazamientoAlert } = useDesplazamiento(demoMode);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [now, setNow] = useState(() => new Date());
  const [secondsSinceSync, setSecondsSinceSync] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-collapse sidebar on mobile, expand on desktop
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    if (mobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Live clock + simulated sync-cycle counter. Two independent intervals so
  // one can be tuned without affecting the other. Both cleared on unmount
  // to avoid setState-after-unmount warnings and memory leaks.
  useEffect(() => {
    const clockId = setInterval(() => setNow(new Date()), 1000);
    const syncId = setInterval(
      () => setSecondsSinceSync((s) => (s + 1) % SYNC_CYCLE_SECONDS),
      1000,
    );
    return () => {
      clearInterval(clockId);
      clearInterval(syncId);
    };
  }, []);

  const breadcrumbSubLabel = getBreadcrumbSubLabel(location.pathname);

  const timeStr = now.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative z-20'}
        ${sidebarOpen ? 'w-72' : isMobile ? '-translate-x-full w-72' : 'w-20'}
        bg-[#0F1623] border-r border-white/5 flex flex-col transition-all duration-300
      `}>
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
                {getInitials(user?.displayName)}
              </div>
              {sidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.displayName ?? user?.email ?? 'Usuario'}</p>
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
          <SidebarItem icon={LayoutDashboard} label={sidebarOpen ? "Visión General" : ""} path="/dashboard" active={location.pathname === '/dashboard'} />

          <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {sidebarOpen ? 'Módulos Operativos' : '---'}
          </div>

          <SidebarItem icon={Activity} label={sidebarOpen ? "Cintas & Caudal" : ""} path="/dashboard/cintas" active={location.pathname.includes('cintas')} />

          {/* Modules restricted for Operators */}
          {user?.role !== 'operator' && (
            <>
              <SidebarItem icon={Database} label={sidebarOpen ? "Control Arcones" : ""} path="/dashboard/arcones" active={location.pathname.includes('arcones')} />
              <SidebarItem icon={Layers} label={sidebarOpen ? "Monitoreo Buzones" : ""} path="/dashboard/buzones" active={location.pathname.includes('buzones')} />
              <SidebarItem icon={Box} label={sidebarOpen ? "Acopios Planta" : ""} path="/dashboard/acopios" active={location.pathname.includes('acopios')} />
            </>
          )}

          <SidebarItem icon={Truck} label={sidebarOpen ? "Gestión Camiones" : ""} path="/dashboard/camiones" active={location.pathname.includes('camiones')} />

          <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {sidebarOpen ? 'Alertas' : '---'}
          </div>

          <Link
            to="/dashboard/desplazamiento"
            onClick={() => isMobile && setSidebarOpen(false)}
            className={`w-full flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group
              ${location.pathname.includes('desplazamiento')
                ? 'bg-gradient-to-r from-brand-gold/20 to-transparent border-l-2 border-brand-gold text-brand-gold'
                : desplazamientoAlert
                  ? 'text-red-400 hover:bg-red-500/10 border-l-2 border-red-500/60'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''} ${
              location.pathname.includes('desplazamiento') ? 'text-brand-gold' :
              desplazamientoAlert ? 'text-red-400 animate-pulse' : 'text-gray-500 group-hover:text-white'
            }`} />
            {sidebarOpen && <span className="truncate">Alerta Desplazamiento</span>}
            {sidebarOpen && desplazamientoAlert && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            )}
          </Link>

          {user?.role === 'admin' && (
             <>
               <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {sidebarOpen ? 'Administración' : '---'}
               </div>
               <SidebarItem icon={Users} label={sidebarOpen ? "Gestión Global" : ""} path="/dashboard/admin" active={location.pathname.includes('admin')} />
             </>
          )}
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
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen && isMobile ? <XIcon size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-xl font-bold">
                <span className="text-white">Panel de Control</span>
                {breadcrumbSubLabel && (
                  <>
                    <span className="text-gray-600 mx-2">›</span>
                    <span className="text-brand-gold">{breadcrumbSubLabel}</span>
                  </>
                )}
              </h2>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-xs text-gray-500">{dateStr}</p>
                <span className="text-gray-700">·</span>
                <span className="font-mono text-xs text-white tabular-nums">{timeStr}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-green-400">EN VIVO</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5 font-mono">
                Última sincronización: hace {secondsSinceSync}s
              </p>
            </div>

          </div>
          
        </header>

        {/* Global displacement alert banner */}
        <AnimatePresence>
          {desplazamientoAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 md:px-8 py-2 bg-red-500/15 border-b border-red-500/30 text-red-300 text-xs">
                <AlertTriangle size={14} className="flex-shrink-0 animate-pulse" />
                <span className="font-semibold">ALERTA DE DESPLAZAMIENTO:</span>
                <span className="text-red-400/80">Se han detectado movimientos fuera del rango normal en la plataforma.</span>
                <Link to="/dashboard/desplazamiento" className="ml-auto flex items-center gap-1 text-red-300 hover:text-white underline underline-offset-2 font-medium whitespace-nowrap">
                  Ver módulo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 overflow-y-auto px-4 py-6 md:p-8 scroll-smooth"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      
      {/* AI Assistant FAB */}
      <AIAvatar />
    </div>
  );
};

export default DashboardLayout;
