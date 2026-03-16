import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Button, Input, Alert } from '../components/ui';
import { Building2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, loading, error, clearError } = useAuthStore();
  const selectedRole = searchParams.get('role') || 'tenant';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole,
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please provide a valid email';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password,
      formData.role,
      formData.phone
    );

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Building2 size={40} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join RentDito today</p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={validationErrors.fullName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email}
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Role badge — pre-selected from the previous page */}
            <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                Registering as:
              </span>
              <span className="text-sm font-semibold text-blue-900 capitalize">{formData.role}</span>
              <Link
                to="/register-type"
                className="ml-auto text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Change
              </Link>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              error={validationErrors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              error={validationErrors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
