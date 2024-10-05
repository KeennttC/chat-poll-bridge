import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { motion } from "framer-motion";

const Chat = () => {
  const [message, setMessage] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const { messages, sendMessage, typingUsers, setTyping, onlineUsers } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      sendMessage(message);
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (user) {
      setTyping(e.target.value.length > 0);
    }
  };

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-800 text-center">Chat Room</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Please log in to access the chat.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-100 shadow-lg flex flex-col h-[600px]">
      <CardHeader className="bg-purple-600 text-white">
        <CardTitle className="text-2xl font-bold text-center">Chat Room</CardTitle>
        <div className="text-sm text-center">
          Online Users: {onlineUsers.join(', ')}
        </div>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mt-2"
          >
            Welcome, {user.username}!
          </motion.div>
        )}
      </CardHeader>
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} isCurrentUser={msg.sender === user.username} />
        ))}
      </ScrollArea>
      <CardFooter className="border-t bg-white flex-col items-start">
        <TypingIndicator typingUsers={typingUsers.filter(u => u !== user.username)} />
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-grow mr-2 border-purple-300 focus:border-purple-500"
          />
          <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

const MessageBubble = ({ message, isCurrentUser }) => (
  <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
    {!isCurrentUser && <UserAvatar username={message.sender} />}
    <div className={`p-3 rounded-lg max-w-[70%] ${
      isCurrentUser 
        ? 'bg-purple-500 text-white rounded-br-none' 
        : 'bg-white text-gray-800 rounded-bl-none'
    }`}>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-semibold">{message.sender}</span>
        <span className="text-xs opacity-50 ml-2">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
      <p>{message.text}</p>
    </div>
    {isCurrentUser && <UserAvatar username={message.sender} />}
  </div>
);

const UserAvatar = ({ username }) => (
  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-2">
    {username[0].toUpperCase()}
  </div>
);

const TypingIndicator = ({ typingUsers }) => (
  <div className="text-sm text-gray-500 mb-2">
    {typingUsers.map((user) => (
      <motion.div
        key={user}
        className="flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <span>{user} is typing</span>
        <motion.div
          className="flex ml-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-1 h-1 bg-gray-500 rounded-full mr-1"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full mr-1"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
        </motion.div>
      </motion.div>
    ))}
  </div>
);

export default Chat;