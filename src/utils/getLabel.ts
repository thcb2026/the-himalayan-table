import { actionLabels } from '../content/common-content';

const labelMap = actionLabels.reduce<Record<string, string>>((acc, group) => {
  group.items.forEach((item) => {
    acc[item.id] = item.label;
  });
  return acc;
}, {});

export const getLabel = (id: string, fallback = ''): string => labelMap[id] || fallback;
export default getLabel;