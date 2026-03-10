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
  Plus,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UnitForm from './UnitForm';

const PropertyUnitsView = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [singleUnits, setSingleUnits] = useState([]);
  const [multiUnits, setMultiUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

        // Separate single units and multi units
        const single = rooms.filter((room) => room.type === 'single-unit');
        const multi = rooms.filter((room) => room.type === 'multi-unit');

        // Format single units
        const formattedSingle = single.map((unit) => ({
          ...unit,
          isUnit: true,
        }));

        // Format multi units with count of child rooms
        const formattedMulti = multi.map((unit) => {
          // Count how many rooms belong to this multi-unit (child rooms will have different type)
          const childRooms = rooms.filter((r) => 
            r.parentUnitId === unit._id && r.type !== 'single-unit' && r.type !== 'multi-unit'
          );
          return {
            ...unit,
            isUnit: true,
            childRoomsCount: childRooms.length,
          };
        });

        setSingleUnits(formattedSingle);
        setMultiUnits(formattedMulti);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load units');
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

  const handleUnitCreated = () => {
    setShowForm(false);
    fetchOccupancyTypes();
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
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add Unit</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <UnitForm
            propertyId={propertyId}
            onSuccess={handleUnitCreated}
            onClose={() => setShowForm(false)}
          />
        )}

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
        ) : singleUnits.length === 0 && multiUnits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No units yet</p>
            <p className="text-gray-500">Add units to this property to get started</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Single Units Section */}
            {singleUnits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Single Units</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {singleUnits.map((unit) => (
                    <div
                      key={unit._id}
                      onClick={() => navigate(`/dashboard/landlord/property/${propertyId}/unit/${unit._id}`)}
                      className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg hover:border-blue-300 transition-all p-6 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Complete Unit</p>
                          <h4 className="text-xl font-bold text-gray-900 mt-1">${unit.monthlyPrice}/month</h4>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <Home className="text-blue-600" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Capacity:</strong> {unit.capacity} {unit.capacity === 1 ? 'person' : 'persons'}</p>
                        {unit.utilities && <p className="text-green-600">✓ Utilities Included</p>}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Details</span>
                        <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi Units Section */}
            {multiUnits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Multi Units</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {multiUnits.map((unit) => (
                    <div
                      key={unit._id}
                      onClick={() => navigate(`/dashboard/landlord/property/${propertyId}/multi-unit/${unit._id}`)}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all p-6 text-white group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-2xl font-bold">{unit.roomNumber}</h4>
                          <p className="text-purple-100 text-sm mt-1">{unit.description}</p>
                        </div>
                        <ArrowRight size={24} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-2xl font-bold">{unit.childRoomsCount}</p>
                        <p className="text-purple-100 text-sm">spaces available</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyUnitsView;
