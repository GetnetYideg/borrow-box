import type { Category } from '../constants/categories';

export interface CategoryInfo {
  label: string;
  iconName: string;
  color: string;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  ELECTRONICS: {
    label: 'Electronics',
    iconName: 'Laptop',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
  CLOTHING: {
    label: 'Clothing',
    iconName: 'Shirt',
    color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  },
  BOOKS: {
    label: 'Books',
    iconName: 'BookOpen',
    color: 'text-amber-700 dark:text-amber-400 bg-amber-500/10',
  },
  SCHOOL: {
    label: 'School',
    iconName: 'GraduationCap',
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
  },
  SPORTS: {
    label: 'Sports',
    iconName: 'Activity',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  TOOLS: {
    label: 'Tools',
    iconName: 'Wrench',
    color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10',
  },
  HOUSEHOLD: {
    label: 'Household',
    iconName: 'Home',
    color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10',
  },
  OTHER: {
    label: 'Other',
    iconName: 'Package',
    color: 'text-stone-600 dark:text-stone-400 bg-stone-500/10',
  },
};

export const getCategoryLabel = (category?: Category): string => {
  if (!category) return 'Other';
  return CATEGORY_INFO[category]?.label || category;
};
