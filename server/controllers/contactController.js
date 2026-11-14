const ContactInquiry = require('../models/ContactInquiry');

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, serviceCategory, budget, timeline, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    const inquiry = await ContactInquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      serviceCategory: serviceCategory || 'General Inquiry',
      budget: budget || 'Not Specified',
      timeline: timeline || 'Not Specified',
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry received. Our engineering leadership team will contact you within 24 business hours.',
      inquiryId: inquiry._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries (Admin only)
// @route   GET /api/admin/contact
// @access  Private (Admin)
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await ContactInquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact inquiry status or admin notes (Admin only)
// @route   PATCH /api/admin/contact/:id
// @access  Private (Admin)
exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found.',
      });
    }

    if (status) inquiry.status = status;
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

