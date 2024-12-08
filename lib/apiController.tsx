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
  params?: Record<string, string | number | boolean>;
  data?: T;
  contentType?: HttpContentType;
  baseUrl?: string;
}

// api controller
export default async function <T, D = unknown>({
  method = "GET",
  url = "",
  token,
  contentType,
  data,
}: IController<D>): Promise<T> {
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
    url,
    method,
    headers,
    bodyType: body instanceof FormData ? 'FormData' : typeof body
  });

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Response error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData?.detail || errorData?.message || "An error occurred");
  }

  const result = await response.json().catch(() => null);
  return result as T;
}