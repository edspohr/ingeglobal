import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CintasModule from './pages/CintasModule';
import ArconesModule from './pages/ArconesModule';
import CamionesModule from './pages/CamionesModule';
import BuzonesModule from './pages/BuzonesModule';
import AcopiosModule from './pages/AcopiosModule';

import MenuPage from './pages/MenuPage';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-gold">Cargando...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/menu" element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="cintas" element={<CintasModule />} />
            <Route path="arcones" element={<ArconesModule />} />
            <Route path="camiones" element={<CamionesModule />} />
            <Route path="buzones" element={<BuzonesModule />} />
            <Route path="acopios" element={<AcopiosModule />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
