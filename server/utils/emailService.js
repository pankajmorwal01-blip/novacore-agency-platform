const nodemailer = require('nodemailer');
const config = require('../config/config');

// Initialize transporter if credentials are provided
let transporter = null;
if (config.EMAIL_HOST && config.EMAIL_USER && config.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
}

/**
 * Send an email notification or log it in development mode
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from: config.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email] Notification sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      // In development or when SMTP is not configured, log to console safely
      console.log('--------------------------------------------------');
      console.log(`📧 [Simulated Email Dispatch]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content:\n${text || html}`);
      console.log('--------------------------------------------------');
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error('[Email Error] Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName = 'Client') => {
  const resetUrl = `${config.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request - Novacore Systems';
  const text = `Hello ${userName},\n\nYou have requested a password reset for your Novacore Systems account. Please use the link below to set a new password:\n\n${resetUrl}\n\nThis token is valid for 1 hour. If you did not make this request, please ignore this email.\n\nNovacore Systems Security Team`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 40px; border-radius: 8px;">
      <h2 style="color: #6366f1; margin-top: 0;">Novacore Systems</h2>
      <p style="font-size: 16px;">Hello ${userName},</p>
      <p style="font-size: 14px; color: #94a3b8;">You recently requested a password reset for your client account. Click the button below to choose a new password:</p>
      <div style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Your Password</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">Or paste this link into your browser: <br><a href="${resetUrl}" style="color: #818cf8;">${resetUrl}</a></p>
      <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This token will expire in 1 hour. If you did not request this, no action is needed.</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send Project Request status update notification
 */
const sendProjectStatusUpdateEmail = async (email, userName, projectTitle, newStatus, comment = '') => {
  const subject = `Update on Project [${projectTitle}] - Status: ${newStatus}`;
  const text = `Hello ${userName},\n\nThe status of your project "${projectTitle}" has been updated to "${newStatus}".\n${comment ? `Note: ${comment}\n` : ''}\nYou can review detailed milestones and reply through your Client Portal:\n${config.CLIENT_URL}/dashboard\n\nNovacore Systems`;
  const html = `
    <div style="font-family: sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 30px; border-radius: 8px;">
      <h3 style="color: #6366f1;">Novacore Project Update</h3>
      <p>Hello ${userName},</p>
      <p>The status of your project request <strong>"${projectTitle}"</strong> has been updated to:</p>
      <p style="display: inline-block; background-color: #1e293b; color: #38bdf8; padding: 6px 14px; border-radius: 4px; font-weight: bold;">${newStatus}</p>
      ${comment ? `<p style="margin-top: 15px; color: #cbd5e1;"><em>"${comment}"</em></p>` : ''}
      <div style="margin-top: 25px;">
        <a href="${config.CLIENT_URL}/dashboard" style="background-color: #4f46e5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 500;">Open Client Portal</a>
      </div>
    </div>
  `;

  return await sendEmail({ to: email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendProjectStatusUpdateEmail,
};

