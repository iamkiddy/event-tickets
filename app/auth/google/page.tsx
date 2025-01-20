'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGmailPost, getUserProfile } from '@/lib/actions/auth';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'react-hot-toast';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        
        if (code) {
            loginWithGmailPost(code)
                .then(async (response) => {
                    if (response.token) {
                        login(response.token);
                        await getUserProfile();
                        toast.success('Successfully logged in!', {
                            duration: 4000,
                            position: 'top-center'
                        });
                        // No redirect, just close any open dialogs
                        window.close(); // Close the popup if it's a popup
                    }
                })
                .catch((error) => {
                    console.error('Google login error:', error);
                    toast.error('Failed to login with Google');
                });
        }
    }, [searchParams, router, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Processing Login...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}