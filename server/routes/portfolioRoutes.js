const express = require('express');
const router = express.Router();
const {
  getAllPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllPortfolio);
router.get('/:id', getPortfolioById);

// Admin portfolio management
router.post('/admin', verifyToken, requireAdmin, upload.single('image'), createPortfolio);
router.put('/admin/:id', verifyToken, requireAdmin, upload.single('image'), updatePortfolio);
router.delete('/admin/:id', verifyToken, requireAdmin, deletePortfolio);

module.exports = router;

