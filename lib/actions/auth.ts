import { LoginEmail, LoginEmailResponse, SignupCompleteData, VerifyCode, VerifyCodeResponse, LoginWithGmailResponse, UserProfileModel, UserProfileUpdateModel } from "../models/_auth_models";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import Cookies from 'js-cookie';

interface ApiError extends Error {
    message: string;
    status?: number;
}

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
            Cookies.set('temp_email_token', response.token, { 
                expires: 1/24, // 1 hour
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            localStorage.setItem('temp_email_token', response.token);
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
        const emailToken = Cookies.get('temp_email_token') || localStorage.getItem('temp_email_token');
        
        if (!emailToken) {
            throw new Error('No temporary token found');
        }
        
        const response = await apiController<VerifyCodeResponse, VerifyCode>({
            method: 'POST',
            url: APIUrls.verify,
            data,
            contentType: 'application/json',
            token: emailToken,
        });
        
        if (response.token) {
            // Clear temporary token
            Cookies.remove('temp_email_token', { path: '/' });
            localStorage.removeItem('temp_email_token');
            
            // Store the auth token
            Cookies.set('token', response.token, {
                expires: 7,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            localStorage.setItem('token', response.token);
            
            return response;
        }
        
        throw new Error('No token received from server');
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}

export const logout = () => {
    localStorage.removeItem('token');
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
            window.location.href = response.message; 
        }
    } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Failed to initiate Google login:', apiError);
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
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
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
        
        if (!response.token) {
            throw new Error('No token received from server');
        }
        
        // Store the token in both cookie and localStorage
        Cookies.set('token', response.token, {
            expires: 7,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        localStorage.setItem('token', response.token);
        
        // Fetch and store user profile
        await getUserProfile();
        
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
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('Fetching user profile with token:', token);

        const response = await apiController<UserProfileModel>({
            method: 'GET',
            url: APIUrls.userProfile,
            token,
            contentType: 'application/json',
        });
        
        console.log('User profile response:', response);

        if (!response) {
            throw new Error('No response received from server');
        }

        // Store user profile in cookies
        Cookies.set('user_profile', JSON.stringify(response), {
            expires: 7,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        localStorage.setItem('user_profile', JSON.stringify(response));
        
        return response;
    } catch (error: unknown) {
        console.error('Full error details:', error);
        
        // Check if it's a response with status code
        if (error && typeof error === 'object' && 'status' in error) {
            const statusCode = (error as { status?: number }).status;
            if (statusCode === 500) {
                throw new Error('Server error: Please try again later or contact support');
            }
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to fetch user profile";
        throw new Error(`Profile fetch failed: ${errorMessage}`);
    }
};



// update user profile
export const updateUserProfile = async (data: UserProfileUpdateModel) => {
    try {
        const response = await apiController({
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