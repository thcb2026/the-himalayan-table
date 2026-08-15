import { actionLabels, applyRegistryOverrides, HOST_LOCAL_API_URL } from '../content/common-content';
import {
  ContentLabelEntry,
  ContentLabelGroup,
  ContentRegistryPayload,
  ContentRegistryService,
} from '../types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildLabelMap = (groups: ContentLabelGroup[] = actionLabels): Record<string, string> =>
  groups.reduce<Record<string, string>>((acc, group) => {
    group.items.forEach((item) => {
      acc[item.id] = item.label;
    });
    return acc;
  }, {});

export const sharedContentRegistry: Record<string, string> = buildLabelMap();

let sharedRegistryHydrationPromise: Promise<Record<string, string>> | null = null;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeSingleEntry = (entry: ContentLabelEntry): [string, string] | null => {
  const id = entry.id ?? entry.key;
  const labelValue = entry.label ?? entry.value;

  if (typeof id !== 'string' || id.trim().length === 0) return null;
  if (typeof labelValue !== 'string' || labelValue.trim().length === 0) return null;

  return [id, labelValue];
};

const collectLabelRecords = (source: unknown, acc: Record<string, string>): Record<string, string> => {
  if (source == null) return acc;

  if (Array.isArray(source)) {
    source.forEach((entry) => {
      if (!isPlainObject(entry)) return;
      const normalized = normalizeSingleEntry(entry as ContentLabelEntry);
      if (normalized) {
        const [id, label] = normalized;
        acc[id] = label;
      }
    });
    return acc;
  }

  if (isPlainObject(source)) {
    const nestedKeys = ['labels', 'data', 'items', 'content', 'values'] as const;
    for (const nestedKey of nestedKeys) {
      if (nestedKey in source) {
        collectLabelRecords(source[nestedKey], acc);
      }
    }

    Object.entries(source).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        acc[key] = value;
      }
    });
  }

  return acc;
};

export const normalizeDatabaseLabels = (databaseLabels: ContentRegistryPayload = {}): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  collectLabelRecords(databaseLabels, sanitized);
  return sanitized;
};

export const createContentService = (databaseLabels: ContentRegistryPayload = {}): ContentRegistryService => {
  const registry = {
    ...sharedContentRegistry,
    ...normalizeDatabaseLabels(databaseLabels),
  };

  return {
    getLabels: () => ({ ...registry }),
    getLabel: (id: string, fallback = '') => registry[id] ?? fallback,
    getAll: () => ({ ...registry }),
    hasLabel: (id: string) => Object.prototype.hasOwnProperty.call(registry, id),
  };
};

const resolveApiBaseUrl = (): string => {
  const env = (globalThis as any).process?.env || {};
  const configured = (env.NEXT_PUBLIC_API_URL || env.REACT_APP_API_URL || '').trim();
  if (configured) {
    return configured;
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol, origin } = window.location;
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || hostname.startsWith('10.') || hostname.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
    if (isLocal) {
      return `${protocol}//127.0.0.1:5002`;
    }
    return origin;
  }

  return HOST_LOCAL_API_URL;
};

const emitFallbackNotification = (message = 'Shared DB registry unavailable; using local content registry.') => {
  if (typeof window === 'undefined') {
    return;
  }

  (window as Window & { __contentRegistryFallbackMessage?: string }).__contentRegistryFallbackMessage = message;
  window.dispatchEvent(new CustomEvent('content-registry-fallback', {
    detail: { message },
  }));
};

export const hydrateSharedContentRegistry = async (): Promise<Record<string, string>> => {
  if (sharedRegistryHydrationPromise) {
    return sharedRegistryHydrationPromise;
  }

  sharedRegistryHydrationPromise = (async (): Promise<Record<string, string>> => {
    const registryUrl = `${resolveApiBaseUrl()}/api/pms_tms/v1/content/registry`;
    const maxAttempts = 3;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          console.log('[hydrate] Fetching registry from:', registryUrl, `attempt ${attempt}/${maxAttempts}`);
          const response = await fetch(registryUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const payload = await response.json().catch(() => ({}));
          const dbLabels = payload?.data ?? payload?.labels ?? payload ?? {};
          console.log('[hydrate] Registry received with', Object.keys(dbLabels).length, 'entries');
          const normalized = normalizeDatabaseLabels(dbLabels);

          if (Object.keys(normalized).length === 0) {
            console.info('[hydrate] Shared DB registry was empty; using local content registry.');
            emitFallbackNotification('No shared registry entries were returned. Local content is being served instead.');
            return normalized;
          }

          const restored = Object.fromEntries(
            Object.entries(normalized).map(([key, value]) => {
              if (typeof value === 'string') {
                try {
                  const parsed = JSON.parse(value);
                  if (Array.isArray(parsed)) {
                    return [key, parsed];
                  }
                } catch {
                  // Keep as string for scalar content.
                }
              }
              return [key, value];
            }),
          );

          console.log('[hydrate] Applying registry overrides, total entries:', Object.keys(restored).length);
          Object.assign(sharedContentRegistry, restored);
          applyRegistryOverrides(restored);
          console.log('[hydrate] Registry overrides applied successfully');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('content-registry-updated'));
          }

          return normalized;
        } catch (error) {
          const details = error instanceof Error ? error.message : String(error);
          const shouldRetry = attempt < maxAttempts;

          if (shouldRetry) {
            console.warn('[hydrate] Registry fetch failed, retrying shortly...', details);
            await sleep(800 * attempt);
            continue;
          }

          console.info('[hydrate] Shared DB registry unavailable; using local content registry.', details);
          emitFallbackNotification('Shared content is temporarily unavailable. Local content is being served instead.');
          return {};
        }
      }

      return {};
    } finally {
      sharedRegistryHydrationPromise = null;
    }
  })();

  return sharedRegistryHydrationPromise;
};

export const contentService = createContentService();

export const getLabel = (id: string, fallback = '', databaseLabels?: ContentRegistryPayload): string => {
  const mergedRegistry = databaseLabels ? { ...sharedContentRegistry, ...normalizeDatabaseLabels(databaseLabels) } : sharedContentRegistry;
  return mergedRegistry[id] ?? fallback;
};

void hydrateSharedContentRegistry();

export default getLabel;