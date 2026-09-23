// Item availability status — mirrors backend Status enum
export const ITEM_STATUSES = ['AVAILABLE', 'UNAVAILABLE'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
};
