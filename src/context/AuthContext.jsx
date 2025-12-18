import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, ROLES } from '../services/mockApi';

const AuthContext = createContext(null);

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
      const userData = await api.auth.login(role);
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
