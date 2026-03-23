const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Send last 50 messages to the newly connected user
    const pastMessages = await Message.findLast(50);
    socket.emit('past_messages', pastMessages);

    // Broadcast when a user types
    socket.on('typing', () => {
      socket.broadcast.emit('user_typing', { username: socket.user.username });
    });

    socket.on('send_message', async (data) => {
      try {
        const savedMessage = await Message.insertOne({
          userId: socket.user._id,
          username: socket.user.username,
          content: data.content
        });
        io.emit('new_message', savedMessage);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};
