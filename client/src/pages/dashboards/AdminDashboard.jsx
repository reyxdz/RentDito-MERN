import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, Badge } from '../../components/ui';
import { Home, Users, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '#', icon: <Home size={20} /> },
    { label: 'Tenants', path: '#', icon: <Users size={20} /> },
    { label: 'Payments', path: '#', icon: <DollarSign size={20} /> },
    { label: 'Maintenance', path: '#', icon: <AlertCircle size={20} /> },
    { label: 'Reports', path: '#', icon: <CheckCircle size={20} /> },
  ];

  const paymentData = [
    { week: 'Week 1', collected: 12000, pending: 4000 },
    { week: 'Week 2', collected: 14000, pending: 2000 },
    { week: 'Week 3', collected: 13000, pending: 3000 },
    { week: 'Week 4', collected: 15000, pending: 1000 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Property Management Dashboard</h3>
          <p className="text-gray-600 mt-1">Manage day-to-day operations for assigned properties</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tenants</p>
                <h4 className="text-3xl font-bold mt-2">12</h4>
                <p className="text-gray-500 text-xs mt-1">In 2 properties</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Due Payments</p>
                <h4 className="text-3xl font-bold mt-2">₱8,000</h4>
                <p className="text-red-600 text-xs mt-1">From 2 tenants</p>
              </div>
              <DollarSign className="text-red-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
                <h4 className="text-3xl font-bold mt-2">5</h4>
                <p className="text-orange-600 text-xs mt-1">Maintenance tasks</p>
              </div>
              <AlertCircle className="text-orange-600" size={32} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <h4 className="text-3xl font-bold mt-2">₱48,000</h4>
                <p className="text-green-600 text-xs mt-1">Collected so far</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Collection Chart */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Weekly Payment Collection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10B981" name="Collected" />
                <Bar dataKey="pending" fill="#FBBF24" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                Send Payment Reminder
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
                Create Maintenance
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
                View Tenants
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
                Generate Report
              </button>
            </div>
          </Card>
        </div>

        {/* Overdue Payments */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Overdue Payments</h3>
          <div className="space-y-3">
            {[
              { tenant: 'John Doe', room: '201', amount: '₱4,000', daysOverdue: 5 },
              { tenant: 'Jane Smith', room: '103', amount: '₱4,000', daysOverdue: 2 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-semibold text-gray-900">{item.tenant} - {item.room}</p>
                  <p className="text-red-600 text-sm">{item.daysOverdue} days overdue</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{item.amount}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-1">
                    Send Reminder →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Maintenance */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Pending Maintenance Requests</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="w-3 h-3 bg-red-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">AC Not Working - Room 201</p>
                    <p className="text-gray-600 text-sm">Reported by John Doe</p>
                  </div>
                  <Badge variant="danger">Urgent</Badge>
                </div>
                <p className="text-gray-500 text-xs mt-2">Submitted 2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="w-3 h-3 bg-orange-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Water Leak - Bathroom 103</p>
                    <p className="text-gray-600 text-sm">Reported by Jane Smith</p>
                  </div>
                  <Badge variant="warning">High</Badge>
                </div>
                <p className="text-gray-500 text-xs mt-2">Submitted 1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-yellow-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Door Lock Repair - Room 305</p>
                    <p className="text-gray-600 text-sm">Reported by Mike Johnson</p>
                  </div>
                  <Badge variant="warning">Medium</Badge>
                </div>
                <p className="text-gray-500 text-xs mt-2">Submitted 3 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
