import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputField from './InputField';
import RememberMeCheckbox from './RememberMeCheckbox';

const LoginForm = ({ formData, handleInputChange, handleLogin, mathChallenge, inputRefs }) => (
  <form onSubmit={handleLogin} className="space-y-4">
    <InputField label="Username" id="username" name="username" value={formData.username} onChange={handleInputChange} />
    <InputField label="Password" id="password" name="password" value={formData.password} onChange={handleInputChange} type="password" />
    <RememberMeCheckbox checked={formData.rememberMe} onChange={(checked) => handleInputChange({ target: { name: 'rememberMe', type: 'checkbox', checked } })} />
    {mathChallenge && (
      <div className="mt-4">
        <Label htmlFor="mathChallenge" className="text-violet-700">Human Verification</Label>
        <p className="text-sm text-gray-600 mb-2">{mathChallenge.question}</p>
        <Input
          id="mathChallenge"
          name="mathAnswer"
          value={formData.mathAnswer}
          onChange={handleInputChange}
          placeholder="Enter your answer"
          required
          className="border-violet-300 focus:border-violet-500"
          ref={el => inputRefs.current.mathAnswer = el}
        />
      </div>
    )}
    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
      {mathChallenge ? 'Verify and Log in' : 'Log in'}
    </Button>
    <Button type="button" variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => handleInputChange({ target: { name: 'resetStep', value: 1 } })}>
      Forgot password?
    </Button>
  </form>
);

export default LoginForm;