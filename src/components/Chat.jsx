import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-800">Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 rounded-lg ${msg.sender === 'You' ? 'bg-purple-100 ml-auto' : 'bg-gray-100'} max-w-[80%] break-words`}>
              <strong className="text-purple-700">{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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