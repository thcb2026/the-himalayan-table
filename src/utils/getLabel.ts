import { actionLabels } from '../content/common-content';

export type ContentLabelGroup = {
  category: string;
  description: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

export type DatabaseLabelMap = Partial<Record<string, string>>;

export interface ContentRegistryService {
  getLabels: () => Record<string, string>;
  getLabel: (id: string, fallback?: string) => string;
}

const buildLabelMap = (groups: ContentLabelGroup[] = actionLabels): Record<string, string> =>
  groups.reduce<Record<string, string>>((acc, group) => {
    group.items.forEach((item) => {
      acc[item.id] = item.label;
    });
    return acc;
  }, {});

export const sharedContentRegistry = buildLabelMap();

const sanitizeDatabaseLabels = (databaseLabels: DatabaseLabelMap = {}): Record<string, string> => {
  const sanitized: Record<string, string> = {};

  Object.entries(databaseLabels).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

export const createContentService = (databaseLabels: DatabaseLabelMap = {}): ContentRegistryService => {
  const registry: Record<string, string> = {
    ...sharedContentRegistry,
    ...sanitizeDatabaseLabels(databaseLabels),
  };

  return {
    getLabels: () => ({ ...registry }),
    getLabel: (id: string, fallback = '') => registry[id] ?? fallback,
  };
};

export const contentService = createContentService();

export const getLabel = (id: string, fallback = '', databaseLabels?: DatabaseLabelMap): string => {
  const service = createContentService(databaseLabels ?? {});
  return service.getLabel(id, fallback);
};

export default getLabel;