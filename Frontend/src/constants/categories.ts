// Category enum — mirrors backend Prisma schema
export const CATEGORIES = [
  'ELECTRONICS',
  'CLOTHING',
  'BOOKS',
  'SCHOOL',
  'SPORTS',
  'TOOLS',
  'HOUSEHOLD',
  'OTHER',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  ELECTRONICS: 'Electronics',
  CLOTHING: 'Clothing',
  BOOKS: 'Books',
  SCHOOL: 'School',
  SPORTS: 'Sports',
  TOOLS: 'Tools',
  HOUSEHOLD: 'Household',
  OTHER: 'Other',
};
