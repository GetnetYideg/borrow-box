import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginInput, RegisterInput } from '../types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => loginApi(data),
    onSuccess: (res) => {
      setAuth(res.data, res.accessToken);
      queryClient.clear();
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => registerApi(data),
    onSuccess: () => {
      // Upon successful registration, navigate to login
      navigate('/login?registered=true');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  return {
    user,
    accessToken,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
