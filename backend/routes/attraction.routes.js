const express = require('express');
const router = express.Router();
const { getAllAttractions, getAttractionById, seedAttractions, getRecommendations } = require('../controllers/attraction.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', getAllAttractions);
router.get('/recommend', getRecommendations);
router.get('/:id', getAttractionById);
router.post('/seed', auth, seedAttractions);

module.exports = router;
