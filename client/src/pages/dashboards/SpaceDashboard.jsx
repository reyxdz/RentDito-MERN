import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui';
import axios from 'axios';

const SpaceDashboard = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpaceDetails();
  }, [spaceId]);

  const fetchSpaceDetails = async () => {
    try {
      setLoading(true);
      const spaceRes = await axios.get(`/api/rooms/${spaceId}`);
      setSpace(spaceRes.data.data);
      // Fetch tenants for this space (room)
      const tenantsRes = await axios.get(`/api/leases/room/${spaceId}`);
      setTenants(tenantsRes.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load space details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
  const currentTenants = tenants.length;
  const expectedCapacity = space.capacity || 1;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">{space.roomName || space.roomNumber}</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>Monthly Rent</CardHeader>
          <CardContent className="text-2xl font-bold text-blue-700">₱{space.monthlyPrice}</CardContent>
        </Card>
        {utilitiesIncluded && (
          <Card>
            <CardHeader>Utility Bills</CardHeader>
            <CardContent className="text-blue-700">
              Included: {utilitiesTypes.join(', ') || 'None'}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>Tenants</CardHeader>
          <CardContent className="text-blue-700">
            <span className="text-2xl font-bold">{currentTenants}</span> / {expectedCapacity} expected
          </CardContent>
        </Card>
      </div>
      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Tenants</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rent Status</th>
                {utilitiesIncluded && (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Utility Bills Status</th>
                )}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lease End</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={utilitiesIncluded ? 4 : 3} className="text-center py-6 text-gray-400">No tenants</td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant._id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{tenant.tenant?.fullName || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={tenant.rentStatus} />
                    </td>
                    {utilitiesIncluded && (
                      <td className="px-4 py-2">
                        <StatusBadge status={tenant.utilityStatus} />
                      </td>
                    )}
                    <td className="px-4 py-2">{formatLeaseEnd(tenant.leaseEnd)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function StatusBadge({ status }) {
  let color = 'gray';
  if (status === 'paid') color = 'green';
  else if (status === 'pending') color = 'yellow';
  else if (status === 'late') color = 'red';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
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
