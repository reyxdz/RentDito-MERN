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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Profile */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl">
          <div className="flex items-start gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg border-4 border-white/20">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Tenant Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-white mb-2">{tenant.fullName}</h1>
              <p className="text-blue-200 text-lg mb-6">Active Tenant</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Move-in</p>
                  <p className="text-white text-lg font-bold">{new Date(tenant.moveInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Lease Ends</p>
                  <p className="text-white text-lg font-bold">{new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Room</p>
                  <p className="text-white text-lg font-bold">{room.roomNumber}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Monthly Rent</p>
                  <p className="text-white text-lg font-bold">₱{room.monthlyPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tenant Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl hover:border-white/30 transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Mail size={20} className="text-blue-400" />
              Contact Information
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Email</p>
                <p className="text-white font-medium break-all">{tenant.email}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Phone</p>
                <p className="text-white font-medium">{tenant.phone}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Address</p>
                <p className="text-white font-medium">{tenant.address}</p>
              </div>
            </div>
          </div>

          {/* Property & Room Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl hover:border-white/30 transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Home size={20} className="text-emerald-400" />
              Property Details
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Property Name</p>
                <p className="text-white font-medium text-lg">{property.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Code</p>
                <p className="text-emerald-400 font-bold">{property.code}</p>
              </div>
              <div className="pt-3 border-t border-white/20">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Address</p>
                <p className="text-white font-medium">{property.address}</p>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl hover:border-white/30 transition-all">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-amber-400" />
              Payment Status
            </h3>
            <div className="space-y-3">
              <div className={`px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-sm border ${payments.rent.status === 'paid' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}>
                <span className="font-semibold text-white">Rent</span>
                <span className="text-2xl">{getStatusBadge(payments.rent.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-sm border ${payments.electricity.status === 'paid' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}>
                <span className="font-semibold text-white">Electricity</span>
                <span className="text-2xl">{getStatusBadge(payments.electricity.status)}</span>
              </div>
              <div className={`px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-sm border ${payments.water.status === 'paid' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}>
                <span className="font-semibold text-white">Water</span>
                <span className="text-2xl">{getStatusBadge(payments.water.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rent Payment */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl border border-blue-500/30 p-6 shadow-lg hover:shadow-xl hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white">Monthly Rent</h4>
              <div className="bg-blue-500/30 p-3 rounded-xl group-hover:bg-blue-500/40 transition-all">
                <DollarSign size={24} className="text-blue-300" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-300 mb-6">₱{payments.rent.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Due Date:</span>
                <span className="font-semibold text-white">{new Date(payments.rent.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${payments.rent.status === 'paid' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : payments.rent.status === 'pending' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-red-500/30 text-red-300 border border-red-500/50'}`}>
                  {payments.rent.status.charAt(0).toUpperCase() + payments.rent.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-white/70">Last Paid:</span>
                <span className="font-semibold text-white">{new Date(payments.rent.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Electricity Payment */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-md rounded-2xl border border-yellow-500/30 p-6 shadow-lg hover:shadow-xl hover:border-yellow-500/50 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white">Electricity Bill</h4>
              <div className="bg-yellow-500/30 p-3 rounded-xl group-hover:bg-yellow-500/40 transition-all">
                <Zap size={24} className="text-yellow-300" />
              </div>
            </div>
            <p className="text-4xl font-bold text-yellow-300 mb-6">₱{payments.electricity.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Due Date:</span>
                <span className="font-semibold text-white">{new Date(payments.electricity.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${payments.electricity.status === 'paid' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : payments.electricity.status === 'pending' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-red-500/30 text-red-300 border border-red-500/50'}`}>
                  {payments.electricity.status.charAt(0).toUpperCase() + payments.electricity.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-white/70">Last Paid:</span>
                <span className="font-semibold text-white">{new Date(payments.electricity.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Water Payment */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-6 shadow-lg hover:shadow-xl hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white">Water Bill</h4>
              <div className="bg-cyan-500/30 p-3 rounded-xl group-hover:bg-cyan-500/40 transition-all">
                <Droplet size={24} className="text-cyan-300" />
              </div>
            </div>
            <p className="text-4xl font-bold text-cyan-300 mb-6">₱{payments.water.amount.toLocaleString()}</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Due Date:</span>
                <span className="font-semibold text-white">{new Date(payments.water.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Status:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-xs ${payments.water.status === 'paid' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : payments.water.status === 'pending' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-red-500/30 text-red-300 border border-red-500/50'}`}>
                  {payments.water.status.charAt(0).toUpperCase() + payments.water.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-white/70">Last Paid:</span>
                <span className="font-semibold text-white">{new Date(payments.water.lastPaidDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentDashboard;
