import { isAbsoluteUrl, DEFAULT_GET_CACHE_TTL_MS, API_BASE_PATH, HOST_LOCAL_API_URL } from "../content/common-content";

const responseCache = new Map<string, { timestamp: number; responsePromise: Promise<Response> }>();

const buildApiUrl = (path: string): string => {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiBaseUrl()}${normalizedPath}`;
};

export const clearAdminApiCache = (): void => {
  responseCache.clear();
};

const buildCacheKey = (url: string, options: RequestInit = {}): string => {
  const method = String(options.method || 'GET').toUpperCase();
  return `${method}:${url}`;
};

const shouldCacheRequest = (options: RequestInit = {}): boolean => {
  const method = String(options.method || 'GET').toUpperCase();
  return method === 'GET' && !options.signal;
};

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

const resolveApiBaseUrl = (): string => {
  const env = (globalThis as any).process?.env || {};
  const configured = (env.NEXT_PUBLIC_API_URL || env.REACT_APP_API_URL || '').trim();
  if (configured) return configured;
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || hostname.startsWith('10.') || hostname.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
    if (isLocal) return `${protocol}//127.0.0.1:5002`;
  }
  return runtimeOrigin || HOST_LOCAL_API_URL;
};

const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';
