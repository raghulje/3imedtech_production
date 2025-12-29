const nodemailer = require('nodemailer');
const { EmailSettings } = require('../models');

let transporter = null;

async function initializeEmailService() {
  try {
    const settings = await EmailSettings.findOne({ where: { isActive: true } });
    
    if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
      console.warn('Email settings not configured. Email functionality will be disabled.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || (settings.smtpSecure ? 465 : 587),
      secure: settings.smtpSecure, // true for 465, false for other ports
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email service initialized successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Error initializing email service:', error);
    return null;
  }
}

async function sendTestEmail(testEmail) {
  try {
    // Re-initialize if transporter is null
    if (!transporter) {
      await initializeEmailService();
    }

    if (!transporter) {
      throw new Error('Email service not configured. Please save your SMTP settings first.');
    }

    const settings = await EmailSettings.findOne({ where: { isActive: true } });
    if (!settings) {
      throw new Error('Email settings not found');
    }

    const mailOptions = {
      from: `"${settings.fromName || '3i MedTech Website'}" <${settings.fromEmail || settings.smtpUser}>`,
      to: testEmail,
      subject: 'Test Email from 3i MedTech CMS',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the 3i MedTech CMS email settings.</p>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
        <hr>
        <p><small>Sent from 3i MedTech CMS at ${new Date().toLocaleString()}</small></p>
      `,
      text: `
Test Email

This is a test email from the 3i MedTech CMS email settings.

If you received this email, your SMTP configuration is working correctly!

---
Sent from 3i MedTech CMS at ${new Date().toLocaleString()}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    throw error;
  }
}

async function sendContactFormEmail(formData) {
  try {
    // Re-initialize if transporter is null
    if (!transporter) {
      await initializeEmailService();
    }

    if (!transporter) {
      throw new Error('Email service not configured');
    }

    const settings = await EmailSettings.findOne({ where: { isActive: true } });
    if (!settings || !settings.toEmail) {
      throw new Error('Recipient email not configured');
    }

    const mailOptions = {
      from: `"${settings.fromName || '3i MedTech Website'}" <${settings.fromEmail || settings.smtpUser}>`,
      to: settings.toEmail,
      subject: `New Contact Form Submission - ${formData.inquiry || 'General Inquiry'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.fname}</p>
        <p><strong>Organization:</strong> ${formData.organization}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Company Size:</strong> ${formData.companySize}</p>
        <p><strong>Inquiry Type:</strong> ${formData.inquiry}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted from 3i MedTech website contact form</small></p>
      `,
      text: `
New Contact Form Submission

Name: ${formData.fname}
Organization: ${formData.organization}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company Size: ${formData.companySize}
Inquiry Type: ${formData.inquiry}

Message:
${formData.message}

---
Submitted from 3i MedTech website contact form
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    throw error;
  }
}

// Re-initialize email service when settings change
async function refreshEmailService() {
  transporter = null;
  return await initializeEmailService();
}

module.exports = {
  initializeEmailService,
  sendContactFormEmail,
  sendTestEmail,
  refreshEmailService,
};

