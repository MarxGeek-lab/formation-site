const rateLimit = require('express-rate-limit');

// Rate limiter pour les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 minute
  max: 3, // Maximum 5 tentatives par minute
  message: { error: "Trop de tentatives de connexion. Veuillez réessayer dans une minute." },
  skipSuccessfulRequests: true // Ignore les tentatives réussies
});

module.exports = loginLimiter;
