const crypto = require('crypto');
const ProjectRequest = require('../models/ProjectRequest');
const Message = require('../models/Message');

// Helper to generate readable Project ID: PRJ-XXXXXX
const generateRequestId = () => {
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PRJ-${randomHex}`;
};

// @desc    Submit a new project request
// @route   POST /api/projects
// @access  Public (Guest allowed) or Authenticated (User linked)
exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      fullName,
      email,
      phone,
      companyName,
      serviceCategory,
      description,
      problemToSolve,
      requiredFeatures,
      preferredTechnology,
      budgetRange,
      expectedDeadline,
      additionalRequirements,
    } = req.body;

    if (!title || !serviceCategory || !description || !budgetRange || !expectedDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, description, budget, and deadline.',
      });
    }

    // Determine user association
    const userId = req.user ? req.user._id : null;
    const finalFullName = fullName || (req.user ? req.user.name : '');
    const finalEmail = email || (req.user ? req.user.email : '');
    const finalPhone = phone || (req.user ? req.user.phone : '');
    const finalCompany = companyName || (req.user ? req.user.company : '');

    if (!finalFullName || !finalEmail) {
      return res.status(400).json({
        success: false,
        message: 'Full name and email are required to submit a project request.',
      });
    }

    // Process attachments from multer if provided
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          originalName: file.originalname,
          fileName: file.filename,
          path: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          size: file.size,
        });
      });
    }

    // Format requiredFeatures if sent as comma-separated or stringified JSON
    let parsedFeatures = [];
    if (Array.isArray(requiredFeatures)) {
      parsedFeatures = requiredFeatures;
    } else if (typeof requiredFeatures === 'string') {
      try {
        parsedFeatures = JSON.parse(requiredFeatures);
      } catch {
        parsedFeatures = requiredFeatures.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    const requestId = generateRequestId();

    const project = await ProjectRequest.create({
      requestId,
      userId,
      fullName: finalFullName,
      email: finalEmail.toLowerCase(),
      phone: finalPhone,
      companyName: finalCompany,
      title: title.trim(),
      serviceCategory,
      description: description.trim(),
      problemToSolve: problemToSolve ? problemToSolve.trim() : '',
      requiredFeatures: parsedFeatures,
      preferredTechnology: preferredTechnology ? preferredTechnology.trim() : '',
      budgetRange,
      expectedDeadline,
      additionalRequirements: additionalRequirements ? additionalRequirements.trim() : '',
      attachments,
      status: 'Submitted',
      history: [
        {
          status: 'Submitted',
          changedBy: userId,
          comment: 'Initial project request received and queued for architectural review.',
        },
      ],
    });

    // Create initial welcome message on the project discussion thread
    await Message.create({
      projectRequestId: project._id,
      senderId: userId || project._id, // if guest, reference project ID
      senderName: 'Novacore Engineering Dispatch',
      senderRole: 'admin',
      message: `Your project request (${project.requestId}) has been logged. An engineering lead will review your specifications, technical requirements, and timeline within 24 hours. You can ask questions or add requirements directly here.`,
    });

    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all project requests for logged in user
// @route   GET /api/projects/my
// @access  Private (User)
exports.getMyProjects = async (req, res, next) => {
  try {
    // STRICT OWNERSHIP: Only fetch requests belonging to the authenticated user ID
    const projects = await ProjectRequest.find({ userId: req.user._id })
      .select('-adminNotes') // Never expose internal admin notes to users
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project request details by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await ProjectRequest.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found.',
      });
    }

    // STRICT OWNERSHIP CHECK:
    // If not an admin and not the owner of this project, deny access!
    const isOwner = project.userId && project.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to view this project.',
      });
    }

    // Fetch conversation messages
    const messages = await Message.find({ projectRequestId: project._id }).sort({ createdAt: 1 });

    // Sanitize adminNotes if user is not admin
    const projectObj = project.toObject();
    if (!isAdmin) {
      delete projectObj.adminNotes;
    }

    res.status(200).json({
      success: true,
      project: projectObj,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project request (Client can update scope if still in 'Submitted' or 'Under Review')
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    const project = await ProjectRequest.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found.',
      });
    }

    // Check ownership
    const isOwner = project.userId && project.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own project requests.',
      });
    }

    // Prevent non-admin users from changing admin-controlled status or notes!
    if (req.user.role !== 'admin') {
      if (['Approved', 'Completed', 'Cancelled'].includes(project.status)) {
        return res.status(400).json({
          success: false,
          message: 'This project is already locked in discussion or active development. Please post in the message thread to request scope modifications.',
        });
      }

      // Allow safe user updates to content fields
      const { title, description, problemToSolve, requiredFeatures, preferredTechnology, additionalRequirements } = req.body;
      if (title) project.title = title.trim();
      if (description) project.description = description.trim();
      if (problemToSolve !== undefined) project.problemToSolve = problemToSolve.trim();
      if (requiredFeatures) project.requiredFeatures = requiredFeatures;
      if (preferredTechnology !== undefined) project.preferredTechnology = preferredTechnology.trim();
      if (additionalRequirements !== undefined) project.additionalRequirements = additionalRequirements.trim();
    } else {
      // Admin update
      Object.assign(project, req.body);
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project request updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a message to a project discussion thread
// @route   POST /api/projects/:id/messages
// @access  Private
exports.addProjectMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty.',
      });
    }

    const project = await ProjectRequest.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found.',
      });
    }

    // Ownership check
    const isOwner = project.userId && project.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot post messages to this project.',
      });
    }

    const newMessage = await Message.create({
      projectRequestId: project._id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      receiverId: isAdmin ? project.userId : null,
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

