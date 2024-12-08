'use client';

import { useState } from 'react';
import { loginEmail } from '@/lib/actions/auth';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { VerifyCodeAlert } from './verifyCodeAlert';
import { GoogleLoginButton } from './GoogleLoginButton';

interface LoginAlertProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (status: 'New' | 'Old') => void;
}

export const LoginAlert: React.FC<LoginAlertProps> = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginEmail({ email });
      setShowVerifyCode(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySuccess = (status: 'New' | 'Old') => {
    onLoginSuccess(status);
  };

  const handleGoogleLoginSuccess = () => {
    onClose();
  };

  if (showVerifyCode) {
    return (
      <VerifyCodeAlert 
        open={true}
        onClose={() => {
          setShowVerifyCode(false);
          onClose();
        }}
        onSuccess={handleVerifySuccess}
      />
    );
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full max-w-md bg-white shadow-2xl border-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-gray-600">
              Sign in to access your account
            </AlertDialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              type="submit" 
              className="w-full bg-primaryColor hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue with Email'}
            </Button>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
