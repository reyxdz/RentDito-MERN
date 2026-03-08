const express = require('express');
const {
  getAllPayments,
  createPayment,
  getPayment,
  updatePayment,
  deletePayment,
  getPaymentStats,
  recordPayment,
  getOverduePayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all payments
router.get('/', getAllPayments);

// Get payment stats
router.get('/stats/overview', getPaymentStats);

// Get overdue payments
router.get('/overdue/list', getOverduePayments);

// Create payment
router.post('/', authorize('landlord', 'landlord-admin'), createPayment);

// Get specific payment
router.get('/:id', getPayment);

// Update payment
router.put('/:id', authorize('landlord', 'landlord-admin'), updatePayment);

// Record payment (mark as paid)
router.post('/:id/record', authorize('tenant', 'landlord', 'landlord-admin'), recordPayment);

// Delete payment
router.delete('/:id', authorize('landlord', 'landlord-admin'), deletePayment);

module.exports = router;
