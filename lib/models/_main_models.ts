export interface GetEventTypeUtilsResponse {
    id: string;
    name: string;
}

export interface GetCategoryUtilsResponse {
    id: string;
    icon: string;
    name: string;
    subCategories: string[];
}

export interface GetBannerUtilsResponse {
    id: string;
    image: string;
    title: string;
}

export interface GetFaqUtilsResponse {
    question: string;
    answer: string;
}

export interface GetNewsletterUtilsRequest {
    email: string;
}

export interface GetNewsletterUtilsResponse {
    message: string;
}

export interface GetHomepageUtilsResponse {
    featuredCategories: {
        icon: string;
        name: string;
        totalEvents: number;
    }[];
    upcomingEvents: {
        id: string;
        image: string;
        title: string;
        startDate: string;
        summary: string;
        isPublish: boolean;
    }[];
    mostViewedEvents: {
        id: string;
        image: string;
        title: string;
        startDate: string;
        summary: string;
        isPublish: boolean;
    }[];
    pageBlogs: {
        id: string;
        image: string;
        title: string;
        summary: string;
        author: string;
        date: string;
    }[];
}

