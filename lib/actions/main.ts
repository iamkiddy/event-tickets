import apiController from "../apiController";
import APIUrls from "../apiurls";
import { cookies } from 'next/headers';
import { GetEventTypeUtilsResponse, GetCategoryUtilsResponse, GetBannerUtilsResponse, GetFaqUtilsResponse, GetNewsletterUtilsRequest, GetNewsletterUtilsResponse, GetHomepageUtilsResponse } from "../models/_main_models";


interface ApiError extends Error {
    message: string;
    status?: number;
}

export const getCategoryUtils = async (): Promise<GetCategoryUtilsResponse[]> => {
  try {
    const response = await apiController<GetCategoryUtilsResponse[]>({
      method: 'GET',
      url: APIUrls.categoryUtils,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching category utils:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch categories";
    throw new Error(errorMessage);
  }
};


export const getEventTypeUtils = async (): Promise<GetEventTypeUtilsResponse[]> => {
  try {
    const response = await apiController<GetEventTypeUtilsResponse[]>({
      method: 'GET',
      url: APIUrls.eventTypeUtils,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching event type utils:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch event types";
    throw new Error(errorMessage);
  }
};

export const getBannerUtils = async (): Promise<GetBannerUtilsResponse[]> => {
  try {
    const response = await apiController<GetBannerUtilsResponse[]>({
      method: 'GET',
      url: APIUrls.bannerUtils,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching banner utils:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch banners";
    throw new Error(errorMessage);
  }
};

export const getNewsletterUtils = async (request: GetNewsletterUtilsRequest): Promise<GetNewsletterUtilsResponse> => {
  try {
    const baseUrl = APIUrls.newsletterUtils.replace(/\/$/, '');
    const encodedEmail = encodeURIComponent(request.email.trim());
    const url = `${baseUrl}?email=${encodedEmail}`;

    const response = await apiController<GetNewsletterUtilsResponse>({
      method: 'POST',
      url: url,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to subscribe to newsletter";
    throw new Error(errorMessage);
  }
};

export const getHomepageUtils = async (): Promise<GetHomepageUtilsResponse> => {
  try {
    const response = await apiController<GetHomepageUtilsResponse>({
      method: 'GET',
      url: APIUrls.getHomepageUtils,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching homepage utils:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch homepage utils";
    throw new Error(errorMessage);
  }
};