import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandlordDashboard from './LandlordDashboard';
import PropertiesPage from './PropertiesPage';

const LandlordLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<LandlordDashboard />} />
      <Route path="/landlord" element={<LandlordDashboard />} />
      <Route path="/landlord/properties" element={<PropertiesPage />} />
      <Route path="*" element={<Navigate to="/dashboard/landlord" />} />
    </Routes>
  );
};

export default LandlordLayout;
