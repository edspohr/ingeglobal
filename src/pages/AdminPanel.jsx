import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, AlertCircle, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import SkeletonBlock from '../components/common/SkeletonBlock';
import { usePlatformSettings } from '../hooks/usePlatformSettings';

const ROLE_STYLES = {
  admin:    'bg-purple-500/10 text-purple-400',
  manager:  'bg-brand-gold/10 text-brand-gold',
  operator: 'bg-blue-500/10 text-blue-400',
  guest:    'bg-gray-500/10 text-gray-400',
};

const ROLE_LABELS = {
  admin:    'Administrador',
  manager:  'Gerente',
  operator: 'Operario',
  guest:    'Invitado',
};

const STATUS_STYLES = {
  active:    'bg-emerald-500/10 text-emerald-400',
  pending:   'bg-yellow-500/10 text-yellow-400',
  suspended: 'bg-red-500/10 text-red-400',
};

const STATUS_LABELS = {
  active:    'Activo',
  pending:   'Pendiente',
  suspended: 'Suspendido',
};

const AdminPanel = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const { demoMode, setDemoMode } = usePlatformSettings();

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('[AdminPanel] loadUsers:', err);
      setError('No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u => {
    const term = search.toLowerCase();
    return (
      u.displayName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-colors disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Demo Mode toggle */}
      <div className="glass-panel rounded-xl border border-white/5 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
            <Sparkles size={18} className="text-brand-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Modo Demo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Activa datos de ejemplo para presentar la plataforma a clientes potenciales.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          style={demoMode
            ? { background: 'rgba(212,162,78,0.15)', borderColor: 'rgba(212,162,78,0.5)', color: '#D4A24E' }
            : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }
          }
        >
          {demoMode
            ? <><ToggleRight size={18} /> Activado</>
            : <><ToggleLeft size={18} /> Desactivado</>
          }
        </button>
      </div>

      {/* Single tab header — visual only, no toggle needed */}
      <div className="border-b border-white/10 pb-1">
        <div className="flex items-center gap-2 px-4 py-2 text-brand-gold border-b-2 border-brand-gold w-fit">
          <Users size={16} />
          <span className="text-sm font-medium">Usuarios</span>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold w-72"
            />
          </div>
          <span className="text-xs text-gray-500">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[0,1,2].map(i => <SkeletonBlock key={i} height={44} className="w-full" />)}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-8 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-500 text-sm">
            {search ? 'Sin resultados para esa búsqueda.' : 'No hay usuarios registrados.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-xs uppercase text-gray-400 font-semibold">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4">Cargo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors border-l-2 border-l-transparent hover:border-l-brand-gold">
                    <td className="p-4 text-white font-medium">{u.displayName ?? '—'}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ROLE_STYLES[u.role] ?? ROLE_STYLES.guest}`}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_STYLES[u.status] ?? STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[u.status] ?? u.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{u.jobTitle ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
