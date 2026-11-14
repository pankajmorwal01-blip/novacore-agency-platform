const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    // Captured contact info directly in request for quick access
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    serviceCategory: {
      type: String,
      required: [true, 'Service category is required'],
      enum: [
        'AI Agent Development',
        'AI Automation and Workflow Integration',
        'Custom Web Application Development',
        'Android and iOS App Development',
        'SaaS Product Development',
        'Backend and API Development',
        'Database Design',
        'E-commerce Development',
        'Software Consulting and Maintenance',
        'Enterprise Solutions'
      ],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    problemToSolve: {
      type: String,
      default: '',
      maxlength: [2000, 'Problem to solve cannot exceed 2000 characters'],
    },
    requiredFeatures: {
      type: [String],
      default: [],
    },
    preferredTechnology: {
      type: String,
      default: '',
      trim: true,
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      enum: [
        '$5k - $15k',
        '$15k - $30k',
        '$30k - $60k',
        '$60k - $120k',
        '$120k+',
        'Flexible / To be scoped'
      ],
    },
    expectedDeadline: {
      type: String,
      required: [true, 'Expected deadline is required'],
      enum: [
        'Urgent (< 1 month)',
        '1 - 3 months',
        '3 - 6 months',
        '6+ months',
        'Ongoing partnership'
      ],
    },
    additionalRequirements: {
      type: String,
      default: '',
    },
    attachments: [
      {
        originalName: String,
        fileName: String,
        path: String,
        mimeType: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'In Discussion',
        'Approved',
        'Rejected',
        'In Progress',
        'Completed',
        'Cancelled',
      ],
      default: 'Submitted',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
      // Admin notes are only visible to admins
    },
    history: [
      {
        status: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for user queries sorted by creation date
projectRequestSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);

