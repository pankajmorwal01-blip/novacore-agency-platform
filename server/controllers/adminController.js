const User = require('../models/User');
const ProjectRequest = require('../models/ProjectRequest');
const ContactInquiry = require('../models/ContactInquiry');
const Message = require('../models/Message');
const Portfolio = require('../models/Portfolio');
const { sendProjectStatusUpdateEmail } = require('../utils/emailService');

// @desc    Get Admin Dashboard aggregate statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await ProjectRequest.countDocuments();
    const pendingProjects = await ProjectRequest.countDocuments({
      status: { $in: ['Submitted', 'Under Review', 'In Discussion'] },
    });
    const approvedProjects = await ProjectRequest.countDocuments({
      status: { $in: ['Approved', 'In Progress'] },
    });
    const completedProjects = await ProjectRequest.countDocuments({
      status: 'Completed',
    });
    const totalInquiries = await ContactInquiry.countDocuments();
    const newInquiries = await ContactInquiry.countDocuments({ status: 'new' });
    const totalPortfolio = await Portfolio.countDocuments();

    // Recent 5 project requests
    const recentProjects = await ProjectRequest.find()
      .populate('userId', 'name email company')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 contact inquiries
    const recentInquiries = await ContactInquiry.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        pendingProjects,
        approvedProjects,
        completedProjects,
        totalInquiries,
        newInquiries,
        totalPortfolio,
      },
      recentProjects,
      recentInquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all project requests (Admin)
// @route   GET /api/admin/projects
// @access  Private (Admin)
exports.getAllProjects = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.serviceCategory = category;
    }

    if (search) {
      query.$or = [
        { requestId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ProjectRequest.countDocuments(query);
    const projects = await ProjectRequest.find(query)
      .populate('userId', 'name email phone company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status and admin notes
// @route   PATCH /api/admin/projects/:id/status
// @access  Private (Admin)
exports.updateProjectStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, comment } = req.body;

    const project = await ProjectRequest.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found.',
      });
    }

    const previousStatus = project.status;

    if (status) {
      project.status = status;
    }

    if (adminNotes !== undefined) {
      project.adminNotes = adminNotes;
    }

    // Append to status history
    project.history.push({
      status: status || project.status,
      changedBy: req.user._id,
      comment: comment || `Status modified from ${previousStatus} to ${status || project.status}`,
      timestamp: new Date(),
    });

    await project.save();

    // If status changed, post system message and send email notification
    if (status && status !== previousStatus) {
      await Message.create({
        projectRequestId: project._id,
        senderId: req.user._id,
        senderName: req.user.name,
        senderRole: 'admin',
        receiverId: project.userId,
        message: `Project status updated to: "${status}". ${comment ? `Note: ${comment}` : ''}`,
      });

      // Notify user via email
      await sendProjectStatusUpdateEmail(
        project.email,
        project.fullName,
        project.title,
        status,
        comment
      );
    }

    res.status(200).json({
      success: true,
      message: `Project status successfully updated to ${project.status}`,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project request
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await ProjectRequest.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found.',
      });
    }

    // Delete associated messages
    await Message.deleteMany({ projectRequestId: project._id });
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project request and associated history deleted permanently.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

    // Aggregate project count per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const projectCount = await ProjectRequest.countDocuments({ userId: u._id });
        return {
          ...u.toSafeObject(),
          projectCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Role must be user or admin.',
      });
    }

    // Prevent admin from removing their own admin privilege
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot revoke your own administrative status to avoid lockout.',
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} for ${targetUser.email}`,
      user: targetUser.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

