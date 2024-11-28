import { LoginEmail, LoginEmailResponse, SignupCompleteData, VerifyCode, VerifyCodeResponse, LoginWithGmailResponse } from "../models/_auth_models";
import apiController from "../apiController";
import APIUrls from "../apiurls";

const token = localStorage.getItem('token') || undefined;

export interface SignupResponse {
  success: boolean;
  token: string;
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
            localStorage.setItem('temp_email_token', response.token);
        }
        
        return response;
    } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const verifyCode = async (data: VerifyCode): Promise<VerifyCodeResponse> => {
    try {
        const emailToken = localStorage.getItem('temp_email_token') || undefined;
        
        const response = await apiController<VerifyCodeResponse, VerifyCode>({
            method: 'POST',
            url: APIUrls.verify,
            data,
            contentType: 'application/json',
            token: emailToken,
        });
        
        if (response.token) {
            localStorage.removeItem('temp_email_token');
            localStorage.setItem('token', response.token);
            localStorage.setItem('verified', 'true');
        }
        
        return response;
    } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
};

export const checkAuth = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const initiateGoogleLogin = async () => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'GET',
            url: APIUrls.loginWithGmail,
        });
        
        if (response.message) {
            window.location.href = response.message; // The message contains the Google OAuth URL
        }
    } catch (error: any) {
        console.error('Failed to initiate Google login:', error);
    }
};

export const completeSignup = async (data: SignupCompleteData): Promise<SignupResponse> => {
    try {
        const signupToken = localStorage.getItem('signup_token') || undefined;
        
        const response = await apiController<SignupResponse, SignupCompleteData>({
            method: 'POST',
            url: APIUrls.completeSignup,
            data,
            contentType: 'application/json',
            token: signupToken,
        });

        if (response.success && response.token) {
            localStorage.removeItem('signup_token');
            localStorage.setItem('token', response.token);
            localStorage.setItem('verified', 'true');
        }

        return response;
    } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}  


export const loginWithGmail = async (): Promise<LoginWithGmailResponse> => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'POST',
            url: APIUrls.loginWithGmail,
        });
        return response;
    } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const loginWithGmailPost = async (code: string): Promise<LoginWithGmailResponse> => {
    try {
        const response = await apiController<LoginWithGmailResponse>({
            method: 'POST',
            url: APIUrls.loginWithGmail,
            data: { code, redirect_uri: `${window.location.origin}/auth/google` },
            contentType: 'application/json',
        });
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('verified', 'true');
        }
        
        return response;
    } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}