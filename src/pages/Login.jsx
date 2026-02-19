import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, register, resetPassword, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
        if (result.success) navigate('/');
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        result = await register(email, password);
        if (result.success) navigate('/complete-profile');
      } else if (mode === 'reset') {
        result = await resetPassword(email);
        if (result.success) setMessage("Se ha enviado un correo para restablecer tu contraseña.");
      }

      if (result && !result.success) {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) navigate('/');
      else setError(result.error);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark/90 z-10"></div>
        <img 
          src="/logo_full.jpg" 
          alt="Industrial BG" 
          className="w-full h-full object-cover opacity-30 grayscale blur-[2px]"
        />
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-brand-dark via-transparent to-brand-gold/5"></div>
      </div>

      <div className="relative z-20 w-full max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-3 bg-brand-dark border border-brand-gold/30 rounded-2xl shadow-lg"
            >
              <img src="/logo_full.jpg" className="h-16 object-contain" alt="Ingeglobal Logo" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {mode === 'login' && 'Bienvenido de Nuevo'}
              {mode === 'register' && 'Crear Cuenta Industrial'}
              {mode === 'reset' && 'Recuperar Acceso'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'login' && 'Ingrese sus credenciales para acceder al portal.'}
              {mode === 'register' && 'Únase a la red de inteligencia de Ingeglobal.'}
              {mode === 'reset' && 'Le enviaremos un enlace de recuperación.'}
            </p>
          </div>

          <form onSubmit={handleAction} className="space-y-5">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Corporativo"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 transition-colors"
                />
              </div>

              {/* Password Inputs */}
              {mode !== 'reset' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Error/Message Feedback */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-xs"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Ingresar al Sistema'}
                    {mode === 'register' && 'Registrarse'}
                    {mode === 'reset' && 'Enviar Instrucciones'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {mode === 'login' && (
              <div className="pt-2">
                <div className="relative flex items-center justify-center mb-4">
                  <div className="border-t border-white/10 w-full"></div>
                  <span className="bg-brand-dark px-3 text-[10px] text-gray-500 uppercase tracking-widest absolute">o continuar con</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  <span>Google de la Empresa</span>
                </button>
              </div>
            )}
          </form>

          {/* Secondary Actions */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            {mode === 'login' ? (
              <>
                <div className="flex items-center justify-between text-xs">
                  <button 
                    onClick={() => toggleMode('reset')}
                    className="text-gray-500 hover:text-brand-gold transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                  <button 
                    onClick={() => toggleMode('register')}
                    className="text-brand-gold hover:underline font-semibold"
                  >
                    Registrarse ahora
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <button 
                  onClick={() => toggleMode('login')}
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1 w-full"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        <p className="mt-8 text-center text-xs text-gray-600 font-medium tracking-widest uppercase">
          Ingeglobal Industrial Dashboard • v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;
