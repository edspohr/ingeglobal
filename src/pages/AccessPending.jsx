import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, LogOut, MessageSquare } from 'lucide-react';

const AccessPending = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-lg w-full p-10 border border-white/10 text-center relative z-10"
      >
        <div className="w-24 h-24 bg-brand-dark border-2 border-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,162,78,0.1)]">
          <Clock className="w-12 h-12 text-brand-gold animate-pulse" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Acceso en Revisión</h2>
        
        <div className="space-y-4 mb-10">
          <p className="text-gray-300 leading-relaxed">
            Hola, <span className="text-brand-gold font-semibold">{user?.displayName || 'Usuario'}</span>. Tu cuenta ha sido creada exitosamente y tu perfil está completo.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-gray-400">
            <ShieldAlert className="w-5 h-5 text-brand-gold mx-auto mb-3" />
            <p>
              Por motivos de seguridad industrial, un Administrador debe validar tu registro y asignar los módulos correspondientes antes de que puedas acceder al Dashboard.
            </p>
          </div>
          <p className="text-sm text-gray-500 italic">
            "Por favor, notifica a tu Administrador para que asigne los permisos y módulos correspondientes a tu perfil."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = 'mailto:soporte@ingeglobal.com'}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl border border-white/10 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-brand-gold" /> Soporte
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-white font-medium py-3 rounded-xl border border-white/10 hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4 text-red-400" /> Cerrar Sesión
          </button>
        </div>

        <div className="mt-12 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          Protocolo de Seguridad Ingeglobal • ID: {user?.uid?.substring(0, 8)}
        </div>
      </motion.div>
    </div>
  );
};

export default AccessPending;
