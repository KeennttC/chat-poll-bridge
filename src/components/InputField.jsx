import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField = ({ label, id, name, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-violet-700">{label}</Label>
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={`Enter your ${label.toLowerCase()}`}
      required
      className="border-violet-300 focus:border-violet-500"
    />
  </div>
);

export default InputField;