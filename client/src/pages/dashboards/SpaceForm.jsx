import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import axios from 'axios';

const SpaceForm = ({ propertyId, parentUnitId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    spaceName: '',
    type: 'single',
    occupancyType: 'Room for rent',
    capacity: 1,
    monthlyPrice: 0,
    description: '',
    utilities: false,
    amenities: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const spaceTypes = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'dormitory', label: 'Dormitory' },
  ];

  const occupancyTypes = [
    { value: 'Room for rent', label: 'Room for rent' },
    { value: 'House for rent', label: 'House for rent' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Dormitory', label: 'Dormitory' },
    { value: 'Boarding House', label: 'Boarding House' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setError(null);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];
    for (const file of formData.images) {
      if (typeof file === 'string') {
        uploadedUrls.push(file);
        continue;
      }
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', 'rentdito_preset');

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/rentdito/image/upload', formDataUpload);
        uploadedUrls.push(response.data.secure_url);
      } catch (err) {
        console.error('Error uploading image:', err);
        throw new Error('Failed to upload images');
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.spaceName.trim()) {
        setError('Space name is required');
        return;
      }

      if (formData.monthlyPrice < 0) {
        setError('Monthly price cannot be negative');
        return;
      }

      setLoading(true);

      // Upload images if any
      let imageUrls = [];
      if (formData.images.length > 0) {
        imageUrls = await uploadImagesToCloudinary();
      }

      // Parse amenities
      const amenitiesArray = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // Create room (space)
      const response = await axios.post('/api/rooms', {
        propertyId,
        roomNumber: formData.spaceName,
        type: formData.type,
        occupancyType: formData.occupancyType,
        capacity: formData.capacity,
        monthlyPrice: formData.monthlyPrice,
        description: formData.description,
        utilities: formData.utilities,
        amenities: amenitiesArray,
        images: imageUrls,
        parentUnitId: parentUnitId,
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create space');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Space</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Space Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Space Name *
            </label>
            <input
              type="text"
              name="spaceName"
              value={formData.spaceName}
              onChange={handleInputChange}
              placeholder="e.g., Room 101, Studio A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Type, Capacity, and Occupancy Type */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Space Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {spaceTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity (Person/s) *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Occupancy Type *
              </label>
              <select
                name="occupancyType"
                value={formData.occupancyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {occupancyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Price and Utilities */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Rent *
              </label>
              <input
                type="number"
                name="monthlyPrice"
                value={formData.monthlyPrice}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="utilities"
                  checked={formData.utilities}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Utilities Included</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this space..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amenities (comma-separated)
            </label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              placeholder="e.g., WiFi, AC, Refrigerator, Bed, Desk"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photos (Maximum 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 5 files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              {loading ? 'Creating...' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceForm;
