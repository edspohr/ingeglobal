import React, { useState } from 'react';
import { Users, Briefcase, Key, Search, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  const MOCK_USERS_LIST = [
    { id: 1, name: 'Fernando', role: 'Superadmin', plant: 'Global' },
    { id: 2, name: 'Gerente Planta', role: 'Manager', plant: 'C. Andina' },
    { id: 3, name: 'Juan Operador', role: 'Operator', plant: 'C. Andina' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
         <span className="text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
            v2.0.1 Global Config
         </span>
      </div>

      <div className="flex space-x-4 border-b border-white/10 pb-1">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 ${activeTab === 'users' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-gray-400 hover:text-white'}`}
          >
             <Users size={18} />
             <span>Usuarios</span>
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex items-center space-x-2 px-4 py-2 ${activeTab === 'clients' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-gray-400 hover:text-white'}`}
          >
             <Briefcase size={18} />
             <span>Clientes</span>
          </button>
          <button 
             onClick={() => setActiveTab('roles')}
            className={`flex items-center space-x-2 px-4 py-2 ${activeTab === 'roles' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-gray-400 hover:text-white'}`}
          >
             <Key size={18} />
             <span>Permisos</span>
          </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 min-h-[400px]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold w-64"
                />
             </div>
             <button className="flex items-center px-4 py-2 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-sm">
                <Plus size={16} className="mr-2" />
                Nuevo {activeTab === 'users' ? 'Usuario' : activeTab === 'clients' ? 'Cliente' : 'Rol'}
             </button>
          </div>

          <div className="p-0">
             <table className="w-full text-left">
                <thead className="bg-black/20 text-xs uppercase text-gray-400 font-semibold">
                    <tr>
                        <th className="p-4">Nombre</th>
                        <th className="p-4">Rol / Tipo</th>
                        <th className="p-4">Asignación</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                    {MOCK_USERS_LIST.map(u => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">{u.name}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                    ${u.role === 'Superadmin' ? 'bg-purple-500/10 text-purple-400' : 
                                      u.role === 'Manager' ? 'bg-brand-gold/10 text-brand-gold' : 
                                      'bg-blue-500/10 text-blue-400'}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-4">{u.plant}</td>
                            <td className="p-4 text-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                            </td>
                            <td className="p-4 text-right text-gray-500 hover:text-white cursor-pointer">
                                Editar
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
             <div className="p-8 text-center text-gray-500 italic text-sm border-t border-white/5">
                Datos de ejemplo. Backend no conectado.
             </div>
          </div>
      </div>
    </div>
  );
};

export default AdminPanel;
