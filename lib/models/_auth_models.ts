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
    country?: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    token?: string;
}

export interface ValidationError {
    detail: Array<{
        loc: (string | number)[];
        msg: string;
        type: string;
    }>;
}

export interface LoginWithGmailResponse {
    message: string;
    token: string;
}


export interface UserProfileModel {
    id:          string;
    fullname:    string;
    email:       string;
    phone:       string;
    country:     string;
    messageType: string;
    provider:    string;
}


// 
export interface UserProfileUpdateModel {
    fullname:    string;
    phone:       string;
    country:     string;
    messageType: string;
}