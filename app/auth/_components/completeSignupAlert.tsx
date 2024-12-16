/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { completeSignup, getUserProfile } from '@/lib/actions/auth';
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneNumberField from '@/components/custom/PhoneNumberField.tsx/PhoneNumberField';

// List of African countries
const africanCountries = [
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' },
  // Add more African countries as needed
];

interface CompleteSignupAlertProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verificationToken?: string;
}

export const CompleteSignupAlert: React.FC<CompleteSignupAlertProps> = ({ 
  open, 
  onClose,
  onSuccess,
  verificationToken 
}) => {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('GH');
  const [isAgree, setIsAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fullname.trim() || !phone.trim() || !country) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!isAgree) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }
    
    try {
      const response = await completeSignup({ 
        fullname: fullname.trim(), 
        phone: phone, 
        isAgree,
        country
      });
      
      if (response.success && response.token) {
        // For new users, set the token and proceed with login
        login(response.token);
        toast.success('Signup completed successfully! Welcome to EventSphere!', {
          duration: 4000,
          position: 'top-center'
        });
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to complete signup');
      }
    } catch (error: unknown) {
      console.error('Complete signup error:', error);
      setError('Failed to complete signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full max-w-md bg-white shadow-2xl border-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Complete Your Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-gray-600">
              Please provide additional information to complete your signup
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
          <Input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Full Name"
            className="w-full"
            required
          />
          <PhoneNumberField
            name='phone'
            label='Phone Number'
            phoneValue={phone}
            onChange={(value) => setPhone(value)}
            required={true}
            disabled={loading}
            className='w-full'
          />
          <Select
            value={country}
            onValueChange={setCountry}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {africanCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={isAgree}
              onCheckedChange={(checked) => setIsAgree(checked as boolean)}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-primaryColor hover:bg-indigo-700 text-white"
            disabled={loading}
          >
            {loading ? 'Completing Signup...' : 'Complete Signup'}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};