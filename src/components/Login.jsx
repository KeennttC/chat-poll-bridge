import React, { useState } from 'react';
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
  const [resetStep, setResetStep] = useState(0);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { login, resetPassword, generateResetCode } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      toast.error("Invalid username or password");
    }
  };

  const handleResetRequest = () => {
    if (username) {
      const code = generateResetCode(username);
      toast.success(`Reset code sent to your email: ${code}`);
      setResetStep(1);
    } else {
      toast.error("Please enter your username first");
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (resetPassword(username, newPassword, resetCode)) {
      toast.success("Password reset successfully. You can now log in with your new password.");
      setResetStep(0);
      setPassword(newPassword);
    } else {
      toast.error("Failed to reset password. Please check your reset code.");
    }
  };

  const renderForm = () => {
    switch (resetStep) {
      case 0:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField label="Username" id="username" value={username} onChange={setUsername} />
            <InputField label="Password" id="password" value={password} onChange={setPassword} type="password" />
            <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Log in
            </Button>
            <Button type="button" variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => setResetStep(1)}>
              Forgot password?
            </Button>
          </form>
        );
      case 1:
        return (
          <form className="space-y-4">
            <InputField label="Username" id="username" value={username} onChange={setUsername} />
            <Button onClick={handleResetRequest} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Request Reset Code
            </Button>
            <Button variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => setResetStep(0)}>
              Back to Login
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <InputField label="Reset Code" id="resetCode" value={resetCode} onChange={setResetCode} />
            <InputField label="New Password" id="newPassword" value={newPassword} onChange={setNewPassword} type="password" />
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Reset Password
            </Button>
            <Button type="button" variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => setResetStep(0)}>
              Back to Login
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-violet-700">
            {resetStep === 0 ? "Login" : resetStep === 1 ? "Reset Password" : "Enter New Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="outline" className="w-full border-violet-500 text-violet-700 hover:bg-violet-100" onClick={() => navigate('/signup')}>
            Sign up
          </Button>
          <LegalLinks />
        </CardFooter>
      </Card>
    </div>
  );
};

const InputField = ({ label, id, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-violet-700">{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter your ${label.toLowerCase()}`}
      required
      className="border-violet-300 focus:border-violet-500"
    />
  </div>
);

const RememberMeCheckbox = ({ checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox 
      id="rememberMe" 
      checked={checked} 
      onCheckedChange={onChange}
      className="border-violet-500 text-violet-700"
    />
    <Label htmlFor="rememberMe" className="text-sm text-violet-700">Remember me</Label>
  </div>
);

const LegalLinks = () => (
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
);

export default Login;