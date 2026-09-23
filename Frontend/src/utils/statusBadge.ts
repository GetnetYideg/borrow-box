import type { ItemStatus } from '../constants/itemStatus';
import type { LendingStatus } from '../constants/lendingStatus';

export interface BadgeConfig {
  label: string;
  className: string;
  dotColor: string;
}

export const getItemStatusConfig = (status: ItemStatus): BadgeConfig => {
  switch (status) {
    case 'AVAILABLE':
      return {
        label: 'Available',
        className: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
        dotColor: 'bg-emerald-500',
      };
    case 'UNAVAILABLE':
      return {
        label: 'Lent Out',
        className: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
        dotColor: 'bg-amber-500',
      };
    default:
      return {
        label: status,
        className: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30',
        dotColor: 'bg-stone-400',
      };
  }
};

export const getLendingStatusConfig = (status: LendingStatus): BadgeConfig => {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        className: 'bg-moss/15 text-forest dark:text-cream border-moss/30',
        dotColor: 'bg-moss',
      };
    case 'DUESOON':
      return {
        label: 'Due Soon',
        className: 'bg-gold/20 text-gold-600 dark:text-gold border-gold/40 font-medium',
        dotColor: 'bg-gold animate-pulse',
      };
    case 'OVERDUE':
      return {
        label: 'Overdue',
        className: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 font-semibold',
        dotColor: 'bg-red-500 animate-ping',
      };
    case 'RETURNED':
      return {
        label: 'Returned',
        className: 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/20',
        dotColor: 'bg-stone-400',
      };
    default:
      return {
        label: status,
        className: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30',
        dotColor: 'bg-stone-400',
      };
  }
};
