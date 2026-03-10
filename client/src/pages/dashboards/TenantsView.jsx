import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  Building2,
  MapPin,
  ArrowLeft,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TenantsView = () => {
  const { locationKey, occupancyType, unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [tenants, setTenants] = useState([]);
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
    fetchTenants();
  }, [unitId]);

  const fetchTenants = async () => {
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

      // Find the specific unit
      let foundUnit = null;
      let propertyId = null;

      for (const property of locationProperties) {
        const roomsResponse = await axios.get(`/api/properties/${property._id}/rooms`);
        const rooms = roomsResponse.data.data || [];
        const room = rooms.find((r) => r._id === unitId);

        if (room) {
          foundUnit = { ...room, propertyName: property.name };
          propertyId = property._id;
          break;
        }
      }

      setUnit(foundUnit);

      // Fetch tenant information if there's a current tenant
      if (foundUnit && foundUnit.currentTenant) {
        try {
          const tenantResponse = await axios.get(`/api/auth/users/${foundUnit.currentTenant}`);
          setTenants([tenantResponse.data.data]);
        } catch (err) {
          console.error('Failed to fetch tenant:', err);
          setTenants([]);
        }
      } else {
        setTenants([]);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load tenant information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/landlord/occupancy-types/${locationKey}/units/${occupancyType}`);
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} />;
      case 'pending':
        return <Clock size={20} />;
      case 'overdue':
        return <AlertCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
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
              <h3 className="text-3xl font-bold text-gray-900">Tenants</h3>
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
            <p className="text-gray-500">Loading tenant information...</p>
          </div>
        ) : (
          <>
            {/* Unit Details Card */}
            {unit && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                      Unit Number
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
                      Monthly Price
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₱{unit.monthlyPrice?.toLocaleString() || 'N/A'}
                    </p>
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

            {/* Tenants List */}
            {tenants.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No tenants</p>
                <p className="text-gray-500">This unit is currently vacant</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tenants.map((tenant) => (
                  <div
                    key={tenant._id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Tenant Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {tenant.profilePicture ? (
                            <img
                              src={tenant.profilePicture}
                              alt={tenant.fullName}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                              {tenant.fullName?.charAt(0) || 'T'}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {tenant.fullName}
                            </h4>
                            <p className="text-gray-600 text-sm">{tenant.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tenant Details */}
                    <div className="px-8 py-6 space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 uppercase mb-4">
                          Contact Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4">
                            <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div>
                              <p className="text-xs text-gray-600 font-semibold">Phone</p>
                              <p className="text-gray-900 font-medium">{tenant.phone || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4">
                            <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div>
                              <p className="text-xs text-gray-600 font-semibold">Email</p>
                              <p className="text-gray-900 font-medium truncate">{tenant.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rent Information */}
                      <div className="border-t border-gray-200 pt-6">
                        <h5 className="text-sm font-bold text-gray-900 uppercase mb-4">
                          Rent Information
                        </h5>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs text-gray-600 font-semibold mb-2">
                                Monthly Rent
                              </p>
                              <p className="text-3xl font-bold text-blue-600">
                                ₱{unit?.monthlyPrice?.toLocaleString() || 'N/A'}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 font-semibold mb-2">
                                Status
                              </p>
                              <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold ${getPaymentStatusColor(tenant.paymentStatus || 'pending')}`}>
                                {getPaymentStatusIcon(tenant.paymentStatus || 'pending')}
                                <span>
                                  {tenant.paymentStatus
                                    ? tenant.paymentStatus.charAt(0).toUpperCase() +
                                      tenant.paymentStatus.slice(1)
                                    : 'Pending'}
                                </span>
                              </span>
                            </div>

                            <div>
                              <p className="text-xs text-gray-600 font-semibold mb-2">
                                Payment Method
                              </p>
                              <p className="text-gray-900 font-medium">
                                {tenant.paymentMethod || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tenant Details */}
                      <div className="border-t border-gray-200 pt-6">
                        <h5 className="text-sm font-bold text-gray-900 uppercase mb-4">
                          Additional Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tenant.age && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600 font-semibold mb-1">Age</p>
                              <p className="text-gray-900">{tenant.age}</p>
                            </div>
                          )}

                          {tenant.address && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600 font-semibold mb-1">Address</p>
                              <p className="text-gray-900 line-clamp-2">{tenant.address}</p>
                            </div>
                          )}

                          {tenant.occupation && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600 font-semibold mb-1">
                                Occupation
                              </p>
                              <p className="text-gray-900">{tenant.occupation}</p>
                            </div>
                          )}

                          {tenant.moveInDate && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600 font-semibold mb-1">
                                Move-in Date
                              </p>
                              <p className="text-gray-900">
                                {new Date(tenant.moveInDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TenantsView;
