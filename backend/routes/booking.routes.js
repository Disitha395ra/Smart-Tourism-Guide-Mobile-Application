const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/booking.controller');

// Dummy auth middleware for demo purposes
const authMiddleware = (req, res, next) => {
  req.user = { id: 'dummyUserId123' }; // In real app, extract from JWT
  next();
};

router.post('/', authMiddleware, createBooking);

module.exports = router;
