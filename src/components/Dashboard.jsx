import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import IconPoll from './IconPoll';
import AdminDashboard from './AdminDashboard';
import UserList from './UserList';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8 relative">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-purple-800">Dashboard</CardTitle>
          </CardHeader>
        </Card>

        {user?.role === 'admin' && <AdminDashboard />}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <Chat />
            <IconPoll />
          </div>
          <div className="col-span-1">
            <UserList />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="fixed bottom-8 right-8 bg-red-100 text-red-600 hover:bg-red-200"
      >
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </div>
  );
};

export default Dashboard;