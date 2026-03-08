const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide property name'],
    trim: true
  },
  description: String,
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: String,
  postalCode: String,
  country: String,
  contact: {
    phone: String,
    email: String
  },
  images: [String],
  amenities: [String],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  totalRooms: {
    type: Number,
    default: 0
  },
  occupiedRooms: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  managedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);
