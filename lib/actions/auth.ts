/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { LoginEmail, LoginEmailResponse, SignupCompleteData, VerifyCode, VerifyCodeResponse, LoginWithGmailResponse, UserProfileModel, UserProfileUpdateModel } from "../models/_auth_models";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import { cookies } from 'next/headers';
import { ResponseModel } from "../models/_util_models";

interface ApiError extends Error {
    message: string;
    status?: number;
}

interface ValidationError extends ApiError {
    detail: {
        msg: string;
    }[];
}

export interface SignupResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const loginEmail = async (email: LoginEmail): Promise<LoginEmailResponse> => {
    try {
        const response = await apiController<LoginEmailResponse, LoginEmail>({
            method: 'POST',
            url: APIUrls.login,
            data: email,
            contentType: 'application/json',
        });
        
        if (response.token) {
            const cookieStore = await cookies();
            cookieStore.set('temp_email_token', response.token, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 // 1 hour
            });
        }
        
        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const verifyCode = async (data: VerifyCode): Promise<VerifyCodeResponse> => {
    try {
        const cookieStore = await cookies();
        const emailToken = cookieStore.get('temp_email_token')?.value;
        
        if (!emailToken) {
            throw new Error('Email token not found');
        }
        const response = await apiController<VerifyCodeResponse, VerifyCode>({
            method: 'POST',
            url: APIUrls.verify,
            data,
            token: emailToken,
            contentType: 'application/json',
        });

        // Store the verification token in cookies
        if (response.token) {
            cookieStore.set('verification_token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 5 // 5 minutes
            });
        }

        return response;
    } catch (error: any) {
        // Handle both string and object error messages
        const errorMessage = typeof error === 'object' ? error?.message || "Verification failed" : error;
        throw new Error(errorMessage);
    }
}

export const logout = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('user_profile');
};

export const checkAuth = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return !!token;
};

export const initiateGoogleLogin = async () => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'GET',
            url: APIUrls.loginWithGmail,
        });
        
        if (response.message) {
            window.location.href = response.message; 
        }
    } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Failed to initiate Google login:', apiError);
    }
};

export const completeSignup = async (data: SignupCompleteData): Promise<SignupResponse> => {
    try {
        const cookieStore = await cookies();
        const verificationToken = cookieStore.get('verification_token')?.value;
        
        if (!verificationToken) {
            return {
                success: false,
                message: 'Verification token not found'
            };
        }

        try {
            const response = await apiController<SignupResponse, SignupCompleteData>({
                method: 'POST',
                url: APIUrls.completeSignup,
                data,
                token: verificationToken,
                contentType: 'application/json',
            });

            // Clear verification token as it's no longer needed
            cookieStore.delete('verification_token');

            // Set the auth token in cookies
            if (response.token) {
                cookieStore.set('token', response.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60 // 30 days
                });
            }

            return {
                success: true,
                message: response.message || 'Signup completed successfully',
                token: response.token
            };
        } catch (apiError: any) {
            console.error('API Error:', apiError);
            
            // Handle validation errors
            if (apiError?.detail && Array.isArray(apiError.detail)) {
                const validationError = apiError as ValidationError;
                const errorMessage = validationError.detail
                    .map(error => error.msg)
                    .join(', ');
                return {
                    success: false,
                    message: errorMessage
                };
            }
            
            return {
                success: false,
                message: apiError?.message || 'Failed to complete signup'
            };
        }
    } catch (error: any) {
        console.error('Server action error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
}

export const loginWithGmail = async (): Promise<LoginWithGmailResponse> => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'POST',
            url: APIUrls.loginWithGmail,
        });
        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const loginWithGmailPost = async (accessToken: string): Promise<LoginWithGmailResponse> => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'POST',
            url: `${APIUrls.loginWithGmail}?accessToken=${accessToken}`,
            contentType: 'application/json',
        });
        
        if (response.token) {
            const cookieStore = await cookies();
            cookieStore.set('token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
        }
        
        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}



// get user profile
export const getUserProfile = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await apiController<UserProfileModel>({
            method: 'GET',
            url: APIUrls.userProfile,
            token,
            contentType: 'application/json',
        });

        if (response) {
            (await cookies()).set('user_profile', JSON.stringify(response), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
        }

        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Failed to get user profile:', apiError);
        throw apiError;
    }
};



// update user profile
export const updateUserProfile = async (data: UserProfileUpdateModel) => {
    try {
        const response = await apiController<ResponseModel>({
            method: 'PUT',
            url: APIUrls.userProfile,
            data,
            contentType: 'application/json',
        });
        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Failed to update user profile:', apiError);
    }
};

// Add helper function to check auth status from server-side
export const getServerSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userProfileStr = cookieStore.get('user_profile')?.value;
    
    if (!token) return null;
    
    try {
        const userProfile = userProfileStr ? JSON.parse(userProfileStr) : null;
        const userProfileModel: UserProfileModel | null = userProfile ? userProfile as UserProfileModel : null;
        return { token, userProfileModel };
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
};