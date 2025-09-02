const Faq = require('../models/Faqs');

// Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const faq = new Faq({
      question: req.body.question,
      answer: req.body.answer,
      admin: req.admin._id // Assuming admin is set in middleware
    });

    const savedFaq = await faq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().populate('admin', 'name email');
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single FAQ by ID
exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).populate('admin', 'name email');
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a FAQ
exports.updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Optional: Check if the admin updating is the one who created it
    if (faq.admin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this FAQ' });
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      {
        question: req.body.question,
        answer: req.body.answer
      },
      { new: true }
    );

    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Optional: Check if the admin deleting is the one who created it
    if (faq.admin.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this FAQ' });
    }

    await Faq.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
