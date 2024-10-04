import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    // In a real app, you'd connect to a real WebSocket server
    const mockSocket = {
      send: (message) => {
        if (typeof message === 'string') {
          broadcastMessage({ text: message, sender: auth.user?.username || 'Anonymous' });
        } else if (message.type === 'typing') {
          handleTyping(message);
        } else if (message.type === 'userStatus') {
          handleUserStatus(message);
        }
      }
    };
    setSocket(mockSocket);

    if (auth.user) {
      mockSocket.send({ type: 'userStatus', user: auth.user.username, status: 'online' });
    }

    return () => {
      if (auth.user) {
        mockSocket.send({ type: 'userStatus', user: auth.user.username, status: 'offline' });
      }
    };
  }, [auth.user]);

  const broadcastMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = (message) => {
    if (socket && auth.user) {
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
    if (socket && auth.user) {
      socket.send({ type: 'typing', user: auth.user.username, isTyping });
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingUsers, setTyping, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};