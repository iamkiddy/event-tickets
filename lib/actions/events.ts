/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { AllEventsResponse, CreateEvent, CreateEventResponse, UpdateEventImagesResponse,
   UpdateEventVideosResponse, UtilsEventTypesResponse, UtilsCategoriesResponse, GetEventsParams, 
   GetEventTicketsResponse, GetEventByIdResponse, GetEventFilesResponse, CreateEventTicket, 
   CreateEventTicketResponse, GetEventTicketPromotionsResponse, CreateEventTicketPromotionRequest, 
   CreateEventTicketPromotionResponse, UpdateEventTicket, UpdateEventTicketResponse, 
   DeleteEventTicketResponse, GetEventTicketPromotionResponse, UpdateEventTicketPromotionResponse, 
   UpdateEventTicketPromotionRequest, DeleteEventTicketPromotionResponse, getTicketsByIdResponse,
  getEventTicketPromotionByIdResponse, GetEventFinalStage,PublishEventRequest,PublishEventResponse,
  GetOrganizerUtils ,GetEventUtils,DeleteEventImageResponse,DeleteEventVideoResponse,
  DeleteEventResponse,UpdateEventResponse,
  UpdateEvent, DashboardResponse, GetEventOrdersResponse
} from '../models/_events_models';
import apiController from '../apiController';
import APIUrls from '../apiurls';
import { ApiError } from 'next/dist/server/api-utils';
import { cookies } from 'next/headers';

// Get all events
export const getAllEvents = async (params?: GetEventsParams): Promise<AllEventsResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `${APIUrls.getAllEvents}?${queryParams.toString()}`;

    const response = await apiController<AllEventsResponse>({
      method: 'GET',
      url,
      token,
      contentType: 'application/json',
    });

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};


// Create an event
export const createEvent = async (data: CreateEvent): Promise<CreateEventResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('API URL:', APIUrls.createEvent);
    console.log('Creating event with data:', data);

    const response = await apiController<CreateEventResponse, CreateEvent>({
      method: 'POST',
      url: APIUrls.createEvent,
      data,
      token,
      contentType: 'application/json',
    });
    
    return response;
  } catch (error: any) {
    console.error('Create Event Error:', {
      url: APIUrls.createEvent,
      error: error,
      message: error.message,
      response: error.response,
      stack: error.stack
    });

    // If it's an API error with a response
    if (error.response) {
      throw new Error(error.response.message || 'API Error');
    }

    // If it's a network error
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - Could not connect to the server');
    }

    // For other errors
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export const updateEvent = async (eventId: string, data: UpdateEvent): Promise<UpdateEventResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<UpdateEventResponse>({
      method: 'PUT',
      url: `${APIUrls.updateEvent}/${eventId}`,
      token,
      data,
      contentType: 'application/json',
    });

    return response;
  } catch (error) {
    console.error('Error updating event:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to update event";
    throw new Error(errorMessage);
  }
};

export const deleteEvent = async (eventId: string): Promise<DeleteEventResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DeleteEventResponse>({
      method: 'DELETE',
      url: `${APIUrls.deleteEvent}/${eventId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};


// Update event images
export const updateEventImage = async (eventId: string, image: File): Promise<UpdateEventImagesResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append('image', image);

    const response = await apiController<UpdateEventImagesResponse>({
      method: 'PUT',
      url: `${APIUrls.BASE_URL_ORG}/api/v1/org/events/image/${eventId}`,
      data: formData,
      token,
      contentType: 'multipart/form-data'
    });

    return response;
  } catch (error) {
    console.error('Error uploading image:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to upload image";
    throw new Error(errorMessage);
  }
};

export const deleteEventImage = async (eventId: string, imageId: string): Promise<DeleteEventImageResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DeleteEventImageResponse>({
      method: 'DELETE',
      url: `${APIUrls.deleteEventImage}/${eventId}/${imageId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error deleting event image:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete event image";
    throw new Error(errorMessage);
  }
};

export const updateEventVideo = async (eventId: string, video: File): Promise<UpdateEventVideosResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append('video', video);
    formData.append('id', eventId);

    console.log('Upload URL:', `${APIUrls.updateEventVideos}/${eventId}`);
    console.log('FormData keys:', [...formData.keys()]);

    const response = await apiController<UpdateEventVideosResponse>({
      method: 'PUT',
      url: `${APIUrls.updateEventVideos}/${eventId}`,
      data: formData,
      token,
      contentType: 'multipart/form-data',
    });

    return response;
  } catch (error) {
    console.error('Error uploading video:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to upload video";
    throw new Error(errorMessage);
  }
};  


export const deleteEventVideo = async (eventId: string, videoId: string): Promise<DeleteEventVideoResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DeleteEventVideoResponse>({
      method: 'DELETE',
      url: `${APIUrls.deleteEventVideo}/${eventId}/${videoId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error deleting event video:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete event video";
    throw new Error(errorMessage);
  }
};

export const getUtilsEventTypes = async (): Promise<UtilsEventTypesResponse> => {
  try {
    const response = await apiController<UtilsEventTypesResponse>({
      method: 'GET',
      url: APIUrls.utilsEventTypes,
    });
    return response;
  } catch (error) {
    console.error('Error fetching event types:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event types";
    throw new Error(errorMessage);
  }
};

export const getUtilsCategories = async (): Promise<UtilsCategoriesResponse[]> => {
  try {
    const response = await apiController<UtilsCategoriesResponse[]>({
      method: 'GET',
      url: APIUrls.utilsCategories,
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const updateEventFAQ = async (params: {
  eventId: string;
  faqId?: string;
  question: string;
  answer: string;
}): Promise<any> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');
    if (!params.eventId) throw new Error('Event ID is required');
    if (!params.question) throw new Error('Question is required');
    if (!params.answer) throw new Error('Answer is required');

    console.log('Updating FAQ:', {
      eventId: params.eventId,
      faqId: params.faqId,
      data: { question: params.question, answer: params.answer }
    });

    const response = await apiController({
      method: 'PUT',
      url: `${APIUrls.updateEventFAQ}/${params.eventId}`,
      data: {
        question: params.question,
        answer: params.answer,
        id: params.faqId 
      },
      token,
      contentType: 'application/json'
    });

    return response;
  } catch (error) {
    console.error('Error updating FAQ:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to update FAQ";
    throw new Error(errorMessage);
  }
};

export const updateEventAgenda = async (params: {
  eventId: string;
  id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: string[];
}): Promise<any> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');
    if (!params.eventId) throw new Error('Event ID is required');
    if (!params.title) throw new Error('Title is required');
    if (!params.description) throw new Error('Description is required');
    if (!params.startTime) throw new Error('Start time is required');
    if (!params.endTime) throw new Error('End time is required');
    if (!Array.isArray(params.host)) throw new Error('Host must be an array');

    console.log('Updating Agenda:', {
      eventId: params.eventId,
      agendaId: params.id,
      data: params
    });

    const response = await apiController({
      method: 'PUT',
      url: `${APIUrls.updateEventAgenda}/${params.eventId}`,
      data: {
        title: params.title,
        description: params.description,
        startTime: params.startTime,
        endTime: params.endTime,
        host: params.host,
        id: params.id
      },
      token,
      contentType: 'application/json'
    });

    return response;
  } catch (error) {
    console.error('Error updating agenda:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to update agenda";
    throw new Error(errorMessage);
  }
};

export const deleteEventFAQ = async (params: {
  eventId: string;
  faqId: string;
}): Promise<any> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');
    if (!params.eventId) throw new Error('Event ID is required');
    if (!params.faqId) throw new Error('FAQ ID is required');

    const response = await apiController({
      method: 'DELETE',
      url: `${APIUrls.updateEventFAQ}/${params.eventId}/${params.faqId}`,
      token,
      contentType: 'application/json'
    });

    return response;
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete FAQ";
    throw new Error(errorMessage);
  }
};

export const deleteEventAgenda = async (params: {
  eventId: string;
  agendaId: string;
}): Promise<any> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');
    if (!params.eventId) throw new Error('Event ID is required');
    if (!params.agendaId) throw new Error('Agenda ID is required');

    const response = await apiController({
      method: 'DELETE',
      url: `${APIUrls.updateEventAgenda}/${params.eventId}/${params.agendaId}`,
      token,
      contentType: 'application/json'
    });

    return response;
  } catch (error) {
    console.error('Error deleting agenda:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete agenda";
    throw new Error(errorMessage);
  }
};

export const getEventById = async (eventId: string): Promise<GetEventByIdResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<GetEventByIdResponse>({
      method: 'GET',
      url: `${APIUrls.getEventById}/${eventId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event by ID";
    throw new Error(errorMessage);
  }
};

export const getEventFiles = async (eventId: string): Promise<GetEventFilesResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<GetEventFilesResponse>({
      method: 'GET',
      url: `${APIUrls.getEventFiles}/${eventId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event files:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event files";
    throw new Error(errorMessage);
  }
};

export const getEventTickets = async (eventId: string): Promise<GetEventTicketsResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<GetEventTicketsResponse>({
      method: 'GET',
      url: `${APIUrls.getEventTickets}/${eventId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event tickets:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event tickets";
    throw new Error(errorMessage);
  }
};

export const createEventTicket = async (eventId: string, data: CreateEventTicket): Promise<CreateEventTicketResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<CreateEventTicketResponse>({
      method: 'POST',
      url: `${APIUrls.getEventTickets}/${eventId}`,
      data,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error creating event ticket:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to create event ticket";
    throw new Error(errorMessage);
  }
};

export const getEventTicketPromotions = async (eventId: string): Promise<GetEventTicketPromotionsResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<GetEventTicketPromotionsResponse>({
      method: 'GET',
      url: `${APIUrls.getEventTicketPromotions}/${eventId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event ticket promotions:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event ticket promotions";
    throw new Error(errorMessage);
  }
};

export const createEventTicketPromotion = async (eventId: string, data: CreateEventTicketPromotionRequest): Promise<CreateEventTicketPromotionResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<CreateEventTicketPromotionResponse>({
      method: 'POST',
      url: `${APIUrls.createEventTicketPromotion}/${eventId}`,
      data,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error creating event ticket promotion:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to create event ticket promotion";
    throw new Error(errorMessage);
  }
};

export const updateEventTicket = async (eventId: string, ticketId: string, data: Omit<UpdateEventTicket, 'id'>): Promise<UpdateEventTicketResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    console.log('Updating ticket with data:', {
      ticketId,
      data
    });

    const response = await apiController<UpdateEventTicketResponse>({
      method: 'PUT',
      url: `${APIUrls.getEventTickets}/${ticketId}`,
      data: {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        currency: data.currency,
        isActive: data.isActive
      },
      token,
      contentType: 'application/json',
    });

    console.log('Update response:', response);
    return response;
  } catch (error) {
    console.error('Error updating event ticket:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to update event ticket";
    throw new Error(errorMessage);
  }
};

export const deleteEventTicket = async (eventId: string, ticketId: string): Promise<DeleteEventTicketResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DeleteEventTicketResponse>({
      method: 'DELETE',
      url: `${APIUrls.getEventTickets}/${ticketId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error deleting event ticket:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete ticket";
    throw new Error(errorMessage);
  }
};

export const getEventTicketPromotion = async (promotionId: string): Promise<GetEventTicketPromotionResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<GetEventTicketPromotionResponse>({
      method: 'GET',
      url: `${APIUrls.getEventTicketPromotion}/${promotionId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event ticket promotion:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event ticket promotion";
    throw new Error(errorMessage);
  }
};

export const updateEventTicketPromotion = async (promotionId: string, data: UpdateEventTicketPromotionRequest): Promise<UpdateEventTicketPromotionResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<UpdateEventTicketPromotionResponse>({
      method: 'PUT',
      url: `${APIUrls.getEventTicketPromotion}/${promotionId}`,
      data,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error updating event ticket promotion:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to update event ticket promotion";
    throw new Error(errorMessage);
  }
};

export const deleteEventTicketPromotion = async (promotionId: string): Promise<DeleteEventTicketPromotionResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DeleteEventTicketPromotionResponse>({
      method: 'DELETE',
      url: `${APIUrls.getEventTicketPromotion}/${promotionId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error deleting event ticket promotion:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to delete event ticket promotion";
    throw new Error(errorMessage);
  }
};

export const getTicketsById = async (ticketId: string): Promise<getTicketsByIdResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<getTicketsByIdResponse>({
      method: 'GET',
      url: `${APIUrls.getEventTickets}/detail/${ticketId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event ticket:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event ticket";
    throw new Error(errorMessage);
  }
};


export const getEventTicketPromotionById = async (promotionId: string): Promise<getEventTicketPromotionByIdResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await apiController<getEventTicketPromotionByIdResponse>({
      method: 'GET',
      url: `${APIUrls.getEventTicketPromotion}/${promotionId}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event ticket promotion:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event ticket promotion";
    throw new Error(errorMessage);
  }
};

export const getEventFinalStage = async (eventId: string): Promise<GetEventFinalStage> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<GetEventFinalStage>({
      method: 'GET',
      url: `${APIUrls.getFinalStage}/${eventId}`,
      token,
      contentType: 'application/json',
    });

    console.log('Event Final Stage Data:', {
      organizer: response.organizer,
      category: response.category,
      subcategory: response.subcategory,
      eventType: response.eventType,
      isPublished: response.isPublished,
      isRefundable: response.isRefundable,
      daysBefore: response.daysBefore
    });

    return response;
  } catch (error) {
    console.error('Error fetching event final stage', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event final stage";
    throw new Error(errorMessage);
  }
};

export const publishEvent = async (eventId: string, data: PublishEventRequest): Promise<PublishEventResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<PublishEventResponse>({
      method: 'PUT',
      url: `${APIUrls.getFinalStage}/${eventId}`,
      data,
      token,
      contentType: 'application/json',
    });
    
    return response;
  } catch (error) {
    // Log the error properly
    if (error instanceof Error) {
      console.error('Error publishing event:', error.message);
      throw new Error(error.message);
    } else {
      // Handle the case where error is not a typical Error object
      console.error('Unexpected error:', JSON.stringify(error));
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getOrganiserUtils = async (): Promise<GetOrganizerUtils> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<GetOrganizerUtils>({
      method: 'GET',
      url: `${APIUrls.getOrganizerUtils}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event organiser utils', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch organiser utils";
    throw new Error(errorMessage);
  }
};

export const getEventsUtils = async (): Promise<GetEventUtils> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<GetEventUtils>({
      method: 'GET',
      url: `${APIUrls.getEventUtils}`,
      token,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event utils', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event utils";
    throw new Error(errorMessage);
  }

}


export const getDashboardOrders = async (eventId: string): Promise<DashboardResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<DashboardResponse>({
      method: 'GET',
      url: `${APIUrls.getDashboardOrders}/${eventId}`,
      token,
      contentType: 'application/json',
    });

    // Validate response data
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }

    return {
      totalOrders: response.totalOrders || 0,
      totalSales: response.totalSales || 0,
      ticketSold: response.ticketSold || 0,
      totalViews: response.totalViews || 0,
      recentWithdraw: response.recentWithdraw || []
    };
  } catch (error) {
    console.error('Error fetching dashboard orders:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch dashboard orders: ${error.message}`);
    }
    throw new Error('Failed to fetch dashboard orders');
  }
}

export const getEventOrders = async (eventId: string, page = 1): Promise<GetEventOrdersResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const response = await apiController<GetEventOrdersResponse>({
      method: 'GET',
      url: `${APIUrls.getEventOrders}/${eventId}?page=${page}`,
      token,
      contentType: 'application/json',
    });

    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format');
    }

    // Ensure the response matches expected structure
    return {
      page: response.page || 1,
      total: response.total || 0,
      limit: response.limit || 10,
      data: Array.isArray(response.data) ? response.data : []
    };
  } catch (error) {
    console.error('Error fetching event orders:', error);
    // Return a valid empty response instead of throwing
    return {
      page: 1,
      total: 0,
      limit: 10,
      data: []
    };
  }
}