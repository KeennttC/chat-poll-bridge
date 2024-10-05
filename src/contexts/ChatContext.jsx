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

    const handleConnect = () => {
      console.log('Connected to server');
      socket.emit('userStatus', { username: user.username, status: 'online' });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

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

    return () => {
      socket.emit('userStatus', { username: user.username, status: 'offline' });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message');
      socket.off('typing');
      socket.off('userStatus');
    };
  }, [socket, user]);

  const sendMessage = (text) => {
    if (socket && user) {
      const message = { text, sender: user.username, timestamp: new Date().toISOString() };
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