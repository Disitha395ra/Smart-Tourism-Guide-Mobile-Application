const express = require('express');
const router = express.Router();
const { 
  getAllAttractions, 
  getAttractionById, 
  seedAttractions, 
  getRecommendations,
  createAttraction,
  updateAttraction,
  deleteAttraction
} = require('../controllers/attraction.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', getAllAttractions);
router.get('/recommend', getRecommendations);
router.get('/:id', getAttractionById);
router.post('/seed', auth, seedAttractions);

// Admin Routes
router.post('/', auth, createAttraction);
router.put('/:id', auth, updateAttraction);
router.delete('/:id', auth, deleteAttraction);

module.exports = router;
