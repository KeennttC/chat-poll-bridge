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
            <li key={index} className="flex items-center">
              <User className={`mr-2 h-4 w-4 ${onlineUsers.includes(user.username) ? 'text-green-500' : 'text-gray-500'}`} />
              {user.username} {onlineUsers.includes(user.username) ? '(Online)' : '(Offline)'}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserList;