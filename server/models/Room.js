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
  utilities: {
    included: {
      type: Boolean,
      default: false
    },
    types: {
      type: [String], // e.g., ['electricity', 'water']
      enum: ['electricity', 'water'],
      default: []
    },
    electricity: {
      common: {
        type: Boolean,
        default: false
      },
      ownSubmeter: {
        type: Boolean,
        default: false
      }
    },
    water: {
      common: {
        type: Boolean,
        default: false
      },
      ownSubmeter: {
        type: Boolean,
        default: false
      }
    }
  },
  parentUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
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
