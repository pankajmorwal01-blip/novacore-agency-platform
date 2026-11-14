const express = require('express');
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  addProjectMessage,
} = require('../controllers/projectController');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Project submission (logged-in user or guest with optionalAuth)
router.post('/', optionalAuth, upload.array('attachments', 5), createProject);

// Current user's submitted projects
router.get('/my', verifyToken, getMyProjects);

// Single project detail (with ownership protection)
router.get('/:id', verifyToken, getProjectById);

// Update project (ownership protection)
router.put('/:id', verifyToken, updateProject);

// Discussion messages on a project
router.post('/:id/messages', verifyToken, addProjectMessage);

module.exports = router;

