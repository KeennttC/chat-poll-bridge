import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challenge, setChallenge] = useState({ num1: 0, num2: 0 });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const generateChallenge = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setChallenge({ num1, num2 });
  }, []);

  const verifyChallenge = () => {
    return parseInt(challengeAnswer) === challenge.num1 + challenge.num2;
  };

  const handleLogin = () => {
    setShowChallenge(true);
    generateChallenge();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showChallenge) {
      handleLogin();
      return;
    }

    if (!verifyChallenge()) {
      toast.error("Incorrect answer. Please try again.");
      generateChallenge();
      setChallengeAnswer('');
      return;
    }

    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      toast.error("Invalid username or password");
      generateChallenge();
      setChallengeAnswer('');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!verifyChallenge()) {
      toast.error("Incorrect answer. Please try again.");
      generateChallenge();
      setChallengeAnswer('');
      return;
    }

    if (resetPassword(username, newPassword)) {
      toast.success("Password reset successfully");
      setShowForgotPassword(false);
    } else {
      toast.error("Failed to reset password. Please check your username.");
    }
    generateChallenge();
    setChallengeAnswer('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-violet-700">
            {showForgotPassword ? "Reset Password" : "Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-violet-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-violet-300 focus:border-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-violet-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-violet-300 focus:border-violet-500"
              />
            </div>
            {showChallenge && (
              <div className="space-y-2">
                <Label htmlFor="challenge" className="text-violet-700">Math Challenge</Label>
                <div className="flex items-center space-x-2">
                  <span>{challenge.num1} + {challenge.num2} = </span>
                  <Input
                    id="challenge"
                    type="number"
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    placeholder="Answer"
                    required
                    className="border-violet-300 focus:border-violet-500"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={rememberMe} 
                  onCheckedChange={setRememberMe}
                  className="border-violet-500 text-violet-700"
                />
                <Label htmlFor="rememberMe" className="text-sm text-violet-700">Remember me</Label>
              </div>
              <Button 
                type="button" 
                variant="link" 
                className="text-violet-700 hover:text-violet-900"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {showForgotPassword ? "Reset Password" : (showChallenge ? "Verify and Log in" : "Log in")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="outline" className="w-full border-violet-500 text-violet-700 hover:bg-violet-100" onClick={() => navigate('/signup')}>
            Sign up
          </Button>
          <div className="text-xs text-center text-gray-600">
            By continuing, you agree to our{' '}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 text-violet-700 hover:underline">Terms of Service</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                  <DialogDescription>
                    This is a generalized terms of service. By using our service, you agree to abide by our rules and regulations. We reserve the right to modify or terminate the service for any reason, without notice at any time.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {' '}and have read our{' '}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 text-violet-700 hover:underline">Privacy Policy</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription>
                    This is a generalized privacy policy. We collect and use personal information to provide and improve our service. By using our service, you agree to the collection and use of information in accordance with this policy.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;