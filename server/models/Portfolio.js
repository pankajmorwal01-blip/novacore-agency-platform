const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'AI & Autonomous Agents',
        'Enterprise Web Apps',
        'Mobile Engineering',
        'SaaS Platforms',
        'Cloud & API Systems',
        'E-commerce & Payments'
      ],
      index: true,
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology must be listed'],
    },
    image: {
      type: String,
      default: '',
    },
    projectUrl: {
      type: String,
      default: '',
    },
    client: {
      type: String,
      default: 'Confidential Client',
    },
    impactMetrics: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);

