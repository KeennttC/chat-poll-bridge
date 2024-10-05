import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Chat = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, typingUsers, setTyping } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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
          <CardTitle className="text-2xl font-bold text-purple-800">Chat Room</CardTitle>
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
        <CardTitle className="text-2xl font-bold">Chat Room</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== user.username && (
              <Avatar className="mr-2">
                <AvatarFallback>{msg.sender[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className={`p-3 rounded-lg max-w-[70%] ${
              msg.sender === user.username 
                ? 'bg-purple-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none'
            }`}>
              <p className="font-semibold mb-1">{msg.sender}</p>
              <p>{msg.text}</p>
            </div>
            {msg.sender === user.username && (
              <Avatar className="ml-2">
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t bg-white">
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 mb-2">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
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

export default Chat;