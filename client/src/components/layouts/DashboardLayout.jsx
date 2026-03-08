import React, { useState } from 'react';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Navigate } from 'react-router-dom';

export const DashboardLayout = ({ children, sidebarItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 fixed h-full z-40`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">RentDito</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {sidebarItems.map((item, idx) => (
            <Link
              key={`${item.label}-${idx}`}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-white'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-white text-sm font-bold">
                  {user.fullName.charAt(0)}
                </span>
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-xs font-semibold">{user.fullName}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 p-2 hover:bg-gray-700 rounded-lg text-xs">
              <Settings size={16} className="mx-auto" />
            </button>
            <button
              onClick={logout}
              className="flex-1 p-2 hover:bg-gray-700 rounded-lg text-xs"
            >
              <LogOut size={16} className="mx-auto" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back</p>
                <p className="font-semibold">{user.fullName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
