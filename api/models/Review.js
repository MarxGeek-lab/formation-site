const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    reported: {
        type: Boolean,
        default: false 
    },
    reportReason: {
        type: String,
        trim: true // Raison du signalement de la revue
    },
}, {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    toJSON: { virtuals: true }, // Inclure les virtuals lors de la conversion en JSON
    toObject: { virtuals: true } // Inclure les virtuals lors de la conversion en Object
});

// Indexes
ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // Index unique sur propriété et utilisateur
ReviewSchema.index({ product: 1, createdAt: -1 }); // Index sur propriété et date de création

module.exports = mongoose.model('Review', ReviewSchema);
