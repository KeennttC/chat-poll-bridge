import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const { user } = useAuth() || {}; // Add a fallback empty object

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse();
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (text) => {
    if (user) {
      const message = { 
        text, 
        sender: user.username, 
        timestamp: new Date().toISOString() 
      };
      await addDoc(collection(db, 'messages'), message);
    }
  };

  const setTyping = (isTyping) => {
    // Implement typing indicator with Firestore if needed
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, typingUsers, setTyping, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;