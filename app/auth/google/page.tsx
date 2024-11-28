'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGmailPost } from '@/lib/actions/auth';
import { useAuth } from '@/lib/context/AuthContext';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        
        if (code) {
            loginWithGmailPost(code)
                .then((response) => {
                    if (response.token) {
                        login(response.token);
                        router.push('/home');
                    }
                })
                .catch((error) => {
                    console.error('Google login error:', error);
                    router.push('/auth?error=google_login_failed');
                });
        } else {
            router.push('/auth?error=no_code');
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