const Booking = require('../models/Booking');
const Guide = require('../models/Guide');

exports.createBooking = async (req, res) => {
  try {
    const { guideId, date, durationHours } = req.body;
    const touristId = req.user.id; // From auth middleware

    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });

    const totalPrice = guide.hourlyRate * durationHours;

    const newBooking = new Booking({
      touristId,
      guideId,
      date,
      durationHours,
      totalPrice,
      status: 'pending'
    });

    await newBooking.save();

    // Emit Socket.io event to notify guide
    if (req.io) {
      req.io.to(guideId.toString()).emit('new_booking_request', newBooking);
    }

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating booking' });
  }
};
