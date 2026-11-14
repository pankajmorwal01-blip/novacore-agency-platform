const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    projectRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectRequest',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ projectRequestId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

