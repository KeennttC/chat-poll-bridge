import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

export default RememberMeCheckbox;