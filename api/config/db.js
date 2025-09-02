const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL || "mongodb://azrexchange:azrexchange2024@198.7.125.60:27017/marketDB");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("MongoDB Connected....");
});

module.exports = db;
