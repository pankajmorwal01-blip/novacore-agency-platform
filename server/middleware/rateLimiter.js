const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes (login, forgot-password, reset-password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Rate limiter for contact inquiry submissions
const contactLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this connection. Please wait before submitting again.',
  },
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Request limit exceeded. Please throttle your requests.',
  },
});

module.exports = {
  authLimiter,
  contactLimiter,
  apiLimiter,
};

