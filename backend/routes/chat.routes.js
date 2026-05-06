const express = require('express');
const router = express.Router();
const { getConversation, sendMessage, getConversations } = require('../controllers/chat.controller');
const auth = require('../middleware/auth.middleware');

router.get('/conversations', auth, getConversations);
router.get('/:userId', auth, getConversation);
router.post('/send', auth, sendMessage);

module.exports = router;
