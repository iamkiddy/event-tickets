export interface LoginEmail {
    email: string;
}

export interface VerifyCode {
    passcode: string;
}

export interface LoginEmailResponse {
    message: string;
    token: string;
    status: 'New' | 'Old';
}

export interface VerifyCodeResponse {
    message: string;
    status: string;
    token: string;
}

export interface SignupCompleteData {
    fullname: string;
    phone: string;
    isAgree: boolean;
}

export interface SignupResponse {
    success: boolean;
}

export interface LoginWithGmailResponse {
    message: string;
    token: string;
}
