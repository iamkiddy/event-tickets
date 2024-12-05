export default class APIUrls {
    static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    static readonly BASE_URL_ORG = process.env.NEXT_PUBLIC_API_URL_ORG;
    
    // login with email
    static readonly login = `${APIUrls.BASE_URL}/api/v1/auth/email`;

    // login with gmail
    static readonly loginWithGmail = `${APIUrls.BASE_URL}/api/v1/auth/google`;
    
    // verify code  
    static readonly verify = `${APIUrls.BASE_URL}/api/v1/auth/verify`;

    // complete signup
    static readonly completeSignup = `${APIUrls.BASE_URL}/api/v1/auth/sign-up-update`;

    // get Utils Categories 
    static readonly utilsCategories = `${APIUrls.BASE_URL}/api/v1/utils/categories`;

    // GET All Events
    static readonly getAllEvents = `${APIUrls.BASE_URL_ORG}/api/v1/org/events`;


}