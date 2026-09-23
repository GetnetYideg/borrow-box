// Named route constants — single source of truth for all paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ITEMS: '/items',
  ITEM_DETAIL: '/items/:id',
  BORROWERS: '/borrowers',
  BORROWER_DETAIL: '/borrowers/:id',
  LENDING: '/lending',
  LENDING_DETAIL: '/lending/:id',
} as const;

// Helper to build parameterised paths at runtime
export const buildRoute = {
  itemDetail: (id: string) => `/items/${id}`,
  borrowerDetail: (id: string) => `/borrowers/${id}`,
  lendingDetail: (id: string) => `/lending/${id}`,
};
