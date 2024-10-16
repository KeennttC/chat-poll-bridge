import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await register(email, password, username);
      if (success) {
        toast.success("Account created successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use. Attempting to log in...");
        try {
          const loginSuccess = await login(email, password);
          if (loginSuccess) {
            toast.success("Logged in with existing account!");
            navigate('/dashboard');
          } else {
            toast.error("Failed to log in with existing account. Please try logging in manually.");
          }
        } catch (loginError) {
          toast.error("Failed to log in with existing account. Please try logging in manually.");
        }
      } else {
        toast.error(error.message || "Failed to create an account");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-violet-700">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-violet-300 focus:border-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-violet-300 focus:border-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-violet-300 focus:border-violet-500"
              />
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button variant="link" className="text-violet-600 hover:text-violet-800" onClick={() => navigate('/')}>
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;