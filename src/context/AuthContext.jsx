import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/mockApi';

const AuthContext = createContext(null);

export const ROLES = {
  SUPERADMIN: 'superadmin',
  MANAGER: 'manager',
  OPERATOR: 'operator'
};

const MOCK_USERS = {
  [ROLES.SUPERADMIN]: {
    id: 1,
    name: 'Fernando',
    role: ROLES.SUPERADMIN,
    permissions: {
      canViewAllPlants: true,
      canConfigureUsers: true,
      canViewMoney: true
    },
    contractedModules: ['cintas', 'arcones', 'camiones', 'buzones', 'acopios']
  },
  [ROLES.MANAGER]: {
    id: 2,
    name: 'Gerente Planta',
    role: ROLES.MANAGER,
    plantId: 'planta-1',
    permissions: {
      canViewAllPlants: false,
      canConfigureUsers: false,
      canViewMoney: true
    },
    contractedModules: ['cintas', 'camiones'] // Only these moved to "Contract"
  },
  [ROLES.OPERATOR]: {
    id: 3,
    name: 'Operario Turno',
    role: ROLES.OPERATOR,
    plantId: 'planta-1',
    permissions: {
      canViewAllPlants: false,
      canConfigureUsers: false,
      canViewMoney: false
    },
    contractedModules: ['cintas', 'arcones', 'camiones', 'buzones', 'acopios']
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage or init
    const stored = localStorage.getItem('ingeglobal_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (role) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = MOCK_USERS[role];
      if (!userData) throw new Error("Invalid role");

      setUser(userData);
      localStorage.setItem('ingeglobal_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ingeglobal_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
