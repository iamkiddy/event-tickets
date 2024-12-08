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

    // get Utils Event Types
    static readonly utilsEventTypes = `${APIUrls.BASE_URL}/api/v1/utils/event-types`;

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


}