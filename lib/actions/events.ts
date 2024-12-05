'use client';

import Cookies from 'js-cookie';
import { AllEventsResponse } from '../models/_events_models';
import apiController from '../apiController';
import APIUrls from '../apiurls';

export const getAllEvents = async (): Promise<AllEventsResponse> => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await apiController<AllEventsResponse>({
      method: 'GET',
      url: APIUrls.getAllEvents,
      token,
      contentType: 'application/json',
    });

    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};
