'use server';

import { AllEventsResponse, CreateEvent, CreateEventResponse, UpdateEventImagesResponse, UpdateEventVideosResponse, UtilsEventTypesResponse, UtilsCategoriesResponse, GetEventsParams, GetEventTicketsResponse, UpdateEventFAQ, UpdateEventAgenda, GetEventById, GetEventByIdResponse, GetEventFilesResponse, CreateEventTicket, CreateEventTicketResponse, GetEventTicketPromotionsResponse, CreateEventTicketPromotionRequest, CreateEventTicketPromotionResponse, UpdateEventTicket, UpdateEventTicketResponse, DeleteEventTicketResponse, GetEventTicketPromotionResponse, UpdateEventTicketPromotionResponse, UpdateEventTicketPromotionRequest, DeleteEventTicketPromotionResponse, getTicketsByIdResponse, getEventTicketPromotionByIdResponse, } from '../models/_events_models';
import apiController from '../apiController';
import APIUrls from '../apiurls';
import { ApiError } from 'next/dist/server/api-utils';
import { cookies } from 'next/headers';

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

export const createEvent = async (data: CreateEvent): Promise<CreateEventResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log('Request payload:', JSON.stringify(data, null, 2)); // Debug log
    
    const response = await apiController<CreateEventResponse, CreateEvent>({
      method: 'POST',
      url: APIUrls.createEvent,
      data,
      token,
      contentType: 'application/json',
    });
    
    return response;
  } catch (error: unknown) {
    console.error('API Error:', error); // Debug log
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const updateEventImage = async (eventId: string, image: File): Promise<UpdateEventImagesResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append('image', image);

    console.log('Upload details:', {
      url: `${APIUrls.updateEventImages}/${eventId}`,
      fileName: image.name,
      fileType: image.type,
      fileSize: image.size
    });

    const response = await apiController<UpdateEventImagesResponse>({
      method: 'PUT',
      url: `${APIUrls.updateEventImages}/${eventId}`,
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

export const getUtilsCategories = async (): Promise<UtilsCategoriesResponse> => {
  try {
    const response = await apiController<UtilsCategoriesResponse>({
      method: 'GET',
      url: APIUrls.utilsCategories,
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch categories";
    throw new Error(errorMessage);
  }
};

export const updateEventFAQ = async (params: {
  eventId: string;
  faqId: string;
  question: string;
  answer: string;
}): Promise<any> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');
    if (!params.eventId) throw new Error('Event ID is required');
    if (!params.faqId) throw new Error('FAQ ID is required');
    if (!params.question) throw new Error('Question is required');
    if (!params.answer) throw new Error('Answer is required');

    console.log('Updating FAQ:', {
      eventId: params.eventId,
      faqId: params.faqId,
      data: { question: params.question, answer: params.answer }
    });

    const response = await apiController({
      method: 'PUT',
      url: `${APIUrls.updateEventFAQ}/${params.eventId}/${params.faqId}`,
      data: {
        question: params.question,
        answer: params.answer,
        id: params.faqId  // Add the ID to the request body
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
  id: string;
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
    if (!params.id) throw new Error('Agenda ID is required');
    if (!params.title) throw new Error('Title is required');
    if (!params.description) throw new Error('Description is required');
    if (!params.startTime) throw new Error('Start time is required');
    if (!params.endTime) throw new Error('End time is required');

    console.log('Updating Agenda:', {
      eventId: params.eventId,
      agendaId: params.id,
      data: params
    });

    const response = await apiController({
      method: 'PUT',
      url: `${APIUrls.updateEventAgenda}/${params.eventId}/${params.id}`,
      data: {
        title: params.title,
        description: params.description,
        startTime: params.startTime,
        endTime: params.endTime,
        host: params.host
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
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
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
      url: `${APIUrls.getEventTickets}/${ticketId}`,
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