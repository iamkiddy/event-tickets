import { TicketType } from "@/app/(main)/codepass/types";

export interface Event {
    id: string;
    title: string;
    image: string;
    startDate: string;
    startTime: string;
    soldOut: number;
    totalGross: number;
    status: 'published' | 'draft';
}

export interface AllEventsResponse {
    page: number;
    total: number;
    limit: number;
    data: Event[];
}

export interface GetEventsParams {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    eventType?: string;
}

export interface EventFAQ {
    question: string;
    answer: string;
}

export interface EventAgendaItem {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    host: string[];
}

export interface CreateEvent {
    title: string;
    summary: string;
    overview: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    totalCapacity: number;
    tags: string[];
    locationType: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    eventFAQ: {
        question: string;
        answer: string;
    }[];
    eventAgenda: {
        title: string;
        description: string;
        startTime: string;
        endTime: string;
        host: string[];
    }[];
}

export interface Event extends CreateEvent {
    id: string;
    soldOut: number;
    totalGross: number;
    status: 'published' | 'draft';
}

export interface CreateEventResponse {
    message: string;
    eventId: string;
}


export interface UpdateEventImages {
    eventId: string;
    images: string[];
}

export interface UpdateEventVideos {
    eventId: string;
    videos: string[];
}

export interface UpdateEventImagesResponse {
    message: string;
}

export interface UpdateEventVideosResponse {
    message: string;
}

export interface UtilsEventTypesResponse {
    id: string;
    name: string;
}

export interface UtilsCategoriesResponse {
    id: string;
    name: string;
    image: string;
    subCategories: string[];
}



export interface UpdateEventFAQ {
    id: string;
    eventId: string;
    question: string;
}

export interface UpdateEventAgenda {
    id: string;
    eventId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    host: string[];
}

export interface UpdateEventFAQResponse {
    message: string;
}

export interface UpdateEventAgendaResponse {
    message: string;
}

export interface GetEventById {
    eventId: string;
}

export interface EventFAQResponse {
    question: string;
    answer: string;
    id: string;
}

export interface EventAgendaResponse {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    host: string[];
    id: string;
}

export interface EventImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface EventVideo {
    id: string;
    url: string;
}

export interface GetEventByIdResponse {
    title: string;
    summary: string;
    overview: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    totalCapacity: number;
    tags: string[];
    locationType: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    eventFAQ: EventFAQResponse[];
    eventAgenda: EventAgendaResponse[];
    images: EventImage[];
    video?: EventVideo;
    tickets: TicketType[];
    status: 'draft' | 'published' | 'private';
}

export interface UpdateEventFiles {
    eventId: string;
    files: string[];
}

export interface GetEventFilesResponse {
    images: EventImage[];
    video?: EventVideo;
}

export interface GetEventTicketsResponse {
    tickets: {
        name: string;
        price: number;
        quantity: number;
        currency: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        isActive: boolean;
        id: string;
    }[];
}

export interface CreateEventTicket {
    name: string;
    price: number;
    quantity: number;
    currency: string;
    isActive: boolean;
}

export interface CreateEventTicketResponse {
    message: string;
}

export type PromotionType = 'discount' | 'coupon';
export type ValueType = 'percentage' | 'amount';

export interface CreateEventTicketPromotion {
  id: string;
  code: string;
  promotionType: PromotionType;
  value: number;
  valueType: ValueType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  quantity: number;
  tickets: string[];
}

export interface EventTicketPromotion extends CreateEventTicketPromotion {
  id: string;
  isActive: boolean;
}

export interface CreateEventTicketPromotionResponse {
  message: string;
  promotionId: string;
}

export interface UpdateEventTicketPromotionResponse {
  message: string;
}

export interface GetEventTicketPromotionsResponse {
  promotions: EventTicketPromotion[];
}

export interface CreateEventTicketPromotionRequest {
  code: string;
  promotionType: PromotionType;
  value: number;
  valueType: ValueType;
  endDate: string;
  endTime: string;
  quantity: number;
  isActive: boolean;
  tickets: string[];
}

export interface UpdateEventTicket {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    isActive: boolean;
  }
  
  export interface UpdateEventTicketResponse {
    message: string;
  }

  export interface DeleteEventTicketResponse {
    message: string;
  }

  export interface GetEventTicketPromotionResponse {
    promotion: EventTicketPromotion;
  }

  export interface UpdateEventTicketPromotionRequest {
    id: string;
    code: string;
    promotionType: PromotionType;
    value: number;
    valueType: ValueType;
    endDate: string;
    endTime: string;
    quantity: number;
    isActive: boolean;
    tickets: string[];
  }

  export interface UpdateEventTicketPromotionResponse {
    message: string;
  }

  export interface DeleteEventTicketPromotionResponse {
    message: string;
  }

  export interface getTicketsByIdResponse{
    name: string;
    price: number;
    quantity: number;
    currency: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    id: string;
  }

  export interface getEventTicketPromotionByIdResponse{
    id: string;
    code: string;
    promotionType: PromotionType;
    value: number;
    valueType: ValueType;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    quantity: number;
    isActive: boolean;
    tickets: string[];
    }

export interface GetEventFinalStage{
    organiser:string,
    category:string,
    subCategories: string[];
    isPublished:boolean;
    isRefundable:boolean;
    daysBefore:number;
}

export interface PublishEventRequest {
    organizer: string;
    category: string;
    subcategory: string;
    isPublished: boolean;
    isRefundable: boolean;
    daysBefore: number;
}

export interface PublishEventResponse{
    message:string;
}

export interface GetOrganizerUtils {
    id: string;
    title: string;
}

export interface GetEventUtils {
    id: string;
    title: string;
}


export interface DeleteEventImageResponse {
    message: string;
}

export interface DeleteEventVideoResponse {
    message: string;
}