import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Home, DollarSign, Zap, Droplet } from 'lucide-react';

const TenantPaymentDashboard = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Demo tenant data
  const [tenant] = useState({
    _id: tenantId,
    fullName: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 917-123-4567',
    address: '123 Main Street, Cebu City',
    moveInDate: '2025-10-01',
    leaseEndDate: '2026-12-31',
  });

  const [property] = useState({
    _id: '1',
    name: 'White Dormitory',
    address: 'Sikatuna Street, Cebu',
    code: 'WD-001',
  });

  const [room] = useState({
    _id: '1',
    roomNumber: 'Room 69',
    monthlyPrice: 6900,
    capacity: 4,
  });

  const [payments] = useState({
    rent: {
      amount: 6900,
      dueDate: '2026-04-01',
      status: 'paid',
      lastPaidDate: '2026-03-01',
    },
    electricity: {
      amount: 1200,
      dueDate: '2026-04-05',
      status: 'pending',
      lastPaidDate: '2026-02-28',
    },
    water: {
      amount: 450,
      dueDate: '2026-04-05',
      status: 'pending',
      lastPaidDate: '2026-02-28',
    },
  });

  useEffect(() => {
    setLoading(false);
  }, [tenantId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'late':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    const icons = {
      paid: '✓',
      pending: '⏳',
      late: '⚠',
    };
    return icons[status] || '?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{tenant.fullName}</h1>
              <p className="text-gray-500 mt-1 text-sm">Tenant Payment Overview</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tenant Information */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tenant Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Email</p>
                  <p className="text-gray-900 font-medium">{tenant.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Phone</p>
                  <p className="text-gray-900 font-medium">{tenant.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Address</p>
                  <p className="text-gray-900 font-medium">{tenant.address}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">Move-in Date</p>
                <p className="text-gray-900 font-medium">{new Date(tenant.moveInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Lease Ends</p>
                <p className="text-gray-900 font-medium">{new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Property & Room Information */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Property & Room</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Home size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Property</p>
                  <p className="text-gray-900 font-medium">{property.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{property.code}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Address</p>
                <p className="text-gray-900 font-medium">{property.address}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">Room</p>
                <p className="text-gray-900 font-medium text-lg">{room.roomNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">Monthly Rent</p>
                <p className="text-2xl font-bold text-blue-600">₱{room.monthlyPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between ${getStatusColor(payments.rent.status)}`}>
                <span className="font-semibold">Rent Status</span>
                <span className="text-2xl">{getStatusBadge(payments.rent.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between ${getStatusColor(payments.electricity.status)}`}>
                <span className="font-semibold">Electric Bill</span>
                <span className="text-2xl">{getStatusBadge(payments.electricity.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between ${getStatusColor(payments.water.status)}`}>
                <span className="font-semibold">Water Bill</span>
                <span className="text-2xl">{getStatusBadge(payments.water.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rent Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Monthly Rent</h4>
              <DollarSign size={24} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-4">₱{payments.rent.amount.toLocaleString()}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.rent.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${getStatusColor(payments.rent.status)}`}>
                  {payments.rent.status.charAt(0).toUpperCase() + payments.rent.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.rent.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Electricity Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Electricity Bill</h4>
              <Zap size={24} className="text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-4">₱{payments.electricity.amount.toLocaleString()}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.electricity.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${getStatusColor(payments.electricity.status)}`}>
                  {payments.electricity.status.charAt(0).toUpperCase() + payments.electricity.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.electricity.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Water Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Water Bill</h4>
              <Droplet size={24} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-4">₱{payments.water.amount.toLocaleString()}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.water.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${getStatusColor(payments.water.status)}`}>
                  {payments.water.status.charAt(0).toUpperCase() + payments.water.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.water.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentDashboard;
