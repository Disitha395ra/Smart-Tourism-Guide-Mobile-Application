const Booking = require('../models/Booking');
const Guide = require('../models/Guide');

// POST /api/bookings - Create booking
exports.createBooking = async (req, res) => {
  try {
    const { guideId, date, durationHours, notes } = req.body;
    const touristId = req.user.id;

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });

    const totalPrice = guide.hourlyRate * durationHours;

    const newBooking = new Booking({
      touristId,
      guideId,
      date: new Date(date),
      durationHours,
      totalPrice,
      notes,
      status: 'pending'
    });

    await newBooking.save();

    // Notify guide via socket
    if (req.io) {
      req.io.to(guideId.toString()).emit('new_booking_request', {
        bookingId: newBooking._id,
        touristId,
        date,
        durationHours,
        totalPrice
      });
    }

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating booking' });
  }
};

// GET /api/bookings/my - Tourist's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ touristId: req.user.id })
      .populate({ path: 'guideId', populate: { path: 'userId', select: 'name profileImage' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/bookings/guide - Guide's incoming bookings
exports.getGuideBookings = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.user.id });
    if (!guide) return res.status(404).json({ error: 'Guide profile not found' });

    const bookings = await Booking.find({ guideId: guide._id })
      .populate('touristId', 'name email profileImage phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/bookings/:id/status - Guide confirms/cancels
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Notify tourist via socket
    if (req.io) {
      req.io.to(booking.touristId.toString()).emit('booking_status_update', {
        bookingId: booking._id,
        status
      });
    }

    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
