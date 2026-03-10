const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'dormitory'],
    default: 'single'
  },
  occupancyType: {
    type: String,
    enum: ['Room for rent', 'House for rent', 'Apartment', 'Dormitory', 'Boarding House'],
    required: true
  },
  capacity: {
    type: Number,
    default: 1
  },
  monthlyPrice: {
    type: Number,
    required: true
  },
  description: String,
  images: [String],
  amenities: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
