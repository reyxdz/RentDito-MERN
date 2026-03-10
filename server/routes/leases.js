const express = require('express');
const {
  getLeasesByRoom,
  getLeaseById,
  createLease,
  updateLeaseStatus,
  deleteLease
} = require('../controllers/leaseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get leases by room (with query parameter)
router.get('/', getLeasesByRoom);

// Create lease (landlord/admin only)
router.post('/', authorize('landlord', 'landlord-admin'), createLease);

// Get specific lease
router.get('/:id', getLeaseById);

// Update lease status (landlord/admin only)
router.put('/:id/status', authorize('landlord', 'landlord-admin'), updateLeaseStatus);

// Delete lease (landlord/admin only)
router.delete('/:id', authorize('landlord', 'landlord-admin'), deleteLease);

module.exports = router;
