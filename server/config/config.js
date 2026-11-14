const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/novacore_db',
  JWT_SECRET: process.env.JWT_SECRET || 'default_super_secret_novacore_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || 'lax',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Novacore Executive Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@novacore.io',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminSecurePass2026!',
  ADMIN_PHONE: process.env.ADMIN_PHONE || '+1 (800) 555-0199',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '"Novacore Systems" <notifications@novacore.io>',
};

