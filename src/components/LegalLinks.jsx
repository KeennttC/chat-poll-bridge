import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

export default LegalLinks;