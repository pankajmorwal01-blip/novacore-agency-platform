const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  updateInquiry,
} = require('../controllers/contactController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public contact submission
router.post('/', contactLimiter, submitInquiry);

// Admin contact management
router.get('/admin', verifyToken, requireAdmin, getInquiries);
router.patch('/admin/:id', verifyToken, requireAdmin, updateInquiry);

module.exports = router;

