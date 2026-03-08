import React from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, Badge } from '../../components/ui';
import { Home, CreditCard, Wrench, FileText, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TenantDashboard = () => {
  const sidebarItems = [
    { label: 'Dashboard', path: '#', icon: <Home size={20} /> },
    { label: 'My Lease', path: '#', icon: <FileText size={20} /> },
    { label: 'Payments', path: '#', icon: <CreditCard size={20} /> },
    { label: 'Maintenance', path: '#', icon: <Wrench size={20} /> },
    { label: 'Messages', path: '#', icon: <MessageSquare size={20} /> },
  ];

  // Sample data
  const paymentData = [
    { month: 'Jan', paid: 4000, due: 4000 },
    { month: 'Feb', paid: 3000, due: 4000 },
    { month: 'Mar', paid: 4000, due: 4000 },
    { month: 'Apr', paid: 0, due: 4000 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h3>
          <p className="text-gray-600 mt-1">Manage your lease, payments, and maintenance requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Current Lease</p>
                <h4 className="text-2xl font-bold mt-2">Room 201</h4>
                <p className="text-gray-500 text-xs mt-1">Active</p>
              </div>
              <Home className="text-blue-600" size={24} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Rent</p>
                <h4 className="text-2xl font-bold mt-2">₱4,000</h4>
                <p className="text-gray-500 text-xs mt-1">Due on 1st</p>
              </div>
              <CreditCard className="text-green-600" size={24} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Requests</p>
                <h4 className="text-2xl font-bold mt-2">2</h4>
                <p className="text-gray-500 text-xs mt-1">Maintenance</p>
              </div>
              <Wrench className="text-orange-600" size={24} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Payment Status</p>
                <h4 className="text-2xl font-bold mt-2">Paid</h4>
                <p className="text-gray-500 text-xs mt-1">This month</p>
              </div>
              <Badge variant="success" className="mt-2">On Time</Badge>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment History Chart */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Payment History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill="#10B981" name="Paid" />
                <Bar dataKey="due" fill="#EF4444" name="Due" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                Pay Rent
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors">
                Request Maintenance
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors">
                Message Landlord
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors">
                View Documents
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Payment Received</p>
                <p className="text-gray-600 text-sm">Your rent payment of ₱4,000 has been received</p>
                <p className="text-gray-500 text-xs mt-1">3 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 pb-4 border-b">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Maintenance Request Updated</p>
                <p className="text-gray-600 text-sm">Your AC repair request has been assigned</p>
                <p className="text-gray-500 text-xs mt-1">1 week ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New Message</p>
                <p className="text-gray-600 text-sm">Landlord sent you a message about lease renewal</p>
                <p className="text-gray-500 text-xs mt-1">2 weeks ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
