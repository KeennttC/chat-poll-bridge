import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import LoginForm from './LoginForm';
import ResetRequestForm from './ResetRequestForm';
import ResetPasswordForm from './ResetPasswordForm';
import LegalLinks from './LegalLinks';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    resetCode: '',
    newPassword: '',
    mathAnswer: '',
    resetStep: 0,
  });
  const [mathChallenge, setMathChallenge] = useState(null);
  const { login, resetPassword, generateResetCode } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef({});

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mathChallenge) {
      setMathChallenge(generateMathChallenge());
    } else {
      if (parseInt(formData.mathAnswer) !== mathChallenge.answer) {
        toast.error("Incorrect math answer. Please try again.");
        setMathChallenge(generateMathChallenge());
        return;
      }
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success("Successfully logged in!");
          navigate('/dashboard');
        } else {
          toast.error("Invalid email or password");
        }
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          toast.error("No account found with this email. Please sign up.");
        } else if (error.code === 'auth/wrong-password') {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error("An error occurred during login. Please try again.");
        }
      }
    }
  };

  const handleResetRequest = () => {
    if (formData.username) {
      const code = generateResetCode(formData.username);
      toast.success(`Reset code sent to your email: ${code}`);
      setFormData(prev => ({ ...prev, resetStep: 2 }));
    } else {
      toast.error("Please enter your username first");
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (resetPassword(formData.username, formData.newPassword, formData.resetCode)) {
      toast.success("Password reset successfully. You can now log in with your new password.");
      setFormData(prev => ({ ...prev, resetStep: 0, password: formData.newPassword }));
    } else {
      toast.error("Failed to reset password. Please check your reset code.");
    }
  };

  const renderForm = () => {
    switch (formData.resetStep) {
      case 0:
        return <LoginForm formData={formData} handleInputChange={handleInputChange} handleLogin={handleLogin} mathChallenge={mathChallenge} inputRefs={inputRefs} />;
      case 1:
        return <ResetRequestForm formData={formData} handleInputChange={handleInputChange} handleResetRequest={handleResetRequest} />;
      case 2:
        return <ResetPasswordForm formData={formData} handleInputChange={handleInputChange} handleResetSubmit={handleResetSubmit} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-purple-600">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-violet-700">
            {formData.resetStep === 0 ? "Login" : formData.resetStep === 1 ? "Reset Password" : "Enter New Password"}
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

function generateMathChallenge() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: num1 + num2
  };
}

export default Login;