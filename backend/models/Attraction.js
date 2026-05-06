const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    province: { type: String },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  category: { type: String, enum: ['beach', 'history', 'wildlife', 'adventure', 'culture', 'religious', 'nature'], required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  entryFee: { type: Number, default: 0 },
  openingHours: { type: String },
  bestTimeToVisit: { type: String },
  tags: [{ type: String }],
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);
