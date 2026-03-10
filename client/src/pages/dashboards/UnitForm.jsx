import React, { useState } from 'react';
import { Input, Alert } from '../../components/ui';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

const UnitForm = ({ propertyId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitType, setUnitType] = useState(null); // null, 'single', or 'multi'
  const [images, setImages] = useState([]);
  const [utilities, setUtilities] = useState(false);
  const [amenities, setAmenities] = useState('');
  const [formData, setFormData] = useState({
    // Single unit fields
    monthlyRent: '',
    capacity: '',
    // Multi unit fields
    unitName: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Create data URLs for preview
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (unitType === 'single') {
        // Single unit flow
        if (!formData.monthlyRent || !formData.capacity) {
          setError('Please fill in all required fields');
          return;
        }

        if (parseInt(formData.capacity) < 1) {
          setError('Capacity must be at least 1');
          return;
        }

        if (parseFloat(formData.monthlyRent) < 0) {
          setError('Monthly rent must be greater than or equal to 0');
          return;
        }

        const roomData = {
          propertyId,
          roomNumber: `single-unit-${Date.now()}`, // Unique identifier for single unit
          capacity: parseInt(formData.capacity),
          monthlyPrice: parseFloat(formData.monthlyRent),
          images: images,
          utilities: utilities,
          amenities: amenities.split(',').map(a => a.trim()).filter(a => a),
          description: amenities, // Store amenities as description for now
          occupancyType: 'Room for rent',
          type: 'single-unit', // Mark as single unit type
        };

        const response = await axios.post('/api/rooms', roomData);

        if (response.data.success || response.status === 201) {
          onSuccess();
        }
      } else if (unitType === 'multi') {
        // Multi unit flow
        if (!formData.unitName || !formData.description) {
          setError('Please fill in all required fields');
          return;
        }

        const roomData = {
          propertyId,
          roomNumber: formData.unitName,
          capacity: 0, // Will be calculated based on added rooms
          description: formData.description,
          images: images,
          monthlyPrice: 0,
          occupancyType: 'Room for rent',
          type: 'multi-unit', // Mark as multi unit type
        };

        const response = await axios.post('/api/rooms', roomData);

        if (response.data.success || response.status === 201) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-white">Add New Unit</h2>
            <p className="text-blue-100 text-sm mt-1">Choose single or multi-unit setup</p>
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

          {/* Unit Type Selection */}
          {!unitType ? (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">What type of unit would you like to add?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUnitType('single')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <h3 className="font-semibold text-gray-900">Single Unit</h3>
                  <p className="text-sm text-gray-600 mt-1">Complete unit with rent & amenities</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUnitType('multi')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                >
                  <div className="text-2xl mb-2">🏢</div>
                  <h3 className="font-semibold text-gray-900">Multi Unit</h3>
                  <p className="text-sm text-gray-600 mt-1">Multiple rooms with individual pricing</p>
                </button>
              </div>
            </div>
          ) : unitType === 'single' ? (
            // Single Unit Form
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Single Unit Details</h3>
                <button
                  type="button"
                  onClick={() => setUnitType(null)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Change type
                </button>
              </div>

              <Input
                label="Monthly Rent *"
                type="number"
                name="monthlyRent"
                placeholder="e.g., 5000"
                value={formData.monthlyRent}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />

              <Input
                label="Good for how many heads/persons *"
                type="number"
                name="capacity"
                placeholder="e.g., 1, 2, 3"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
              />

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="utilities"
                  checked={utilities}
                  onChange={(e) => setUtilities(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="utilities" className="flex-1 cursor-pointer">
                  <p className="font-medium text-gray-900">Utilities Included</p>
                  <p className="text-sm text-gray-600">Water, electricity, and other utilities</p>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Included Amenities</label>
                <textarea
                  name="amenities"
                  placeholder="e.g., WiFi, Kitchen, TV, Air Conditioning (comma-separated)"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          ) : (
            // Multi Unit Form
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Multi Unit Details</h3>
                <button
                  type="button"
                  onClick={() => setUnitType(null)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Change type
                </button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">The number of spaces will be automatically calculated based on how many individual rooms/spaces you add to this unit.</p>
              </div>

              <Input
                label="Unit Name *"
                type="text"
                name="unitName"
                placeholder="e.g., Room 101, Apartment A"
                value={formData.unitName}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the unit (amenities, features, etc.)"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          {unitType && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Maximum 5)
                </label>
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload images</span>
                    <span className="text-xs text-gray-500">{images.length} / 5 images selected</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={images.length >= 5}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            {unitType && (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? 'Creating...' : unitType === 'single' ? 'Create Unit' : 'Create Unit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
