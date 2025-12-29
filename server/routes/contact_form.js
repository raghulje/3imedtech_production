const express = require('express');
const router = express.Router();
const { sendContactFormEmail } = require('../utils/emailService');
const status = require('../helpers/response');

// Contact form submission (public endpoint)
router.post('/submit', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.fname || !formData.email || !formData.organization || !formData.message) {
      return status.responseStatus(res, 400, 'Missing required fields');
    }

    // Send email
    await sendContactFormEmail(formData);
    
    return status.responseStatus(res, 200, 'Contact form submitted successfully');
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return status.responseStatus(res, 500, 'Failed to submit contact form', { error: error.message });
  }
});

module.exports = router;

