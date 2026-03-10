import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import {
  ArrowLeft,
  Building2,
  Users,
  DollarSign,
  Home,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UnitDetailsPage = () => {
  const { propertyId, unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [occupants, setOccupants] = useState([]);
  const [payments, setPayments] = useState([]);
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

  useEffect(() => {
    fetchUnitDetails();
  }, [propertyId, unitId]);

  const fetchUnitDetails = async () => {
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

      // Fetch unit details
      const unitResponse = await axios.get(`/api/rooms/${unitId}`);
      if (unitResponse.data.success) {
        setUnit(unitResponse.data.data);
      }

      // Fetch leases for this unit (occupants)
      const leasesResponse = await axios.get(`/api/leases?roomId=${unitId}`);
      if (leasesResponse.data.success) {
        const activeLeases = leasesResponse.data.data.filter(
          (lease) => lease.status === 'active' || lease.status === 'pending'
        );
        setOccupants(activeLeases);

        // Fetch payments related to these leases
        if (activeLeases.length > 0) {
          const paymentResponse = await axios.get(`/api/payments?roomId=${unitId}`);
          if (paymentResponse.data.success) {
            setPayments(paymentResponse.data.data);
          }
        }
      }

      setError(null);
    } catch (err) {
      setError('Failed to load unit details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/landlord/property/${propertyId}/units`);
  };

  const getPaymentStatus = () => {
    if (payments.length === 0) return 'No payments';

    const pending = payments.filter((p) => p.status === 'pending').length;
    const paid = payments.filter((p) => p.status === 'paid').length;
    const overdue = payments.filter((p) => p.status === 'overdue').length;

    if (overdue > 0) return 'Overdue';
    if (pending > 0) return 'Pending';
    if (paid > 0) return 'Paid';
    return 'No recent payments';
  };

  const getPaymentStatusColor = () => {
    const status = getPaymentStatus();
    if (status === 'Paid') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'Overdue') return 'bg-red-50 border-red-200 text-red-700';
    if (status === 'Pending') return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getPaymentStatusIcon = () => {
    const status = getPaymentStatus();
    if (status === 'Paid') return <CheckCircle size={20} />;
    if (status === 'Overdue') return <AlertCircle size={20} />;
    if (status === 'Pending') return <Clock size={20} />;
    return <DollarSign size={20} />;
  };

  const calculateUtilitiesCost = () => {
    // Simple calculation: typically utilities are around 10-15% of rent
    // This can be customized based on actual utility costs
    if (unit && !unit.utilities) {
      return Math.round(unit.monthlyPrice * 0.12); // 12% of rent as utilities estimate
    }
    return 0;
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading unit details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !unit) {
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
            {error || 'Unit not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Complete Unit</h2>
            {propertyDetails && (
              <p className="text-gray-600 mt-2 flex items-center">
                <MapPin size={18} className="mr-2" />
                {propertyDetails.address && `${propertyDetails.address}, `}
                {propertyDetails.barangay}, {propertyDetails.municipality}, {propertyDetails.city}
              </p>
            )}
          </div>
        </div>

        {/* Mini Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Occupants Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Current Occupants</p>
                <p className="text-3xl font-bold text-gray-900">{occupants.length}</p>
                <p className="text-xs text-gray-500 mt-1">of {unit.capacity} capacity</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Monthly Rent Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Monthly Rent</p>
                <p className="text-3xl font-bold text-gray-900">${unit.monthlyPrice}</p>
                <p className="text-xs text-gray-500 mt-1">per month</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Utilities Payment Card (only if utilities not included) */}
          {!unit.utilities && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Utilities Cost</p>
                  <p className="text-3xl font-bold text-gray-900">${calculateUtilitiesCost()}</p>
                  <p className="text-xs text-gray-500 mt-1">estimated monthly</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Utilities Included Indicator */}
          {unit.utilities && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Utilities Status</p>
                  <p className="text-lg font-bold text-green-600">Included</p>
                  <p className="text-xs text-gray-500 mt-1">No separate billing</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Payment Status Card */}
          <div className={`border rounded-xl shadow-sm p-6 ${getPaymentStatusColor()}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-75 mb-2">Payment Status</p>
                <p className="text-2xl font-bold">{getPaymentStatus()}</p>
                <p className="text-xs opacity-75 mt-1">{payments.length} payment(s)</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                {getPaymentStatusIcon()}
              </div>
            </div>
          </div>
        </div>

        {/* Unit Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unit Information */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Unit Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900">Complete Unit</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-gray-600">Capacity</span>
                <span className="font-semibold text-gray-900">{unit.capacity} person(s)</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-gray-600">Status</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                  unit.status === 'available' ? 'bg-green-100 text-green-700' : 
                  unit.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Occupancy Type</span>
                <span className="font-semibold text-gray-900">{unit.occupancyType}</span>
              </div>
            </div>
          </div>

          {/* Amenities & Features */}
          {unit.amenities && unit.amenities.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>
              <div className="space-y-2">
                {unit.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        {payments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Not paid'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">${payment.amount}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UnitDetailsPage;
