import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getSecondaryAuth } from '../../services/firebaseSecondary';

const ROLE_OPTIONS = [
  { value: 'operator', label: 'Operario' },
  { value: 'manager',  label: 'Gerente' },
  { value: 'admin',    label: 'Administrador' },
  { value: 'guest',    label: 'Invitado' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const friendlyError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo.';
    case 'auth/invalid-email':
      return 'El correo no tiene un formato válido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/network-request-failed':
      return 'Error de red. Verifica tu conexión e intenta de nuevo.';
    default:
      return 'No se pudo crear el usuario. Intenta de nuevo.';
  }
};

export default function AddUserModal({ isOpen, onClose, onCreated }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [jobTitle, setJobTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setDisplayName('');
      setEmail('');
      setPassword('');
      setRole('operator');
      setJobTitle('');
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) return setError('Ingresa el nombre completo.');
    if (!EMAIL_RE.test(email.trim())) return setError('El correo no tiene un formato válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');

    setSubmitting(true);
    const secondaryAuth = getSecondaryAuth();

    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        uid,
        email: email.trim(),
        displayName: displayName.trim(),
        role,
        jobTitle: jobTitle.trim(),
        status: 'active',
        contractedModules: [],
        createdAt: serverTimestamp(),
      });

      try { await signOut(secondaryAuth); } catch { /* ignore */ }

      onCreated?.(displayName.trim());
    } catch (err) {
      console.error('[AddUserModal] create user:', err);
      setError(friendlyError(err?.code));
      try { await signOut(secondaryAuth); } catch { /* ignore */ }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full max-w-md glass-panel rounded-2xl border border-white/10 bg-[#0A0F18]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-brand-gold/10 to-transparent">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-brand-gold" />
                <h2 className="text-white font-bold text-sm">Agregar Usuario</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold/50"
                  disabled={submitting}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold/50"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Contraseña inicial <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold/50 font-mono"
                  disabled={submitting}
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Comparte esta contraseña con el usuario para su primer inicio de sesión.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Rol / Perfil <span className="text-red-400">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold/50"
                  disabled={submitting}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0A0F18]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Cargo (opcional)
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold/50"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-brand-gold hover:bg-yellow-400 rounded-lg transition-colors disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Creando...</>
                  ) : (
                    <><UserPlus size={14} /> Crear usuario</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
