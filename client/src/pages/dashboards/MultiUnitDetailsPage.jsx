import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Plus,
  MapPin,
  Bed,
  Home,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SpaceForm from './SpaceForm';

const MultiUnitDetailsPage = () => {
  const { propertyId, unitId } = useParams();
  const navigate = useNavigate();
  const [multiUnit, setMultiUnit] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [showSpaceForm, setShowSpaceForm] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard/landlord', icon: <Building2 size={20} /> },
    { label: 'Properties', path: '/dashboard/landlord/properties', icon: <Building2 size={20} /> },
    { label: 'Tenants', path: '#', icon: <Users size={20} /> },
    { label: 'Payments', path: '#', icon: <DollarSign size={20} /> },
    { label: 'Staff', path: '#', icon: <Users size={20} /> },
  ];

  const spaceTypeIcons = {
    'single': <Bed className="text-blue-600" size={20} />,
    'double': <Bed className="text-green-600" size={20} />,
    'dormitory': <Users className="text-orange-600" size={20} />,
  };

  const spaceTypeColors = {
    'single': 'from-blue-500 to-blue-600',
    'double': 'from-green-500 to-green-600',
    'dormitory': 'from-orange-500 to-orange-600',
  };

  useEffect(() => {
    fetchMultiUnitDetails();
  }, [propertyId, unitId]);

  const fetchMultiUnitDetails = async () => {
    try {
      setLoading(true);

      // Fetch property details
      const propertyResponse = await axios.get(`/api/properties/${propertyId}`);
      if (propertyResponse.data.success) {
        const property = propertyResponse.data.data;
        setPropertyDetails({
          name: property.name,
          address: property.address,
          barangay: property.barangay,
          municipality: property.municipality,
          city: property.city,
        });
      }

      // Fetch multi-unit details
      const unitResponse = await axios.get(`/api/rooms/${unitId}`);
      if (unitResponse.data.success) {
        setMultiUnit(unitResponse.data.data);
      }

      // Fetch spaces/rooms under this multi-unit
      const spacesResponse = await axios.get(`/api/rooms?parentUnitId=${unitId}`);
      if (spacesResponse.data.success) {
        setSpaces(spacesResponse.data.data);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load multi-unit details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/landlord/property/${propertyId}/units`);
  };

  const handleSpaceCreated = () => {
    setShowSpaceForm(false);
    fetchMultiUnitDetails();
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading multi-unit details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !multiUnit) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="space-y-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Units</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Multi-unit not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{multiUnit.roomNumber}</h2>
              {propertyDetails && (
                <p className="text-gray-600 mt-2 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  {propertyDetails.address && `${propertyDetails.address}, `}
                  {propertyDetails.barangay}, {propertyDetails.municipality}, {propertyDetails.city}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowSpaceForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add Space</span>
          </button>
        </div>

        {/* Space Form Modal */}
        {showSpaceForm && (
          <SpaceForm
            propertyId={propertyId}
            parentUnitId={unitId}
            onSuccess={handleSpaceCreated}
            onClose={() => setShowSpaceForm(false)}
          />
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Multi-Unit Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Multi-Unit Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="font-semibold text-gray-900">{multiUnit.description || 'No description'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Occupancy Type</p>
              <p className="font-semibold text-gray-900">{multiUnit.occupancyType}</p>
            </div>
          </div>
        </div>

        {/* Spaces Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Spaces ({spaces.length})</h3>
            <p className="text-gray-600">{spaces.filter(s => s.status === 'available').length} available</p>
          </div>

          {spaces.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <Bed size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-semibold">No spaces yet</p>
              <p className="text-gray-500">Click "Add Space" to add the first space to this multi-unit</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {spaces.map((space) => (
                <div
                  key={space._id}
                  className={`bg-gradient-to-br ${spaceTypeColors[space.type] || 'from-gray-500 to-gray-600'} rounded-2xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold">{space.roomNumber}</h4>
                      <p className="text-white/80 text-sm mt-1 capitalize">
                        {space.type.charAt(0).toUpperCase() + space.type.slice(1)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                      {spaceTypeIcons[space.type] || <Bed size={24} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-white/70 text-xs">Monthly Rent</p>
                      <p className="text-lg font-bold">${space.monthlyPrice}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Capacity</p>
                      <p className="text-lg font-bold">{space.capacity} head(s)</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-xs">Status</p>
                        <p className={`font-semibold text-sm capitalize ${
                          space.status === 'available' ? 'text-green-300' : 'text-orange-300'
                        }`}>
                          {space.status}
                        </p>
                      </div>
                      {space.utilities && (
                        <div className="text-right">
                          <p className="text-white/70 text-xs">Utilities</p>
                          <p className="text-green-300 font-semibold text-sm">Included</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities Section */}
        {multiUnit.amenities && multiUnit.amenities.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shared Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {multiUnit.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MultiUnitDetailsPage;
