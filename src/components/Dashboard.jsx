import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chat from './Chat';
import IconPoll from './IconPoll';
import AdminDashboard from './AdminDashboard';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-purple-800">Welcome, {user?.username}!</CardTitle>
            <Button onClick={logout} variant="outline" className="bg-red-100 text-red-600 hover:bg-red-200">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardHeader>
        </Card>

        {user?.role === 'admin' && <AdminDashboard />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Chat />
          <IconPoll />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;