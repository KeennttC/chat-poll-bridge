import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, you'd connect to a real WebSocket server
    const mockSocket = {
      send: (message) => {
        if (typeof message === 'string') {
          broadcastMessage({ text: message, sender: user?.username || 'Anonymous' });
        } else if (message.type === 'typing') {
          handleTyping(message);
        } else if (message.type === 'userStatus') {
          handleUserStatus(message);
        }
      }
    };
    setSocket(mockSocket);

    if (user) {
      mockSocket.send({ type: 'userStatus', user: user.username, status: 'online' });
    }

    return () => {
      if (user) {
        mockSocket.send({ type: 'userStatus', user: user.username, status: 'offline' });
      }
    };
  }, [user]);

  const broadcastMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = (message) => {
    if (socket && user) {
      socket.send(message);
    }
  };

  const handleTyping = (typingInfo) => {
    if (typingInfo.isTyping) {
      setTypingUsers(prev => [...prev.filter(u => u !== typingInfo.user), typingInfo.user]);
    } else {
      setTypingUsers(prev => prev.filter(u => u !== typingInfo.user));
    }
  };

  const handleUserStatus = (statusInfo) => {
    setOnlineUsers(prev => {
      const newUsers = prev.filter(u => u !== statusInfo.user);
      if (statusInfo.status === 'online') {
        newUsers.push(statusInfo.user);
      }
      return newUsers;
    });
  };

  const setTyping = (isTyping) => {
    if (socket && user) {
      socket.send({ type: 'typing', user: user.username, isTyping });
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingUsers, setTyping, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};