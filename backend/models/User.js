const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'guide', 'admin'], default: 'tourist' },
  phone: { type: String },
  profileImage: { type: String },
  preferences: [{ type: String }], // e.g. ['beach', 'history', 'wildlife']
  location: {
    city: { type: String },
    country: { type: String, default: 'Sri Lanka' }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
