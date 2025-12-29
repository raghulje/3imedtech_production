const { EmailSettings } = require("../models");
const status = require("../helpers/response");
const { refreshEmailService } = require("../utils/emailService");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => status.responseStatus(res, 500, "Internal error", { error: e.message }));
}

exports.emailSettings = {
  get: asyncHandler(async (req, res) => {
    const settings = await EmailSettings.findOne({ where: { isActive: true } });
    // Don't send password in response for security
    if (settings) {
      const safeSettings = settings.toJSON();
      safeSettings.smtpPassword = safeSettings.smtpPassword ? '***' : null;
      return status.responseStatus(res, 200, "OK", safeSettings);
    }
    return status.responseStatus(res, 200, "OK", null);
  }),
  upsert: asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const userId = req.userData?.id || null;
    
    console.log('📧 Email settings update request:', {
      hasPassword: !!payload.smtpPassword,
      passwordLength: payload.smtpPassword?.length,
      passwordIsMasked: payload.smtpPassword === '***',
      ...Object.keys(payload).reduce((acc, key) => {
        if (key !== 'smtpPassword') acc[key] = payload[key];
        return acc;
      }, {})
    });
    
    const existing = await EmailSettings.findOne({ where: { isActive: true } });
    if (existing) {
      // If password is masked (***) or empty, don't update it
      if (payload.smtpPassword === '***' || payload.smtpPassword === '' || !payload.smtpPassword) {
        delete payload.smtpPassword;
        console.log('🔒 Keeping existing password (not updating)');
      } else {
        console.log('🔑 Updating password');
      }
      
      await existing.update(payload);
      const updated = await EmailSettings.findByPk(existing.id);
      
      // Refresh email service with new settings
      try {
        await refreshEmailService();
        console.log('✅ Email service refreshed');
      } catch (refreshError) {
        console.error('⚠️ Warning: Email service refresh failed:', refreshError.message);
        // Don't fail the update if refresh fails, but log it
      }
      
      // Don't send password in response
      const safeSettings = updated.toJSON();
      safeSettings.smtpPassword = safeSettings.smtpPassword ? '***' : null;
      return status.responseStatus(res, 200, "Updated", safeSettings);
    }
    
    // Create new settings
    if (!payload.smtpPassword || payload.smtpPassword === '***') {
      return status.responseStatus(res, 400, "Password is required for new email settings");
    }
    
    const created = await EmailSettings.create(payload);
    
    // Initialize email service with new settings
    try {
      await refreshEmailService();
      console.log('✅ Email service initialized');
    } catch (refreshError) {
      console.error('⚠️ Warning: Email service initialization failed:', refreshError.message);
    }
    
    // Don't send password in response
    const safeSettings = created.toJSON();
    safeSettings.smtpPassword = safeSettings.smtpPassword ? '***' : null;
    return status.responseStatus(res, 201, "Created", safeSettings);
  }),
  test: asyncHandler(async (req, res) => {
    const { testEmail } = req.body;
    if (!testEmail) {
      return status.responseStatus(res, 400, "Test email address is required");
    }

    const { sendTestEmail } = require("../utils/emailService");
    
    try {
      await sendTestEmail(testEmail);
      return status.responseStatus(res, 200, "Test email sent successfully");
    } catch (error) {
      console.error('Test email error:', error);
      return status.responseStatus(res, 500, "Failed to send test email", { error: error.message });
    }
  }),
};

