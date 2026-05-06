const Message = require('../models/Message');

// GET /api/chat/:userId - Get conversation with a user
exports.getConversation = async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherId, receiverId: myId, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/chat/send - Save message to DB
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, bookingId } = req.body;
    const senderId = req.user.id;

    const message = new Message({ senderId, receiverId, content, bookingId });
    await message.save();

    // Emit via socket
    if (req.io) {
      req.io.to(receiverId.toString()).emit('receive_message', {
        senderId,
        content,
        timestamp: message.createdAt
      });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/chat/conversations - Get all conversations list
exports.getConversations = async (req, res) => {
  try {
    const myId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }]
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name profileImage')
      .populate('receiverId', 'name profileImage');

    // Build unique conversations list
    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId = msg.senderId._id.toString() === myId ? msg.receiverId._id.toString() : msg.senderId._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const otherUser = msg.senderId._id.toString() === myId ? msg.receiverId : msg.senderId;
        conversations.push({ user: otherUser, lastMessage: msg.content, lastTime: msg.createdAt });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
