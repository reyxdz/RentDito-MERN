import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Building2, MapPin, Users, Home, DollarSign, Plus, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';

const LocationsView = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { label: 'Dashboard', path: '/dashboard/landlord', icon: <Building2 size={20} /> },
    { label: 'Properties', path: '/dashboard/landlord/properties', icon: <Building2 size={20} /> },
    { label: 'Tenants', path: '#', icon: <Users size={20} /> },
    { label: 'Payments', path: '#', icon: <DollarSign size={20} /> },
    { label: 'Staff', path: '#', icon: <Users size={20} /> },
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/properties');
      const properties = response.data.data || [];

      // Calculate stats for each property and prepare for display
      const propertiesWithStats = properties.map((property) => {
        const occupiedRooms = property.occupiedRooms || 0;
        const totalUnits = property.totalRooms || 0;
        
        return {
          ...property,
          locationKey: `${property.municipality}, ${property.barangay}, ${property.city}`,
          totalUnits,
          totalTenants: occupiedRooms
        };
      });

      setLocations(propertiesWithStats);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyCreated = () => {
    setShowForm(false);
    fetchLocations();
  };

  const handlePropertyCardClick = (propertyId) => {
    navigate(`/dashboard/landlord/property/${propertyId}/units`);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Properties</h3>
            <p className="text-gray-600 mt-1">Manage your boarding houses by location</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add Property</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <PropertyForm
            onSuccess={handlePropertyCreated}
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
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No properties yet</p>
            <p className="text-gray-500 mb-6">Create your first property to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
            >
              <Plus size={20} />
              <span>Add Property</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locations.map((property) => (
              <div
                key={property._id}
                onClick={() => handlePropertyCardClick(property._id)}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 overflow-hidden cursor-pointer transition-all hover:shadow-lg"
              >
                {/* Header with City */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-3xl font-bold">{property.city}</h4>
                      <p className="text-blue-100 text-sm mt-2">
                        <div className="flex items-start">
                          <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span>{property.address && `${property.address}, `}{property.barangay}, {property.municipality}, {property.city}</span>
                        </div>
                      </p>
                    </div>
                    <ArrowRight
                      size={24}
                      className="group-hover:translate-x-1 transition-transform flex-shrink-0"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mx-auto mb-2">
                        <Home className="text-blue-600" size={24} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {property.totalUnits}
                      </p>
                      <p className="text-sm text-gray-600">Units</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-2">
                        <Users className="text-green-600" size={24} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {property.totalTenants}
                      </p>
                      <p className="text-sm text-gray-600">Tenants</p>
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

export default LocationsView;
