import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Briefcase, Shield } from 'lucide-react';

const Login = () => {
  const { login, ROLES } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    setLoading(true);
    try {
      const result = await login(role);
      if (result) {
        navigate('/menu', { replace: true });
      }
    } catch (e) {
      console.error("Login Error in component:", e);
    } finally {
      setLoading(false);
    }
  };

  const profiles = [
    { role: ROLES.OPERATOR, label: 'Operario', icon: User, color: 'text-blue-400', desc: 'Acceso a nodo específico' },
    { role: ROLES.MANAGER, label: 'Gerente Planta', icon: Briefcase, color: 'text-brand-gold', desc: 'Visión completa empresa' },
    { role: ROLES.SUPERADMIN, label: 'Administrador', icon: Shield, color: 'text-purple-400', desc: 'Gestión global' }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/logo_full.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="text-center mb-12">
           {/* Logo Container */}
           <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
             <img src="/logo_full.jpg" className="h-24 md:h-32 object-contain drop-shadow-2xl rounded-xl" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3"
          >
            Portal de Inteligencia Industrial
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Seleccione su perfil de acceso seguro
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((p, index) => (
            <motion.button
              key={p.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin(p.role)}
              disabled={loading}
              className="glass-card p-8 group text-left relative overflow-hidden z-20 cursor-pointer"
            >
              <div className={`absolute top-0 right-0 p-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500 pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-${p.color.split('-')[1]}-500/50 transition-colors`}>
                  <p.icon className={`w-8 h-8 ${p.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{p.label}</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">{p.desc}</p>
                
                <div className="mt-6 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-600 group-hover:text-white transition-colors">
                  Ingresar <span className="ml-2">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <p className="text-xs text-gray-600">Ingeglobal Systems v2.0 • 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
