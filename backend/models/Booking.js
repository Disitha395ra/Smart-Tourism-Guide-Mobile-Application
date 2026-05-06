const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  date: { type: Date, required: true },
  durationHours: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
