import { ApiClientError } from '../services/apiClient.js';

export function handleToolError(error: unknown): { content: [{ type: 'text'; text: string }] } {
  if (error instanceof ApiClientError) {
    return { content: [{ type: 'text', text: `API error ${error.status}: ${error.statusText}` }] };
  }
  if (error instanceof Error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
  return { content: [{ type: 'text', text: 'An unexpected error occurred.' }] };
}
