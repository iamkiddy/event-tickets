import { useState } from 'react';
import { completeSignup } from '@/lib/actions/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [isAgree, setIsAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (verificationToken) {
        localStorage.setItem('signup_token', verificationToken);
      }
      
      await completeSignup({ fullname, phone, isAgree });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
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
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full"
            required
          />
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