/* eslint-disable import/no-anonymous-default-export */

// methods
export type HttpMethods = "GET" | "POST" | "HEAD" | "PUT" | "PATCH" | "DELETE";

// content typs
export type HttpContentType =
  | "text/html"
  | "application/json"
  | "multipart/form-data";

// interface for the controller
export interface IController<T = unknown> {
  method?: HttpMethods;
  url: string;
  token?: string;
  params?: Record<string, string>;
  data?: T;
  contentType?: HttpContentType;
  baseUrl?: string;
}

// interface for API errors
interface APIError extends Error {
  status?: number;
  data?: unknown;
}

// api controller
export default async function <T, D = unknown>({
  method = "GET",
  url = "",
  token,
  params,
  contentType,
  data,
}: IController<D>): Promise<T> {
  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    let body: BodyInit | null = null;

    if (data) {
      if (contentType === "application/json") {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
      } else if (contentType === "multipart/form-data") {
        // Don't set Content-Type for multipart/form-data
        body = data instanceof FormData ? data : Object.assign(new FormData(), data);
      } else {
        headers["Content-Type"] = contentType || "application/x-www-form-urlencoded";
        body = new URLSearchParams(data as Record<string, string>).toString();
      }
    }

    const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {
      method,
      headers,
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || responseData.detail || "An error occurred",
        data: responseData
      };
    }

    return responseData as T;
  } catch (error: unknown) {
    const apiError = error as APIError;
    throw apiError;
  }
}