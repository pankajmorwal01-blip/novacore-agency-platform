const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllProjects,
  updateProjectStatus,
  deleteProject,
  getAllUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { getInquiries, updateInquiry } = require('../controllers/contactController');
const {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all admin routes: require authentication and admin role
router.use(verifyToken, requireAdmin);

// Dashboard overview
router.get('/dashboard', getDashboardStats);

// Projects management
router.get('/projects', getAllProjects);
router.patch('/projects/:id/status', updateProjectStatus);
router.delete('/projects/:id', deleteProject);

// Contact inquiries management
router.get('/contact', getInquiries);
router.patch('/contact/:id', updateInquiry);

// Users management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

// Portfolio management
router.post('/portfolio', upload.single('image'), createPortfolio);
router.put('/portfolio/:id', upload.single('image'), updatePortfolio);
router.delete('/portfolio/:id', deletePortfolio);

module.exports = router;

