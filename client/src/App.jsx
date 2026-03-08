import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import LandlordDashboard from './pages/dashboards/LandlordDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import PlatformAdminDashboard from './pages/dashboards/PlatformAdminDashboard';

function App() {
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      // Set authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const getDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'tenant':
        return <TenantDashboard />;
      case 'landlord':
        return <LandlordDashboard />;
      case 'landlord-admin':
        return <AdminDashboard />;
      case 'platform-admin':
        return <PlatformAdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={user ? getDashboard() : <Navigate to="/login" />}
        />

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
