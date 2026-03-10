const express = require('express');
const { body } = require('express-validator');
const {
  getAllRooms,
  getRoomsByProperty,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  searchAvailableRooms,
  assignTenant,
  unassignTenant
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route - search available rooms
router.get('/search/available', searchAvailableRooms);

// All other routes require authentication
router.use(protect);

// Get all rooms (with optional query parameters like parentUnitId)
router.get('/', getAllRooms);

// Get rooms by property
router.get('/property/:propertyId', getRoomsByProperty);

// Create room (landlord/admin only)
router.post('/', authorize('landlord', 'landlord-admin'), [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('monthlyPrice').isNumeric().withMessage('Monthly price must be a number')
], createRoom);

// Get specific room (MUST be after more specific routes)
router.get('/:id', getRoom);

// Update room (landlord/admin only)
router.put('/:id', authorize('landlord', 'landlord-admin'), updateRoom);

// Delete room (landlord/admin only)
router.delete('/:id', authorize('landlord', 'landlord-admin'), deleteRoom);

// Assign tenant to room (landlord/admin only)
router.post('/:id/assign-tenant', authorize('landlord', 'landlord-admin'), assignTenant);

// Unassign tenant from room (landlord/admin only)
router.post('/:id/unassign-tenant', authorize('landlord', 'landlord-admin'), unassignTenant);

module.exports = router;
