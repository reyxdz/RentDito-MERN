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
    address: '',
    barangay: '',
    municipality: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.barangay || !formData.municipality || !formData.city) {
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
              placeholder="e.g., Naval Kawayan, Biliran"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Address *"
              type="text"
              name="address"
              placeholder="e.g., 123 Main Street"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Barangay *"
                type="text"
                name="barangay"
                placeholder="e.g., Kawayan"
                value={formData.barangay}
                onChange={handleChange}
                required
              />

              <Input
                label="Municipality *"
                type="text"
                name="municipality"
                placeholder="e.g., Naval"
                value={formData.municipality}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="City *"
              type="text"
              name="city"
              placeholder="e.g., Biliran"
              value={formData.city}
              onChange={handleChange}
              required
            />
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
