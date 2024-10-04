import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send, User } from 'lucide-react';

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
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-800">Chat Room</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[70%] ${msg.sender === user.username ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="font-semibold mb-1">{msg.sender}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t">
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
            <Send className="h-4 w-4 mr-2" /> Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;