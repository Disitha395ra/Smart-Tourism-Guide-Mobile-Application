const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  languages: [{ type: String }],
  specializations: [{ type: String }], // e.g. ['history', 'wildlife', 'adventure']
  hourlyRate: { type: Number, required: true },
  location: {
    city: { type: String },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    }
  },
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  isVerified: { type: Boolean, default: false },
  trustScore: { type: Number, default: 50, min: 0, max: 100 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  profileImage: { type: String },
  experience: { type: Number, default: 0 }, // years
  completedTours: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
