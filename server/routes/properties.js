const express = require('express');
const { body } = require('express-validator');
const {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats
} = require('../controllers/propertyController');
const { protect, authorize, checkPropertyAccess } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all properties (filtered by user role)
router.get('/', getAllProperties);

// Create property (landlord only)
router.post('/', authorize('landlord'), [
  body('name').notEmpty().withMessage('Property name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required')
], createProperty);

// Get specific property
router.get('/:id', getProperty);

// Get property stats
router.get('/:id/stats', getPropertyStats);

// Update property (landlord/admin only)
router.put('/:id', authorize('landlord', 'landlord-admin'), checkPropertyAccess, updateProperty);

// Delete property (landlord only)
router.delete('/:id', authorize('landlord'), deleteProperty);

module.exports = router;
