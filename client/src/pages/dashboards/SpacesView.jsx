import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  Users,
  ArrowLeft,
  Plus,
  DollarSign,
  Trash2,
  Edit,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SpaceForm from './SpaceForm';

const SpacesView = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
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

  useEffect(() => {
    fetchSpaces();
  }, [propertyId]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      
      // Fetch property details
      const propertyResponse = await axios.get(`/api/properties/${propertyId}`);
      if (propertyResponse.data.data) {
        setPropertyDetails(propertyResponse.data.data);
      }

      // Fetch rooms/spaces for this property
      const spacesResponse = await axios.get(`/api/properties/${propertyId}/rooms`);
      setSpaces(spacesResponse.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load spaces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceCreated = () => {
    setShowForm(false);
    fetchSpaces();
  };

  const handleDeleteSpace = async (spaceId) => {
    if (!window.confirm('Are you sure you want to delete this space?')) {
      return;
    }

    try {
      await axios.delete(`/api/rooms/${spaceId}`);
      fetchSpaces();
    } catch (error) {
      setError('Failed to delete space');
      console.error(error);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/landlord/properties')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Spaces</h3>
              {propertyDetails && (
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <strong>{propertyDetails.name}</strong>
                    {propertyDetails.code && ` [${propertyDetails.code}]`}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2" />
                    <span>{propertyDetails.address}, {propertyDetails.barangay}, {propertyDetails.municipality}, {propertyDetails.city}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add Space</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <SpaceForm
            propertyId={propertyId}
            onSuccess={handleSpaceCreated}
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
            <p className="text-gray-500">Loading spaces...</p>
          </div>
        ) : spaces.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No spaces yet</p>
            <p className="text-gray-500 mb-6">Add your first space to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
            >
              <Plus size={20} />
              <span>Add Space</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <div
                key={space._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Space Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-2xl font-bold">{space.roomName || space.spaceName}</h4>
                      <p className="text-blue-100 text-sm mt-1">{space.occupancyType}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {}}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSpace(space._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Space Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Type</p>
                        <p className="text-gray-900 font-semibold capitalize">{space.type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Capacity</p>
                        <p className="text-gray-900 font-semibold">{space.capacity || 1} person(s)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Monthly Price</p>
                        <p className="text-gray-900 font-semibold">₱{space.monthlyPrice || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Utilities</p>
                        <p className="text-gray-900 font-semibold">{space.utilities ? 'Included' : 'Not Included'}</p>
                      </div>
                    </div>

                    {space.description && (
                      <div>
                        <p className="text-gray-600 text-sm">Description</p>
                        <p className="text-gray-700">{space.description}</p>
                      </div>
                    )}
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

export default SpacesView;
