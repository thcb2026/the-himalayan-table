import { actionLabels } from '../content/common-content';
import {
  ContentLabelEntry,
  ContentLabelGroup,
  ContentRegistryPayload,
  ContentRegistryService,
  DatabaseLabelMap,
} from '../types';

const buildLabelMap = (groups: ContentLabelGroup[] = actionLabels): Record<string, string> =>
  groups.reduce<Record<string, string>>((acc, group) => {
    group.items.forEach((item) => {
      acc[item.id] = item.label;
    });
    return acc;
  }, {});

export const sharedContentRegistry = buildLabelMap();

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeSingleEntry = (entry: ContentLabelEntry): [string, string] | null => {
  const id = entry.id ?? entry.key;
  const labelValue = entry.label ?? entry.value;

  if (typeof id !== 'string' || id.trim().length === 0) {
    return null;
  }

  if (typeof labelValue !== 'string' || labelValue.trim().length === 0) {
    return null;
  }

  return [id, labelValue];
};

const collectLabelRecords = (source: unknown, acc: Record<string, string>): Record<string, string> => {
  if (source == null) {
    return acc;
  }

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
    const nestedKeys = ['labels', 'data', 'items'] as const;
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
  const registry: Record<string, string> = {
    ...sharedContentRegistry,
    ...normalizeDatabaseLabels(databaseLabels),
  };

  return {
    getLabels: () => ({ ...registry }),
    getLabel: (id: string, fallback = '') => registry[id] ?? fallback,
    hasLabel: (id: string) => Object.prototype.hasOwnProperty.call(registry, id),
  };
};

export const contentService = createContentService();

export const getLabel = (id: string, fallback = '', databaseLabels?: ContentRegistryPayload): string => {
  const service = createContentService(databaseLabels ?? {});
  return service.getLabel(id, fallback);
};

export default getLabel;