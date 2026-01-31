import { config } from '../config.js';

export class ApiClientError extends Error {
  constructor(public message: string, public status: number, public statusText: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.QUANTIX_API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.QUANTIX_API_KEY,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiClientError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) => 
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown = {}) => 
    apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};
