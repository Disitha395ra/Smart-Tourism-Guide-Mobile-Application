const Guide = require('../models/Guide');
const User = require('../models/User');

// GET /api/guides - Get all verified guides
exports.getAllGuides = async (req, res) => {
  try {
    const { city, language, maxRate, minRating } = req.query;
    let filter = {};
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (language) filter.languages = { $in: [language] };
    if (maxRate) filter.hourlyRate = { $lte: Number(maxRate) };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const guides = await Guide.find(filter)
      .populate('userId', 'name email profileImage')
      .sort({ rating: -1, trustScore: -1 });

    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching guides' });
  }
};

// GET /api/guides/:id - Get single guide profile
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('userId', 'name email profileImage phone');
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/guides/my-profile - Get guide profile for logged in guide user
exports.getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.user.id })
      .populate('userId', 'name email profileImage phone');
    if (!guide) return res.status(404).json({ error: 'Guide profile not found' });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/guides/my-profile - Update guide profile
exports.updateGuideProfile = async (req, res) => {
  try {
    const { bio, languages, specializations, hourlyRate, location, availability, experience } = req.body;
    const guide = await Guide.findOneAndUpdate(
      { userId: req.user.id },
      { bio, languages, specializations, hourlyRate, location, availability, experience },
      { new: true, upsert: true }
    ).populate('userId', 'name email profileImage');

    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
