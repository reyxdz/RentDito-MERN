import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Home, DollarSign, Zap, Droplet, User, X } from 'lucide-react';

const TenantPaymentDashboard = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentHistoryModal, setPaymentHistoryModal] = useState({ show: false, type: null });

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

  const generatePaymentHistory = (type = 'rent') => {
    const history = [];
    const moveInDate = new Date(tenant.moveInDate);
    const currentDate = new Date();
    
    let current = new Date(moveInDate.getFullYear(), moveInDate.getMonth(), 1);
    
    while (current <= currentDate) {
      const monthName = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Generate demo payment statuses with weighted distribution
      const rand = Math.random();
      let status;
      if (rand < 0.6) {
        status = 'paid';
      } else if (rand < 0.9) {
        status = 'pending';
      } else {
        status = 'late';
      }

      history.push({
        month: monthName,
        status: status,
      });

      current.setMonth(current.getMonth() + 1);
    }
    
    return history;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'late':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
          
          <div className="flex items-start gap-8 relative z-10">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border border-blue-100">
                <User size={64} className="text-white" />
              </div>
            </div>

            {/* Tenant Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{tenant.fullName}</h1>
              <p className="text-gray-500 text-lg mb-6">Active Tenant</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Move-in</p>
                  <p className="text-gray-900 font-bold text-lg">{new Date(tenant.moveInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Lease Ends</p>
                  <p className="text-gray-900 font-bold text-lg">{new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Room</p>
                  <p className="text-gray-900 font-bold text-lg">{room.roomNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Monthly Rent</p>
                  <p className="text-blue-600 font-bold text-lg">₱{room.monthlyPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Email</p>
                <p className="text-gray-900 font-medium break-all">{tenant.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Phone</p>
                <p className="text-gray-900 font-medium">{tenant.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Address</p>
                <p className="text-gray-900 font-medium">{tenant.address}</p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home size={20} className="text-blue-600" />
              Property Details
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Property Name</p>
                <p className="text-gray-900 font-medium text-lg">{property.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Code</p>
                <p className="text-blue-600 font-bold">{property.code}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Address</p>
                <p className="text-gray-900 font-medium">{property.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Status Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              Payment Status
            </h3>
            <div className="space-y-3">
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-sm ${getStatusColor(payments.rent.status)}`}>
                <span>Rent</span>
                <span>{getStatusBadge(payments.rent.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-sm ${getStatusColor(payments.electricity.status)}`}>
                <span>Electricity</span>
                <span>{getStatusBadge(payments.electricity.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-sm ${getStatusColor(payments.water.status)}`}>
                <span>Water</span>
                <span>{getStatusBadge(payments.water.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Rent */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">Monthly Rent</h4>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-6">₱{payments.rent.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.rent.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-lg text-xs ${getStatusColor(payments.rent.status)}`}>
                  {payments.rent.status.charAt(0).toUpperCase() + payments.rent.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.rent.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => setPaymentHistoryModal({ show: true, type: 'rent' })}
              className="mt-6 w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-colors duration-200 text-sm"
            >
              View Payment History
            </button>
          </div>

          {/* Electricity Bill */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">Electricity Bill</h4>
              <div className="bg-amber-50 p-3 rounded-lg">
                <Zap size={24} className="text-amber-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-amber-600 mb-6">₱{payments.electricity.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.electricity.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-lg text-xs ${getStatusColor(payments.electricity.status)}`}>
                  {payments.electricity.status.charAt(0).toUpperCase() + payments.electricity.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.electricity.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => setPaymentHistoryModal({ show: true, type: 'electricity' })}
              className="mt-6 w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 text-amber-600 font-semibold rounded-lg transition-colors duration-200 text-sm"
            >
              View Payment History
            </button>
          </div>

          {/* Water Bill */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">Water Bill</h4>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <Droplet size={24} className="text-cyan-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-cyan-600 mb-6">₱{payments.water.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.water.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-lg text-xs ${getStatusColor(payments.water.status)}`}>
                  {payments.water.status.charAt(0).toUpperCase() + payments.water.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-600">Last Paid:</span>
                <span className="font-semibold text-gray-900">{new Date(payments.water.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => setPaymentHistoryModal({ show: true, type: 'water' })}
              className="mt-6 w-full py-2 px-4 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 font-semibold rounded-lg transition-colors duration-200 text-sm"
            >
              View Payment History
            </button>
          </div>
        </div>

        {/* Payment History Modal */}
        {paymentHistoryModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {paymentHistoryModal.type === 'rent' && 'Monthly Rent'}
                    {paymentHistoryModal.type === 'electricity' && 'Electricity Bill'}
                    {paymentHistoryModal.type === 'water' && 'Water Bill'}
                    {' '} Payment History
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">From {new Date(tenant.moveInDate).toLocaleDateString()} to present</p>
                </div>
                <button
                  onClick={() => setPaymentHistoryModal({ show: false, type: null })}
                  className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="space-y-3">
                  {generatePaymentHistory(paymentHistoryModal.type).reverse().map((payment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{payment.month}</p>
                        </div>
                      </div>
                      <span className={`font-semibold px-4 py-2 rounded-lg text-sm ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
};

export default TenantPaymentDashboard;
