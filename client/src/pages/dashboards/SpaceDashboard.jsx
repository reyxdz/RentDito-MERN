import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Eye } from 'lucide-react';
import axios from 'axios';

const SpaceDashboard = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  // Hardcoded tenants for demo
  const [tenants, setTenants] = useState([
    {
      _id: '1',
      tenant: { fullName: 'Juan Dela Cruz' },
      rentStatus: 'paid',
      utilityStatus: 'pending',
      leaseEnd: '2026-12-31',
    },
    {
      _id: '2',
      tenant: { fullName: 'Maria Santos' },
      rentStatus: 'late',
      utilityStatus: 'paid',
      leaseEnd: '2027-03-31',
    },
    {
      _id: '3',
      tenant: { fullName: 'Pedro Reyes' },
      rentStatus: 'pending',
      utilityStatus: 'late',
      leaseEnd: '2026-08-31',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Demo: hardcoded space for now
    setLoading(true);
    setTimeout(() => {
      setSpace({
        roomName: 'Room 69',
        roomNumber: 'Room 69',
        monthlyPrice: 6900,
        capacity: 4,
        utilities: {
          included: false,
          types: [],
          electricity: {
            common: true,
            ownSubmeter: false,
          },
          water: {
            common: false,
            ownSubmeter: true,
          },
        },
      });
      setLoading(false);
    }, 300);
  }, [spaceId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }
  if (!space) {
    return <div className="text-gray-600 text-center py-8">Space not found</div>;
  }

  // Utility logic
  const utilitiesIncluded = space.utilities && space.utilities.included;
  const utilitiesTypes = (space.utilities && space.utilities.types) || [];
  // Demo: random utility bill amount
  const utilityBillAmount = utilitiesIncluded ? (Math.floor(Math.random() * 2000) + 500) : 0;
  const currentTenants = tenants.length;
  const expectedCapacity = space.capacity || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{space.roomName || space.roomNumber}</h1>
            <p className="text-gray-500 mt-1 text-sm">Space overview and tenant management</p>
          </div>
          <button
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            onClick={() => navigate(-1)}
          >
            <span className="mr-2">←</span> Back
          </button>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Monthly Rent Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Monthly Rent</p>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ₱{space.monthlyPrice.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Per month</p>
            </div>
          </div>

          {/* Electricity Bill Card */}
          {!utilitiesIncluded && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Electricity Bill</p>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                    <Eye size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <Edit size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Common</p>
                  <span className="text-xl font-bold text-yellow-600">
                    {space.utilities?.electricity?.common ? '✓' : '−'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Own Submeter</p>
                  <span className="text-xl font-bold text-yellow-600">
                    {space.utilities?.electricity?.ownSubmeter ? '✓' : '−'}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Tenant pays separately</p>
              </div>
            </div>
          )}

          {/* Water Bill Card */}
          {!utilitiesIncluded && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Water Bill</p>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                    <Eye size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <Edit size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Common</p>
                  <span className="text-xl font-bold text-blue-600">
                    {space.utilities?.water?.common ? '✓' : '−'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Own Submeter</p>
                  <span className="text-xl font-bold text-blue-600">
                    {space.utilities?.water?.ownSubmeter ? '✓' : '−'}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Tenant pays separately</p>
              </div>
            </div>
          )}

          {/* Occupancy Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Occupancy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{currentTenants}</span>
              <span className="text-lg text-gray-400">/ {expectedCapacity}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTenants / expectedCapacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{Math.round((currentTenants / expectedCapacity) * 100)}% occupied</p>
            </div>
          </div>
        </div>

        {/* Tenants Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Tenant Details</h3>
            <p className="text-sm text-gray-500 mt-1">Current occupants and their payment status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rent Status</th>
                  {utilitiesIncluded && (
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utility Status</th>
                  )}
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lease End</th>
                </tr>
              </thead>
              <tbody>
                {tenants.length === 0 ? (
                  <tr>
                    <td colSpan={utilitiesIncluded ? 4 : 3} className="text-center py-12 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl opacity-30">🏢</span>
                        <span>No tenants yet</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tenants.map((tenant, idx) => (
                    <tr key={tenant._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150`}>
                      <td className="px-8 py-5 font-semibold text-gray-900">{tenant.tenant?.fullName || 'N/A'}</td>
                      <td className="px-8 py-5">
                        <StatusBadge status={tenant.rentStatus} />
                      </td>
                      {utilitiesIncluded && (
                        <td className="px-8 py-5">
                          <StatusBadge status={tenant.utilityStatus} />
                        </td>
                      )}
                      <td className="px-8 py-5 text-gray-600 font-medium">{formatLeaseEnd(tenant.leaseEnd)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusBadge({ status }) {
  const statusConfig = {
    paid: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    late: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
    </span>
  );
}

function formatLeaseEnd(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

export default SpaceDashboard;
