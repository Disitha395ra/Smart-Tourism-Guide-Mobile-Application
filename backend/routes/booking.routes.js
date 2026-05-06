const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getGuideBookings, updateBookingStatus } = require('../controllers/booking.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, createBooking);
router.get('/my', auth, getMyBookings);
router.get('/guide', auth, getGuideBookings);
router.put('/:id/status', auth, updateBookingStatus);

module.exports = router;
