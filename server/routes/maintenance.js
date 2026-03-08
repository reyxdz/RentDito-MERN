const express = require('express');
const { body } = require('express-validator');
const {
  getAllRequests,
  createRequest,
  getRequest,
  updateRequest,
  assignRequest,
  completeRequest,
  deleteRequest,
  getRequestStats
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all requests
router.get('/', getAllRequests);

// Get request stats
router.get('/stats/overview', getRequestStats);

// Create request (tenant only)
router.post('/', authorize('tenant'), [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
], createRequest);

// Get specific request
router.get('/:id', getRequest);

// Update request (landlord/admin only)
router.put('/:id', authorize('landlord', 'landlord-admin'), updateRequest);

// Assign request (landlord/admin only)
router.post('/:id/assign', authorize('landlord', 'landlord-admin'), assignRequest);

// Complete request (landlord/admin only)
router.post('/:id/complete', authorize('landlord', 'landlord-admin'), completeRequest);

// Delete request (landlord/admin only)
router.delete('/:id', authorize('landlord', 'landlord-admin'), deleteRequest);

module.exports = router;
