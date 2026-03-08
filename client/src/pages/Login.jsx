import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Button, Input, Alert } from '../components/ui';
import { Building2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="hidden lg:flex absolute top-0 left-0 w-full h-full">
        <div className="flex-1 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <Building2 size={40} />
            <h1 className="text-4xl font-bold">RentDito</h1>
          </div>
          <h2 className="text-5xl font-bold mb-4">Boarding House Management</h2>
          <p className="text-xl text-blue-100 mb-8">
            Manage properties, tenants, payments, and maintenance all in one place.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-lg">
              <span className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">✓</span>
              <span>Easy property management</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
              <span className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">✓</span>
              <span>Secure tenant records</span>
            </li>
            <li className="flex items-center space-x-3 text-lg">
              <span className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">✓</span>
              <span>Online payment processing</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-md z-10 lg:ml-auto lg:mr-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Building2 size={40} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your RentDito account</p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-4">Demo Credentials</p>
            <div className="space-y-2 text-xs bg-gray-50 p-4 rounded-lg">
              <p><strong>Landlord:</strong> landlord@demo.com / password123</p>
              <p><strong>Tenant:</strong> tenant@demo.com / password123</p>
              <p><strong>Admin:</strong> admin@demo.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
