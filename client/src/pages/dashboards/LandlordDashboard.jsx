import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, Badge } from '../../components/ui';
import { Building2, Users, CreditCard, TrendingUp, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LandlordDashboard = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '#', icon: <Building2 size={20} /> },
    { label: 'Properties', path: '#', icon: <Building2 size={20} /> },
    { label: 'Tenants', path: '#', icon: <Users size={20} /> },
    { label: 'Payments', path: '#', icon: <CreditCard size={20} /> },
    { label: 'Staff', path: '#', icon: <Users size={20} /> },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 48000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 50000 },
    { month: 'Apr', revenue: 55000 },
    { month: 'May', revenue: 60000 },
    { month: 'Jun', revenue: 58000 },
  ];

  const occupancyData = [
    { name: 'Occupied', value: 24 },
    { name: 'Vacant', value: 6 },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h3>
            <p className="text-gray-600 mt-1">Manage properties, earnings, and tenants</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            <Plus size={20} />
            <span>Add Property</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Properties</p>
                <h4 className="text-3xl font-bold mt-2">4</h4>
                <p className="text-green-600 text-xs mt-1">↑ 2 this year</p>
              </div>
              <Building2 className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tenants</p>
                <h4 className="text-3xl font-bold mt-2">24</h4>
                <p className="text-green-600 text-xs mt-1">↑ 8 occupied</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Revenue</p>
                <h4 className="text-3xl font-bold mt-2">₱58,000</h4>
                <p className="text-green-600 text-xs mt-1">↑ 3.3% vs last month</p>
              </div>
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Occupancy Rate</p>
                <h4 className="text-3xl font-bold mt-2">80%</h4>
                <p className="text-blue-600 text-xs mt-1">30/30 rooms</p>
              </div>
              <CreditCard className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Monthly Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-6">Occupancy Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Properties Summary */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Properties Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Downtown Inn', rooms: 8, occupied: 7, revenue: '₱28,000' },
              { name: 'Westside Hub', rooms: 6, occupied: 5, revenue: '₱20,000' },
              { name: 'Central Plaza', rooms: 10, occupied: 8, revenue: '₱40,000' },
              { name: 'Riverside Suites', rooms: 6, occupied: 4, revenue: '₱16,000' },
            ].map((property) => (
              <div key={property.name} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms</span>
                    <Badge>{property.occupied}/{property.rooms}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold">{property.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(property.occupied / property.rooms) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tenants */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Recent Tenant Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold">Tenant</th>
                  <th className="text-left p-3 text-sm font-semibold">Property</th>
                  <th className="text-left p-3 text-sm font-semibold">Room</th>
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Lease Ends</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', property: 'Downtown Inn', room: '201', status: 'Active', ends: 'Dec 2024' },
                  { name: 'Jane Smith', property: 'Westside Hub', room: '103', status: 'Active', ends: 'Aug 2024' },
                  { name: 'Mike Johnson', property: 'Central Plaza', room: '305', status: 'Active', ends: 'Oct 2024' },
                  { name: 'Sarah Williams', property: 'Downtown Inn', room: '215', status: 'Ending Soon', ends: 'Apr 2024' },
                ].map((tenant, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3">{tenant.name}</td>
                    <td className="p-3">{tenant.property}</td>
                    <td className="p-3">{tenant.room}</td>
                    <td className="p-3">
                      <Badge variant={tenant.status === 'Active' ? 'success' : 'warning'}>
                        {tenant.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600">{tenant.ends}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LandlordDashboard;
