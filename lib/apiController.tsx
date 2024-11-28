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
      body = JSON.stringify(data); // Do not stringify data for multipart/form-data
    } else if (contentType === "multipart/form-data") {
      // Create a FormData object for multipart/form-data
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      body = formData;
    } else {
      headers["Content-Type"] = contentType || "application/x-www-form-urlencoded";
      body = new URLSearchParams(data as Record<string, string>).toString();
    }
  }
  
  const response = await fetch(url, {
    method: method,
    cache: "no-store",
    headers: headers,
    body: body,
  });

  const result = response.body ? await response.json() : null;

  if (response.status === 200 || response.status === 201) {
    return result as T;
  } else {
    const errorMessage = result?.detail || result?.message || "An error occurred";
    throw new Error(errorMessage); // Only throw the error message
  }
}