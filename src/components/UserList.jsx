import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';

const UserList = () => {
  const { users } = useAuth();
  const { onlineUsers } = useChat();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                <span>{user.username}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${onlineUsers[user.username] ? 'bg-green-500' : 'bg-gray-300'}`} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserList;