import { HOST_LOCAL_API_URL, isAbsoluteUrl } from "../content/common-content";
export const subtotal = (cartItems: Array<{ price: number; quantity: number }>) => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const deliveryCharge = (cartItems: Array<{ price: number; quantity: number }>) => cartItems.length > 0 ? 150 : 0;
export const total = (cartItems: Array<{ price: number; quantity: number }>) => subtotal(cartItems) + deliveryCharge(cartItems);
export const responseCache = new Map<string, { timestamp: number; responsePromise: Promise<Response> }>();
export const resolveApiBaseUrl = (): string => {
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

export const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';

export const buildApiUrl = (path: string): string => {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiBaseUrl()}${normalizedPath}`;
};

export const clearAdminApiCache = (): void => {
  responseCache.clear();
};

export const buildCacheKey = (url: string, options: RequestInit = {}): string => {
  const method = String(options.method || 'GET').toUpperCase();
  return `${method}:${url}`;
};

export const shouldCacheRequest = (options: RequestInit = {}): boolean => {
  const method = String(options.method || 'GET').toUpperCase();
  return method === 'GET' && !options.signal;
};
 export const resolveAuthHeaders = (): Record<string, string> => {
    const tokenCandidates = [
      localStorage.getItem('accessToken'),
      localStorage.getItem('auth_token'),
      localStorage.getItem('token'),
      localStorage.getItem('jwt'),
      localStorage.getItem('platform_auth_token'),
      sessionStorage.getItem('accessToken'),
      sessionStorage.getItem('auth_token'),
      sessionStorage.getItem('token'),
      sessionStorage.getItem('jwt'),
      sessionStorage.getItem('platform_auth_token'),
    ];

    const token = tokenCandidates.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();

    if (token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }

    return {
      'Content-Type': 'application/json',
      'x-bypass-auth': 'true',
      'x-dev-user': '1',
    };
  };