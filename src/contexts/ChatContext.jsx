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

    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        newSocket.emit('userStatus', { username: user.username, status: 'online' });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('typing', ({ username, isTyping }) => {
      setTypingUsers((prevTypingUsers) => {
        if (isTyping) {
          return [...new Set([...prevTypingUsers, username])];
        } else {
          return prevTypingUsers.filter((u) => u !== username);
        }
      });
    });

    newSocket.on('userStatus', ({ username, status }) => {
      setOnlineUsers((prevOnlineUsers) => {
        if (status === 'online') {
          return [...new Set([...prevOnlineUsers, username])];
        } else {
          return prevOnlineUsers.filter((u) => u !== username);
        }
      });
    });

    // Load messages from local storage on initial load
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    return () => {
      if (user) {
        newSocket.emit('userStatus', { username: user.username, status: 'offline' });
      }
      newSocket.disconnect();
    };
  }, [user]);

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (text) => {
    if (socket && user) {
      const message = { text, sender: user.username, timestamp: new Date().toISOString() };
      socket.emit('message', message);
      // Add message locally to ensure it's saved even if offline
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