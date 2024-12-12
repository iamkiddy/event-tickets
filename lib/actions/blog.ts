'use server';

import apiController from "../apiController";
import APIUrls from "../apiurls";
import { cookies } from 'next/headers';
import {
  GetAllBlogsResponse,
  GetBlogByIdResponse,
  GetBlogCommentsResponse,
  AddBlogCommentRequest,
  LikeBlogResponse
} from "../models/_blogs_models";
import { ApiError } from 'next/dist/server/api-utils';


export const getAllBlogs = async (): Promise<GetAllBlogsResponse> => {
  try {
    const response = await apiController<GetAllBlogsResponse>({
      method: 'GET',
      url: APIUrls.getBlogs,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    const apiError = error as ApiError;
    const errorMessage = apiError.message || "Failed to fetch blogs";
    throw new Error(errorMessage);
  }
};

export const getBlogById = async (blogId: string): Promise<GetBlogByIdResponse> => {
  try {
    const response = await apiController<GetBlogByIdResponse>({
      method: 'GET',
      url: `${APIUrls.getBlogs}/${blogId}`,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching blog:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || "Failed to fetch blog");
  }
};

export const getBlogComments = async (blogId: string): Promise<GetBlogCommentsResponse> => {
  try {
    const response = await apiController<GetBlogCommentsResponse>({
      method: 'GET',
      url: `${APIUrls.getBlogs}/${blogId}`,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || "Failed to fetch blog comments");
  }
};

export const addBlogComment = async (blogId: string, comment: AddBlogCommentRequest): Promise<void> => {
  try {
    await apiController<void>({
      method: 'POST',
      url: `${APIUrls.getBlogs}/${blogId}/comments`,
      contentType: 'application/json',
      data: comment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || "Failed to add comment");
  }
};

export const likeBlog = async (blogId: string): Promise<LikeBlogResponse> => {
  try {
    const response = await apiController<LikeBlogResponse>({
      method: 'POST',
      url: `${APIUrls.getBlogs}/${blogId}/like`,
      contentType: 'application/json',
    });
    return response;
  } catch (error) {
    console.error('Error liking blog:', error);
    const apiError = error as ApiError;
    throw new Error(apiError.message || "Failed to like blog");
  }
};

