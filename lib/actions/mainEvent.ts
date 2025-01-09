'use server';

import apiController from "../apiController";
import APIUrls from "../apiurls";
import { ApiError } from 'next/dist/server/api-utils';
import { EventListResponse, EventDetails,OrganisedEventResponse,RelatedEventResponse } from '../models/_main_event_models';
import { getServerSession } from "./auth";

export interface GetMainEventsParams {
  search?: string;
  page?: number;
  category?: string;
  type?: string;
  date?: string;
  where?: string;
  time?: string;
}

export const getAllMainEvents = async (params?: GetMainEventsParams): Promise<EventListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.where) queryParams.append('where', params.where);
    if (params?.time) queryParams.append('time', params.time);

    const response = await apiController<EventListResponse>({
      method: 'GET',
      url: APIUrls.getAllMainEvents,
      params: Object.fromEntries(queryParams),
      contentType: 'application/json',
    });

    return response;
  } catch (error) {
    console.error('Error fetching main events:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch events";
    throw new Error(errorMessage);
  }
};


export const getRelatedEvents = async (eventId: string): Promise<RelatedEventResponse[]> => {
  try {
    const response = await apiController<RelatedEventResponse[]>({
      method: 'GET',
      url: `${APIUrls.getRelatedEventById}/${eventId}`,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching related events:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch related events";
    throw new Error(errorMessage);
  }
};

export const getOrganisedEvents = async (organizerId: string): Promise<OrganisedEventResponse[]> => {
  try {
    const response = await apiController<OrganisedEventResponse[]>({
      method: 'GET',
      url: `${APIUrls.getOrganisedEvent}/${organizerId}`,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching organised events:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch organised events";
    throw new Error(errorMessage);
  }
};

export async function getEventDetails(eventId: string): Promise<EventDetails> {
  const user = await getServerSession()
  
  try {
    const response = await apiController<EventDetails, void>({
      method: 'GET',
      url: `${APIUrls.getMainEventById}/${eventId}`,
      contentType: 'application/json',
      params: user?.userProfileModel ? `userId=${user.userProfileModel.id}`: ''
    });

    return response;
  } catch (error) {
    console.error('Error fetching event details:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event details";
    throw new Error(errorMessage);
  }
}