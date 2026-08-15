import { actionLabels, applyRegistryOverrides, HOST_LOCAL_API_URL } from '../content/common-content';
import {
  ContentLabelEntry,
  ContentLabelGroup,
  ContentRegistryPayload,
  ContentRegistryService,
} from '../types';

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
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || hostname.startsWith('10.') || hostname.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
    if (isLocal) {
      return `${protocol}//127.0.0.1:5002`;
    }
  }

  return HOST_LOCAL_API_URL;
};

export const hydrateSharedContentRegistry = async (): Promise<Record<string, string>> => {
  if (sharedRegistryHydrationPromise) {
    return sharedRegistryHydrationPromise;
  }

  sharedRegistryHydrationPromise = (async (): Promise<Record<string, string>> => {
    try {
      const registryUrl = `${resolveApiBaseUrl()}/api/pms_tms/v1/content/registry`;
      const response = await fetch(registryUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.info('[content] Shared DB registry unavailable; using local content registry.');
        return {};
      }

      const payload = await response.json().catch(() => ({}));
      const dbLabels = payload?.data ?? payload?.labels ?? payload ?? {};
      const normalized = normalizeDatabaseLabels(dbLabels);

      if (Object.keys(normalized).length > 0) {
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

        Object.assign(sharedContentRegistry, restored);
        applyRegistryOverrides(restored);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('content-registry-updated'));
        }
      }

      return normalized;
    } catch (error) {
      console.info('[content] Shared DB registry unavailable; using local content registry.', error instanceof Error ? error.message : String(error));
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