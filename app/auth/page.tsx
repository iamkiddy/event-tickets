'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LoginAlert } from './_components/loginAlert';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from './_components/GoogleLoginButton';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';

export default function Page() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Get the previous path from sessionStorage
      const previousPath = sessionStorage.getItem('previousPath') || '/';
      // Clear the stored path
      sessionStorage.removeItem('previousPath');
      // Navigate back to the previous path
      router.push(previousPath);
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = (status: 'New' | 'Old') => {
    if (status === 'Old') {
      const previousPath = sessionStorage.getItem('previousPath') || '/';
      sessionStorage.removeItem('previousPath');
      router.push(previousPath);
    }
  };

  // If authenticated, don't render the page content
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Event Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <Image
          fill
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Event background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <GoogleLoginButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full bg-primaryColor hover:bg-indigo-700 text-white"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Continue with Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginAlert
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
