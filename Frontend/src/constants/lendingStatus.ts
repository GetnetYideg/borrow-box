// LendingStatus enum — mirrors backend Prisma schema
export const LENDING_STATUSES = ['ACTIVE', 'DUESOON', 'OVERDUE', 'RETURNED'] as const;
export type LendingStatus = (typeof LENDING_STATUSES)[number];

export const LENDING_STATUS_LABELS: Record<LendingStatus, string> = {
  ACTIVE: 'Active',
  DUESOON: 'Due Soon',
  OVERDUE: 'Overdue',
  RETURNED: 'Returned',
};

export const LENDING_STATUS_COLORS: Record<LendingStatus, string> = {
  ACTIVE: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  DUESOON: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  OVERDUE: 'bg-red-500/20 text-red-300 border-red-500/30',
  RETURNED: 'bg-green-500/20 text-green-300 border-green-500/30',
};
