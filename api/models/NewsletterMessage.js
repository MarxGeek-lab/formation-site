const mongoose = require('mongoose');

const newsletterMessageSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    htmlContent: {
        type: String,
        required: false
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['published', 'unPublished'],
        default: 'unPublished'
    },
    publishedDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NewsletterMessage', newsletterMessageSchema); 