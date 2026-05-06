const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['guide', 'attraction'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  isVerified: { type: Boolean, default: false } // Only verified if booking exists
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
