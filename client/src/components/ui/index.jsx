import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900'
  };

  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-xl font-semibold transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-shadow hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input
        className={clsx(
          'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
          error ? 'border-red-500' : 'border-gray-300'
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={clsx('inline-block px-3 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};

export const Alert = ({ children, variant = 'info', className }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={clsx('p-4 rounded-lg border', variants[variant], className)}>
      {children}
    </div>
  );
};
