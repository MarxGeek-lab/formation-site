const mongoose = require('mongoose');

const UserVisitSchema = new mongoose.Schema({
    ip : String,
    userAgent : String,
    date : { type: Date, default: Date.now }
  });

module.exports = mongoose.model('UserVisit', UserVisitSchema);
  