const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, getUser, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['platform-admin', 'landlord', 'landlord-admin', 'tenant']).withMessage('Invalid role')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], login);

router.get('/me', protect, getMe);
router.get('/users/:userId', protect, getUser);
router.post('/logout', protect, logout);

module.exports = router;
