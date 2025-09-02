const mongoose = require('mongoose');

const helpCenterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: [
    {
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
      },
      type: {
        type: String,
        enum: ['message', 'response'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HelpCenter = mongoose.model('HelpCenter', helpCenterSchema);

module.exports = HelpCenter;
