const express = require('express');
const router = express.Router();
const { createReview, getReviews } = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, createReview);
router.get('/:targetType/:targetId', getReviews);

module.exports = router;
