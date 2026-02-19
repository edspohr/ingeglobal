import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Briefcase, Save, RefreshCw } from 'lucide-react';

const CompleteProfile = () => {
  const { updateUserProfile, STATUS } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    jobTitle: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateUserProfile({
        ...formData,
        status: STATUS.PENDING,
        role: 'guest'
      });
      if (result.success) {
        navigate('/access-pending');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-lg w-full p-8 border border-white/10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-brand-gold" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete su Perfil</h2>
          <p className="text-gray-400 text-sm">Necesitamos algunos datos adicionales antes de procesar su solicitud de acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-brand-gold/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+56 9 XXXX XXXX"
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-brand-gold/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">Cargo / Puesto</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="Ej: Supervisor de Planta"
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-brand-gold/50 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar y Continuar</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
