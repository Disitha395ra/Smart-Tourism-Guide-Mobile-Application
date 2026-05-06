const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Smart Tourism Guide API is running!');
});

// Setup Socket.io
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Attach io to req for controllers to use
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Socket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('send_message', (data) => {
    const { senderId, receiverId, content } = data;
    io.to(receiverId).emit('receive_message', { senderId, content, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection Mock
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
