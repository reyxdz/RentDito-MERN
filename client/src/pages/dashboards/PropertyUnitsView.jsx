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
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PropertyUnitsView = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);

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
  }, [propertyId]);

  const fetchOccupancyTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/properties');
      const properties = response.data.data || [];

      // Find the property
      const property = properties.find((p) => p._id === propertyId);

      if (property) {
        setPropertyDetails({
          name: property.name,
          address: property.address,
          barangay: property.barangay,
          municipality: property.municipality,
          city: property.city,
        });

        // Fetch rooms for this property
        const roomsResponse = await axios.get(`/api/properties/${propertyId}/rooms`);
        const rooms = roomsResponse.data.data || [];

        // Group rooms by occupancy type
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

        rooms.forEach((room) => {
          if (occupancyMap.has(room.occupancyType)) {
            const occupancyData = occupancyMap.get(room.occupancyType);
            occupancyData.totalUnits += 1;
            if (room.status === 'occupied' || room.currentTenant) {
              occupancyData.totalTenants += 1;
            }
            occupancyData.units.push({
              ...room,
              propertyId: propertyId,
              propertyName: property.name,
            });
          }
        });

        // Convert map to array and filter out empty occupancy types
        const filteredOccupancyTypes = Array.from(occupancyMap.values()).filter(
          (o) => o.totalUnits > 0
        );

        setOccupancyTypes(filteredOccupancyTypes);
      }
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
      `/dashboard/landlord/occupancy-types/property-${propertyId}/units/${encodeURIComponent(occupancyType)}`
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
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            {propertyDetails && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{propertyDetails.city}</h3>
                <p className="text-gray-600 mt-2 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  {propertyDetails.address && `${propertyDetails.address}, `}
                  {propertyDetails.barangay}, {propertyDetails.municipality}, {propertyDetails.city}
                </p>
              </div>
            )}
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
            <p className="text-gray-500">Loading unit types...</p>
          </div>
        ) : occupancyTypes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No units yet</p>
            <p className="text-gray-500">Add units to this property to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {occupancyTypes.map((occType) => (
              <div
                key={occType.occupancyType}
                onClick={() => handleOccupancyTypeClick(occType.occupancyType)}
                className={`group bg-gradient-to-br ${occupancyColors[occType.occupancyType]} rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all overflow-hidden`}
              >
                <div className="p-8 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                        {occupancyIcons[occType.occupancyType]}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold">{occType.occupancyType}</h4>
                        <p className="text-white/80 text-sm mt-1">
                          {occType.totalUnits} {occType.totalUnits === 1 ? 'unit' : 'units'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={24}
                      className="group-hover:translate-x-1 transition-transform flex-shrink-0"
                    />
                  </div>

                  {/* Occupancy Rate */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm font-medium">Occupancy</span>
                      <span className="text-white font-semibold">
                        {occType.totalUnits > 0
                          ? Math.round((occType.totalTenants / occType.totalUnits) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/60 rounded-full transition-all"
                        style={{
                          width:
                            occType.totalUnits > 0
                              ? `${(occType.totalTenants / occType.totalUnits) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                    <div>
                      <p className="text-white/80 text-sm">Occupied</p>
                      <p className="text-2xl font-bold text-white mt-1">{occType.totalTenants}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Available</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {occType.totalUnits - occType.totalTenants}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyUnitsView;
