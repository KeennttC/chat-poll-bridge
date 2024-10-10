import React from 'react';
import { Button } from "@/components/ui/button";
import InputField from './InputField';

const ResetRequestForm = ({ formData, handleInputChange, handleResetRequest }) => (
  <form className="space-y-4">
    <InputField label="Username" id="username" name="username" value={formData.username} onChange={handleInputChange} />
    <Button onClick={handleResetRequest} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
      Request Reset Code
    </Button>
    <Button variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => handleInputChange({ target: { name: 'resetStep', value: 0 } })}>
      Back to Login
    </Button>
  </form>
);

export default ResetRequestForm;