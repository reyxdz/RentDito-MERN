import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  Users,
  ArrowLeft,
  Home,
  Users2,
  Wind,
  DollarSign,
  Bed,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const OccupancyTypesView = () => {
  const { locationKey } = useParams();
  const navigate = useNavigate();
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard/landlord', icon: <Building2 size={20} /> },
    { label: 'Properties', path: '/dashboard/landlord/properties', icon: <Building2 size={20} /> },
    { label: 'Tenants', path: '#', icon: <Users size={20} /> },
    { label: 'Payments', path: '#', icon: <DollarSign size={20} /> },
    { label: 'Staff', path: '#', icon: <Users size={20} /> },
  ];

  const occupancyIcons = {
    'Room for rent': <Bed className="text-blue-600" size={24} />,
    'House for rent': <Home className="text-green-600" size={24} />,
    'Apartment': <Building2 className="text-purple-600" size={24} />,
    'Dormitory': <Users2 className="text-orange-600" size={24} />,
    'Boarding House': <Wind className="text-red-600" size={24} />,
  };

  const occupancyColors = {
    'Room for rent': 'from-blue-500 to-blue-600',
    'House for rent': 'from-green-500 to-green-600',
    'Apartment': 'from-purple-500 to-purple-600',
    'Dormitory': 'from-orange-500 to-orange-600',
    'Boarding House': 'from-red-500 to-red-600',
  };

  useEffect(() => {
    fetchOccupancyTypes();
  }, [locationKey]);

  const fetchOccupancyTypes = async () => {
    try {
      setLoading(true);
      const decodedLocation = decodeURIComponent(locationKey);
      const response = await axios.get('/api/properties');
      const properties = response.data.data || [];

      // Filter properties for this location
      const locationProperties = properties.filter((prop) => {
        const propLocation = `${prop.municipality}, ${prop.barangay}, ${prop.city}`;
        return propLocation === decodedLocation;
      });

      // Extract location details
      if (locationProperties.length > 0) {
        const first = locationProperties[0];
        setLocationDetails({
          municipality: first.municipality,
          barangay: first.barangay,
          city: first.city,
        });
      }

      // Get all rooms for this location
      const occupancyMap = new Map();
      const allOccupancyTypes = [
        'Room for rent',
        'House for rent',
        'Apartment',
        'Dormitory',
        'Boarding House',
      ];

      for (const occupancyType of allOccupancyTypes) {
        occupancyMap.set(occupancyType, {
          occupancyType,
          totalUnits: 0,
          totalTenants: 0,
          units: [],
        });
      }

      // Fetch rooms for all properties in this location
      for (const property of locationProperties) {
        const roomsResponse = await axios.get(`/api/properties/${property._id}/rooms`);
        const rooms = roomsResponse.data.data || [];

        rooms.forEach((room) => {
          if (occupancyMap.has(room.occupancyType)) {
            const occupancyData = occupancyMap.get(room.occupancyType);
            occupancyData.totalUnits += 1;
            if (room.status === 'occupied' || room.currentTenant) {
              occupancyData.totalTenants += 1;
            }
            occupancyData.units.push({
              ...room,
              propertyId: property._id,
              propertyName: property.name,
            });
          }
        });
      }

      // Convert map to array and filter out empty occupancy types
      const filteredOccupancyTypes = Array.from(occupancyMap.values()).filter(
        (o) => o.totalUnits > 0
      );

      setOccupancyTypes(filteredOccupancyTypes);
      setError(null);
    } catch (err) {
      setError('Failed to load occupancy types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOccupancyTypeClick = (occupancyType) => {
    navigate(
      `/dashboard/landlord/occupancy-types/${encodeURIComponent(locationKey)}/units/${encodeURIComponent(occupancyType)}`
    );
  };

  const handleBack = () => {
    navigate('/dashboard/landlord/properties');
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Occupancy Types</h3>
              {locationDetails && (
                <p className="text-gray-600 mt-1 flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>
                    {locationDetails.municipality}, {locationDetails.barangay},{' '}
                    {locationDetails.city}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading occupancy types...</p>
          </div>
        ) : occupancyTypes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No units yet</p>
            <p className="text-gray-500">Add units to your properties to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occupancyTypes.map((occupancy) => (
              <div
                key={occupancy.occupancyType}
                onClick={() => handleOccupancyTypeClick(occupancy.occupancyType)}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
              >
                {/* Header with gradient */}
                <div
                  className={`bg-gradient-to-r ${occupancyColors[occupancy.occupancyType]} p-6 text-white`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {occupancyIcons[occupancy.occupancyType]}
                        <h4 className="text-xl font-bold">{occupancy.occupancyType}</h4>
                      </div>
                      <p className="text-white/90 text-sm">
                        Browse all {occupancy.occupancyType.toLowerCase()} in this area
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {occupancy.totalUnits}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Available Units</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {occupancy.totalTenants}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Tenants</p>
                    </div>
                  </div>
                </div>

                {/* Occupancy rate */}
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Occupancy Rate
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {occupancy.totalUnits > 0
                        ? Math.round((occupancy.totalTenants / occupancy.totalUnits) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${occupancyColors[occupancy.occupancyType]} h-2 rounded-full transition-all`}
                      style={{
                        width: `${occupancy.totalUnits > 0 ? (occupancy.totalTenants / occupancy.totalUnits) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Click action hint */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    View Details
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OccupancyTypesView;
