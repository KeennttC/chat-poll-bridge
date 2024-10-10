import React from 'react';
import { Button } from "@/components/ui/button";
import InputField from './InputField';

const ResetPasswordForm = ({ formData, handleInputChange, handleResetSubmit }) => (
  <form onSubmit={handleResetSubmit} className="space-y-4">
    <InputField label="New Password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} type="password" />
    <InputField label="Reset Code" id="resetCode" name="resetCode" value={formData.resetCode} onChange={handleInputChange} />
    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
      Reset Password
    </Button>
    <Button type="button" variant="link" className="w-full text-violet-700 hover:text-violet-900" onClick={() => handleInputChange({ target: { name: 'resetStep', value: 0 } })}>
      Back to Login
    </Button>
  </form>
);

export default ResetPasswordForm;