const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Verify JWT token from HTTP-only cookie or Authorization header
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // Check HTTP-only cookie first (preferred & secure)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: jwtErr.name === 'TokenExpiredError'
          ? 'Session has expired. Please sign in again.'
          : 'Invalid authentication token.',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this token no longer exists.',
      });
    }

    // Attach user document to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error.',
    });
  }
};

// Require Admin Role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrative privileges required.',
    });
  }

  next();
};

// Optional authentication - populates req.user if a valid token is present
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Silently ignore invalid token in optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  optionalAuth,
};

