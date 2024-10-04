import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chat from './Chat';
import Poll from './Poll';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Welcome, {user?.username}!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={logout}>Logout</Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Chat />
        <Poll />
      </div>
    </div>
  );
};

export default Dashboard;