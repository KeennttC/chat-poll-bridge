import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                <span>{u.username}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${u.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserList;