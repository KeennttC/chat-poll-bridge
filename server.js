const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow connections from any origin
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

const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  Message.find().sort('-timestamp').limit(50).exec((err, messages) => {
    if (err) return console.error(err);
    socket.emit('initialMessages', messages);
  });

  socket.emit('initialOnlineUsers', onlineUsers);

  socket.on('message', (message) => {
    const newMessage = new Message(message);
    newMessage.save((err) => {
      if (err) return console.error(err);
      io.emit('message', message);
    });
  });

  socket.on('userStatus', ({ username, status }) => {
    onlineUsers[username] = status === 'online';
    
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
    Object.keys(onlineUsers).forEach(username => {
      if (onlineUsers[username]) {
        onlineUsers[username] = false;
        io.emit('userStatus', { username, status: 'offline' });
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));