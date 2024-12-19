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

    console.log('Request details:', {
      url: `${url}?${new URLSearchParams(params).toString()}`,
      method,
      headers,
      body: body ? JSON.parse(body.toString()) : null
    });

    const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {
      method,
      headers,
      body,
    });

    const responseData = await response.json();
    
    console.log('Response details:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || responseData.detail || "An error occurred",
        data: responseData
      };
    }

    return responseData as T;
  } catch (error: any) {
    console.error('API Controller Error:', {
      error,
      message: error.message,
      status: error.status,
      data: error.data
    });
    throw error;
  }
}