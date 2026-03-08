import React, { useState } from 'react';
import { Button, Input, Alert } from '../../components/ui';
import { X, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';

const PropertyForm = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    description: '',
    utilitiesIncluded: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - images.length;
    
    if (files.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image(s). Maximum is 5.`);
      return;
    }

    // Convert images to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          file: file.name,
          data: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const propertyData = {
        ...formData,
        images: images.map(img => img.data)
      };

      const response = await axios.post('/api/properties', propertyData);
      
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 pb-7 flex items-center justify-between flex-shrink-0 relative z-10" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 -2px 0 rgba(255, 255, 255, 0.1)'}}>
          <div>
            <h2 className="text-3xl font-bold text-white">Add New Property</h2>
            <p className="text-blue-100 text-sm mt-1">Fill in the details about your boarding house</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-8 overflow-y-auto flex-1 relative z-0">
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          {/* Basic Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <Input
              label="Property Title *"
              type="text"
              name="name"
              placeholder="e.g., Downtown Boarding House"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Address *"
                type="text"
                name="address"
                placeholder="e.g., 123 Main St"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <Input
                label="City *"
                type="text"
                name="city"
                placeholder="e.g., Manila"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="State/Province"
                type="text"
                name="state"
                placeholder="e.g., NCR"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your property, amenities, and what makes it special..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                rows={4}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">Property Images</h3>
            </div>
            <p className="text-sm text-gray-600 ml-4">
              Upload up to 5 images <span className="font-semibold text-blue-600">({images.length}/5)</span>
            </p>

            {images.length < 5 && (
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="inline-block p-3 bg-blue-100 rounded-xl mb-3">
                    <Upload className="text-blue-600" size={32} />
                  </div>
                  <p className="text-gray-900 font-semibold">Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB each</p>
                </label>
              </div>
            )}

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.data}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 truncate font-medium">{image.file}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Utilities */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">Utilities & Amenities</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="utilitiesIncluded"
                  checked={formData.utilitiesIncluded}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-gray-900 font-semibold block">Include utilities in rent</span>
                  <span className="text-sm text-gray-600">
                    {formData.utilitiesIncluded
                      ? 'Electricity, water, and internet are covered'
                      : 'Tenants pay for their own utilities'}
                  </span>
                </div>
              </label>
            </div>
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
              {loading ? 'Creating...' : '✨ Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
