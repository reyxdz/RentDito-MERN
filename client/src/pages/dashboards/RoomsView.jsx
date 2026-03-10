import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  ArrowLeft,
  Bed,
  Door,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RoomsView = () => {
  const { locationKey, occupancyType, unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [rooms, setRooms] = useState([]);
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
    fetchRooms();
  }, [unitId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const decodedLocation = decodeURIComponent(locationKey);

      // First, find the unit details
      const response = await axios.get('/api/properties');
      const properties = response.data.data || [];

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

      // Find the specific unit (which is a boarding house)
      let foundUnit = null;
      let allRooms = [];

      for (const property of locationProperties) {
        const roomsResponse = await axios.get(`/api/properties/${property._id}/rooms`);
        const propRooms = roomsResponse.data.data || [];
        const unit = propRooms.find((r) => r._id === unitId);

        if (unit) {
          foundUnit = { ...unit, propertyName: property.name };
          // Get all rooms in this boarding house that belong to the same parent unit
          // For now, we'll treat sub-rooms as additional properties
          allRooms = propRooms.filter((r) => r.parentUnitId === unitId || r._id === unitId);
          break;
        }
      }

      setUnit(foundUnit);
      // If no sub-rooms, just show the unit itself as one room
      if (allRooms.length === 0 && foundUnit) {
        setRooms([foundUnit]);
      } else {
        setRooms(allRooms);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    navigate(
      `/dashboard/landlord/occupancy-types/${locationKey}/units/${occupancyType}/tenants/${room._id}`
    );
  };

  const handleBack = () => {
    navigate(`/dashboard/landlord/occupancy-types/${locationKey}/units/${occupancyType}`);
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
              <h3 className="text-3xl font-bold text-gray-900">Rooms</h3>
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
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        ) : (
          <>
            {/* Unit Details Card */}
            {unit && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                      Boarding House
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{unit.roomNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                      Property
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{unit.propertyName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                      Total Rooms
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                      Occupancy Type
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{unit.occupancyType}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rooms Grid */}
            {rooms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <Door size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No rooms</p>
                <p className="text-gray-500">This boarding house has no rooms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Rooms</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {rooms.length}
                        </p>
                      </div>
                      <Door className="text-blue-600" size={32} />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Occupied</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {rooms.filter((r) => r.status === 'occupied').length}
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
                          {rooms.filter((r) => r.status === 'available').length}
                        </p>
                      </div>
                      <Clock className="text-orange-600" size={32} />
                    </div>
                  </div>
                </div>

                {/* Rooms Table/Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      onClick={() => handleRoomClick(room)}
                      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                    >
                      {/* Room Image or placeholder */}
                      {room.images && room.images.length > 0 ? (
                        <div className="h-40 overflow-hidden bg-gray-200">
                          <img
                            src={room.images[0]}
                            alt={room.roomNumber}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                          <Bed className="text-purple-400" size={48} />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Room number and status */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {room.roomNumber}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">Room</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              room.status === 'occupied'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {room.status === 'occupied' ? 'Occupied' : 'Available'}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Capacity</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {room.capacity} person(s)
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Price</span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₱{room.monthlyPrice?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          {room.currentTenant && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Tenant ID</span>
                              <span className="text-sm font-semibold text-gray-900 truncate">
                                {room.currentTenant}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Click action hint */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 uppercase">
                            View Tenant
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RoomsView;
