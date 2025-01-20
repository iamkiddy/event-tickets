'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import { getUserProfile, loginWithGmailPost } from '@/lib/actions/auth';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'react-hot-toast';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await loginWithGmailPost(tokenResponse.access_token);
        
        if (response.token) {
          login(response.token);
          // Get user profile immediately after login
          await getUserProfile();
          // Call onSuccess callback to close the dialog
          onSuccess?.();
          toast.success('Successfully logged in!', {
            duration: 4000,
            position: 'top-center'
          });
        }
      } catch (error) { 
        console.error('Google login error:', error);
        toast.error('Failed to login with Google');
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast.error('Google login failed');
    }
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        console.log('Initiating Google login...');
        googleLogin();
      }}
    >
      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      </svg>
      Continue with Google
    </Button>
  );
}; 