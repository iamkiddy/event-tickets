'use client';

import { useState } from 'react';
import { verifyCode, getUserProfile } from '@/lib/actions/auth';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CompleteSignupAlert } from './completeSignupAlert';
import { useAuth } from '@/lib/context/AuthContext';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

interface VerifyCodeAlertProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (status: 'New' | 'Old') => void;
}

export const VerifyCodeAlert: React.FC<VerifyCodeAlertProps> = ({ open, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCompleteSignup, setShowCompleteSignup] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await verifyCode({ passcode: code });
        
        if (response.status === 'New') {
            setVerificationToken(response.token);
            setShowCompleteSignup(true);
        } else {
            // For existing users, first set the token
            login(response.token);
            
            // Then try to fetch the profile
            try {
                await getUserProfile();
                onSuccess('Old');
                onClose();
            } catch (profileError) {
                console.error('Profile fetch error:', profileError);
                setError('Logged in but failed to fetch profile. Please try again.');
            }
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred');
        }
    } finally {
        setLoading(false);
    }
  };

  if (showCompleteSignup) {
    return (
      <CompleteSignupAlert
        open={true}
        onClose={onClose}
        onSuccess={() => {
          onSuccess('New');
          onClose();
        }}
        verificationToken={verificationToken}
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
              Enter Verification Code
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-gray-600">
              Please enter the verification code sent to your email
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputOTP maxLength={6} 
            className="w-full"
            onChange={(value) => setCode(value)}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup className='w-full gap-4'>
              <InputOTPSlot index={0} className='w-full h-10' />
              <InputOTPSlot index={1} className='w-full h-10' />
              <InputOTPSlot index={2} className='w-full h-10' />
              <InputOTPSlot index={3} className='w-full h-10' />
              <InputOTPSlot index={4} className='w-full h-10' />
              <InputOTPSlot index={5} className='w-full h-10' />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-primaryColor hover:bg-indigo-700 text-white"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
