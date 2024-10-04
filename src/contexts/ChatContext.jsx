import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, you'd connect to a real WebSocket server
    const mockSocket = {
      send: (message) => {
        if (typeof message === 'string') {
          setMessages(prev => [...prev, { text: message, sender: user.username }]);
        } else if (message.type === 'typing') {
          handleTyping(message);
        }
      }
    };
    setSocket(mockSocket);

    return () => {
      // Clean up socket connection
    };
  }, [user]);

  const sendMessage = (message) => {
    if (socket) {
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

  const setTyping = (isTyping) => {
    if (socket) {
      socket.send({ type: 'typing', user: user.username, isTyping });
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingUsers, setTyping }}>
      {children}
    </ChatContext.Provider>
  );
};