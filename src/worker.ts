const DEFAULT_UPSTREAM_TIMEOUT_MS = 15000;
const DEFAULT_INDEX_PATH = '/index.html';
const DEFAULT_PRODUCTION_FALLBACK_ORIGINS: string[] = [];
const INSECURE_UPSTREAM_ENV_NAME = 'ALLOW_INSECURE_UPSTREAM';

const HEADER_X_FORWARDED_FOR = 'x-forwarded-for';
const HEADER_X_FORWARDED_HOST = 'x-forwarded-host';
const HEADER_X_FORWARDED_PROTO = 'x-forwarded-proto';
const HEADER_CF_CONNECTING_IP = 'cf-connecting-ip';

const buildDebugResponse = async (request: Request, env: WorkerEnv): Promise<Response> => {
  const upstreamOrigins = resolveUpstreamOrigins(env);
  const payload = {
    debug: true,
    environment: String(env.ENVIRONMENT || 'unknown'),
    allowInsecureUpstream: isInsecureUpstreamAllowed(env),
    upstreamOrigin: upstreamOrigins[0] || null,
    upstreamCandidates: upstreamOrigins,
    upstreamTimeoutMs: parseTimeout(env.UPSTREAM_TIMEOUT_MS),
    requestUrl: request.url,
    requestHost: request.headers.get('host') || null,
    cfConnectingIp: request.headers.get(HEADER_CF_CONNECTING_IP) || null,
  };

  return await annotateWorkerResponse(Response.json(payload, { status: 200 }), env);
};

const isInsecureUpstreamAllowed = (env: WorkerEnv): boolean => {
  const rawValue = String(env[INSECURE_UPSTREAM_ENV_NAME] || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(rawValue);
};

const ALLOWED_CORS_ORIGINS = [
  'https://platform-prod.psaroz.workers.dev',
  'https://platform.psaroz.workers.dev',
];

export const getCorsOrigin = (request: Request): string | null => {
  const origin = request.headers.get('origin')?.trim();
  if (!origin) {
    return null;
  }

  return ALLOWED_CORS_ORIGINS.includes(origin) ? origin : null;
};

export const buildCorsHeaders = (origin: string | null = null): Headers => {
  const headers = new Headers();
  headers.set('access-control-allow-origin', origin || '*');
  headers.set('access-control-allow-methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('access-control-allow-headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  headers.set('access-control-expose-headers', 'Content-Type,Authorization');
  headers.set('cross-origin-resource-policy', 'cross-origin');
  headers.set('vary', 'Origin');
  return headers;
};

const normalizeOrigin = (rawOrigin: string, env: WorkerEnv): string => {
  let origin = rawOrigin.trim();
  if (!origin) {
    return '';
  }

  const isExplicitHttp = /^http:\/\//i.test(origin);
  if (!origin.startsWith('http')) {
    origin = `https://${origin}`;
  }

  if (isExplicitHttp && !isInsecureUpstreamAllowed(env)) {
    return '';
  }

  return origin.replace(/\/+$/, '');
};

const parseFallbackOrigins = (env: WorkerEnv): string[] => {
  const configured = String(env.BACKEND_FALLBACK_ORIGINS || '')
    .split(',')
    .map((value) => normalizeOrigin(value, env))
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  if (String(env.ENVIRONMENT || '').toLowerCase() === 'production') {
    return DEFAULT_PRODUCTION_FALLBACK_ORIGINS;
  }

  return [];
};

const resolveUpstreamOrigins = (env: WorkerEnv): string[] => {
  const primary = normalizeOrigin(String(env.BACKEND_ORIGIN || env.API_ORIGIN || ''), env);
  const fallback = parseFallbackOrigins(env);

  const candidates = [primary, ...fallback].filter(Boolean);
  return Array.from(new Set(candidates));
};

const buildUpstreamRequest = (
  request: Request,
  requestUrl: URL,
  targetUrl: URL,
  bufferedBody?: ArrayBuffer,
): Request => {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set(HEADER_X_FORWARDED_HOST, request.headers.get('host') || '');
  headers.set(HEADER_X_FORWARDED_PROTO, requestUrl.protocol.replace(':', ''));
  headers.set(HEADER_X_FORWARDED_FOR, request.headers.get(HEADER_CF_CONNECTING_IP) || '');

  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';

  return new Request(targetUrl.toString(), {
    method,
    headers,
    body: hasBody ? (bufferedBody ? bufferedBody.slice(0) : undefined) : undefined,
    redirect: 'follow',
  });
};

const readRequestBodyForRetries = async (request: Request): Promise<ArrayBuffer | undefined> => {
  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  if (!hasBody) {
    return undefined;
  }

  return await request.clone().arrayBuffer();
};

const annotateWorkerResponse = async (response: Response, env: WorkerEnv): Promise<Response> => {
  const headers = new Headers(response.headers);
  const corsHeaders = buildCorsHeaders();

  corsHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  headers.set('x-worker-environment', String(env.ENVIRONMENT || 'unknown'));
  headers.set('x-worker-backend-origin', resolveUpstreamOrigins(env)[0] || '');

  const body = await response.arrayBuffer();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
const isCloudflareError1003 = async (response: Response): Promise<boolean> => {
  if (response.status !== 403) {
    return false;
  }

  const server = (response.headers.get('server') || '').toLowerCase();
  if (!server.includes('cloudflare')) {
    return false;
  }

  try {
    const body = await response.clone().text();
    return /error\s+code:\s*1003/i.test(body);
  } catch {
    return false;
  }
};

const proxyApiRequest = async (request: Request, env: WorkerEnv): Promise<Response> => {
  const upstreamOrigins = resolveUpstreamOrigins(env);
  const requestUrl = new URL(request.url);
  const timeoutMs = parseTimeout(env.UPSTREAM_TIMEOUT_MS);
  const failures: Array<{ origin: string; error: string }> = [];
  const bufferedBody = await readRequestBodyForRetries(request);
  let lastUpstreamServerError: Response | null = null;

  if (upstreamOrigins.length === 0) {
    return Response.json({ success: false, error: 'No upstream API origin is configured for proxying.' }, { status: 502 });
  }

  for (const upstreamOrigin of upstreamOrigins) {
    // Using concatenation ensures that if the upstreamOrigin has a base path,
    // it isn't accidentally stripped by the URL constructor logic.
    const targetUrl = new URL(upstreamOrigin + requestUrl.pathname + requestUrl.search);

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const upstreamRequest = buildUpstreamRequest(request, requestUrl, targetUrl, bufferedBody);
      const response = await fetch(upstreamRequest, { signal: controller.signal });

      if (await isCloudflareError1003(response)) {
        failures.push({
          origin: upstreamOrigin,
          error: 'Upstream blocked by Cloudflare error 1003 (direct IP access denied)',
        });
        continue;
      }

      if (response.ok || response.status < 500) {
        return response;
      }

      // Preserve concrete upstream 5xx payload in case all retries fail.
      lastUpstreamServerError = response;

      failures.push({
        origin: upstreamOrigin,
        error: `Upstream responded with ${response.status}`,
      });
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      const message = isTimeout
        ? `Upstream request timed out after ${timeoutMs}ms`
        : (error instanceof Error ? error.message : String(error));
      failures.push({
        origin: upstreamOrigin,
        error: message,
      });
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  if (lastUpstreamServerError) {
    return lastUpstreamServerError;
  }

  return Response.json({
    success: false,
    error: 'Failed to reach backend upstream.',
    details: failures,
    attemptedOrigins: upstreamOrigins,
  }, { status: 502 });
};

type AssetsBinding = { fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> };

type WorkerEnv = {
  ASSETS?: AssetsBinding;
  BACKEND_ORIGIN?: string;
  API_ORIGIN?: string;
  BACKEND_FALLBACK_ORIGINS?: string;
  UPSTREAM_TIMEOUT_MS?: string | number;
  ENVIRONMENT?: string;
  ALLOW_INSECURE_UPSTREAM?: string;
};

const parseTimeout = (value?: string | number): number => {
  if (!value) return DEFAULT_UPSTREAM_TIMEOUT_MS;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_UPSTREAM_TIMEOUT_MS;
};

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: unknown
  ): Promise<Response> {
    void ctx;

    const corsOrigin = getCorsOrigin(request);
    const withCors = (response: Response): Response => {
      const headers = new Headers(response.headers);
      buildCorsHeaders(corsOrigin).forEach((value, key) => {
        headers.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    };

    if (request.method.toUpperCase() === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }));
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/api/_debug') {
      return await buildDebugResponse(request, env);
    }

    if (pathname.startsWith('/api/')) {
      return proxyApiRequest(request, env);
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return await annotateWorkerResponse(
        new Response('Worker misconfiguration: ASSETS binding is missing.', { status: 500 }),
        env,
      );
    }

    try {
      // Support the same-origin remote fallback path used by the platform shell.
      const assetPath = pathname.startsWith('/the-himalayan-table-app')
        ? pathname.replace(/^\/the-himalayan-table-app/, '') || '/'
        : pathname.startsWith('/the-himalayan-table')
          ? pathname.replace(/^\/the-himalayan-table/, '') || '/'
          : pathname;
      const assetRequest = new Request(new URL(assetPath + url.search, url).toString(), request);

      // Try to serve the requested file first.
      const response = await env.ASSETS.fetch(assetRequest);

      // If a GET route is not found and looks like an SPA path, serve index.html.
      if (request.method === 'GET' && response.status === 404 && !pathname.includes('.')) {
        const indexResponse = await env.ASSETS.fetch(new Request(new URL(DEFAULT_INDEX_PATH, url).toString()));
        return withCors(indexResponse);
      }

      return withCors(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown worker error';
      return withCors(
        new Response(`Worker runtime error: ${message}`, { status: 500 }),
      );
    }

  },
};