const Review = require('../models/Review');
const Guide = require('../models/Guide');
const Attraction = require('../models/Attraction');

// POST /api/reviews - Create review
exports.createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment, bookingId } = req.body;
    const reviewerId = req.user.id;

    const review = new Review({ reviewerId, targetType, targetId, rating, comment, bookingId, isVerified: !!bookingId });
    await review.save();

    // Update average rating on guide or attraction
    const reviews = await Review.find({ targetId, targetType });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    if (targetType === 'guide') {
      await Guide.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), totalReviews: reviews.length });
    } else if (targetType === 'attraction') {
      await Attraction.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), totalReviews: reviews.length });
    }

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/reviews/:targetType/:targetId - Get reviews for a guide or attraction
exports.getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const reviews = await Review.find({ targetType, targetId })
      .populate('reviewerId', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
