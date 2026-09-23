/**
 * Date utility functions for BorrowBox
 */

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

export const isOverdue = (expectedReturnDate?: string | null, status?: string): boolean => {
  if (status === 'RETURNED') return false;
  if (!expectedReturnDate) return false;
  const expected = new Date(expectedReturnDate).getTime();
  return Date.now() > expected;
};

export const isDueSoon = (expectedReturnDate?: string | null, status?: string): boolean => {
  if (status === 'RETURNED' || status === 'OVERDUE') return false;
  if (!expectedReturnDate) return false;
  const now = Date.now();
  const expected = new Date(expectedReturnDate).getTime();
  const diffDays = (expected - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 2;
};

export const daysRemaining = (expectedReturnDate?: string | null): number => {
  if (!expectedReturnDate) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(expectedReturnDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatRelativeTime = (dateString?: string | null): string => {
  if (!dateString) return '';
  const days = daysRemaining(dateString);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
};
