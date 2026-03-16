import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Home, User } from 'lucide-react';

const RegisterType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      {/* Background branding panel (desktop) */}
      <div className="hidden lg:flex absolute top-0 left-0 w-full h-full">
        <div className="flex-1 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <Building2 size={40} />
            <h1 className="text-4xl font-bold">RentDito</h1>
          </div>
          <h2 className="text-5xl font-bold mb-4">Join RentDito Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Whether you're renting a place or managing one, we've got you covered.
          </p>
          <ul className="space-y-4">
            {['Easy property management', 'Secure tenant records', 'Online payment processing'].map((item) => (
              <li key={item} className="flex items-center space-x-3 text-lg">
                <span className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md z-10 lg:ml-auto lg:mr-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Building2 size={40} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">How will you be using RentDito?</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Tenant */}
            <button
              onClick={() => navigate('/register?role=tenant')}
              className="w-full flex items-center gap-5 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-left"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User size={28} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">I'm a Tenant</p>
                <p className="text-sm text-gray-500">Looking for a place to rent or managing my stay</p>
              </div>
            </button>

            {/* Landlord */}
            <button
              onClick={() => navigate('/register?role=landlord')}
              className="w-full flex items-center gap-5 p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-left"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Home size={28} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">I'm a Landlord</p>
                <p className="text-sm text-gray-500">I own or manage properties and boarding houses</p>
              </div>
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
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

export default RegisterType;
