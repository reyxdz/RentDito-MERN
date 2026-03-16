import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandlordDashboard from './LandlordDashboard';
import LocationsView from './LocationsView';
import SpacesView from './SpacesView';
import PropertyUnitsView from './PropertyUnitsView';
import UnitDetailsPage from './UnitDetailsPage';
import MultiUnitDetailsPage from './MultiUnitDetailsPage';
import UnitsView from './UnitsView';
import TenantsView from './TenantsView';
import RoomsView from './RoomsView';
import SpaceDashboard from './SpaceDashboard';

const LandlordLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<LandlordDashboard />} />
      <Route path="/landlord" element={<LandlordDashboard />} />
      <Route path="/landlord/properties" element={<LocationsView />} />
      <Route path="/landlord/property/:propertyId/spaces" element={<SpacesView />} />
      <Route path="/landlord/property/:propertyId/units" element={<PropertyUnitsView />} />
      <Route path="/landlord/property/:propertyId/unit/:unitId" element={<UnitDetailsPage />} />
      <Route path="/landlord/property/:propertyId/multi-unit/:unitId" element={<MultiUnitDetailsPage />} />
      <Route path="/occupancy-types/:locationKey" element={<PropertyUnitsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType" element={<UnitsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/tenants/:unitId" element={<TenantsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/rooms/:unitId" element={<RoomsView />} />
      <Route path="/occupancy-types/:locationKey/units/:occupancyType/rooms/:unitId/tenants/:roomId" element={<TenantsView />} />
      <Route path="/landlord/space/:spaceId" element={<SpaceDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/landlord" />} />
    </Routes>
  );
};

export default LandlordLayout;
