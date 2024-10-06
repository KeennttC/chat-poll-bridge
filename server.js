const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: Date
});

const Message = mongoose.model('Message', messageSchema);

const userSchema = new mongoose.Schema({
  username: String,
  status: String
});

const User = mongoose.model('User', userSchema);

io.on('connection', (socket) => {
  console.log('New client connected');

  Message.find().sort('-timestamp').limit(50).exec((err, messages) => {
    if (err) return console.error(err);
    socket.emit('initialMessages', messages);
  });

  User.find({ status: 'online' }, (err, users) => {
    if (err) return console.error(err);
    io.emit('initialOnlineUsers', users.map(user => user.username));
  });

  socket.on('message', (message) => {
    const newMessage = new Message(message);
    newMessage.save((err) => {
      if (err) return console.error(err);
      io.emit('message', message);
    });
  });

  socket.on('userStatus', ({ username, status }) => {
    User.findOneAndUpdate(
      { username: username },
      { status: status },
      { upsert: true, new: true },
      (err, user) => {
        if (err) return console.error(err);
        io.emit('userStatus', { username, status });
      }
    );
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Find the disconnected user and update their status
    User.findOne({ socketId: socket.id }, (err, user) => {
      if (user) {
        user.status = 'offline';
        user.save((err) => {
          if (err) return console.error(err);
          io.emit('userStatus', { username: user.username, status: 'offline' });
        });
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));