import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  ArrowLeft,
  Bed,
  Grid,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UnitsView = () => {
  const { locationKey, occupancyType } = useParams();
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
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

  useEffect(() => {
    fetchUnits();
  }, [locationKey, occupancyType]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const decodedLocation = decodeURIComponent(locationKey);
      const decodedOccupancyType = decodeURIComponent(occupancyType);

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

      // Fetch all units for this occupancy type
      const allUnits = [];

      for (const property of locationProperties) {
        const roomsResponse = await axios.get(`/api/properties/${property._id}/rooms`);
        const rooms = roomsResponse.data.data || [];

        const filteredRooms = rooms.filter(
          (room) => room.occupancyType === decodedOccupancyType
        );

        filteredRooms.forEach((room) => {
          allUnits.push({
            ...room,
            propertyId: property._id,
            propertyName: property.name,
            address: property.address,
          });
        });
      }

      setUnits(allUnits);
      setError(null);
    } catch (err) {
      setError('Failed to load units');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitClick = (unit) => {
    if (decodeURIComponent(occupancyType) === 'Boarding House') {
      // For boarding house, show rooms first
      navigate(
        `/dashboard/landlord/occupancy-types/${locationKey}/units/${encodeURIComponent(occupancyType)}/rooms/${unit._id}`
      );
    } else {
      // For other types, show tenants directly
      navigate(
        `/dashboard/landlord/occupancy-types/${locationKey}/units/${encodeURIComponent(occupancyType)}/tenants/${unit._id}`
      );
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/landlord/occupancy-types/${locationKey}`);
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
              <h3 className="text-3xl font-bold text-gray-900">
                {decodeURIComponent(occupancyType)}
              </h3>
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
            <p className="text-gray-500">Loading units...</p>
          </div>
        ) : units.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Grid size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No units found</p>
            <p className="text-gray-500">
              There are no {decodeURIComponent(occupancyType).toLowerCase()} in this location
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Units</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{units.length}</p>
                  </div>
                  <Grid className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Occupied</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {units.filter((u) => u.status === 'occupied').length}
                    </p>
                  </div>
                  <CheckCircle className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Available</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {units.filter((u) => u.status === 'available').length}
                    </p>
                  </div>
                  <Clock className="text-orange-600" size={32} />
                </div>
              </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {units.map((unit) => (
                <div
                  key={unit._id}
                  onClick={() => handleUnitClick(unit)}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                >
                  {/* Unit Image or placeholder */}
                  {unit.images && unit.images.length > 0 ? (
                    <div className="h-40 overflow-hidden bg-gray-200">
                      <img
                        src={unit.images[0]}
                        alt={unit.roomNumber}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <Bed className="text-blue-400" size={48} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Room number and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {unit.roomNumber}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{unit.propertyName}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          unit.status === 'occupied'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {unit.status === 'occupied' ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {unit.capacity} person(s)
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Price</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ₱{unit.monthlyPrice?.toLocaleString() || 'N/A'}
                        </span>
                      </div>

                      {unit.currentTenant && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tenant ID</span>
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {unit.currentTenant}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Click action hint */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600 uppercase">
                        {decodeURIComponent(occupancyType) === 'Boarding House'
                          ? 'View Rooms'
                          : 'View Tenants'}
                      </span>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UnitsView;
