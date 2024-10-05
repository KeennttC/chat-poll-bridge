import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', ({ username, isTyping }) => {
      setTypingUsers((prevTypingUsers) => {
        if (isTyping) {
          return [...new Set([...prevTypingUsers, username])];
        } else {
          return prevTypingUsers.filter((u) => u !== username);
        }
      });
    });

    socket.on('userStatus', ({ username, status }) => {
      setOnlineUsers((prevOnlineUsers) => {
        if (status === 'online') {
          return [...new Set([...prevOnlineUsers, username])];
        } else {
          return prevOnlineUsers.filter((u) => u !== username);
        }
      });
    });

    socket.emit('userStatus', { username: user.username, status: 'online' });

    return () => {
      socket.emit('userStatus', { username: user.username, status: 'offline' });
      socket.off('message');
      socket.off('typing');
      socket.off('userStatus');
    };
  }, [socket, user]);

  const sendMessage = (text) => {
    if (socket && user) {
      const message = { text, sender: user.username };
      socket.emit('message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const setTyping = (isTyping) => {
    if (socket && user) {
      socket.emit('typing', { username: user.username, isTyping });
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingUsers, setTyping, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};