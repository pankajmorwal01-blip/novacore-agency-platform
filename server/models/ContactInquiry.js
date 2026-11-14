const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    serviceCategory: {
      type: String,
      default: 'General Inquiry',
    },
    budget: {
      type: String,
      default: 'Not Specified',
    },
    timeline: {
      type: String,
      default: 'Not Specified',
    },
    message: {
      type: String,
      required: [true, 'Please describe your inquiry or project'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'archived'],
      default: 'new',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);

