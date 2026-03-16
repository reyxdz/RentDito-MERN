import React, { useState } from 'react';
import { Input, Alert } from '../../components/ui';
import { X } from 'lucide-react';
import axios from 'axios';

// Property Form - v2
const PropertyForm = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    address: '',
    barangay: '',
    municipality: '',
    city: '',
    utilitiesIncluded: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.name || !formData.code || !formData.type || !formData.barangay || !formData.municipality || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/properties', formData);
      
      if (response.data.success || response.status === 201) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed -top-10 left-0 w-screen h-[110vh] bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col -mt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white">Add New Property</h2>
            <p className="text-blue-100 text-sm mt-1">Set the location for your units</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 overflow-y-auto flex-1">
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          {/* Property Information */}
          <div className="space-y-4">
            <Input
              label="Property Name *"
              type="text"
              name="name"
              placeholder="e.g., White Dorm"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Property Code *"
              type="text"
              name="code"
              placeholder="e.g., BH 3"
              value={formData.code}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
              >
                <option value="" disabled>Select property type</option>
                <option value="Boarding House">Boarding House</option>
                <option value="Apartment">Apartment</option>
                <option value="Dormitory">Dormitory</option>
                <option value="Condo">Condo</option>
                <option value="House for Rent">House for Rent</option>
                <option value="Room for Rent">Room for Rent</option>
              </select>
            </div>

            <Input
              label="Street"
              type="text"
              name="address"
              placeholder="e.g., Sikatuna Street"
              value={formData.address}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Barangay *"
                type="text"
                name="barangay"
                placeholder="e.g., Zapatera"
                value={formData.barangay}
                onChange={handleChange}
                required
              />

              <Input
                label="Municipality *"
                type="text"
                name="municipality"
                placeholder="e.g., Cebu City"
                value={formData.municipality}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Province *"
              type="text"
              name="city"
              placeholder="e.g., Cebu"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* Utilities */}
          <div className="flex items-center gap-3 py-2">
            <div className="relative">
              <input
                type="checkbox"
                id="utilitiesIncluded"
                name="utilitiesIncluded"
                checked={formData.utilitiesIncluded}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                onClick={() =>
                  setFormData({ ...formData, utilitiesIncluded: !formData.utilitiesIncluded })
                }
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 flex items-center ${
                  formData.utilitiesIncluded ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ml-0.5 ${
                    formData.utilitiesIncluded ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <label
              htmlFor="utilitiesIncluded"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              onClick={() =>
                setFormData({ ...formData, utilitiesIncluded: !formData.utilitiesIncluded })
              }
            >
              Utilities Included
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                formData.utilitiesIncluded
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {formData.utilitiesIncluded ? 'Yes' : 'No'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
