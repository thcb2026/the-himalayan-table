import {DEFAULT_GET_CACHE_TTL_MS, API_BASE_PATH } from "../content/common-content";
import { buildApiUrl, buildCacheKey, responseCache, shouldCacheRequest } from "../utils/common-helpers";

export const adminApiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const url = buildApiUrl(path);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  let token: string | null = null;
  try {
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // ignore missing token
  }

  const cacheKey = buildCacheKey(url, options);
  if (shouldCacheRequest(options)) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < DEFAULT_GET_CACHE_TTL_MS) {
      return cached.responsePromise;
    }
  }

  const tokenPresent = Boolean(token);
  const fetchPromise = fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  }).then((response) => {
    if (!response.ok) {
      responseCache.delete(cacheKey);
      if (response.status === 401 || response.status === 403) {
        console.warn('[adminApiFetch] auth failure', {
          url,
          status: response.status,
          method: String(options.method || 'GET').toUpperCase(),
          tokenPresent,
          responseUrl: response.url,
        });
      }
    }
    return response;
  }).catch((error) => {
    responseCache.delete(cacheKey);
    throw error;
  });

  if (shouldCacheRequest(options)) {
    responseCache.set(cacheKey, { timestamp: Date.now(), responsePromise: fetchPromise });
  }

  return fetchPromise;
};

export const adminRequest = async (
  path: string,
  options: RequestInit = {},
  fallbackMessage: string,
  basePath = API_BASE_PATH
): Promise<any> => {
  const targetPath = `${basePath}${path ? `/${path}` : ''}`;
  const response = await adminApiFetch(targetPath, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = (data && (data.message || (data.error && (data.error as any).message))) || fallbackMessage;
    const err: any = new Error(`${response.status}: ${msg}`);
    err.status = response.status;
    err.body = data;
    throw err;
  }

  return data;
};

