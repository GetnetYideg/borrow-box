import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ItemsPage } from '../pages/items/ItemsPage';
import { ItemDetailPage } from '../pages/items/ItemDetailPage';
import { BorrowersPage } from '../pages/borrowers/BorrowersPage';
import { BorrowerDetailPage } from '../pages/borrowers/BorrowerDetailPage';
import { LendingPage } from '../pages/lending/LendingPage';
import { LendingDetailPage } from '../pages/lending/LendingDetailPage';
import { DueSoonOverduePage } from '../pages/lending/DueSoonOverduePage';

export const router = createBrowserRouter([
  // Public landing page
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },

  // Auth pages (public-only, redirects to /dashboard if logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
          {
            path: ROUTES.REGISTER,
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },

  // Protected App routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: ROUTES.ITEMS,
            element: <ItemsPage />,
          },
          {
            path: ROUTES.ITEM_DETAIL,
            element: <ItemDetailPage />,
          },
          {
            path: ROUTES.BORROWERS,
            element: <BorrowersPage />,
          },
          {
            path: ROUTES.BORROWER_DETAIL,
            element: <BorrowerDetailPage />,
          },
          {
            path: ROUTES.LENDING,
            element: <LendingPage />,
          },
          {
            path: ROUTES.LENDING_DETAIL,
            element: <LendingDetailPage />,
          },
          {
            path: ROUTES.DUE_SOON_OVERDUE,
            element: <DueSoonOverduePage />,
          },
        ],
      },
    ],
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
