import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from './store/authStore';
import { refreshAccessToken } from './api/auth.api';

export const App: React.FC = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();
        if (isMounted && data?.accessToken) {
          setAccessToken(data.accessToken);
        } else if (isMounted) {
          clearAuth();
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [setAccessToken, clearAuth, setInitializing]);

  return <RouterProvider router={router} />;
};

export default App;
