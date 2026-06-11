const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Tourism Guide API is running! 🌴' });
});

// Setup Socket.io
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Attach io to req for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/guides', require('./routes/guide.routes'));
app.use('/api/attractions', require('./routes/attraction.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

// Socket.io real-time chat logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins their own room using their userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Real-time message relay
  socket.on('send_message', (data) => {
    const { senderId, receiverId, content } = data;
    io.to(receiverId).emit('receive_message', {
      senderId,
      content,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
