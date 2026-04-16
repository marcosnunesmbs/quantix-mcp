import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  apiKey: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getRequestApiKey(): string | undefined {
  return requestContext.getStore()?.apiKey;
}
