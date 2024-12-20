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

export interface EventOrganizer {
  name: string;
  profileImage: string;
  phone1: string;
  phone2: string;
  website: string;
  bio: string;
  country: string;
}

export interface EventTicket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  discountValue: number;
  discountType: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventAgenda {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: string[];
}


