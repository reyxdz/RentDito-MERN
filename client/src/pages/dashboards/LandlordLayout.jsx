import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandlordDashboard from './LandlordDashboard';
import LocationsView from './LocationsView';
import OccupancyTypesView from './OccupancyTypesView';
import UnitsView from './UnitsView';
import TenantsView from './TenantsView';
import RoomsView from './RoomsView';

const LandlordLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<LandlordDashboard />} />
      <Route path="/landlord" element={<LandlordDashboard />} />
      <Route path="/landlord/properties" element={<LocationsView />} />
      <Route path="/occupancy-types/:locationKey" element={<OccupancyTypesView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType" element={<UnitsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/tenants/:unitId" element={<TenantsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/rooms/:unitId" element={<RoomsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/rooms/:unitId/tenants/:roomId" element={<TenantsView />} />
      <Route path="*" element={<Navigate to="/dashboard/landlord" />} />
    </Routes>
  );
};

export default LandlordLayout;
