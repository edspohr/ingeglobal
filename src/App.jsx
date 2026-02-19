import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import AccessPending from './pages/AccessPending';
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
  const { user, loading, STATUS } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-brand-dark">
      <div className="text-brand-gold animate-pulse font-mono tracking-widest uppercase text-sm">
        Iniciando Protocolos...
      </div>
    </div>
  );
  
  // 1. Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Profile incomplete (Check for fields from CompleteProfile.jsx)
  const isProfileIncomplete = !user.displayName || !user.jobTitle;
  if (isProfileIncomplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // 3. Authenticated but access still pending
  if (user.status === STATUS.PENDING && location.pathname !== '/access-pending' && !isProfileIncomplete) {
    return <Navigate to="/access-pending" replace />;
  }

  // 4. Authenticated but suspended
  if (user.status === STATUS.SUSPENDED) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-dark p-4">
        <div className="glass-panel p-8 border border-red-500/20 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Acceso Suspendido</h2>
          <p className="text-gray-400">Tu cuenta ha sido desactivada por un administrador. Contacta a soporte para más información.</p>
        </div>
      </div>
    );
  }

  // 5. Active and ready
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Onboarding Routes */}
          <Route path="/complete-profile" element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/access-pending" element={
            <ProtectedRoute>
              <AccessPending />
            </ProtectedRoute>
          } />

          {/* Protected Main Routes */}
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
