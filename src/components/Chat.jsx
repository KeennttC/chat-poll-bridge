import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const messagesCollection = collection(db, 'messages');
      const q = query(messagesCollection, orderBy('timestamp', 'asc'));
      
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          // If the collection is empty, create it with a dummy document
          await addDoc(messagesCollection, {
            text: 'Welcome to the chat!',
            sender: 'System',
            timestamp: new Date()
          });
        }
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          }));
          setMessages(fetchedMessages);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages. Please try again.");
      }
    };

    fetchMessages();
  }, [user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      try {
        await addDoc(collection(db, 'messages'), {
          text: newMessage,
          sender: user.username,
          timestamp: new Date()
        });
        setNewMessage('');
        toast.success('Message sent successfully');
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && isValid(timestamp)) {
      return format(timestamp, 'HH:mm');
    }
    return '';
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
        <CardTitle className="text-2xl font-bold text-center">Live Chat</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[70%] ${
              msg.sender === user.username 
                ? 'bg-purple-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none'
            }`}>
              <p>{msg.text}</p>
              <span className="text-xs opacity-50 block mt-1">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
      <CardFooter className="border-t bg-white">
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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