import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, Badge } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Building2, CreditCard, AlertTriangle } from 'lucide-react';

const PlatformAdminDashboard = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '#', icon: <TrendingUp size={20} /> },
    { label: 'Users', path: '#', icon: <Users size={20} /> },
    { label: 'Properties', path: '#', icon: <Building2 size={20} /> },
    { label: 'Payments', path: '#', icon: <CreditCard size={20} /> },
    { label: 'Disputes', path: '#', icon: <AlertTriangle size={20} /> },
  ];

  const systemData = [
    { date: 'Mon', users: 120, transactions: 45 },
    { date: 'Tue', users: 145, transactions: 52 },
    { date: 'Wed', users: 165, transactions: 68 },
    { date: 'Thu', users: 190, transactions: 75 },
    { date: 'Fri', users: 220, transactions: 89 },
    { date: 'Sat', users: 210, transactions: 72 },
    { date: 'Sun', users: 180, transactions: 58 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 145000 },
    { month: 'Mar', revenue: 165000 },
    { month: 'Apr', revenue: 190000 },
    { month: 'May', revenue: 220000 },
    { month: 'Jun', revenue: 250000 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Platform Admin Dashboard</h3>
          <p className="text-gray-600 mt-1">System-wide analytics and user management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <h4 className="text-3xl font-bold mt-2">1,245</h4>
                <p className="text-green-600 text-xs mt-1">↑ 12.5% this month</p>
              </div>
              <Users className="text-blue-600" size={28} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Landlords</p>
                <h4 className="text-3xl font-bold mt-2">156</h4>
                <p className="text-green-600 text-xs mt-1">↑ 8 new this week</p>
              </div>
              <Building2 className="text-green-600" size={28} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Properties</p>
                <h4 className="text-3xl font-bold mt-2">542</h4>
                <p className="text-green-600 text-xs mt-1">↑ New properties</p>
              </div>
              <Building2 className="text-purple-600" size={28} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <h4 className="text-3xl font-bold mt-2">₱250K</h4>
                <p className="text-green-600 text-xs mt-1">↑ This month</p>
              </div>
              <CreditCard className="text-yellow-600" size={28} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Disputes</p>
                <h4 className="text-3xl font-bold mt-2">12</h4>
                <p className="text-orange-600 text-xs mt-1">Pending resolution</p>
              </div>
              <AlertTriangle className="text-red-600" size={28} />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={systemData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                <Bar dataKey="transactions" fill="#10B981" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-6">Revenue Growth</h3>
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
        </div>

        {/* User Management */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Recent User Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-left p-3 text-sm font-semibold">Email</th>
                  <th className="text-left p-3 text-sm font-semibold">Role</th>
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Joined</th>
                  <th className="text-left p-3 text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Juan dela Cruz', email: 'juan@example.com', role: 'Landlord', status: 'Verified', joined: '2 hours ago' },
                  { name: 'Maria Santos', email: 'maria@example.com', role: 'Tenant', status: 'Verified', joined: '4 hours ago' },
                  { name: 'Pedro Reyes', email: 'pedro@example.com', role: 'Landlord', status: 'Pending', joined: '1 day ago' },
                  { name: 'Ana Lopez', email: 'ana@example.com', role: 'Landlord Admin', status: 'Verified', joined: '2 days ago' },
                  { name: 'Carlos Torres', email: 'carlos@example.com', role: 'Tenant', status: 'Verified', joined: '3 days ago' },
                ].map((user, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <Badge variant={user.status === 'Verified' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600 text-sm">{user.joined}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Disputes */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Pending Disputes</h3>
          <div className="space-y-4">
            {[
              { id: 'D001', complainant: 'John Doe', defendant: 'Downtown Inn', type: 'Payment', filed: '3 days ago' },
              { id: 'D002', complainant: 'Maria Santos', defendant: 'Westside Hub', type: 'Property Condition', filed: '5 days ago' },
              { id: 'D003', complainant: 'Pedro Reyes', defendant: 'Central Plaza', type: 'Lease Violation', filed: '1 week ago' },
            ].map((dispute, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{dispute.id} - {dispute.complainant} vs {dispute.defendant}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="warning">{dispute.type}</Badge>
                    <p className="text-gray-500 text-xs">Filed {dispute.filed}</p>
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { metric: 'API Uptime', value: '99.99%', status: 'excellent' },
              { metric: 'Avg Response Time', value: '145ms', status: 'excellent' },
              { metric: 'Database Status', value: 'Healthy', status: 'excellent' },
              { metric: 'Last Backup', value: '2 hours ago', status: 'excellent' },
            ].map((item, idx) => (
              <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm">{item.metric}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{item.value}</p>
                <p className="text-green-600 text-xs mt-1">✓ All systems operational</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlatformAdminDashboard;
