export default class APIUrls {
    static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    static readonly BASE_URL_ORG = process.env.NEXT_PUBLIC_API_URL_ORG;

    /*

        USER API URLS
    
    */
    
    // login with email
    static readonly login = `${APIUrls.BASE_URL}/api/v1/auth/email`;

    // login with gmail
    static readonly loginWithGmail = `${APIUrls.BASE_URL}/api/v1/auth/google`;
    
    // verify code  
    static readonly verify = `${APIUrls.BASE_URL}/api/v1/auth/verify`;

    // complete signup
    static readonly completeSignup = `${APIUrls.BASE_URL}/api/v1/auth/sign-up-update`;

    // get and update user profile
    static readonly userProfile = `${APIUrls.BASE_URL}/api/v1/auth/profile`;


    /*

        Utils API URLS
    
    */

    // get Utils Categories 
    static readonly utilsCategories = `${APIUrls.BASE_URL}/api/v1/utils/categories`;

    // get Utils Event Types
    static readonly utilsEventTypes = `${APIUrls.BASE_URL}/api/v1/utils/event-types`;

    /*

        ORGANIZATION API URLS
    
    */

    // GET All Events
    static readonly getAllEvents = `${APIUrls.BASE_URL_ORG}/api/v1/org/events`;

    // GET Event by ID
    static readonly getEventById = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/get`;

    // Create Event
    static readonly createEvent = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/create`;

    // Update Event Images
    static readonly updateEventImages = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/image`;

    // Update Event Videos
    static readonly updateEventVideos = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/video`;

    // Update Event FAQ
    static readonly updateEventFAQ = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/faq`;

    // Update Event Agenda
    static readonly updateEventAgenda = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/agenda`;

    // Update Event Media
    static readonly getEventFiles = `${APIUrls.BASE_URL_ORG}/api/v1/org/events/files`;

    // get event tickets
    static readonly getEventTickets = `${APIUrls.BASE_URL_ORG}/api/v1/ticket`;

    // get event ticket Promotions
    static readonly getEventTicketPromotions = `${APIUrls.BASE_URL_ORG}/api/v1/ticket/promotions`;

    // get event ticket promotion by id
    static readonly getEventTicketPromotion = `${APIUrls.BASE_URL_ORG}/api/v1/ticket/promotion`;

    // create event ticket promotion
    static readonly createEventTicketPromotion = `${APIUrls.BASE_URL_ORG}/api/v1/ticket/promotion`;


    // ---- ORGANIZATION PROFILE ---- //

    // get organization profile
    static readonly getOrgProfiles = `${APIUrls.BASE_URL_ORG}/api/v1/users/`;

    // create organization profile
    static readonly createOrgProfile = `${APIUrls.getOrgProfiles}create`;

    // get organization profile by ID
    static readonly getOrgProfileById = `${APIUrls.getOrgProfiles}profile/`;

    // update organization profile
    static readonly updateOrgProfile = `${APIUrls.getOrgProfiles}update/`;

    // delete organization profile
    static readonly deleteOrgProfile = `${APIUrls.getOrgProfiles}delete/`;


    // ---- ORGANIZATION TEAM ---- //


}