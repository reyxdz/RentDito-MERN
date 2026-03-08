const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['platform-admin', 'landlord', 'landlord-admin', 'tenant'],
    required: [true, 'Please provide a role']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Landlord specific
  landlordDetails: {
    businessName: String,
    registrationNumber: String,
    taxId: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankCode: String
    },
    totalProperties: {
      type: Number,
      default: 0
    }
  },
  
  // Landlord Admin specific
  adminDetails: {
    landlordId: mongoose.Schema.Types.ObjectId,
    assignedProperties: [mongoose.Schema.Types.ObjectId],
    permissions: {
      manageProperties: { type: Boolean, default: true },
      manageTenants: { type: Boolean, default: true },
      collectPayments: { type: Boolean, default: true },
      handleMaintenance: { type: Boolean, default: true },
      generateReports: { type: Boolean, default: false },
      manageDocuments: { type: Boolean, default: true }
    }
  },
  
  // Tenant specific
  tenantDetails: {
    idType: String,
    idNumber: String,
    currentLeases: [mongoose.Schema.Types.ObjectId],
    occupancyStatus: {
      type: String,
      enum: ['active', 'inactive', 'evicted'],
      default: 'inactive'
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }]
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get JWT token
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);
