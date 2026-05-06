const express = require('express');
const router = express.Router();
const { getAllGuides, getGuideById, getMyGuideProfile, updateGuideProfile } = require('../controllers/guide.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', getAllGuides);
router.get('/my-profile', auth, getMyGuideProfile);
router.put('/my-profile', auth, updateGuideProfile);
router.get('/:id', getGuideById);

module.exports = router;
