const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  languages: [{ type: String }],
  hourlyRate: { type: Number, required: true },
  location: { 
    type: { type: String, default: 'Point' }, 
    coordinates: [Number] 
  },
  isVerified: { type: Boolean, default: false },
  trustScore: { type: Number, default: 50 },
  rating: { type: Number, default: 0 }
});

guideSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Guide', guideSchema);
