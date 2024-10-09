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
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [mathChallenge, setMathChallenge] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const generateMathChallenge = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setMathChallenge({
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!showMathChallenge) {
      setShowMathChallenge(true);
      generateMathChallenge();
      return;
    }
    if (parseInt(userAnswer) !== mathChallenge.answer) {
      toast.error("Incorrect math answer. Please try again.");
      generateMathChallenge();
      setUserAnswer('');
      return;
    }
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      toast.error("Invalid username or password");
    }
  };

  const handleInputChange = useCallback((setter) => (e) => {
    setter(e.target.value);
  }, []);

  const renderForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <InputField label="Username" id="username" value={username} onChange={handleInputChange(setUsername)} />
      <InputField label="Password" id="password" value={password} onChange={handleInputChange(setPassword)} type="password" minLength={8} />
      {showMathChallenge && (
        <div className="space-y-2">
          <Label htmlFor="mathChallenge" className="text-violet-700">Human Verification</Label>
          <div className="flex items-center space-x-2">
            <span className="text-violet-700">{mathChallenge.question}</span>
            <Input
              id="mathChallenge"
              type="number"
              value={userAnswer}
              onChange={handleInputChange(setUserAnswer)}
              placeholder="Answer"
              required
              className="border-violet-300 focus:border-violet-500 w-20"
            />
          </div>
        </div>
      )}
      <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
      <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
        {showMathChallenge ? "Verify" : "Log in"}
      </Button>
    </form>
  );

  const InputField = ({ label, id, value, onChange, type = "text", minLength }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-violet-700">{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        required
        minLength={minLength}
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-violet-700">Login</CardTitle>
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

export default Login;