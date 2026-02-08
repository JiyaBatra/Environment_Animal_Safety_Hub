const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false
});

const rateLimits = {
  general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests'),
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many login attempts'),
  contact: createRateLimit(60 * 60 * 1000, 3, 'Too many contact submissions')
};

// XSS sanitization
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

// MongoDB injection protection
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_'
});

module.exports = {
  rateLimits,
  sanitizeInput,
  mongoSanitizeMiddleware
};